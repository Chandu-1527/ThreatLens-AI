from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import re, sqlite3, json

app = FastAPI(title="ThreatLens AI API", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True,
                   allow_methods=["*"], allow_headers=["*"])

DB="threatlens.db"
def db():
    c=sqlite3.connect(DB)
    c.execute("""CREATE TABLE IF NOT EXISTS scans(
        id INTEGER PRIMARY KEY AUTOINCREMENT, subject TEXT, sender TEXT,
        verdict TEXT, score INTEGER, reasons TEXT, created_at TEXT)""")
    c.commit(); return c
db().close()

class Email(BaseModel):
    subject: str = ""
    sender: str = ""
    body: str

def analyze(e: Email):
    text=(e.subject+" "+e.sender+" "+e.body).lower()
    reasons=[]; score=5
    patterns=[
        (r"urgent|immediately|act now|final warning",20,"Urgency/manipulation language"),
        (r"verify your account|confirm your account|password|login",22,"Credential/request language"),
        (r"click here|open the link|download attachment",18,"Suspicious action request"),
        (r"gift card|wire transfer|bank details|otp|one-time password",25,"Financial or credential lure"),
        (r"http://|bit\.ly|tinyurl|t\.co/",15,"Potentially risky link pattern"),
        (r"invoice|payment due|refund|prize|winner",12,"Common social-engineering lure"),
    ]
    for pat, pts, reason in patterns:
        if re.search(pat,text):
            score += pts; reasons.append(reason)
    score=min(score,100)
    verdict="HIGH RISK" if score>=70 else ("SUSPICIOUS" if score>=40 else "LOW RISK")
    return {"verdict":verdict,"score":score,"reasons":reasons or ["No strong phishing indicators detected"],
            "authentication":{"spf":"Not available","dkim":"Not available","dmarc":"Not available"},
            "iocs":{"urls":re.findall(r'https?://\S+', e.body),"emails":re.findall(r'[\w\.-]+@[\w\.-]+\.\w+', e.body)}}

@app.get("/api/health")
def health(): return {"status":"online","service":"ThreatLens AI"}

@app.post("/api/analyze")
def scan(e: Email):
    result=analyze(e)
    c=db()
    c.execute("INSERT INTO scans(subject,sender,verdict,score,reasons,created_at) VALUES(?,?,?,?,?,?)",
              (e.subject,e.sender,result["verdict"],result["score"],json.dumps(result["reasons"]),datetime.utcnow().isoformat()))
    c.commit(); c.close()
    return result

@app.get("/api/history")
def history():
    c=db(); rows=c.execute("SELECT id,subject,sender,verdict,score,created_at FROM scans ORDER BY id DESC LIMIT 20").fetchall()
    c.close()
    return [{"id":r[0],"subject":r[1],"sender":r[2],"verdict":r[3],"score":r[4],"created_at":r[5]} for r in rows]
