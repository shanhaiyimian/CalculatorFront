# -*- coding: utf-8 -*-
"""
RAG 引擎：文档导入 -> 向量化 -> 检索 -> LLM 回答
使用本地 sentence-transformers 模型进行嵌入 + DeepSeek Chat API 回答
"""

import os
import time
import uuid
from pathlib import Path
from typing import Optional

import chromadb
from chromadb.config import Settings
import httpx

# 禁止 HuggingFace 联网检查，避免因网络不可达导致长时间超时重试
os.environ['HF_HUB_OFFLINE'] = '1'


# -- Embedding 函数（API / 本地模型双模式） ---------------------------------

class EmbeddingFunction:
    """Embedding 接口：优先 DeepSeek API，无 API Key 时降级到本地模型"""

    def __init__(self, model_name: str = "", api_key: str = "", base_url: str = ""):
        self.model_name = model_name or "shibing624/text2vec-base-chinese"
        self.api_key = api_key
        self.base_url = base_url
        self._local_model = None
        self._mode = "api" if api_key else "local"

    def _call_api(self, texts: list[str]) -> list[list[float]]:
        """调用 DeepSeek Embedding API"""
        url = f"{self.base_url}/v1/embeddings"
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        data = {
            "model": "text-embedding-v3",
            "input": texts,
            "encoding_format": "float",
        }
        resp = httpx.post(url, headers=headers, json=data, timeout=30)
        resp.raise_for_status()
        result = resp.json()
        sorted_data = sorted(result["data"], key=lambda x: x["index"])
        return [item["embedding"] for item in sorted_data]

    def _load_local_model(self):
        if self._local_model is not None:
            return
        try:
            from sentence_transformers import SentenceTransformer
            try:
                self._local_model = SentenceTransformer(
                    self.model_name, device="cpu",
                    local_files_only=True,  # 离线模式，不联网下载
                )
            except Exception:
                print("[WARN] 中文模型加载失败，降级到 all-MiniLM-L6-v2")
                self._local_model = SentenceTransformer(
                    "all-MiniLM-L6-v2", device="cpu",
                    local_files_only=True,
                )
        except Exception as e:
            raise RuntimeError(f"无法加载本地 embedding 模型: {e}\n请设置 DEEPSEEK_API_KEY 使用 API 方式")

    def _call_local(self, texts: list[str]) -> list[list[float]]:
        self._load_local_model()
        embeddings = self._local_model.encode(texts, show_progress_bar=False)
        return embeddings.tolist()

    def embed(self, texts: list[str]) -> list[list[float]]:
        if self._mode == "api":
            try:
                return self._call_api(texts)
            except Exception as e:
                print(f"[WARN] API embedding 失败，降级到本地模型: {e}")
                self._mode = "local"
                return self._call_local(texts)
        else:
            return self._call_local(texts)

    @property
    def dim(self) -> int:
        if self._mode == "api":
            return 1024
        self._load_local_model()
        return self._local_model.get_sentence_embedding_dimension()

    @property
    def mode(self) -> str:
        return self._mode


# -- RAG 引擎 --------------------------------------------------------------

