import React,{useEffect,useState} from "react";
import {createRoot} from "react-dom/client";
import {ShieldCheck,ScanSearch,MapPin,FileSearch,Activity,AlertTriangle,CheckCircle} from "lucide-react";
import "./style.css";

const API="http://localhost:8000";

function App(){
 const [tab,setTab]=useState("dashboard"), [subject,setSubject]=useState(""),[sender,setSender]=useState(""),[body,setBody]=useState(""),[result,setResult]=useState(null),[history,setHistory]=useState([]);

 const load=()=>fetch(API+"/api/history").then(r=>r.json()).then(setHistory);

 useEffect(()=>{load()},[]);

 const scan=async()=>{
  const r=await fetch(API+"/api/analyze",{
   method:"POST",
   headers:{"Content-Type":"application/json"},
   body:JSON.stringify({subject,sender,body})
  });
  const x=await r.json();
  setResult(x);
  load()
 };

 const nav=[
  ["dashboard","Dashboard",Activity],
  ["scanner","Email Scanner",ScanSearch],
  ["forensics","Forensic Intel",FileSearch],
  ["geo","Geo Intelligence",MapPin]
 ];

 return <div className="app">
  <aside>
   <div className="brand">
    <ShieldCheck/>
    <span>ThreatLens<span> AI</span></span>
   </div>

   <div className="tag">EMAIL THREAT • FORENSICS</div>

   {nav.map(([id,n,I])=>
    <button
     className={tab===id?"nav active":"nav"}
     onClick={()=>setTab(id)}
    >
     <I size={18}/>
     {n}
    </button>
   )}

   <div className="sidecard">
    <div className="dot"></div>
    <b>Detection Engine</b>
    <small>Online • API protected
