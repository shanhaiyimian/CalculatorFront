<template>
  <div class="chat-room">
    <!-- 左侧：聊天栏 -->
    <div class="chat-panel">
      <!-- 头部 -->
      <div class="chat-header">
        <h2>
          <span class="header-icon">🤖</span>
          秋生生的AI
        </h2>
        <div class="header-actions">
          <el-tag :type="backendStatus === 'ok' ? 'success' : 'danger'" size="small" effect="dark">
            {{ backendStatus === 'ok' ? '后端在线' : backendStatus === 'checking' ? '检查中...' : '离线' }}
          </el-tag>
          <el-button size="mini" icon="el-icon-refresh" circle @click="checkBackend" title="刷新状态"></el-button>
        </div>
      </div>

      <!-- 消息列表 -->
      <div class="message-list" ref="messageList">
        <div v-if="messages.length === 0" class="empty-hint">
          <div class="empty-icon">💬</div>
          <p>上传文档到知识库后，在这里提问</p>
          <p class="empty-sub">支持 TXT / PDF / Markdown 文件</p>
        </div>

        <div v-for="(msg, i) in messages" :key="i" class="message-item" :class="msg.role">
          <div class="message-avatar">
            {{ msg.role === 'user' ? '🧑' : '🤖' }}
          </div>
          <div class="message-bubble">
            <div class="message-content" v-html="renderedContent(msg)"></div>
            <!-- 来源引用 -->
            <div v-if="msg.sources && msg.sources.length" class="message-sources">
              <el-divider content-position="left">📎 引用来源</el-divider>
              <div v-for="(src, si) in msg.sources" :key="si" class="source-item">
                <el-tag size="mini" type="info">#{{ si + 1 }}</el-tag>
                <span class="source-file">{{ src.source }}</span>
                <span class="source-score">(相似度: {{ (1 - src.score).toFixed(2) }})</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 加载中 -->
        <div v-if="loading" class="message-item assistant">
          <div class="message-avatar">🤖</div>
          <div class="message-bubble thinking">
            <span class="dot-pulse"></span>
            <span class="thinking-text">思考中...</span>
          </div>
        </div>
      </div>

      <!-- 输入框 -->
      <div class="chat-input">
        <el-input
          v-model="question"
          type="textarea"
          :rows="2"
          placeholder="输入你的问题..."
          @keydown.enter.exact="sendMessage"
          :disabled="loading || backendStatus !== 'ok'"
        ></el-input>
        <el-button
          type="primary"
          icon="el-icon-s-promotion"
          :loading="loading"
          :disabled="!question.trim() || backendStatus !== 'ok'"
          @click="sendMessage"
          class="send-btn"
        >
          发送
        </el-button>
      </div>
    </div>

    <!-- 右侧：知识库信息 -->
    <div class="info-panel">
      <el-card shadow="hover">
        <div slot="header">
          <span>📚 知识库</span>
          <el-button size="mini" type="text" style="float:right" icon="el-icon-refresh" @click="loadDocs">刷新</el-button>
        </div>
        <div v-if="docsLoading" class="info-loading">加载中...</div>
        <div v-else-if="documents.length === 0" class="info-empty">
          <p>暂无文档</p>
          <p class="info-hint">请到"知识库管理"页面上传</p>
        </div>
        <div v-else class="doc-list">
          <div v-for="doc in documents" :key="doc.id" class="doc-item">
            <div class="doc-icon">
              <span v-if="doc.filename.endsWith('.pdf')">📄</span>
              <span v-else-if="doc.filename.endsWith('.md')">📝</span>
              <span v-else>📃</span>
            </div>
            <div class="doc-info">
              <div class="doc-name" :title="doc.filename">{{ doc.filename }}</div>
              <div class="doc-meta">{{ doc.chunks }} 个片段 · {{ doc.created_at }}</div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script>
import { chat, healthCheck, getDocuments } from '@/util/api'

