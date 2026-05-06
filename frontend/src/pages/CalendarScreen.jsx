import { useState } from "react";
import EventCard from "../components/EventCard";
import { MONTHS, DOT_COLOR, daysUntil } from "../utils/helpers";

export default function CalendarScreen({ events, onDelete }) {
  const NOW = new Date();
  const [calYear,  setCalYear]  = useState(NOW.getFullYear());
  const [calMonth, setCalMonth] = useState(NOW.getMonth());
  const [selDay,   setSelDay]   = useState(null);

  function changeMonth(dir) {
    setCalMonth(m => {
      let nm = m + dir, ny = calYear;
      if (nm > 11) { nm = 0; ny++; }
      if (nm < 0)  { nm = 11; ny--; }
      setCalYear(ny); setSelDay(null);
      return nm;
    });
  }

  const firstDay    = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth+1, 0).getDate();
  const daysInPrev  = new Date(calYear, calMonth, 0).getDate();
  const today       = new Date(); today.setHours(0,0,0,0);

  const evMap = {};
  events.forEach(ev => {
    const d = new Date(ev.date);
    if (d.getFullYear() === calYear && d.getMonth() === calMonth) {
      const k = d.getDate();
      if (!evMap[k]) evMap[k] = [];
      evMap[k].push(ev);
    }
  });

  const selEvs   = selDay ? (evMap[selDay] || []) : [];
  const monthEvs = events.filter(ev => {
    const d = new Date(ev.date);
    return d.getFullYear() === calYear && d.getMonth() === calMonth;
  }).sort((a,b) => new Date(a.date).getDate() - new Date(b.date).getDate());

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 88px" }}>
      {/* Calendar box */}
      <div style={{ background:"var(--surf)", border:"0.5px solid var(--bdr)", borderRadius:20,
        padding:18, marginBottom:14, boxShadow:"var(--shadow)" }}>
        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ fontSize:16, fontWeight:800, color:"var(--t1)" }}>{MONTHS[calMonth]} {calYear}</div>
          <div style={{ display:"flex", gap:8 }}>
            {["‹","›"].map((ch,i) => (
              <button key={i} onClick={() => changeMonth(i===0?-1:1)} style={{
                width:30, height:30, borderRadius:"50%", background:"var(--icon-bg)",
                border:"none", cursor:"pointer", color:"var(--p1)", fontSize:18, fontWeight:700,
                display:"flex", alignItems:"center", justifyContent:"center",
              }}>{ch}</button>
            ))}
          </div>
        </div>
        {/* Day headers */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", marginBottom:6 }}>
          {["S","M","T","W","T","F","S"].map((d,i) => (
            <div key={i} style={{ textAlign:"center", fontSize:9, fontWeight:700, color:"var(--t3)", padding:"4px 0", letterSpacing:0.5 }}>{d}</div>
          ))}
        </div>
        {/* Grid */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:3 }}>
          {Array.from({length:firstDay},(_,i) => (
            <div key={"p"+i} style={{ aspectRatio:"1", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:10 }}>
              <span style={{ fontSize:12, color:"var(--t3)" }}>{daysInPrev-firstDay+i+1}</span>
            </div>
          ))}
          {Array.from({length:daysInMonth},(_,i) => {
            const d = i+1;
            const cellDate = new Date(calYear,calMonth,d); cellDate.setHours(0,0,0,0);
            const isToday  = cellDate.getTime() === today.getTime();
            const isSel    = selDay === d;
            const evs      = evMap[d] || [];
            return (
              <div key={d} onClick={() => setSelDay(selDay===d?null:d)} style={{
                aspectRatio:"1", display:"flex", flexDirection:"column",
                alignItems:"center", justifyContent:"center", borderRadius:10,
                cursor:"pointer", position:"relative", transition:"background 0.15s",
                background: isToday ? "linear-gradient(135deg,#4F46E5,#9333EA)"
                          : isSel   ? "var(--icon-bg)" : "transparent",
                border: isSel&&!isToday ? "1.5px solid #4F46E5" : "none",
              }}>
                <span style={{ fontSize:12, lineHeight:1,
                  fontWeight: isToday||isSel ? 800 : 600,
                  color: isToday?"#fff" : isSel?"#4F46E5" : "var(--t1)",
                }}>{d}</span>
                {evs.length > 0 && (
                  <div style={{ display:"flex", gap:2, justifyContent:"center", position:"absolute", bottom:3 }}>
                    {evs.slice(0,3).map((e,i) => (
                      <div key={i} style={{ width:4, height:4, borderRadius:"50%",
                        background:isToday?"rgba(255,255,255,0.85)":(DOT_COLOR[e.type]||"#8B5CF6") }}/>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {Array.from({length:(7-(firstDay+daysInMonth)%7)%7},(_,i) => (
            <div key={"n"+i} style={{ aspectRatio:"1", display:"flex", alignItems:"center", justifyContent:"center", borderRadius:10 }}>
              <span style={{ fontSize:12, color:"var(--t3)" }}>{i+1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display:"flex", gap:14, marginBottom:14, flexWrap:"wrap" }}>
        {[["#EC4899","Birthday"],["#0EA5E9","Anniversary"],["#8B5CF6","Other"]].map(([c,l]) => (
          <div key={l} style={{ display:"flex", alignItems:"center", gap:5, fontSize:10, color:"var(--t2)", fontWeight:600 }}>
            <div style={{ width:8, height:8, borderRadius:"50%", background:c }}/>{l}
          </div>
        ))}
      </div>

      {/* Selected day panel */}
      {selDay && (
        <div style={{ background:"var(--surf)", border:"0.5px solid var(--bdr)", borderRadius:16,
          padding:15, marginBottom:13, boxShadow:"var(--shadow)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <span style={{ fontSize:13, fontWeight:800, color:"var(--t1)" }}>
              {MONTHS[calMonth]} {selDay}, {calYear}
            </span>
            {selEvs.length > 0 && (
              <span style={{ fontSize:9, background:"var(--icon-bg)", color:"var(--p1)",
                padding:"3px 9px", borderRadius:8, fontWeight:700 }}>
                {selEvs.length} event{selEvs.length>1?"s":""}
              </span>
            )}
          </div>
          {selEvs.length === 0 ? (
            <div style={{ textAlign:"center", padding:16, color:"var(--t3)", fontSize:12 }}>No events on this day</div>
          ) : selEvs.map((ev,i) => (
            <div key={ev._id||ev.id} style={{ display:"flex", gap:11, alignItems:"center", padding:"10px 0",
              borderTop:i===0?"none":"0.5px solid rgba(79,70,229,0.07)" }}>
              <div style={{ width:9, height:9, borderRadius:"50%", flexShrink:0,
                background:DOT_COLOR[ev.type]||"#8B5CF6" }}/>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:13, fontWeight:700, color:"var(--t1)" }}>{ev.name}</div>
                <div style={{ fontSize:10, color:"var(--t3)", marginTop:1 }}>
                  {ev.type} · {ev.rel}{ev.notes?" · "+ev.notes:""}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Month list */}
      <div style={{ fontSize:10, fontWeight:700, color:"var(--t2)", textTransform:"uppercase",
        letterSpacing:0.8, marginBottom:10 }}>Events in {MONTHS[calMonth]}</div>
      {monthEvs.length ? monthEvs.map(ev => (
        <EventCard key={ev._id||ev.id} ev={ev} showDelete={true}
          onDelete={id => { if(window.confirm("Delete this event?")) onDelete(id); }}/>
      )) : (
        <div style={{ textAlign:"center", padding:20, color:"var(--t3)", fontSize:12 }}>
          No events in {MONTHS[calMonth]}
        </div>
      )}
    </div>
  );
}
