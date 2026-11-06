# CalculatorFront · 剑网三焚影伤害计算器

**简体中文** | [English](README.en.md)

基于 Vue 2 的剑网三伤害计算工具，主要提供焚影属性换算、技能伤害、连招序列与属性收益对比。仓库还包含可选的本地知识库问答模块，使用 FastAPI、ChromaDB 与 DeepSeek API。

> 当前焚影页面采用“苍生铸世、双方固定 50 级”的属性规则。基础属性和部分技能已更新，其余倍率、奇穴及伤害规则尚未全部完成新版校准，计算结果仅供对比。

## 功能与状态

- **焚影计算**：录入自身与敌方属性，设置增益、奇穴和减伤，查看普通伤害与会心伤害。
- **连招分析**：添加、删除或清空技能序列，查看技能系数、总伤害与伤害占比图。
- **属性收益**：固定以当前增益下的日破为参考，比较增加 1 点属性带来的期望伤害变化，并按收益从高到低排列。
- **消耗品增益**：支持小吃、小药、附魔、酒、创意料理、宴席及香水；类别内单选，再次点击已选项即可取消，类别间按计算规则叠加。
- **可选 RAG 模块**：上传文档、检索知识库、调用模型回答并显示引用来源；AI 菜单入口当前隐藏，可通过路由直接访问。
- **历史页面**：`/mingzun` 路由仍保留，但页面含历史技能内容和未完成项，不属于当前完整支持的功能。

焚影计算在浏览器内完成，使用计算器无需启动 Python 后端或配置 API Key。当前参考期望伤害尚未扣除敌方御劲对会心率的影响。

## 技术栈

| 层级 | 主要技术 |
| --- | --- |
| 前端 | Vue 2、Vue Router 3、Element UI 2、ECharts 6 |
| 构建与检查 | Vue CLI 5、Babel、ESLint、Prettier |
| 可选后端 | Python、FastAPI、Uvicorn、ChromaDB |
| 文档与模型 | sentence-transformers、PyMuPDF、httpx、DeepSeek API |

前端依赖见 [package.json](package.json) 与 [package-lock.json](package-lock.json)，后端依赖见 [requirements.txt](rag-server/requirements.txt)。

## 快速开始

先安装 Node.js 和 npm。仓库目前未通过 `engines` 或版本文件固定 Node.js/npm 版本；请使用与锁文件及现有依赖兼容的环境。

在项目根目录运行：

```powershell
npm ci
npm run serve
```

