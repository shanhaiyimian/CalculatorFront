/**
 * RAG 问答系统 — API 调用工具
 * 后端地址：FastAPI 服务 http://localhost:8000
 */

const API_BASE = 'http://127.0.0.1:8000'

/**
 * 发送聊天消息
 * @param {string} question - 用户问题
 * @param {number} topK - 检索条数（默认5）
 * @returns {Promise<{answer: string, sources: Array}>}
 */
export async function chat(question, topK = 5) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, top_k: topK }),
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`请求失败 (${res.status}): ${err}`)
  }
  return res.json()
}

/**
 * 上传文件到知识库
 * @param {File} file - 要上传的文件
 * @param {function} onProgress - 上传进度回调
 * @returns {Promise<{message: string, doc_id: string, chunks: number}>}
 */
export async function uploadFile(file, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    // 设置超时（60 秒），避免大文件上传时无限等待
    xhr.timeout = 60000

    xhr.open('POST', `${API_BASE}/upload`, true)
    // 明确告知浏览器不携带凭证（Cookie / Auth header），
    // 避免浏览器因 credentials 策略不一致而触发 onerror
    xhr.withCredentials = false

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }

    xhr.upload.onerror = () => {
      reject(new Error('上传中断，请检查网络连接'))
    }

    xhr.upload.ontimeout = () => {
      reject(new Error('上传超时，请检查网络连接'))
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText))
        } catch {
          reject(new Error('服务器返回了无效的数据'))
        }
      } else {
        // 尝试解析后端返回的 JSON 错误信息
        let detail = ''
        try {
          const errBody = JSON.parse(xhr.responseText)
          detail = errBody.detail || ''
        } catch {
          // responseText 可能不是 JSON（如 uvicorn 的纯文本报错）
          detail = xhr.responseText || ''
        }
        const msg = detail
          ? `上传失败: ${detail}`
          : `服务器错误 (${xhr.status})`
        reject(new Error(msg))
      }
    }

    xhr.onerror = () => {
      // 区分可能的原因
      if (xhr.status === 0) {
        reject(new Error('无法连接后端服务，请确认后端已启动 (start_rag_server.bat)'))
      } else {
        reject(new Error('网络请求失败，请检查防火墙或代理设置'))
      }
    }

    xhr.ontimeout = () => {
      reject(new Error('请求超时，请检查网络连接'))
    }

    if (!file || !(file instanceof Blob)) {
      reject(new Error('无效的文件对象，请重新选择文件'))
      return
    }
    const formData = new FormData()
    formData.append('file', file, file.name || 'unknown')
    xhr.send(formData)
  })
}

/**
 * 获取知识库文档列表
 * @returns {Promise<{documents: Array}>}
 */
export async function getDocuments() {
  const res = await fetch(`${API_BASE}/documents`)
  if (!res.ok) throw new Error(`获取文档列表失败 (${res.status})`)
  return res.json()
}

/**
 * 删除知识库文档
 * @param {string} docId
 */
export async function deleteDocument(docId) {
  const res = await fetch(`${API_BASE}/documents/${docId}`, {
    method: 'DELETE',
  })
  if (!res.ok) throw new Error(`删除失败 (${res.status})`)
  return res.json()
}

/**
 * 健康检查
 */
export async function healthCheck() {
  try {
    const res = await fetch(`${API_BASE}/health`, { method: 'GET' })
    if (!res.ok) return { status: 'error' }
    return res.json()
  } catch {
    return { status: 'offline' }
  }
}

/**
 * 流式聊天（SSE 模式，打字机效果）
 * 如果后端支持 SSE 可以使用，当前后端暂不支持
 */
export async function chatStream(question, onChunk, onDone, onError) {
  try {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, stream: true }),
    })
    if (!res.ok) throw new Error(`请求失败 (${res.status})`)

    const reader = res.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) { onDone(); break }
      const text = decoder.decode(value, { stream: true })
      onChunk(text)
    }
  } catch (err) {
    onError(err)
  }
}