import { useState } from "react";
import EventCard from "../components/EventCard";
import { Icons } from "../components/Icons";
import { daysUntil } from "../utils/helpers";

export default function HomeScreen({ events = [], user, onAddClick, onEditClick }) {
  const [filter, setFilter] = useState("all");
  const now = new Date();
  
  // Ensure events is an array
  const safeEvents = Array.isArray(events) ? events : [];

  const statMonth = safeEvents.filter(e => e && e.date && new Date(e.date).getMonth() === now.getMonth()).length;
  const statWeek  = safeEvents.filter(e => { if(!e || !e.date) return false; const n = daysUntil(e.date); return n >= 0 && n <= 7; }).length;

  const FILTERS = [
    { key:"all",         label:"All" },
    { key:"Birthday",    label:"Birthdays",     dot:"#EC4899" },
    { key:"Anniversary", label:"Anniversaries", dot:"#0EA5E9" },
    { key:"Other",       label:"Other",         dot:"#8B5CF6" },
    { key:"week",        label:"This Week" },
    { key:"today",       label:"Today" },
  ];
  const LABELS = { all:"Coming Up Soon", Birthday:"Birthdays", Anniversary:"Anniversaries", Other:"Other Events", week:"This Week", today:"Today" };

  function applyFilter(list) {
    if (["Birthday","Anniversary","Other"].includes(filter)) return list.filter(e => e && e.type === filter);
    if (filter === "week")  return list.filter(e => { if(!e || !e.date) return false; const n = daysUntil(e.date); return n >= 0 && n <= 7; });
    if (filter === "today") return list.filter(e => e && e.date && daysUntil(e.date) === 0);
    return list.filter(e => e && e.date && daysUntil(e.date) >= 0);
  }
  const sorted   = [...safeEvents].sort((a, b) => {
    const da = (a && a.date) ? daysUntil(a.date) : 999;
    const db = (b && b.date) ? daysUntil(b.date) : 999;
    return da - db;
  });
  const filtered = applyFilter(sorted).slice(0, 15);

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 88px" }}>
      {/* Hero */}
      <div style={{ background:"linear-gradient(135deg,#4F46E5 0%,#9333EA 100%)", borderRadius:20,
        padding:"22px 20px 20px", marginBottom:16, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-45, right:-30, width:130, height:130,
          background:"rgba(255,255,255,0.07)", borderRadius:"50%" }}/>
        <div style={{ position:"absolute", bottom:-30, left:5, width:90, height:90,
          background:"rgba(255,255,255,0.05)", borderRadius:"50%" }}/>
        <h2 style={{ color:"#fff", fontSize:18, fontWeight:800, lineHeight:1.35, position:"relative", zIndex:1 }}>
          {user ? <>Hey {user.name?.split(" ")[0] || "there"},<br/>Never Miss a Moment ✨</> : <>Never Miss a<br/>Special Moment ✨</>}
        </h2>
        <p style={{ color:"rgba(255,255,255,0.82)", fontSize:12, marginTop:6, position:"relative", zIndex:1 }}>
          All your birthdays &amp; anniversaries in one place
        </p>
        <button onClick={onAddClick} style={{
          marginTop:16, display:"inline-flex", alignItems:"center", gap:5,
          background:"rgba(255,255,255,0.18)", border:"1px solid rgba(255,255,255,0.35)",
          color:"#fff", fontSize:12, fontWeight:700, padding:"8px 15px", borderRadius:20,
          cursor:"pointer", position:"relative", zIndex:1, fontFamily:"inherit",
        }}>
          <Icons.Plus/> Add Event
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:9, marginBottom:16 }}>
        {[[events.length,"Total"],[statMonth,"This Month"],[statWeek,"This Week"]].map(([v,l]) => (
          <div key={l} style={{ background:"var(--surf)", border:"0.5px solid var(--bdr)",
            borderRadius:14, padding:"13px 8px", textAlign:"center", boxShadow:"var(--shadow)" }}>
            <div style={{ fontSize:24, fontWeight:800, background:"linear-gradient(135deg,#4F46E5,#9333EA)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{v}</div>
            <div style={{ fontSize:9, color:"var(--t3)", fontWeight:600, letterSpacing:0.4, marginTop:3 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div style={{ display:"flex", gap:7, marginBottom:16, overflowX:"auto", paddingBottom:2 }}>
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            display:"inline-flex", alignItems:"center", gap:5, padding:"7px 13px",
            borderRadius:20, fontSize:11, fontWeight:700, flexShrink:0, cursor:"pointer",
            border:`0.5px solid ${filter===f.key?"transparent":"var(--bdr)"}`,
            background:filter===f.key?"linear-gradient(135deg,#4F46E5,#9333EA)":"var(--surf)",
            color:filter===f.key?"#fff":"var(--t2)", fontFamily:"inherit", transition:"all 0.18s",
          }}>
            {f.dot && <span style={{ width:7, height:7, borderRadius:"50%", flexShrink:0, display:"inline-block",
              background:filter===f.key?"rgba(255,255,255,0.85)":f.dot }}/>}
            {f.label}
          </button>
        ))}
      </div>

      <div style={{ fontSize:10, fontWeight:700, color:"var(--t2)", textTransform:"uppercase",
        letterSpacing:0.8, marginBottom:10 }}>{LABELS[filter] || "Coming Up Soon"}</div>

      {filtered.length ? filtered.map(ev => (
        <EventCard key={ev._id || ev.id} ev={ev} showDelete={false} onClickCard={onEditClick}/>
      )) : (
        <div style={{ textAlign:"center", padding:"40px 20px", color:"var(--t3)" }}>
          <div style={{ fontSize:48, marginBottom:12, opacity:0.35 }}>📅</div>
          <div style={{ fontSize:14, fontWeight:700, color:"var(--t2)", marginBottom:4 }}>No Events Found</div>
          <div style={{ fontSize:12 }}>Try a different filter or add some events!</div>
        </div>
      )}
    </div>
  );
}
