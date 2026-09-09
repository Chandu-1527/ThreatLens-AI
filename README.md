# ThreatLens AI — Full Stack Email Threat Detection Platform

A student-friendly full-stack starter for **AI-Powered Email Threat Detection, GeoLocation and Forensic Intelligence**.

## Stack
- Frontend: React + Vite + Lucide
- Backend: Python + FastAPI
- Database: SQLite (demo persistence)
- Detection: explainable rule/heuristic engine, ready to replace with an ML/NLP model
- Modules: Dashboard, Email Scanner, Forensic Intelligence, GeoLocation workspace, scan history

## Run

### Backend
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Open the Vite URL shown in the terminal.

## Production upgrades
1. Replace the heuristic detector with a trained NLP/ML model.
2. Add PostgreSQL/MongoDB.
3. Add authenticated analyst accounts and RBAC.
4. Integrate authorized IP/domain reputation and geolocation providers.
5. Parse `.eml` safely in an isolated worker.
6. Add SPF/DKIM/DMARC verification from authorized mail evidence.
7. Add encrypted evidence storage and audit logging.
8. Deploy frontend to Vercel/Netlify and FastAPI to Render/Railway/AWS.

The design intentionally separates unavailable evidence from safe/benign conclusions.
