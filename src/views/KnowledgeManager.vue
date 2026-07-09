<template>
  <div class="knowledge-manager">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>📚 知识库管理</h2>
      <el-tag :type="backendStatus === 'ok' ? 'success' : 'danger'" size="small" effect="dark">
        {{ statusText }}
      </el-tag>
    </div>

    <el-row :gutter="20">
      <!-- 左侧：上传区域 -->
      <el-col :span="10">
        <el-card shadow="hover">
          <div slot="header">
            <span>📤 上传文档</span>
          </div>

          <!-- 拖拽上传 -->
          <el-upload
            drag
            :auto-upload="false"
            :show-file-list="true"
            :file-list="fileList"
            :on-change="handleFileChange"
            :on-remove="handleFileRemove"
            accept=".txt,.md,.pdf"
            ref="upload"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖拽到此处，或<em>点击选择</em>
            </div>
            <div class="el-upload__tip" slot="tip">
              支持 TXT / PDF / Markdown 文件，单个文件不超过 20MB
            </div>
          </el-upload>

          <!-- 上传进度 -->
          <div v-if="uploadProgress > 0 && uploadProgress < 100" class="progress-wrapper">
            <el-progress :percentage="uploadProgress" :status="uploadError ? 'exception' : ''"></el-progress>
            <span v-if="uploadStatus" class="upload-status">{{ uploadStatus }}</span>
          </div>

          <!-- 操作按钮 -->
          <div style="margin-top:16px; display:flex; gap:12px;">
            <el-button
              type="primary"
              :disabled="selectedFile === null || uploading"
              :loading="uploading"
              @click="handleUpload"
              icon="el-icon-upload2"
            >
              上传到知识库
            </el-button>
            <el-button @click="resetUpload" :disabled="uploading" icon="el-icon-refresh">
              重置
            </el-button>
          </div>
        </el-card>
      </el-col>

      <!-- 右侧：文档列表 -->
      <el-col :span="14">
        <el-card shadow="hover">
          <div slot="header">
            <span>📋 已导入文档</span>
            <el-button
              size="mini"
              type="text"
              style="float:right"
              icon="el-icon-refresh"
              @click="loadDocuments"
            >刷新</el-button>
          </div>

          <!-- 加载状态 -->
          <div v-if="docsLoading" class="center-box">
            <i class="el-icon-loading" style="font-size:24px; color:#409eff;"></i>
            <p>加载中...</p>
          </div>

          <!-- 空状态 -->
          <div v-else-if="documents.length === 0" class="center-box">
            <div style="font-size:48px; margin-bottom:12px;">📭</div>
            <p style="color:#909399;">知识库为空</p>
            <p style="color:#c0c4cc; font-size:13px;">请通过左侧区域上传文档</p>
          </div>

          <!-- 文档列表 -->
          <el-table
            v-else
            :data="documents"
            style="width:100%"
            size="small"
            stripe
          >
            <el-table-column label="类型" width="60" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.filename.endsWith('.pdf')" style="font-size:20px;">📄</span>
                <span v-else-if="scope.row.filename.endsWith('.md')" style="font-size:20px;">📝</span>
                <span v-else style="font-size:20px;">📃</span>
              </template>
            </el-table-column>
            <el-table-column prop="filename" label="文件名" min-width="160" show-overflow-tooltip></el-table-column>
            <el-table-column prop="chunks" label="片段数" width="80" align="center"></el-table-column>
            <el-table-column prop="created_at" label="导入时间" width="160"></el-table-column>
            <el-table-column label="操作" width="80" align="center">
              <template slot-scope="scope">
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  circle
                  @click="handleDelete(scope.row)"
                  :disabled="deleting === scope.row.id"
                  :loading="deleting === scope.row.id"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>

    <!-- 使用说明 -->
    <el-card shadow="hover" style="margin-top:16px;">
      <div slot="header"><span>💡 使用建议</span></div>
      <el-row :gutter="20">
        <el-col :span="8">
          <h4>1. 准备文档</h4>
          <p>将你想要 AI 参考的文档（攻略、手册、笔记）准备好，支持 TXT / PDF / Markdown 格式。</p>
        </el-col>
        <el-col :span="8">
          <h4>2. 上传到知识库</h4>
          <p>通过左侧上传区将文档导入。系统会自动解析文档内容、分块并向量化存储。</p>
        </el-col>
        <el-col :span="8">
          <h4>3. 开始提问</h4>
          <p>切换到"AI 问答"页面，AI 会从知识库中检索相关内容来回答你的问题。</p>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { uploadFile, getDocuments, deleteDocument, healthCheck } from '@/util/api'

