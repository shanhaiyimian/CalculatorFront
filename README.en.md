# CalculatorFront · JX3 Fen Ying Damage Calculator

[简体中文](README.md) | **English**

A Vue 2 application for comparing JX3 Fen Ying attributes, skill damage, skill sequences, and marginal attribute gains. The repository also includes an optional local knowledge-base Q&A service built with FastAPI, ChromaDB, and the DeepSeek API.

> The current Fen Ying page uses the “苍生铸世” attribute rules with both sides fixed at level 50. Base attributes and selected skills have been updated; other multipliers, talents, and damage rules have not all been recalibrated. Treat results as comparisons.

## Features and status

- **Fen Ying calculations:** enter player and target attributes, select buffs, talents, and damage reductions, and inspect normal and critical damage.
- **Sequence analysis:** add, remove, or clear skills and view coefficients, total damage, and damage-share charts.
- **Attribute gains:** use Sun Break (日破) with the currently selected buffs as the fixed reference, and list the expected damage gained per attribute point from highest to lowest.
- **Consumable buffs:** choose food, medicine, enchants, wine, creative dishes, banquets, and perfume. Choices are mutually exclusive within a category; click the selected option again to clear it. Different categories stack according to the calculation rules.
- **Optional RAG service:** upload documents, retrieve passages, and generate answers with source references. Its navigation entries are currently hidden, but the routes remain accessible.
- **Legacy page:** `/mingzun` remains registered but contains historical skill content and unfinished items. It is not a fully supported current feature.

The calculator runs in the browser and requires neither the Python service nor an API key. Reference expected damage currently does not subtract the target's critical resistance from critical-hit probability.

## Technology

| Layer | Main components |
| --- | --- |
| Frontend | Vue 2, Vue Router 3, Element UI 2, ECharts 6 |
| Build and checks | Vue CLI 5, Babel, ESLint, Prettier |
| Optional backend | Python, FastAPI, Uvicorn, ChromaDB |
| Documents and models | sentence-transformers, PyMuPDF, httpx, DeepSeek API |

Frontend dependencies are defined in [package.json](package.json) and [package-lock.json](package-lock.json). Backend dependencies are listed in [requirements.txt](rag-server/requirements.txt).

## Quick start

Install Node.js and npm first. This repository does not currently pin their versions through `engines` or a version file; use an environment compatible with the lockfile and existing dependencies.

Run from the project root:

```powershell
npm ci
npm run serve
```

The default address is [http://localhost:8001](http://localhost:8001), and the development server opens a browser automatically. If the port is occupied, use the address printed in the terminal. `npm ci` installs from the lockfile; use `npm install` when intentionally updating dependencies.

The application uses **hash routing**:

| Address | Purpose |
| --- | --- |
| `http://localhost:8001/#/` | Home |
| `http://localhost:8001/#/fenying` | Fen Ying calculator |
| `http://localhost:8001/#/knowledge` | Knowledge management; requires the backend |
| `http://localhost:8001/#/chat` | AI Q&A; requires the backend |
| `http://localhost:8001/#/mingzun` | Legacy page; hidden from navigation |

## Using the calculator

The page starts with editable default attributes. Inputs use rating points, and the panels display converted values. Critical-damage resistance is derived from critical resistance.

1. Enter the **level-50, unbuffed in-game panel**. Base attack should be the game's base-attack value, already including innate Yuanqi conversion and fixed specialization attack; do not enter final panel attack.
2. Enter critical-hit, critical-damage, overcome, and target defensive attributes as **rating points**, not percentages. Enter `0` for absent attributes.
3. Choose whether to include the innate toughness of a non-tank specialization. Disable this option for training dummies, NPCs, or tank specializations.
4. Select the applicable consumables, buffs, talents, and reductions, then inspect skill damage, sequences, and attribute gains. Update all inputs after changing equipment.

Incomplete required inputs leave results at “待录入” (awaiting input) and disable the relevant calculation controls. “All non-critical” and “all critical” charts represent two calculation scenarios, not an actual combat critical-hit distribution.

## Optional: start the knowledge-base backend

Install a Python 3 environment compatible with [requirements.txt](rag-server/requirements.txt). Run the following PowerShell commands from the project root. They invoke the virtual environment's interpreter directly and do not require changing PowerShell's execution policy.

```powershell
python -m venv .venv-rag
.\.venv-rag\Scripts\python.exe -m pip install -r rag-server/requirements.txt
$env:DEEPSEEK_API_KEY = "replace-with-your-api-key"
.\.venv-rag\Scripts\python.exe -m uvicorn main:app --app-dir rag-server --host 127.0.0.1 --port 8000 --reload
```

`DEEPSEEK_API_KEY` is read from the process environment. [.env.example](rag-server/.env.example) is a format example only: the current code **does not automatically load `.env` files**. Keep real credentials, virtual environments, and personal knowledge-base data out of commits.

Prepare embedding models before use. The engine forces offline loading, tries the configured `text2vec-base-chinese` model, and falls back to `all-MiniLM-L6-v2`; both use `local_files_only=True`. Compatible model caches must already be available to the user running the backend. Installing Python dependencies does not populate these caches. With an API key, the engine first tries API embeddings and still falls back to local models on failure.

Without an API key, document retrieval can work when local models are available, but no DeepSeek answer is generated. The backend currently has no authentication and uses permissive development CORS settings; add access controls and restrict configuration before exposing it externally.

Check the service from another terminal:

```powershell
Invoke-RestMethod http://127.0.0.1:8000/health
```

API documentation: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs). A successful health check only indicates service and index initialization; upload a document and ask a question to verify model loading, embeddings, and answer generation end to end.

