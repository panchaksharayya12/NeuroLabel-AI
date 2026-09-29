# NeuroLabel AI
> **Agentic AI-Powered Medical Device Labeling Automation**  
> *Developed for NeuroNexa — "Better Labels. Safer Patients."*

---

## Direct Access Links

| Resource | Direct Link | Description |
| :--- | :--- | :--- |
| **Live Production Website** | **[https://neuro-label-ai.vercel.app/](https://neuro-label-ai.vercel.app/)** | Live Production Deployment on Vercel |
| **Project Report (.docx)** | **[Download Word Document](https://raw.githubusercontent.com/panchaksharayya12/NeuroLabel-AI/main/NeuroLabel_AI_Project_Report.docx)** • **[View on GitHub](https://github.com/panchaksharayya12/NeuroLabel-AI/blob/main/NeuroLabel_AI_Project_Report.docx)** | Full Technical and Regulatory Project Report |
| **Local Development Web App** | **[http://localhost:5173](http://localhost:5173)** | Local Development Frontend Server |
| **Interactive API Documentation** | **[http://localhost:8000/docs](http://localhost:8000/docs)** | FastAPI Swagger UI with live testing for all endpoints |
| **ReDoc API Documentation** | **[http://localhost:8000/redoc](http://localhost:8000/redoc)** | Clean technical OpenAPI specification |
| **Dashboard Data API** | **[http://localhost:8000/api/dashboard](http://localhost:8000/api/dashboard)** | Live JSON data payload powering the dashboard |
| **Audit Log CSV Export** | **[http://localhost:8000/api/audit-logs/export](http://localhost:8000/api/audit-logs/export)** | 21 CFR Part 11 cryptographic audit trail export |

---

## Executive Summary

NeuroLabel AI is a production-grade enterprise AI SaaS platform engineered to automate and coordinate medical-device labeling workflows across global jurisdictions including EU MDR 2017/745 and India CDSCO Medical Device Rules 2017.

The platform demonstrates this operational scenario:  
A medical-device manufacturer receives a mandatory regulatory update requiring an updated safety warning for lithium secondary batteries across dual jurisdictions (India and European Union) on the CardioSense Monitor (CS-100).

The system coordinates 7 specialized AI agents and enforces an immutable Human Approval Gate (21 CFR Part 11) prior to cryptographic release:
1. **Change Impact Agent**: Identifies affected devices, packaging labels (4 SKUs), markets (India, EU), and languages.
2. **Label Authoring Agent**: Generates clinical safety warning diffs and rationale.
3. **Compliance Agent**: Evaluates deterministic regulatory rules (EU MDR, CDSCO, UDI, ISO 15223-1 symbols) calculating a live 92% compliance score.
4. **Artwork Vision Agent**: Uses OpenCV computer vision to detect pixel differences, symbol bounding boxes, and barcode integrity.
5. **Translation Agent**: Inspects English vs. German translations for medical nuances and terminology mismatches.
6. **Risk and Quality Agent**: Aggregates findings and scores the hazard index (LOW risk, 18.5/100).
7. **Human Approval Gate**: Requires authorized electronic signature before any label release.
8. **Release and Audit Trail**: Cryptographically hashes every action using SHA-256 for complete traceability.

---

## User Interface and Visual Design

The UI replicates the enterprise AI dark theme specified in the product requirements:
- **Theme**: Dark navy/black background (`#070B14`, `#0C1322`), electric blue, cyan, purple, and neon accents.
- **Components**: Glassmorphism cards, glowing status borders, neon agent workflow nodes, live agent collaboration activity stream, interactive radial compliance gauge, side-by-side OpenCV artwork comparisons, and milestone steppers.
- **Backend-Driven**: Every button, form, filter, export, and status transition connects to live FastAPI backend services and a SQLite database.

---

## Technology Stack

### Frontend
- **Framework**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, custom glassmorphism, responsive layout
- **Icons**: Lucide React
- **Visual Feedback**: Canvas Confetti (upon compliant human sign-off)

### Backend
- **Framework**: FastAPI (Python 3.13)
- **Database and ORM**: SQLite, SQLAlchemy 2.0
- **Validation**: Pydantic v2
- **Computer Vision**: OpenCV Headless, Pillow, NumPy
- **Security**: SHA-256 cryptographic audit signatures (21 CFR Part 11)

### Dual-Mode AI Engine
- **Offline / Local Deterministic Mode (Default)**: Zero external dependency requirement. Generates authentic regulatory evaluations, compliance scores, and OpenCV diffs.
- **OpenAI Hybrid Mode (Optional)**: Automatically activates if `OPENAI_API_KEY` is present in `backend/.env`.

---

## Quickstart Guide

### Prerequisites
- Python 3.10+ (Tested on Python 3.13)
- Node.js 18+ (Tested on v20.18.0)
- npm 9+

---

### Step 1: Backend Setup and Launch

1. Open a terminal in the project root:
   ```bash
   cd backend
   ```

2. Activate the virtual environment (or create one):
   ```bash
   # Windows PowerShell:
   .\venv\Scripts\Activate.ps1

   # Linux / macOS:
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install fastapi "uvicorn[standard]" pydantic sqlalchemy python-multipart pillow numpy opencv-python-headless requests python-docx
   ```

4. Start the FastAPI server:
   ```bash
   python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

- **Backend API**: `http://127.0.0.1:8000`
- **Swagger Documentation**: `http://127.0.0.1:8000/docs`
- **Database**: SQLite database auto-created and seeded at `backend/data/neurolabel.db`.

---

### Step 2: Frontend Setup and Launch

1. Open a second terminal:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

- **Live Production Deployment**: [https://neuro-label-ai.vercel.app/](https://neuro-label-ai.vercel.app/)
- **Local Development Server**: `http://127.0.0.1:5173`

---

## Implemented Pages and Features

| Page | Features and Capabilities |
| :--- | :--- |
| **1. Dashboard** | Visual control center: Live hero card, demo scenario for CardioSense CS-100 (India and EU), 8 connected agent cards, live collaboration feed, interactive label preview with tabs, radial compliance gauge (92%), key insights, milestone progress stepper, and expected impact metrics. |
| **2. New Request** | Form to create a labeling revision with medical device selector, regulatory directives, market checkboxes (India, EU, US, UK, Japan), language selectors, and artwork uploaders. |
| **3. Request Details** | Deep-dive page with 7 tabs: Label Comparison (Current vs Proposed), Compliance Engine (8 rules), Artwork Vision (OpenCV diff), Translation (EN vs DE), Risk and Quality, Human Approval Gate, and Audit Trail. |
| **4. Label Library** | Filterable catalog of medical device packaging labels across products, markets, languages, and statuses, with version history drawer. |
| **5. Change Impact** | Regulatory dependency tree showing how directives cascade to markets, products, 4 affected packaging labels, and downstream actions. |
| **6. Compliance Engine** | Global regulatory rule inspector for EU MDR, CDSCO, FDA, and ISO standards with interactive rule auditor. |
| **7. Artwork Vision** | Computer vision comparison studio utilizing OpenCV contour detection to highlight layout variations and verify GS1-128 barcodes. |
| **8. Translation** | Bilingual medical validation workbench checking German phrasing nuances against DIN EN ISO 15223-1 standards. |
| **9. Audit Logs** | Tamper-evident 21 CFR Part 11 compliant event log with SHA-256 cryptographic signatures and downloadable CSV export. |
| **10. Settings** | System configuration for AI Engine mode (Local Deterministic vs OpenAI), jurisdiction toggles, and electronic signature gates. |

---

## Regulatory Compliance and Human Oversight (21 CFR Part 11)

NeuroLabel AI enforces mandatory human oversight:
- AI agents analyze, draft, and cross-reference, but cannot release a label independently.
- The workflow enters "Awaiting Human Approval" after all automated agents finish.
- The Project Lead (`Rashmi Gowda`) must execute an electronic signature with formal comments.
- Rejection requires an explicit documented reason.
- Revisions route feedback back to authoring agents.
- All actions are permanently written with SHA-256 tamper-evident cryptographic hashes.

---

## System Verification and Automated Testing

All tests can be re-run at any time:
```bash
cd backend
.\venv\Scripts\python test_workflow.py
```
This validates:
- Request creation
- Multi-agent sequential background execution
- Approval and rejection flows
- SHA-256 cryptographic audit logs
- CSV export integrity
- OpenCV image comparison endpoint
