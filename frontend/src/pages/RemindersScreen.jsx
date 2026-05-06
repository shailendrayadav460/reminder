import { DOT_COLOR, daysUntil, pillInfo, fmtDate } from "../utils/helpers";

export default function RemindersScreen({ events }) {
  const upcoming = [...events]
    .filter(e => { const n = daysUntil(e.date); return n >= 0 && n <= 30; })
    .sort((a, b) => daysUntil(a.date) - daysUntil(b.date));
  const totalSent = events.reduce((s, e) => s + (e.sent || 0), 0);

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 88px" }}>
      <div style={{ fontSize:10, fontWeight:700, color:"var(--t2)", textTransform:"uppercase",
        letterSpacing:0.8, marginBottom:10 }}>Active Alerts — Next 30 Days</div>

      {upcoming.length ? upcoming.map(ev => {
        const n    = daysUntil(ev.date);
        const pill = pillInfo(n);
        return (
          <div key={ev._id || ev.id} style={{ background:"var(--surf)", border:"0.5px solid var(--bdr)",
            borderRadius:16, padding:14, marginBottom:10, display:"flex",
            alignItems:"center", gap:12, boxShadow:"var(--shadow)" }}>
            <div style={{ width:10, height:10, borderRadius:"50%", flexShrink:0,
              background:DOT_COLOR[ev.type] || "#8B5CF6" }}/>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"var(--t1)" }}>{ev.name} · {ev.type}</div>
              <div style={{ fontSize:10, color:"var(--t2)", marginTop:2 }}>
                Reminder: {ev.days} day{ev.days !== 1 ? "s" : ""} before · {fmtDate(ev.date)}
              </div>
            </div>
            <div style={{ textAlign:"right", flexShrink:0 }}>
              <div style={{ fontSize:12, color:"var(--t2)", fontWeight:700 }}>{pill.label}</div>
              <div style={{ fontSize:9, fontWeight:700, marginTop:2, color:n<=3?"#D97706":"#10B981" }}>
                {n <= 3 ? "⚡ Soon" : "✓ Active"}
              </div>
            </div>
          </div>
        );
      }) : (
        <div style={{ textAlign:"center", padding:"40px 20px", color:"var(--t3)" }}>
          <div style={{ fontSize:48, marginBottom:12, opacity:0.35 }}>🔔</div>
          <div style={{ fontSize:14, fontWeight:700, color:"var(--t2)", marginBottom:4 }}>All Clear!</div>
          <div style={{ fontSize:12 }}>No events in the next 30 days</div>
        </div>
      )}

      {/* Webhook card */}
      <div style={{ marginTop:8 }}>
        <div style={{ fontSize:10, fontWeight:700, color:"var(--t2)", textTransform:"uppercase",
          letterSpacing:0.8, marginBottom:10 }}>Webhook Status</div>
        <div style={{ background:"var(--surf)", border:"0.5px solid var(--bdr)",
          borderRadius:16, padding:15, boxShadow:"var(--shadow)" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:"var(--t1)" }}>n8n Webhook</div>
              <div style={{ fontSize:10, color:"var(--t3)", marginTop:3 }}>Auto-greetings pipeline</div>
            </div>
            <span style={{ fontSize:9, fontWeight:700, padding:"4px 11px", borderRadius:10,
              background:"#F0FDF4", color:"#166534" }}>Connected</span>
          </div>
          <div style={{ marginTop:10, fontSize:11, color:"var(--t2)" }}>
            {totalSent} message{totalSent !== 1 ? "s" : ""} sent · 0 failed
          </div>
        </div>
      </div>
    </div>
  );
}