export default {
  name: 'ChatRoom',
  data() {
    return {
      question: '',
      messages: [],
      loading: false,
      backendStatus: 'checking',
      documents: [],
      docsLoading: false,
    }
  },
  mounted() {
    this.checkBackend()
    this.loadDocs()
    // 启动后自动问候
    setTimeout(() => {
      this.messages.push({
        role: 'assistant',
        content: '你好！我是秋生的AI小助手。\n\n请先上传文档（支持 PDF / TXT / Markdown），然后就可以向我提问了。我会从你上传的文档中检索相关信息来回答。',
      })
    }, 500)
  },
  methods: {
    async checkBackend() {
      this.backendStatus = 'checking'
      const result = await healthCheck()
      this.backendStatus = result.status === 'ok' ? 'ok' : 'offline'
    },

    async loadDocs() {
      this.docsLoading = true
      try {
        const data = await getDocuments()
        this.documents = data.documents || []
      } catch {
        // 后端可能未启动
      } finally {
        this.docsLoading = false
      }
    },

    async sendMessage() {
      const q = this.question.trim()
      if (!q || this.loading) return

      this.messages.push({ role: 'user', content: q })
      this.question = ''
      this.loading = true

      try {
        const res = await chat(q)
        this.messages.push({
          role: 'assistant',
          content: res.answer || '抱歉，没有得到回答。',
          sources: res.sources || [],
        })
      } catch (err) {
        this.messages.push({
          role: 'assistant',
          content: `❌ 请求失败: ${err.message}\n\n请确认后端服务已启动（运行 start_rag_server.bat）`,
        })
      } finally {
        this.loading = false
        this.$nextTick(() => this.scrollToBottom())
      }
    },

    renderedContent(msg) {
      // 简单的 Markdown 转 HTML（支持换行、粗体、代码块）
      let text = msg.content || ''
      // 转义 HTML
      text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      // 代码块 ```code```
      text = text.replace(/```(\w*)\n?([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
      // 行内代码 `code`
      text = text.replace(/`([^`]+)`/g, '<code>$1</code>')
      // 粗体 **text**
      text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // 换行
      text = text.replace(/\n/g, '<br>')
      return text
    },

    scrollToBottom() {
      const el = this.$refs.messageList
      if (el) el.scrollTop = el.scrollHeight
    },
  },
}
</script>

<style scoped>
.chat-room {
  display: flex;
  height: calc(100vh - 50px); /* 减去 header 高度 */
  background: #f0f2f5;
  gap: 16px;
  padding: 16px;
  box-sizing: border-box;
}

/* ── 左侧聊天面板 ───────────────── */
.chat-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid #ebeef5;
  background: #fafafa;
}

.chat-header h2 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.header-icon {
  margin-right: 6px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.empty-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #909399;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-sub {
  font-size: 13px;
  color: #c0c4cc;
}

.message-item {
  display: flex;
  margin-bottom: 20px;
  gap: 12px;
}

.message-item.user {
  flex-direction: row-reverse;
}

.message-avatar {
  font-size: 28px;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f2f5;
  border-radius: 50%;
}

.message-item.user .message-avatar {
  background: #e6f7ff;
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  color: #303133;
}

.message-item.assistant .message-bubble {
  background: #f0f2f5;
  border-bottom-left-radius: 4px;
}

.message-item.user .message-bubble {
  background: #ecf5ff;
  border-bottom-right-radius: 4px;
}

.message-content :deep(pre) {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 12px;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 13px;
  margin: 8px 0;
}

.message-content :deep(code) {
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 13px;
  color: #e96900;
}

.message-content :deep(pre code) {
  background: transparent;
  color: inherit;
  padding: 0;
}

.message-sources {
  margin-top: 8px;
}

.source-item {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 4px 0;
  font-size: 12px;
  color: #909399;
}

.source-file {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.source-score {
  color: #c0c4cc;
  font-size: 11px;
}

/* ── 思考动画 ───────────────── */
.thinking {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dot-pulse {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #409eff;
  animation: pulse 1.2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
  40% { opacity: 1; transform: scale(1); }
}

.thinking-text {
  color: #909399;
  font-size: 13px;
}

/* ── 输入框 ───────────────── */
.chat-input {
  display: flex;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid #ebeef5;
  background: #fafafa;
}

.chat-input .el-input {
  flex: 1;
}

.send-btn {
  align-self: flex-end;
  height: 56px;
  width: 80px;
}

/* ── 右侧信息面板 ───────────────── */
.info-panel {
  width: 280px;
  flex-shrink: 0;
}

.info-loading,
.info-empty {
  text-align: center;
  padding: 40px 0;
  color: #909399;
}

.info-hint {
  font-size: 12px;
  color: #c0c4cc;
  margin-top: 8px;
}

.doc-list {
  max-height: 400px;
  overflow-y: auto;
}

.doc-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.doc-icon {
  font-size: 20px;
  flex-shrink: 0;
}

.doc-info {
  flex: 1;
  min-width: 0;
}

.doc-name {
  font-size: 13px;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.doc-meta {
  font-size: 11px;
  color: #c0c4cc;
  margin-top: 2px;
}
</style>
