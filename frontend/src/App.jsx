import { useState, useEffect, useRef } from "react";
import { eventsApi, profileApi } from "./api/client";

// Pages
import AuthScreen     from "./pages/AuthScreen";
import HomeScreen     from "./pages/HomeScreen";
import CalendarScreen from "./pages/CalendarScreen";
import AddScreen      from "./pages/AddScreen";
import RemindersScreen from "./pages/RemindersScreen";
import ProfileScreen  from "./pages/ProfileScreen";

// Components
import { Toast, IconBtn } from "./components/UI";
import { Icons }          from "./components/Icons";
import { getInitials }    from "./utils/helpers";

/* ════════════════════════════════════════════
   GLOBAL CSS — injected once into <head>
════════════════════════════════════════════ */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }

:root {
  --p1: #4F46E5; --p2: #9333EA;
  --bg: #F8F7FF; --surf: #FFFFFF; --bdr: rgba(79,70,229,0.12);
  --t1: #111827;  --t2: #6B7280;  --t3: #9CA3AF;
  --icon-bg: #EEF2FF; --icon-hover: #DDD6FE; --icon-stroke: #4F46E5;
  --shadow: 0 2px 12px rgba(79,70,229,0.08);
  --input-bg: #FAFAFE;
}

html[data-theme="dark"] {
  --bg: #0F0E1A; --surf: #1C1A2E; --bdr: rgba(139,92,246,0.18);
  --t1: #F3F4F6; --t2: #A0A0B0; --t3: #6B7280;
  --icon-bg: #2D2A4A; --icon-hover: #3D3A5A; --icon-stroke: #A78BFA;
  --shadow: 0 2px 12px rgba(0,0,0,0.35);
  --input-bg: #151325;
}

html, body, #root {
  height: 100%;
  font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
  background: var(--bg);
  color: var(--t1);
  font-size: 13px;
  -webkit-font-smoothing: antialiased;
}

input, select, textarea, button { font-family: inherit; }

input:focus, select:focus, textarea:focus {
  outline: none;
  border-color: var(--p1) !important;
  box-shadow: 0 0 0 3px rgba(79,70,229,0.1);
}

::-webkit-scrollbar { display: none; }
scrollbar-width: none;

/* Auth layout */
.auth-layout { display:flex; min-height:100vh; width:100%; }
.auth-left {
  flex: 0 0 46%;
  background: linear-gradient(145deg,#3730A3 0%,#6D28D9 50%,#9333EA 100%);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  padding: 48px 40px; position: relative; overflow: hidden;
}
.auth-left::before { content:''; position:absolute; top:-80px; right:-80px; width:300px; height:300px; background:rgba(255,255,255,0.06); border-radius:50%; }
.auth-left::after  { content:''; position:absolute; bottom:-60px; left:-40px; width:200px; height:200px; background:rgba(255,255,255,0.04); border-radius:50%; }
.auth-right {
  flex: 1; display:flex; flex-direction:column; align-items:center; justify-content:center;
  padding: 48px 40px; background: var(--surf); overflow-y:auto; transition:background 0.3s;
}
.auth-feature {
  display:flex; align-items:center; gap:14px;
  background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.15);
  border-radius:14px; padding:13px 16px; margin-bottom:12px;
}

/* Bottom nav */
.bnav-btn { flex:1; display:flex; flex-direction:column; align-items:center; gap:3px; cursor:pointer; padding:4px 0; border:none; background:none; -webkit-tap-highlight-color:transparent; transition:transform 0.15s; }
.bnav-btn:active { transform:scale(0.88); }

/* Event card hover */
.ecard:hover { box-shadow: 0 6px 24px rgba(79,70,229,0.16) !important; }

/* Profile row hover */
.prow:hover { background: var(--icon-bg) !important; }