export default {
  name: 'KnowledgeManager',
  data() {
    return {
      backendStatus: 'checking',
      documents: [],
      docsLoading: false,
      selectedFile: null,
      fileList: [],
      uploading: false,
      uploadProgress: 0,
      uploadError: false,
      uploadStatus: '',
      deleting: '',
    }
  },
  computed: {
    statusText() {
      const map = {
        ok: '后端在线',
        checking: '检查中...',
        offline: '离线',
      }
      return map[this.backendStatus] || '未知'
    },
  },
  mounted() {
    this.checkBackend()
    this.loadDocuments()
  },
  methods: {
    async checkBackend() {
      this.backendStatus = 'checking'
      const result = await healthCheck()
      this.backendStatus = result.status === 'ok' ? 'ok' : 'offline'
    },

    async loadDocuments() {
      this.docsLoading = true
      try {
        const data = await getDocuments()
        this.documents = data.documents || []
      } catch {
        // 后端不可用时不报错
      } finally {
        this.docsLoading = false
      }
    },

    handleFileChange(file, fileList) {
      // file.raw: 原生 File 对象（Element UI 标准字段）
      // 降级：file 本身可能已经是 File 对象，或从 fileList 的第一个取
      const raw = file.raw || file
      this.selectedFile = raw instanceof Blob ? raw : null
      this.fileList = fileList || [file]
      if (!this.selectedFile) {
        console.error('[knowledge] 未能获取文件对象', file)
      }
    },

    handleFileRemove() {
      this.selectedFile = null
      this.fileList = []
    },

    resetUpload() {
      this.selectedFile = null
      this.fileList = []
      this.uploadProgress = 0
      this.uploadError = false
      this.uploadStatus = ''
      if (this.$refs.upload) {
        this.$refs.upload.clearFiles()
      }
    },

    async handleUpload() {
      if (!this.selectedFile) {
        this.$message.warning('请先选择要上传的文件')
        return
      }
      if (!(this.selectedFile instanceof Blob)) {
        this.$message.error('文件对象异常，请刷新页面后重试')
        return
      }

      this.uploading = true
      this.uploadProgress = 0
      this.uploadError = false
      this.uploadStatus = '正在上传...'

      try {
        const result = await uploadFile(this.selectedFile, (pct) => {
          this.uploadProgress = pct
        })

        this.uploadProgress = 100
        this.uploadStatus = '✅ 导入完成！'
        this.$message.success(
          `"${this.selectedFile.name}" 导入成功，生成 ${result.chunks} 个片段`
        )

        // 刷新文档列表
        this.loadDocuments()
        this.resetUpload()
      } catch (err) {
        this.uploadError = true
        this.uploadStatus = `❌ ${err.message}`
        this.$message.error(`上传失败: ${err.message}`)
      } finally {
        this.uploading = false
      }
    },

    async handleDelete(doc) {
      try {
        await this.$confirm(
          `确定要删除文档 "${doc.filename}" 吗？\n该操作不可恢复。`,
          '确认删除',
          { confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning' }
        )
      } catch {
        return // 用户取消
      }

      this.deleting = doc.id
      try {
        await deleteDocument(doc.id)
        this.$message.success(`"${doc.filename}" 已删除`)
        this.loadDocuments()
      } catch (err) {
        this.$message.error(`删除失败: ${err.message}`)
      } finally {
        this.deleting = ''
      }
    },
  },
}
</script>

<style scoped>
.knowledge-manager {
  padding: 20px;
  background: #f0f2f5;
  min-height: calc(100vh - 50px);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.page-header h2 {
  margin: 0;
  font-size: 20px;
  color: #303133;
}

.center-box {
  text-align: center;
  padding: 60px 0;
}

.center-box p {
  color: #909399;
  margin: 8px 0;
}

.progress-wrapper {
  margin-top: 16px;
}

.upload-status {
  display: block;
  margin-top: 8px;
  font-size: 13px;
  color: #606266;
}

.el-upload-dragger {
  width: 100%;
}

h4 {
  margin: 0 0 8px 0;
  color: #303133;
}

.el-card p {
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
  margin: 0;
}
</style>
