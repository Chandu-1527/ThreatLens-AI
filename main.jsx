import React,{useEffect,useState} from "react";
import {createRoot} from "react-dom/client";
import {ShieldCheck,ScanSearch,MapPin,FileSearch,Activity,AlertTriangle,CheckCircle} from "lucide-react";
import "./style.css";

const API="http://localhost:8000";
function App(){
 const [tab,setTab]=useState("dashboard"), [subject,setSubject]=useState(""),[sender,setSender]=useState(""),[body,setBody]=useState(""),[result,setResult]=useState(null),[history,setHistory]=useState([]);
 const load=()=>fetch(API+"/api/history").then(r=>r.json()).then(setHistory);
 useEffect(()=>{load()},[]);
 const scan=async()=>{const r=await fetch(API+"/api/analyze",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({subject,sender,body})}); const x=await r.json();setResult(x);load()};
 const nav=[["dashboard","Dashboard",Activity],["scanner","Email Scanner",ScanSearch],["forensics","Forensic Intel",FileSearch],["geo","Geo Intelligence",MapPin]];
 return <div className="app">
  <aside><div className="brand"><ShieldCheck/> <span>ThreatLens<span> AI</span></span></div>
   <div className="tag">EMAIL THREAT • FORENSICS</div>
   {nav.map(([id,n,I])=><button className={tab===id?"nav active":"nav"} onClick={()=>setTab(id)}><I size={18}/>{n}</button>)}
   <div className="sidecard"><div className="dot"></div><b>Detection Engine</b><small>Online • API protected</small></div>
  </aside>
  <main><header><div><div className="eyebrow">AI SECURITY OPERATIONS CENTER</div><h1>{tab==="dashboard"?"Threat Intelligence Dashboard":tab==="scanner"?"AI Email Threat Scanner":tab==="forensics"?"Forensic Intelligence": "GeoLocation Intelligence"}</h1></div><div className="status"><i/> SYSTEM ONLINE</div></header>
   {tab==="dashboard"&&<Dashboard history={history} setTab={setTab}/>}
   {tab==="scanner"&&<Scanner {...{subject,setSubject,sender,setSender,body,setBody,scan,result}}/>}
   {tab==="forensics"&&<Forensics result={result}/>}
   {tab==="geo"&&<Geo/>}
  </main>
 </div>
}
function Dashboard({history,setTab}){
 const high=history.filter(x=>x.verdict==="HIGH RISK").length, total=history.length, avg=total?Math.round(history.reduce((a,b)=>a+b.score,0)/total):0;
 return <><section className="hero"><div><div className="pill">● AI-POWERED DEFENSE</div><h2>Detect. Investigate.<br/><em>Understand the threat.</em></h2><p>Analyze suspicious email evidence, extract indicators, assess risk and prepare analyst-ready forensic intelligence.</p><button className="primary" onClick={()=>setTab("scanner")}>Start Email Investigation →</button></div><div className="radar"><div className="ring r1"/><div className="ring r2"/><ShieldCheck size={64}/></div></section>
 <div className="cards"><Card title="Emails Analyzed" value={total} sub="Recorded investigations" icon={ScanSearch}/><Card title="High Risk" value={high} sub="Requires review" icon={AlertTriangle}/><Card title="Avg. Risk Score" value={avg} sub="Across recent scans" icon={Activity}/><Card title="Engine Status" value="ONLINE" sub="FastAPI service" icon={CheckCircle}/></div>
 <section className="panel"><div className="panelhead"><h3>Recent Investigations</h3><span>{total} records</span></div>{history.length?<table><thead><tr><th>SUBJECT</th><th>SENDER</th><th>VERDICT</th><th>SCORE</th></tr></thead><tbody>{history.slice(0,8).map(x=><tr><td>{x.subject||"Untitled email"}</td><td>{x.sender||"Unknown"}</td><td><b className={x.verdict==="HIGH RISK"?"danger":"safe"}>{x.verdict}</b></td><td>{x.score}/100</td></tr>)}</tbody></table>:<div className="empty">No investigations yet. Start your first email scan.</div>}</section></>
}
function Card({title,value,sub,icon:Icon}){return <div className="card"><Icon/><small>{title}</small><strong>{value}</strong><span>{sub}</span></div>}
function Scanner(p){
 return <div className="grid2"><section className="panel form"><div className="panelhead"><h3>Email Evidence</h3><span>Paste or type evidence</span></div><label>SUBJECT<input value={p.subject} onChange={e=>p.setSubject(e.target.value)} placeholder="Suspicious email subject"/></label><label>SENDER<input value={p.sender} onChange={e=>p.setSender(e.target.value)} placeholder="sender@example.com"/></label><label>BODY<textarea value={p.body} onChange={e=>p.setBody(e.target.value)} placeholder="Paste the email body, links and suspicious content here..."/></label><button className="primary full" onClick={p.scan}>Run AI Threat Analysis</button></section><section className="panel result">{p.result?<><div className="score">{p.result.score}<small>/100</small></div><h2 className={p.result.score>=70?"red":""}>{p.result.verdict}</h2><p>Risk assessment based on detected content indicators.</p><h4>Evidence Signals</h4>{p.result.reasons.map(x=><div className="signal"><AlertTriangle size={15}/>{x}</div>)}<h4>Extracted IOCs</h4><pre>{JSON.stringify(p.result.iocs,null,2)}</pre></>:<div className="empty"><ScanSearch size={44}/><h3>Ready for analysis</h3><p>Submit an email to generate risk scoring and forensic indicators.</p></div>}</section></div>
}
function Forensics({result}){return <section className="panel"><div className="panelhead"><h3>Forensic Intelligence Workspace</h3><span>Evidence-aware analysis</span></div>{result?<><div className="forensicgrid"><div><h4>Authentication</h4><pre>{JSON.stringify(result.authentication,null,2)}</pre></div><div><h4>Indicators of Compromise</h4><pre>{JSON.stringify(result.iocs,null,2)}</pre></div></div><div className="notice">Production note: connect trusted threat-intelligence, WHOIS/DNS, geolocation and mail-authentication providers on the backend. Never treat unavailable data as proof of safety.</div></>:<div className="empty"><FileSearch size={44}/><h3>No case loaded</h3><p>Run an email investigation first.</p></div>}</section>}
function Geo(){return <section className="panel geo"><MapPin size={50}/><h2>GeoLocation Intelligence</h2><p>Use this workspace to correlate sender infrastructure, IP addresses and hosting locations from authorized evidence.</p><div className="notice">Privacy-safe design: this demo does not silently collect the visitor's precise location. Add an IP geolocation provider to enrich an analyzed IP on the server.</div><div className="mapfake"><div className="pin">●</div><span>Threat infrastructure map</span></div></section>}
createRoot(document.getElementById("root")).render(<App/>);
