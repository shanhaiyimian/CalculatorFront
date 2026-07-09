"""
最小化诊断：只测试 inget_file 里的 _meta_collection.add 是否修复
不加载 embedding 模型，不跑完整的 RAGEngine
"""
import os, sys, pathlib
os.chdir(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.getcwd())

import chromadb, uuid, time
from chromadb.config import Settings

# 直接用 ChromaDB 测试 _meta_collection.add
client = chromadb.PersistentClient(
    path="data/chroma_db",
    settings=Settings(anonymized_telemetry=False),
)

# 新 collection
test_name = f"test_meta_{uuid.uuid4().hex[:8]}"
meta = client.get_or_create_collection(name=test_name)

doc_id = str(uuid.uuid4())

print("Testing _meta_collection.add with documents=...")

try:
    meta.add(
        ids=[doc_id],
        documents=["test.txt"],       # ← 这是修复的关键
        metadatas=[{
            "filename": "test.txt",
            "source": "knowledge/test.txt",
            "chunks": 3,
            "created_at": time.strftime("%Y-%m-%d %H:%M:%S"),
        }],
    )
    print(f"  PASS: add succeeded for {doc_id}")
except Exception as e:
    print(f"  FAIL: {e}")

# 再用不带 documents 的做对照
meta2 = client.get_or_create_collection(name=f"test_meta2_{uuid.uuid4().hex[:8]}")
doc_id2 = str(uuid.uuid4())
try:
    meta2.add(
        ids=[doc_id2],
        # documents=[...],  ← 故意不传
        metadatas=[{"filename": "fail.txt", "chunks": 1, "source": "x", "created_at": "now"}],
    )
    print(f"  WITHOUT documents: add succeeded (unexpected)")
except Exception as e:
    print(f"  WITHOUT documents: add FAILED as expected: {e}")

# 测试主 collection（带 embeddings）
main = client.get_or_create_collection(name="_test_main", metadata={"hnsw:space": "cosine"})
doc_id3 = str(uuid.uuid4())
import random
fake_emb = [[random.random() for _ in range(384)] for _ in range(2)]
try:
    main.add(
        ids=[f"{doc_id3}_0", f"{doc_id3}_1"],
        embeddings=fake_emb,
        documents=["chunk 0", "chunk 1"],
        metadatas=[
            {"doc_id": doc_id3, "filename": "main_test.txt", "chunk_index": 0},
            {"doc_id": doc_id3, "filename": "main_test.txt", "chunk_index": 1},
        ],
    )
    print(f"  Main collection add: PASS")
except Exception as e:
    print(f"  Main collection add: FAIL: {e}")

# 清理
client.delete_collection(test_name)
client.delete_collection(meta2.name)
client.delete_collection("_test_main")
print("\nDone. Cleanup ok.")
