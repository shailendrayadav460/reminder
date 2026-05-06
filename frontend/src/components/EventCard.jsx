import { BADGE, AV_PALETTE, STRIPE_COLOR, getInitials, fmtDate, daysUntil, pillInfo } from "../utils/helpers";

export default function EventCard({ ev, showDelete, onDelete, onClickCard }) {
  const n      = daysUntil(ev.date);
  const pill   = pillInfo(n);
  const badge  = BADGE[ev.type]  || BADGE.Other;
  // Use last char of mongo _id or numeric id for color stability
  const idx    = typeof ev._id === "string" ? parseInt(ev._id.slice(-1), 16) : (ev.id || 0);
  const av     = AV_PALETTE[idx % AV_PALETTE.length];
  const stripe = STRIPE_COLOR[ev.type] || STRIPE_COLOR.Other;

  return (
    <div className="ecard" onClick={() => onClickCard?.(ev._id || ev.id)}
      style={{
        background:"var(--surf)", border:"0.5px solid var(--bdr)", borderRadius:16,
        padding:"13px 14px 13px 11px", marginBottom:10,
        display:"flex", gap:11, alignItems:"flex-start",
        cursor:"pointer", boxShadow:"var(--shadow)", transition:"box-shadow 0.2s",
      }}>
      {/* stripe */}
      <div style={{width:4,borderRadius:4,flexShrink:0,alignSelf:"stretch",minHeight:44,background:stripe}}/>
      {/* avatar */}
      <div style={{width:38,height:38,borderRadius:"50%",display:"flex",alignItems:"center",
        justifyContent:"center",fontSize:12,fontWeight:700,flexShrink:0,
        background:av.bg, color:av.color}}>
        {getInitials(ev.name)}
      </div>
      {/* body */}
      <div style={{flex:1,minWidth:0}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div style={{fontSize:14,fontWeight:700,color:"var(--t1)"}}>{ev.name}</div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {showDelete && (
              <button onClick={e=>{e.stopPropagation(); onDelete(ev._id || ev.id);}}
                style={{background:"none",border:"none",color:"#EF4444",fontSize:20,
                  cursor:"pointer",lineHeight:1,paddingLeft:6,flexShrink:0}}>×</button>
            )}
            {!showDelete && (
              <button onClick={e=>{e.stopPropagation(); onClickCard?.(ev);}}
                style={{background:"none",border:"none",color:"var(--p1)",fontSize:10, fontWeight:700,
                  cursor:"pointer",flexShrink:0}}>EDIT</button>
            )}
          </div>
        </div>
        <div style={{fontSize:10,color:"var(--t3)",marginTop:2,
          overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
          {ev.rel}{ev.phone?" · "+ev.phone:""}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
          marginTop:8,flexWrap:"wrap",gap:5}}>
          <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
            <span style={{fontSize:9,fontWeight:700,padding:"3px 8px",borderRadius:10,
              background:badge.bg,color:badge.color}}>{ev.type}</span>
            <span style={{fontSize:10,color:"var(--t3)"}}>{fmtDate(ev.date)}</span>
          </div>
          <span style={{fontSize:9,fontWeight:700,padding:"3px 8px",borderRadius:8,
            background:pill.bg,color:pill.color}}>{pill.label}</span>
        </div>
      </div>
    </div>
  );
}
