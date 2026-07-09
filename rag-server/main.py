"""
RAG 问答系统 - FastAPI 服务入口
基于 DeepSeek API + ChromaDB 的本地知识库问答系统
"""

import os
import uuid
from pathlib import Path
from typing import Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from rag_engine import RAGEngine

# -- 配置 ----------------------------------------------------------
DATA_DIR = Path(__file__).parent / "data"
CHROMA_DIR = DATA_DIR / "chroma_db"
KNOWLEDGE_DIR = Path(__file__).parent / "knowledge"
ALLOWED_EXTENSIONS = {".txt", ".md", ".pdf"}

# 从环境变量读取 DeepSeek API Key
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "")
DEEPSEEK_BASE_URL = "https://api.deepseek.com"
CHAT_MODEL = "deepseek-chat"
EMBED_MODEL = "text2vec-base-chinese"

# -- 全局状态 ------------------------------------------------------
rag_engine: Optional[RAGEngine] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """应用启动时初始化引擎"""
    global rag_engine
    rag_engine = RAGEngine(
        chroma_path=str(CHROMA_DIR),
        embedding_model=EMBED_MODEL,
        api_key=DEEPSEEK_API_KEY,
        base_url=DEEPSEEK_BASE_URL,
        chat_model=CHAT_MODEL,
    )
    yield


app = FastAPI(title="RAG Q&A System", version="1.0.0", lifespan=lifespan)

# 允许前端跨域
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -- 请求/响应模型 --------------------------------------------------
class ChatRequest(BaseModel):
    question: str
    top_k: int = 5


class ChatResponse(BaseModel):
    answer: str
    sources: list[dict] = []


# -- 接口 ------------------------------------------------------------

@app.get("/health")
async def health():
    return {"status": "ok", "doc_count": rag_engine.count_documents() if rag_engine else 0}


@app.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    """问答接口：检索知识库 + 调用 DeepSeek 回答"""
    if not rag_engine:
        raise HTTPException(status_code=503, detail="Engine not initialized")

    answer, sources = await rag_engine.query(
        question=req.question,
        top_k=req.top_k,
    )
    return ChatResponse(answer=answer, sources=sources)


@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """上传文档到知识库"""
    if not rag_engine:
        raise HTTPException(status_code=503, detail="Engine not initialized")

    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"不支持的文件类型: {ext}，支持 {ALLOWED_EXTENSIONS}",
        )

    KNOWLEDGE_DIR.mkdir(parents=True, exist_ok=True)
    file_path = KNOWLEDGE_DIR / file.filename

    content = await file.read()
    file_path.write_bytes(content)

    try:
        doc_id = rag_engine.ingest_file(str(file_path))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"导入失败: {e}")

    return {
        "message": f"文件 {file.filename} 导入成功",
        "doc_id": doc_id,
        "chunks": len(rag_engine.get_document_chunks(doc_id)) if doc_id else 0,
    }


@app.get("/documents")
async def list_documents():
    """获取已导入的文档列表"""
    if not rag_engine:
        raise HTTPException(status_code=503, detail="Engine not initialized")

    docs = rag_engine.list_documents()
    return {"documents": docs}


@app.delete("/documents/{doc_id}")
async def delete_document(doc_id: str):
    """删除知识库中的文档"""
    if not rag_engine:
        raise HTTPException(status_code=503, detail="Engine not initialized")

    rag_engine.delete_document(doc_id)
    return {"message": f"文档 {doc_id} 已删除"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
