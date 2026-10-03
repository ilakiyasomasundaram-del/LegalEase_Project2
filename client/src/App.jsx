import { FileText, Plus, LayoutDashboard, Info, Trash2, Download, Printer, Copy, Search,Save, Sparkles, ArrowRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import { getTemplates, getDocuments, getDocument, generateDocument, updateDocument, deleteDocument } from "./services/api";
import { jsPDF } from "jspdf";

const fieldMap = {
  rental:[["landlordName","Landlord Name"],["tenantName","Tenant Name"],["propertyAddress","Property Address"],["monthlyRent","Monthly Rent"],["securityDeposit","Security Deposit"],["leaseStartDate","Lease Start Date","date"],["leaseEndDate","Lease End Date","date"],["paymentDueDate","Payment Due Date"],["maintenanceResponsibilities","Maintenance Responsibilities","textarea"],["noticePeriod","Notice Period"],["additionalTerms","Additional Terms","textarea"]],
  employment:[["employerName","Employer / Company"],["employeeName","Employee Name"],["jobTitle","Job Title"],["employmentStartDate","Employment Start Date","date"],["salary","Salary"],["workLocation","Work Location"],["workingHours","Working Hours"],["probationPeriod","Probation Period"],["leavePolicy","Leave Policy","textarea"],["noticePeriod","Notice Period"],["additionalTerms","Additional Terms","textarea"]],
  nda:[["disclosingParty","Disclosing Party"],["receivingParty","Receiving Party"],["purpose","Purpose","textarea"],["confidentialInformation","Confidential Information","textarea"],["duration","Duration"],["permittedDisclosures","Permitted Disclosures","textarea"],["governingJurisdiction","Governing Jurisdiction"],["additionalTerms","Additional Terms","textarea"]],
  affidavit:[["declarantName","Declarant Name"],["address","Address"],["dateOfBirth","Date of Birth","date"],["purpose","Purpose"],["statement","Statement / Declaration","textarea"],["location","Location"],["date","Date","date"]],
  authorization:[["authorizerName","Authorizing Person"],["authorizedName","Authorized Person"],["purpose","Purpose","textarea"],["scope","Scope of Authorization","textarea"],["validFrom","Valid From","date"],["validUntil","Valid Until","date"],["additionalInstructions","Additional Instructions","textarea"]],
  notice:[["senderName","Sender Name"],["recipientName","Recipient Name"],["subject","Subject"],["issueDescription","Description of Issue","textarea"],["requiredAction","Required Action","textarea"],["deadline","Deadline","date"],["contactInformation","Contact Information"],["additionalDetails","Additional Details","textarea"]]
};

const titleMap={rental:"Rental Agreement",employment:"Employment Agreement",nda:"Non-Disclosure Agreement",affidavit:"Affidavit",authorization:"Authorization Letter",notice:"General Legal Notice"};

function Layout({children}){
  return <div className="app">
    <header className="nav"><Link className="brand" to="/"><span className="brandMark">L</span>LegalEase</Link>
      <nav><Link to="/dashboard">Dashboard</Link><Link to="/create">Create</Link><Link to="/templates">Templates</Link><Link to="/history">History</Link><Link to="/about">About</Link></nav>
      <Link className="btn primary small" to="/create"><Plus size={16}/> Create</Link>
    </header>
    <main>{children}</main>
    <footer>LegalEase · AI-powered legal document drafting for educational and informational use.</footer>
  </div>
}

function Home(){
 return <Layout><section className="hero"><div className="heroCopy"><div className="eyebrow"><Sparkles size={16}/> AI-POWERED LEGAL DRAFTING</div><h1>Create Legal Documents.<br/><span>Simply.</span></h1><p>Generate structured legal-document drafts through guided forms and AI-assisted drafting.</p><div className="actions"><Link className="btn primary" to="/create">Create a Document <ArrowRight size={18}/></Link><Link className="btn secondary" to="/templates">Explore Templates</Link></div><div className="notice">⚖️ LegalEase provides document drafts for informational purposes and does not provide legal advice.</div></div><div className="heroCard"><div className="paper"><div className="paperTop"><span>LEGAL EASE</span><span>2026</span></div><h3>RENTAL AGREEMENT</h3><div className="lines"><i/><i/><i/><i/><i/><i/><i/></div><div className="sig"><span>Landlord Signature</span><span>Tenant Signature</span></div></div></div></section>
 <section className="section"><h2>How it works</h2><div className="steps">{["Choose a document","Enter your details","Generate your draft","Review & download"].map((x,i)=><div className="step" key={x}><b>0{i+1}</b><h3>{x}</h3><p>{["Select from six ready-to-use templates.","Fill out a simple guided form.","LegalEase creates a structured draft.","Edit, save, print or download PDF."][i]}</p></div>)}</div></section></Layout>
}

function Templates(){
 const [templates,setTemplates]=useState([]);
 useEffect(()=>{getTemplates().then(r=>setTemplates(r.data.data)).catch(()=>{})},[]);
 return <Layout><div className="pageHead"><div><div className="eyebrow">DOCUMENT LIBRARY</div><h1>Templates</h1><p>Start with a structured template and customize it to your needs.</p></div><Link className="btn primary" to="/create">Create Document <ArrowRight size={17}/></Link></div><div className="grid">{templates.map((t,i)=><TemplateCard key={t.type} t={t} i={i}/>)}</div></Layout>
}
function TemplateCard({t,i}){return <div className="card template"><div className="iconBox">{["⌂","◈","◌","✦","↗","§"][i]}</div><h3>{t.name}</h3><p>{t.description}</p><Link className="textBtn" to={`/create/${t.type}`}>Use Template <ArrowRight size={16}/></Link></div>}

function Create(){
 const [templates,setTemplates]=useState([]);
 useEffect(()=>{getTemplates().then(r=>setTemplates(r.data.data))},[]);
 return <Layout><div className="pageHead"><div><div className="eyebrow">STEP 1</div><h1>Choose a document</h1><p>Select the type of legal draft you want to create.</p></div></div><div className="grid">{templates.map((t,i)=><TemplateCard key={t.type} t={t} i={i}/>)}</div></Layout>
}

function FormPage(){
 const {type}=useParams(); const navigate=useNavigate(); const fields=fieldMap[type]||[]; const [data,setData]=useState({}); const [loading,setLoading]=useState(false);
 if(!fields.length) return <Layout><div className="empty"><h2>Template not found</h2><Link className="btn primary" to="/create">Back</Link></div></Layout>;
 const submit=async(e)=>{e.preventDefault(); const missing=fields.find(([k,label])=>!data[k]?.trim()); if(missing){alert(`Please enter ${missing[1]}.`);return;} setLoading(true); try{const r=await generateDocument({type,title:titleMap[type],data});navigate(`/document/${r.data.data.id}`)}catch(err){alert("Unable to generate document. Make sure the backend is running.")}finally{setLoading(false)}};
 return <Layout><div className="formWrap"><div className="formHead"><div><div className="eyebrow">STEP 2 · DOCUMENT DETAILS</div><h1>{titleMap[type]}</h1><p>Enter the information below to generate your draft.</p></div><span className="stepPill">2 / 3</span></div><form className="form card" onSubmit={submit}>{fields.map(([key,label,kind])=><label key={key}>{label}{kind==="textarea"?<textarea rows="4" value={data[key]||""} onChange={e=>setData({...data,[key]:e.target.value})} placeholder={`Enter ${label.toLowerCase()}`}/>:<input type={kind||"text"} value={data[key]||""} onChange={e=>setData({...data,[key]:e.target.value})} placeholder={`Enter ${label.toLowerCase()}`}/>}</label>)}<div className="formActions"><Link className="btn secondary" to="/create">Back</Link><button className="btn primary" disabled={loading}>{loading?"Generating…":"Generate Legal Draft"} <Sparkles size={17}/></button></div><div className="notice">⚖️ This creates an informational draft. Review it carefully and consult a qualified legal professional before use.</div></form></div></Layout>
}

function DocumentView(){
 const {id}=useParams(); const navigate=useNavigate(); const [doc,setDoc]=useState(null); const [saving,setSaving]=useState(false);
 useEffect(()=>{getDocument(id).then(r=>setDoc(r.data.data)).catch(()=>navigate("/history"))},[id]);
 if(!doc)return <Layout><div className="loading">Loading document…</div></Layout>;
 const save=async()=>{setSaving(true); const r=await updateDocument(id,{title:doc.title,content:doc.content}); setDoc(r.data.data);setSaving(false)};
 const copy=async()=>{await navigator.clipboard.writeText(doc.content);alert("Document copied.");};
 const download=()=>{const pdf=new jsPDF(); const lines=pdf.splitTextToSize(doc.content,170); let y=18; pdf.setFont("helvetica","normal"); pdf.setFontSize(10); lines.forEach(line=>{if(y>280){pdf.addPage();y=18}pdf.text(line,20,y);y+=6});pdf.save(`LegalEase_${doc.type}_${new Date().toISOString().slice(0,10)}.pdf`)};
 const remove=async()=>{if(confirm("Delete this document?")){await deleteDocument(id);navigate("/history")}};
 return <Layout><div className="editorPage"><div className="editorTop"><div><div className="eyebrow">DOCUMENT · {doc.type.toUpperCase()}</div><input className="titleInput" value={doc.title} onChange={e=>setDoc({...doc,title:e.target.value})}/><small>Created {new Date(doc.createdAt).toLocaleString()}</small></div><div className="toolBtns"><button className="btn secondary" onClick={save}><Save size={16}/>{saving?"Saving…":"Save"}</button><button className="btn secondary" onClick={copy}><Copy size={16}/>Copy</button><button className="btn secondary" onClick={download}><Download size={16}/>PDF</button><button className="btn secondary" onClick={()=>window.print()}><Printer size={16}/>Print</button><button className="iconBtn danger" onClick={remove}><Trash2 size={18}/></button></div></div><div className="editor card"><textarea value={doc.content} onChange={e=>setDoc({...doc,content:e.target.value})}/></div></div></Layout>
}

function History(){
 const [docs,setDocs]=useState([]); const load=()=>getDocuments().then(r=>setDocs(r.data.data)).catch(()=>setDocs([])); useEffect(load,[]);
 const remove=async(id)=>{if(confirm("Delete this document?")){await deleteDocument(id);load()}};
 return <Layout><div className="pageHead"><div><div className="eyebrow">YOUR WORKSPACE</div><h1>Document History</h1><p>View and manage generated documents.</p></div><Link className="btn primary" to="/create"><Plus size={17}/> New Document</Link></div>{docs.length?<div className="table card">{docs.map(d=><div className="row" key={d.id}><div className="rowIcon"><FileText size={18}/></div><div className="rowMain"><b>{d.title}</b><span>{d.type} · {new Date(d.updatedAt).toLocaleDateString()}</span></div><Link className="textBtn" to={`/document/${d.id}`}>Open <ArrowRight size={15}/></Link><button className="iconBtn danger" onClick={()=>remove(d.id)}><Trash2 size={17}/></button></div>)}</div>:<div className="empty card"><FileText size={36}/><h2>No documents yet</h2><p>Create your first legal-document draft.</p><Link className="btn primary" to="/create">Create Document</Link></div>}</Layout>
}

function Dashboard(){
 const [docs,setDocs]=useState([]); useEffect(()=>{getDocuments().then(r=>setDocs(r.data.data)).catch(()=>{})},[]);
 return <Layout><div className="pageHead"><div><div className="eyebrow">OVERVIEW</div><h1>Dashboard</h1><p>Manage your LegalEase document workspace.</p></div><Link className="btn primary" to="/create"><Plus size={17}/> Create Document</Link></div><div className="stats"><div className="stat"><FileText/><b>{docs.length}</b><span>Total Documents</span></div><div className="stat"><LayoutDashboard/><b>{docs.filter(d=>new Date(d.createdAt).getMonth()===new Date().getMonth()).length}</b><span>This Month</span></div><div className="stat"><History/><b>{docs[0]?docs[0].type:"—"}</b><span>Latest Type</span></div></div><div className="card recent"><div className="cardTitle"><h2>Recent Documents</h2><Link to="/history">View all</Link></div>{docs.slice(0,4).map(d=><Link className="recentRow" key={d.id} to={`/document/${d.id}`}><FileText size={18}/><span><b>{d.title}</b><small>{new Date(d.updatedAt).toLocaleString()}</small></span><ArrowRight size={16}/></Link>)}</div></Layout>
}

function About(){return <Layout><div className="narrow"><div className="eyebrow">ABOUT LEGALEASE</div><h1>Legal drafting, made simpler.</h1><p className="lead">LegalEase demonstrates how guided data collection and AI-assisted generation can turn user inputs into structured legal-document drafts.</p><div className="card prose"><h2>How it works</h2><p>Select a document, enter relevant information, and LegalEase generates a structured draft. You can then edit, save, print or export it as a PDF.</p><h2>Important disclaimer</h2><p>LegalEase is an educational and informational tool. It does not provide legal advice and does not guarantee that generated documents are legally valid, complete, or appropriate for a particular jurisdiction or situation.</p><h2>Project technology</h2><p>React, Vite, Express, Prisma, SQLite, JavaScript and jsPDF. The AI layer is designed so an external AI API can be connected without making it a requirement for local demonstrations.</p></div></div></Layout>}

export default function App(){return <Routes><Route path="/" element={<Home/>}/><Route path="/dashboard" element={<Dashboard/>}/><Route path="/create" element={<Create/>}/><Route path="/create/:type" element={<FormPage/>}/><Route path="/templates" element={<Templates/>}/><Route path="/history" element={<History/>}/><Route path="/document/:id" element={<DocumentView/>}/><Route path="/about" element={<About/>}/><Route path="*" element={<Home/>}/></Routes>}