class RAGEngine:
    def __init__(
        self,
        chroma_path: str,
        embedding_model: str = "",
        api_key: str = "",
        base_url: str = "https://api.deepseek.com",
        chat_model: str = "deepseek-chat",
        collection_name: str = "knowledge_base",
    ):
        self.chroma_path = chroma_path
        self.api_key = api_key
        self.base_url = base_url
        self.chat_model = chat_model

        self.embed_fn = EmbeddingFunction(
            model_name=embedding_model,
            api_key=api_key,
            base_url=base_url,
        )

        self.client = chromadb.PersistentClient(
            path=chroma_path,
            settings=Settings(anonymized_telemetry=False),
        )
        self.collection = self.client.get_or_create_collection(
            name=collection_name,
            metadata={"hnsw:space": "cosine"},
        )
        self._meta_collection = self.client.get_or_create_collection(
            name=f"{collection_name}_meta",
        )

        print(f"[RAG] Embedding: {self.embed_fn.mode} 模式")
        print(f"[RAG] ChromaDB 已就绪")

    # -- 文档导入 -----------------------------------------------------------

    def ingest_file(self, file_path: str) -> str:
        path = Path(file_path)
        if not path.exists():
            raise FileNotFoundError(f"文件不存在: {file_path}")

        ext = path.suffix.lower()
        doc_id = str(uuid.uuid4())

        if ext == ".pdf":
            text = self._read_pdf(str(path))
        else:
            text = path.read_text(encoding="utf-8")

        chunks = self._chunk_text(text)
        if not chunks:
            raise ValueError(f"文件 {path.name} 内容为空")

        chunk_ids = [f"{doc_id}_{i}" for i in range(len(chunks))]
        metadatas = [
            {"doc_id": doc_id, "filename": path.name, "chunk_index": i, "source": file_path}
            for i in range(len(chunks))
        ]

        print(f"[RAG] 正在向量化 {len(chunks)} 个片段...")
        batch_size = 32
        for start in range(0, len(chunks), batch_size):
            end = min(start + batch_size, len(chunks))
            batch_texts = chunks[start:end]
            batch_ids = chunk_ids[start:end]
            batch_meta = metadatas[start:end]
            embeddings = self.embed_fn.embed(batch_texts)
            self.collection.add(
                ids=batch_ids,
                embeddings=embeddings,
                documents=batch_texts,
                metadatas=batch_meta,
            )

        self._meta_collection.add(
            ids=[doc_id],
            documents=[path.name],  # 必须提供，ChromaDB 要求至少一个内容字段
            metadatas=[{
                "filename": path.name,
                "source": str(path),
                "chunks": len(chunks),
                "created_at": time.strftime("%Y-%m-%d %H:%M:%S"),
            }],
        )

        print(f"[RAG] '{path.name}' 导入完成 ({len(chunks)} 片段)")
        return doc_id

    # -- 检索 ---------------------------------------------------------------

    def retrieve(self, question: str, top_k: int = 5) -> list[dict]:
        query_embedding = self.embed_fn.embed([question])[0]
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=min(top_k, self.collection.count()),
        )
        sources = []
        if results["ids"] and results["ids"][0]:
            for i in range(len(results["ids"][0])):
                sources.append({
                    "id": results["ids"][0][i],
                    "content": results["documents"][0][i],
                    "score": round(results["distances"][0][i], 4),
                    "source": results["metadatas"][0][i].get("filename", "unknown"),
                })
        return sources

    # -- 问答 ---------------------------------------------------------------

    async def query(self, question: str, top_k: int = 5) -> tuple[str, list[dict]]:
        sources = self.retrieve(question, top_k)
        if not sources:
            return ("知识库中暂无相关内容，请先上传文档。", [])
        context_parts = []
        for i, s in enumerate(sources, 1):
            context_parts.append(f"[片段 {i}] 来自 {s['source']}:\n{s['content']}")
        context = "\n\n".join(context_parts)
        answer = await self._call_llm(question, context)
        return answer, sources

    # -- DeepSeek API -------------------------------------------------------

    async def _call_llm(self, question: str, context: str) -> str:
        if not self.api_key:
            return (
                "未配置 DeepSeek API Key。\n"
                "请在启动服务前设置环境变量:\n"
                "  set DEEPSEEK_API_KEY=sk-xxxxxxxx\n\n"
                "以下是知识库中检索到的相关内容:\n\n"
                f"{context[:2000]}"
            )

        system_prompt = (
            '你是一个基于知识库的智能问答助手。请根据提供的上下文片段回答问题。\n'
            '规则:\n'
            '1. 只使用提供的上下文来回答问题，不要编造信息\n'
            '2. 如果上下文不足，请明确说明"根据现有知识库无法完全回答"\n'
            '3. 引用信息来源，用 [片段编号] 标注\n'
            '4. 回答要简洁、准确、有条理'
        )
        user_prompt = f"上下文信息：\n{context}\n\n问题：{question}\n\n请基于以上上下文回答我的问题。"

        try:
            async with httpx.AsyncClient(timeout=60.0) as client:
                resp = await client.post(
                    f"{self.base_url}/v1/chat/completions",
                    headers={
                        "Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json",
                    },
                    json={
                        "model": self.chat_model,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt},
                        ],
                        "temperature": 0.3,
                        "max_tokens": 2048,
                    },
                )
                resp.raise_for_status()
                data = resp.json()
                return data["choices"][0]["message"]["content"]
        except httpx.HTTPStatusError as e:
            return f"API 请求失败 (HTTP {e.response.status_code}): {e.response.text[:500]}"
        except httpx.TimeoutException:
            return "API 请求超时，请稍后重试"
        except Exception as e:
            return f"调用大模型时出错: {str(e)}"

    # -- 文档管理 -----------------------------------------------------------

    def list_documents(self) -> list[dict]:
        results = self._meta_collection.get()
        docs = []
        if results["ids"]:
            for i in range(len(results["ids"])):
                meta = results["metadatas"][i]
                docs.append({
                    "id": results["ids"][i],
                    "filename": meta["filename"],
                    "chunks": meta["chunks"],
                    "created_at": meta["created_at"],
                })
        return docs

    def get_document_chunks(self, doc_id: str) -> list[str]:
        results = self.collection.get(where={"doc_id": doc_id})
        return results["documents"] if results["documents"] else []

    def delete_document(self, doc_id: str):
        self.collection.delete(where={"doc_id": doc_id})
        self._meta_collection.delete(ids=[doc_id])

    def count_documents(self) -> int:
        return len(self._meta_collection.get()["ids"])

    # -- 内部工具方法 -------------------------------------------------------

    def _read_pdf(self, path: str) -> str:
        import fitz
        doc = fitz.open(path)
        texts = [page.get_text() for page in doc]
        doc.close()
        return "\n".join(texts)

    def _chunk_text(self, text: str, chunk_size: int = 500, overlap: int = 100) -> list[str]:
        if not text.strip():
            return []
        chunks = []
        start = 0
        text_len = len(text)
        while start < text_len:
            end = start + chunk_size
            if end >= text_len:
                chunks.append(text[start:].strip())
                break
            search_end = min(end + overlap, text_len)
            cut = self._find_cut_point(text, end, search_end)
            chunks.append(text[start:cut].strip())
            start = cut
        return [c for c in chunks if c]

    def _find_cut_point(self, text: str, start: int, end: int) -> int:
        for sep in ["。", "！", "？", "\n\n", "\n", ". ", "! ", "? "]:
            idx = text.rfind(sep, start, end)
            if idx != -1:
                return idx + len(sep)
        return end