默认访问 [http://localhost:8001](http://localhost:8001)，开发服务器会自动打开浏览器。端口被占用时以终端输出的地址为准。`npm ci` 根据锁文件安装依赖；有意更新依赖时再使用 `npm install`。

项目使用 **hash 路由**：

| 地址 | 用途 |
| --- | --- |
| `http://localhost:8001/#/` | 首页 |
| `http://localhost:8001/#/fenying` | 焚影计算器 |
| `http://localhost:8001/#/knowledge` | 知识库管理，需后端 |
| `http://localhost:8001/#/chat` | AI 问答，需后端 |
| `http://localhost:8001/#/mingzun` | 历史页面，菜单未开放 |

## 计算器使用说明

页面预填可修改的默认属性。输入框使用等级点数，右侧显示换算后的实际面板；御效由御劲自动换算。

1. 输入 **50 级、零增益游戏面板**。基础攻击填写游戏中的基础攻击，已包含元气固有转换及心法固定攻击，不要填写最终面板攻击。
2. 会心、会效、破防及敌方防御属性填写**等级点数**，不要填写百分比；无对应属性时填 `0`。
3. 按目标选择是否包含非防御心法基础化劲；木桩、NPC 或防御心法应取消该选项。
4. 选择与实际场景一致的消耗品、增益、奇穴及减伤，再查看技能伤害、技能序列和属性收益。换装后同步更新全部输入。

必填属性未录入完整时，结果保持“待录入”，相关计算入口不可用。连招图中的“全不会心”和“全会心”分别表示两种计算情形，不代表实战会心分布。

## 可选：启动知识库后端

安装能够满足 [requirements.txt](rag-server/requirements.txt) 的 Python 3 环境。以下 PowerShell 命令均从项目根目录执行；使用虚拟环境的解释器，不要求修改脚本执行策略。

```powershell
python -m venv .venv-rag
.\.venv-rag\Scripts\python.exe -m pip install -r rag-server/requirements.txt
$env:DEEPSEEK_API_KEY = "替换为你的 API Key"
.\.venv-rag\Scripts\python.exe -m uvicorn main:app --app-dir rag-server --host 127.0.0.1 --port 8000 --reload
```

`DEEPSEEK_API_KEY` 从进程环境变量读取。[.env.example](rag-server/.env.example) 仅提供格式示例，当前代码**不会自动加载 `.env` 文件**。请勿提交真实密钥、虚拟环境或个人知识库数据。

启动前还需准备嵌入模型：引擎强制离线加载，本地模型配置为 `text2vec-base-chinese`，失败后尝试 `all-MiniLM-L6-v2`，两者均使用 `local_files_only=True`。需要在运行后端的用户环境中预先准备兼容的模型缓存；安装 Python 依赖不会自动准备这些模型。有 API Key 时先尝试 API 嵌入，失败后仍会回退本地模型。

未配置 API Key 时，在本地模型可用的前提下可检索文档，但不会生成 DeepSeek 回答。后端当前没有身份认证，跨域配置面向本地开发；对外部署前需要补充访问控制并收紧配置。

另开一个终端检查服务：

```powershell
Invoke-RestMethod http://127.0.0.1:8000/health
```

接口文档：[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)。健康检查只说明服务和索引初始化状态；还需实际上传文档并提问，才能确认模型加载、嵌入和回答链路可用。

仓库中的 [start_rag_server.bat](start_rag_server.bat) 会覆盖 API Key 为占位值，并强制结束占用 8000 端口的进程。请优先使用上面的手动启动命令。

### 文档使用与存储

- 进入 `/#/knowledge` 上传 UTF-8 TXT、Markdown 或包含可提取文本的 PDF，再到 `/#/chat` 提问。PDF 处理不包含 OCR。
- 上传原文件保存在 `rag-server/knowledge/`，向量索引和元数据保存在 `rag-server/data/chroma_db/`。
- 直接复制文件到 `knowledge/` 不会自动建立索引，需要通过上传接口导入。
- 删除知识库文档会删除索引及元数据，**不会删除原始上传文件**。备份时同时保留原文件与索引目录。
- 页面虽然提示 20 MB 上限，当前前后端未实现对应的大小校验；问答使用普通 JSON 响应，尚未实现流式输出。

### API 概览

默认服务地址为 `http://127.0.0.1:8000`。

| 方法 | 路径 | 用途 |
| --- | --- | --- |
| `GET` | `/health` | 返回服务状态与文档数量 |
| `POST` | `/upload` | `multipart/form-data` 上传文件，字段名为 `file` |
| `POST` | `/chat` | JSON 请求，例如 `{"question":"文档讲了什么？","top_k":5}` |
| `GET` | `/documents` | 列出已导入文档 |
| `DELETE` | `/documents/{doc_id}` | 删除指定文档的索引与元数据 |

## 常用命令

| 命令 | 作用 |
| --- | --- |
| `npm ci` | 按锁文件安装前端依赖 |
| `npm run serve` | 启动前端开发服务 |
| `npm run build` | 构建生产静态文件 |
| `npm run lint -- --no-fix` | 检查代码，不自动修改文件 |
| `npm run lint` | 检查并自动修复可修复的问题 |
| `node scripts/check-fenying-attributes.cjs` | 运行现有焚影属性和技能序列回归检查 |

回归脚本覆盖部分属性换算、输入状态、收益与技能序列规则；它不等同于全部游戏机制或 RAG 链路验证。当前没有 `npm test` 脚本。

## 构建与部署

运行 `npm run build` 后，将 **`V1.10/dist/`** 部署到静态 HTTP 服务；实际输出不是根目录 `dist/`。资源路径由 `publicPath: './'` 配置，前端使用 hash 路由。构建配置见 [vue.config.js](vue.config.js)。

RAG 地址在 [src/util/api.js](src/util/api.js) 的 `API_BASE` 中硬编码为 `http://127.0.0.1:8000`，没有 `VUE_APP_*` 配置入口。部署到其他机器时应修改为浏览器能够访问的后端地址并重新构建；浏览器中的 `127.0.0.1` 指向访问者自己的电脑。HTTPS 前端应使用 HTTPS 后端或同源代理。

## 目录结构

```text
CalculatorFront/
├── public/                   # HTML 模板与静态文件
├── src/
│   ├── common/skills/        # 属性、技能与伤害计算
│   ├── components/           # 布局和导航组件
│   ├── router/               # 前端路由
│   ├── util/api.js           # RAG 请求与后端地址
│   └── views/                # 计算器、问答及知识库页面
├── rag-server/               # 可选 FastAPI 服务、文档和索引
├── scripts/                  # 焚影回归检查
├── V1.10/dist/               # 前端生产构建输出
└── vue.config.js             # 开发服务器与构建配置
```

## 常见问题

| 现象 | 检查方式 |
| --- | --- |
| 页面一直显示“待录入” | 填全自身和敌方必填属性，无对应数值时填 `0` |
| 找不到 AI 菜单 | 当前菜单隐藏，请直接访问 `/#/knowledge` 或 `/#/chat` |
| 后端离线或上传连接失败 | 检查 `/health`、8000 端口及 `API_BASE` 是否一致 |
| 健康检查正常但上传或问答失败 | 查看后端日志，检查本地模型缓存、嵌入请求、API Key 和知识库内容 |
| 开发热更新连接异常 | 检查 `vue.config.js` 中固定为 8001 的 WebSocket 地址是否与实际服务一致 |
| 构建后找不到输出 | 查看 `V1.10/dist/`，不要只查看根目录 `dist/` |

## 贡献与许可证

提交计算规则变更时，请附适用游戏版本、公式来源和可复现输入；同步更新相关回归检查，并运行构建与必要检查。修改功能或配置后，请同步维护中英文 README。

[package.json](package.json) 声明 `ISC`，但仓库尚未包含独立 `LICENSE` 文件。图片、游戏素材及第三方内容的授权范围未在本仓库中统一说明；分发或复用前请向维护者确认。