The included [start_rag_server.bat](start_rag_server.bat) overwrites the API key with a placeholder and forcibly terminates processes listening on port 8000. Prefer the manual startup command above.

### Documents and storage

- Open `/#/knowledge` to upload UTF-8 TXT, Markdown, or PDFs with extractable text, then ask questions at `/#/chat`. PDF processing does not include OCR.
- Original uploads are stored in `rag-server/knowledge/`; vector indexes and metadata are stored in `rag-server/data/chroma_db/`.
- Copying files into `knowledge/` does not index them automatically. Import them through the upload endpoint.
- Deleting a knowledge-base document removes its index entries and metadata, **but keeps the original uploaded file**. Back up both the originals and the index directory.
- Although the UI mentions a 20 MB limit, neither frontend nor backend currently enforces that limit. Q&A returns ordinary JSON; streaming is not implemented.

### API overview

The default service address is `http://127.0.0.1:8000`.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/health` | Service status and document count |
| `POST` | `/upload` | Upload using `multipart/form-data` with the field `file` |
| `POST` | `/chat` | JSON request, e.g. `{"question":"What does this document describe?","top_k":5}` |
| `GET` | `/documents` | List imported documents |
| `DELETE` | `/documents/{doc_id}` | Delete a document's index entries and metadata |

## Common commands

| Command | Purpose |
| --- | --- |
| `npm ci` | Install frontend dependencies from the lockfile |
| `npm run serve` | Start the frontend development server |
| `npm run build` | Build production static files |
| `npm run lint -- --no-fix` | Check code without automatically modifying files |
| `npm run lint` | Check code and automatically fix supported issues |
| `node scripts/check-fenying-attributes.cjs` | Run the existing Fen Ying attribute and sequence regression checks |

The regression script covers selected attribute conversions, input states, gains, and sequence rules. It does not validate every game mechanic or the RAG pipeline. There is currently no `npm test` script.

## Build and deployment

After `npm run build`, deploy **`V1.10/dist/`** using a static HTTP server. The actual build output is not the root `dist/` directory. Assets use `publicPath: './'`, and navigation uses hash routing. See [vue.config.js](vue.config.js).

The RAG service address is hardcoded as `http://127.0.0.1:8000` in `API_BASE` in [src/util/api.js](src/util/api.js); there is no `VUE_APP_*` configuration for it. For deployment on another machine, replace it with a backend address accessible to the browser and rebuild. In a browser, `127.0.0.1` refers to the visitor's own computer. An HTTPS frontend should use an HTTPS backend or a same-origin proxy.

## Project structure

```text
CalculatorFront/
├── public/                   # HTML template and static files
├── src/
│   ├── common/skills/        # Attributes, skills, and damage calculations
│   ├── components/           # Layout and navigation
│   ├── router/               # Frontend routes
│   ├── util/api.js           # RAG requests and backend address
│   └── views/                # Calculator, chat, and knowledge pages
├── rag-server/               # Optional FastAPI service, documents, and indexes
├── scripts/                  # Fen Ying regression checks
├── V1.10/dist/               # Production frontend build output
└── vue.config.js             # Development server and build configuration
```

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Results stay at “待录入” | Complete all required player and target attributes; enter `0` for absent values |
| AI navigation is missing | Entries are hidden; open `/#/knowledge` or `/#/chat` directly |
| Backend is offline or uploads cannot connect | Check `/health`, port 8000, and the configured `API_BASE` |
| Health works but upload or Q&A fails | Inspect backend logs, model caches, embedding requests, the API key, and imported content |
| Development hot reload cannot connect | Check whether the WebSocket address fixed to port 8001 in `vue.config.js` matches the running server |
| Build output seems missing | Look in `V1.10/dist/`, not only the root `dist/` directory |

## Contributing and license

For calculation changes, provide the applicable game version, formula sources, and reproducible inputs. Update relevant regression checks and run the build and necessary checks. Keep the Chinese and English READMEs synchronized when behavior or configuration changes.

[package.json](package.json) declares `ISC`, but the repository does not currently contain a standalone `LICENSE` file. Permissions for images, game assets, and other third-party content are not documented consistently here; confirm them with the maintainer before redistribution or reuse.