/* Button base */
.btn-grad { background:linear-gradient(135deg,var(--p1),var(--p2)); color:#fff; border:none; border-radius:13px; font-size:14px; font-weight:700; cursor:pointer; transition:opacity 0.2s,transform 0.15s; font-family:inherit; display:flex; align-items:center; justify-content:center; gap:8px; }
.btn-grad:hover { opacity:0.9; transform:translateY(-1px); }
.btn-grad:active { transform:scale(0.98); }
.btn-grad:disabled { cursor:not-allowed; }

/* Spinner keyframes */
@keyframes rm-spin { to { transform: rotate(360deg); } }

/* Social btn */
.social-btn:hover { background:var(--icon-bg) !important; border-color:rgba(79,70,229,0.3) !important; }

@media (max-width: 768px) {
  .auth-layout { flex-direction: column; }
  .auth-left { flex:none; padding:36px 24px 30px; }
  .auth-left-features { display:none !important; }
  .auth-right { padding:32px 24px 48px; justify-content:flex-start; }
}
`;

/* ════════════════════════════════════════════
   ROOT APP
════════════════════════════════════════════ */
export default function App() {
  // Inject global CSS once
  useEffect(() => {
    if (!document.getElementById("rm-global-css")) {
      const style = document.createElement("style");
      style.id = "rm-global-css";
      style.textContent = GLOBAL_CSS;
      document.head.appendChild(style);
    }
  }, []);

  // ── State ──────────────────────────────────────────────────────────
  const [isDark,  setIsDarkState] = useState(() => localStorage.getItem("rm_theme") === "dark");
  const [user,    setUser]        = useState(() => {
    try { return JSON.parse(localStorage.getItem("rm_session")); } catch { return null; }
  });
  const [events,  setEvents]      = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [loading, setLoading]     = useState(false);
  const [tab,     setTab]         = useState("home");
  const [toast,   setToastMsg]    = useState("");
  const toastTimer = useRef(null);

  // Apply theme on mount & change
  function setIsDark(val) {
    setIsDarkState(val);
    localStorage.setItem("rm_theme", val ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", val ? "dark" : "");
  }
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "");
  }, [isDark]);

  // ── Sync session & Load events ──────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("rm_token");
    if (!token) {
      setUser(null);
      setEvents([]);
      return;
    }

    setLoading(true);
    
    // 1. Verify/Refresh User Profile
    profileApi.get()
      .then(u => {
        setUser(u);
        localStorage.setItem("rm_session", JSON.stringify(u));
        
        // 2. Load Events
        return eventsApi.getAll();
      })
      .then(data => {
        setEvents(data);
      })
      .catch((err) => {
        console.error("Auth sync error:", err);
        // If 401, clear session
        if (err.message.toLowerCase().includes("denied") || err.message.toLowerCase().includes("valid")) {
          handleLogout();
        } else {
          showToast("⚠️ Connection error");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // ── Toast helper ────────────────────────────────────────────────────
  function showToast(msg) {
    setToastMsg(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(""), 2800);
  }

  // ── Auth handlers ───────────────────────────────────────────────────
  function handleLogin(u, token) {
    localStorage.setItem("rm_token", token);
    localStorage.setItem("rm_session", JSON.stringify(u));
    setUser(u);
    
    // Load events after login
    setLoading(true);
    eventsApi.getAll()
      .then(data => setEvents(data))
      .catch(() => showToast("⚠️ Error loading events"))
      .finally(() => setLoading(false));

    showToast("👋 Welcome, " + u.name.split(" ")[0] + "!");
  }
  function handleLogout() {
    localStorage.removeItem("rm_token");
    localStorage.removeItem("rm_session");
    setUser(null);
    setEvents([]);
    setTab("home");
    showToast("Signed out successfully");
  }

  // ── Event handlers ──────────────────────────────────────────────────
  function handleSaveEvent(ev, isUpdate) {
    if (isUpdate) {
      setEvents(prev => prev.map(e => (e._id || e.id) === (ev._id || ev.id) ? ev : e));
      showToast("✅ Event updated!");
    } else {
      setEvents(prev => [...prev, ev]);
      showToast("🎉 Event saved!");
    }
    setEditingEvent(null);
    setTimeout(() => setTab("home"), 500);
  }
  function handleEditClick(ev) {
    setEditingEvent(ev);
    setTab("add");
  }
  async function handleDeleteEvent(id) {
    try {
      await eventsApi.remove(id);
      setEvents(prev => prev.filter(e => (e._id || e.id) !== id));
      showToast("Event deleted");
    } catch {
      showToast("❌ Failed to delete event");
    }
  }
  function handleClearData() {
    if (!window.confirm("Delete ALL events? This cannot be undone.")) return;
    // Delete all events one by one
    Promise.all(events.map(e => eventsApi.remove(e._id || e.id)))
      .then(() => { setEvents([]); showToast("All data cleared"); })
      .catch(() => showToast("❌ Could not clear all data"));
  }
  function handleExport() {
    const json = JSON.stringify({ events }, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `remindme-${new Date().toISOString().split("T")[0]}.json`;
    a.click(); URL.revokeObjectURL(url);
    showToast("📤 Data exported!");
  }
  function handleUpdateUser(updatedUser) {
    setUser(updatedUser);
    localStorage.setItem("rm_session", JSON.stringify(updatedUser));
  }

  // ── Nav items ───────────────────────────────────────────────────────
  const NAV = [
    { key:"home",      label:"Home",     Icon:Icons.Home },
    { key:"calendar",  label:"Calendar", Icon:Icons.Cal  },
    { key:"add",       label:"Add",      Icon:Icons.Add  },
    { key:"reminders", label:"Alerts",   Icon:Icons.Bell },
    { key:"profile",   label:"Profile",  Icon:Icons.User },
  ];

  // ── Not logged in → Auth ────────────────────────────────────────────
  if (!user) {
    return (
      <>
        <AuthScreen onLogin={handleLogin}/>
        <Toast msg={toast}/>
      </>
    );
  }

  const initials = getInitials(user.name);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

  // ── App shell ───────────────────────────────────────────────────────
  return (
    <>
      <div style={{ width:"100%", display:"flex", justifyContent:"center",
        alignItems:"flex-start", minHeight:"100vh", background:"var(--bg)" }}>
        <div style={{ width:"100%", maxWidth:430, minHeight:"100vh",
          background:"var(--bg)", display:"flex", flexDirection:"column",
          position:"relative", margin:"0 auto" }}>

          {/* ── Top Nav ── */}
          <nav style={{
            background: isDark ? "rgba(28,26,46,0.97)" : "rgba(255,255,255,0.97)",
            padding:"14px 18px 12px",
            borderBottom:"0.5px solid var(--bdr)",
            display:"flex", justifyContent:"space-between", alignItems:"center",
            position:"sticky", top:0, zIndex:50,
            backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)",
            transition:"background 0.3s",
          }}>
            <div style={{ fontSize:17, fontWeight:800, letterSpacing:-0.5,
              background:"linear-gradient(135deg,#4F46E5,#9333EA)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              🎉 RemindMe
            </div>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <IconBtn onClick={() => setIsDark(!isDark)} title="Toggle theme">
                {isDark ? <Icons.Sun/> : <Icons.Moon/>}
              </IconBtn>
              <IconBtn onClick={() => setTab("add")} title="Add event">
                <Icons.Plus/>
              </IconBtn>
              <button onClick={() => setTab("profile")} title="Profile" style={{
                width:34, height:34, borderRadius:"50%",
                background:"linear-gradient(135deg,#4F46E5,#9333EA)",
                border:"none", display:"flex", alignItems:"center", justifyContent:"center",
                cursor:"pointer", fontSize:12, fontWeight:700, color:"#fff",
                overflow:"hidden"
              }}>
                {user.avatar ? (
                  <img src={`${API_URL}/uploads/${user.avatar}`} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : initials}
              </button>
            </div>
          </nav>

          {/* ── Loading overlay ── */}
          {loading && (
            <div style={{ textAlign:"center", padding:"32px 0", color:"var(--t3)" }}>
              <div style={{ fontSize:13 }}>Loading your events…</div>
            </div>
          )}

          {/* ── Screens ── */}
          {!loading && (
            <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
              {tab==="home"      && <HomeScreen      events={events} user={user} onAddClick={() => setTab("add")} onEditClick={handleEditClick}/>}
              {tab==="calendar"  && <CalendarScreen  events={events} onDelete={handleDeleteEvent}/>}
              {tab==="add"       && <AddScreen       onSave={handleSaveEvent} toast={showToast} editEvent={editingEvent} onCancel={() => {setEditingEvent(null); setTab("home");}}/>}
              {tab==="reminders" && <RemindersScreen events={events}/>}
              {tab==="profile"   && (
                <ProfileScreen
                  user={user} events={events}
                  isDark={isDark} setIsDark={setIsDark}
                  onLogout={handleLogout}
                  toast={showToast}
                  onClearData={handleClearData}
                  onExport={handleExport}
                  onUpdateUser={handleUpdateUser}
                />
              )}
            </div>
          )}

          {/* ── Bottom Nav ── */}
          <nav style={{
            position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
            width:"100%", maxWidth:430,
            background:isDark ? "rgba(28,26,46,0.97)" : "rgba(255,255,255,0.97)",
            borderTop:"0.5px solid var(--bdr)",
            display:"flex", zIndex:100,
            padding:"6px 0 max(8px,env(safe-area-inset-bottom))",
            boxShadow:"0 -4px 20px rgba(79,70,229,0.06)",
            transition:"background 0.3s",
          }}>
            {NAV.map(item => (
              <button key={item.key} onClick={() => setTab(item.key)} className="bnav-btn"
                style={{ color: tab===item.key ? "#4F46E5" : "var(--t3)" }}>
                <item.Icon/>
                <div style={{ width:4, height:4, borderRadius:"50%", background:"#4F46E5",
                  opacity:tab===item.key?1:0, margin:"0 auto" }}/>
                <span style={{ fontSize:9, fontWeight:600, letterSpacing:0.3 }}>{item.label}</span>
              </button>
            ))}
          </nav>

        </div>
      </div>
      <Toast msg={toast}/>
    </>
  );
}