from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import re, sqlite3, json

app = FastAPI(title="ThreatLens AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

DB = "threatlens.db"


def db():
    c = sqlite3.connect(DB)
    c.execute("""
        CREATE TABLE IF NOT EXISTS scans(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            subject TEXT,
            sender TEXT,
            verdict TEXT,
            score INTEGER,
            reasons TEXT,
            created_at TEXT
        )
    """)
    c.commit()
    return c


db().close()


class Email(BaseModel):
    subject: str = ""
    sender: str = ""
    body: str


def analyze(e: Email):
    text = (e.subject + " " + e.sender + " " + e.body).lower()

    reasons = []
    score = 5

    patterns = [
        (
            r"urgent|immediately|act now|final warning",
            20,
            "Urgency/manipulation language"
        ),
        (
            r"verify your account|confirm your account|password|login",
            22,
            "Credential/request language"
        ),
        (
            r"click here|open the link|download
