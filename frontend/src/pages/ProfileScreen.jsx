import { useState, useRef } from "react";
import { Icons } from "../components/Icons";
import { Toggle, AuthField, GradBtn, Spinner } from "../components/UI";
import { getInitials } from "../utils/helpers";
import { profileApi } from "../api/client";

export default function ProfileScreen({ user, events, isDark, setIsDark, onLogout, toast, onClearData, onExport, onUpdateUser }) {
  const [modal, setModal] = useState(null); // 'edit' or 'password'
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  // Edit Profile State
  const [editForm, setEditForm] = useState({ name: user?.name || "", phone: user?.phone || "" });
  
  // Password Change State
  const [passForm, setPassForm] = useState({ current: "", newPass: "", confirm: "" });

  const now       = new Date();
  const totalSent = events.reduce((s, e) => s + (e.sent || 0), 0);
  const monthCount= events.filter(e => new Date(e.date).getMonth() === now.getMonth()).length;

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

  async function handleUpdateProfile() {
    if (!editForm.name.trim()) return toast("⚠️ Name is required");
    setLoading(true);
    try {
      const res = await profileApi.update({ name: editForm.name, phone: editForm.phone });
      onUpdateUser(res.user);
      toast("✅ Profile updated!");
      setModal(null);
    } catch (err) {
      toast("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePassword() {
    if (!passForm.current || !passForm.newPass) return toast("⚠️ Fill all fields");
    if (passForm.newPass !== passForm.confirm) return toast("⚠️ Passwords don't match");
    setLoading(true);
    try {
      await profileApi.changePassword({ currentPassword: passForm.current, newPassword: passForm.newPass });
      toast("✅ Password changed!");
      setModal(null);
      setPassForm({ current: "", newPass: "", confirm: "" });
    } catch (err) {
      toast("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAvatarChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append("avatar", file);

    setLoading(true);
    try {
      const res = await profileApi.uploadAvatar(formData);
      if (res.user) {
        onUpdateUser(res.user);
        toast("✅ Avatar updated!");
      } else {
        toast("❌ " + (res.msg || "Upload failed"));
      }
    } catch (err) {
      toast("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  }

  function PRow({ icon, iconBg, iconColor, label, labelColor, sub, rightEl, onClick }) {
    return (
      <div className="prow" onClick={onClick} style={{
        display:"flex", justifyContent:"space-between", alignItems:"center",
        padding:"12px 15px", borderTop:"0.5px solid var(--bdr)",
        cursor:onClick?"pointer":"default", transition:"background 0.15s",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:11 }}>
          <div style={{ width:34, height:34, borderRadius:10, background:iconBg,
            display:"flex", alignItems:"center", justifyContent:"center",
            flexShrink:0, color:iconColor }}>{icon}</div>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:labelColor||"var(--t1)" }}>{label}</div>
            {sub && <div style={{ fontSize:10, color:"var(--t3)", marginTop:1 }}>{sub}</div>}
          </div>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>{rightEl}</div>
      </div>
    );
  }

  return (
    <div style={{ overflowY:"auto", paddingBottom:88 }}>
      {/* Hero */}
      <div style={{ background:"linear-gradient(135deg,#4F46E5 0%,#9333EA 100%)",
        padding:"30px 20px 60px", position:"relative", overflow:"hidden", textAlign:"center" }}>
        
        {/* Avatar Section */}
        <div style={{ position: "relative", width: 90, height: 90, margin: "0 auto 12px", zIndex: 10 }}>
          <div onClick={() => fileInputRef.current.click()} style={{ 
            width:90, height:90, borderRadius:"50%", cursor: "pointer",
            background:"rgba(255,255,255,0.25)", border:"3px solid rgba(255,255,255,0.5)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:32, fontWeight:800, color:"#fff", overflow: "hidden"
          }}>
            {user?.avatar ? (
              <img src={`${API_URL}/uploads/${user.avatar}`} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : getInitials(user?.name || "?")}
          </div>
          <button onClick={() => fileInputRef.current.click()} style={{
            position: "absolute", bottom: 0, right: 0, width: 28, height: 28,
            borderRadius: "50%", background: "#fff", border: "none",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)", cursor: "pointer", color: "#4F46E5"
          }}>
            <Icons.Plus size={14} />
          </button>
          <input type="file" ref={fileInputRef} onChange={handleAvatarChange} style={{ display: "none" }} accept="image/*" />
        </div>

        <div style={{ fontSize:20, fontWeight:800, color:"#fff", position:"relative", zIndex:1 }}>{user?.name || "–"}</div>
        <div style={{ fontSize:12, color:"rgba(255,255,255,0.75)", marginTop:4, position:"relative", zIndex:1 }}>{user?.email || "–"}</div>
        <div style={{ fontSize:10, color:"rgba(255,255,255,0.6)", marginTop:4, position:"relative", zIndex:1 }}>
          Member since {user?.joinDate ? new Date(user.joinDate).toLocaleDateString() : "today"}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)",
        background:"var(--surf)", border:"0.5px solid var(--bdr)", borderRadius:16,
        margin:"-28px 16px 16px", boxShadow:"0 4px 20px rgba(79,70,229,0.12)",
        position:"relative", zIndex:2, overflow:"hidden" }}>
        {[[events.length,"Total"],[monthCount,"This Month"],[totalSent,"Sent"]].map(([v,l],i) => (
          <div key={l} style={{ padding:"14px 8px", textAlign:"center",
            borderRight:i<2?"0.5px solid var(--bdr)":"none" }}>
            <div style={{ fontSize:20, fontWeight:800,
              background:"linear-gradient(135deg,#4F46E5,#9333EA)",
              WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{v}</div>
            <div style={{ fontSize:9, color:"var(--t3)", fontWeight:600, marginTop:3, letterSpacing:0.4 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Setting sections */}
      {[
        {
          lbl:"Account",
          rows:[
            { icon:<Icons.Edit/>, iconBg:"#EFF6FF", iconColor:"#1D4ED8", label:"Edit Profile", sub:"Name, phone", onClick:() => setModal('edit'), rightEl:<span style={{color:"var(--t3)",fontSize:16}}>›</span> },
            { icon:<Icons.Lock/>, iconBg:"#FFFBEB", iconColor:"#B45309", label:"Change Password", sub:"Update your security", onClick:() => setModal('password'), rightEl:<span style={{color:"var(--t3)",fontSize:16}}>›</span> },
          ]
        },
        {
          lbl:"Preferences",
          rows:[
            { icon:<Icons.Sun/>, iconBg:"#F5F3FF", iconColor:"#6D28D9", label:"Dark Mode", sub:"Switch theme",
              rightEl:<Toggle checked={isDark} onChange={e=>{setIsDark(e.target.checked);toast(e.target.checked?"🌙 Dark mode on":"☀️ Light mode on");}}/> },
            { icon:<Icons.Bell/>, iconBg:"#FDF2F8", iconColor:"#BE185D", label:"Notifications", sub:"Push alerts",
              rightEl:<Toggle checked={true} onChange={()=>{}}/> },
          ]
        },
        {
          lbl:"Data",
          rows:[
            { icon:<Icons.Download/>, iconBg:"#EFF6FF", iconColor:"#1D4ED8", label:"Export All Data", sub:"Download as JSON", onClick:onExport, rightEl:<span style={{color:"var(--t3)",fontSize:16}}>›</span> },
            { icon:<Icons.Trash/>,    iconBg:"#FEF2F2", iconColor:"#DC2626", label:"Clear All Data",  sub:"Cannot be undone",  labelColor:"#EF4444", onClick:onClearData, rightEl:<span style={{color:"#EF4444",fontSize:16}}>›</span> },
          ]
        },
      ].map(section => (
        <div key={section.lbl} style={{ margin:"0 16px 16px" }}>
          <div style={{ background:"var(--surf)", border:"0.5px solid var(--bdr)",
            borderRadius:16, overflow:"hidden", boxShadow:"var(--shadow)" }}>
            <div style={{ fontSize:10, fontWeight:700, color:"var(--t3)", letterSpacing:0.8,
              textTransform:"uppercase", padding:"12px 15px 7px" }}>{section.lbl}</div>
            {section.rows.map((row, i) => <PRow key={i} {...row}/>)}
          </div>
        </div>
      ))}

      {/* Logout */}
      <button onClick={onLogout} style={{
        width:"calc(100% - 32px)", margin:"0 16px 24px", padding:14,
        background:"var(--surf)", border:"0.5px solid rgba(239,68,68,0.3)",
        color:"#EF4444", borderRadius:14, fontSize:14, fontWeight:700,
        cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
        gap:8, fontFamily:"inherit", transition:"background 0.2s",
      }}>
        <Icons.Logout/> Sign Out
      </button>

      {/* Edit Modal */}
      {modal === 'edit' && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:"var(--surf)", width:"100%", maxWidth:400, borderRadius:24, padding:24, position:"relative" }}>
            <button onClick={() => setModal(null)} style={{ position:"absolute", top:16, right:16, background:"none", border:"none", cursor:"pointer", color:"var(--t3)" }}><Icons.Plus style={{ transform: "rotate(45deg)" }} /></button>
            <h3 style={{ fontSize:18, fontWeight:800, marginBottom:20 }}>Edit Profile</h3>
            <AuthField label="Display Name" value={editForm.name} onChange={v => setEditForm({...editForm, name:v})} />
            <AuthField label="Phone Number" value={editForm.phone} onChange={v => setEditForm({...editForm, phone:v})} />
            <GradBtn onClick={handleUpdateProfile} disabled={loading} style={{ marginTop:10 }}>
              {loading ? <Spinner /> : "Save Changes"}
            </GradBtn>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {modal === 'password' && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", zIndex:1000, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
          <div style={{ background:"var(--surf)", width:"100%", maxWidth:400, borderRadius:24, padding:24, position:"relative" }}>
            <button onClick={() => setModal(null)} style={{ position:"absolute", top:16, right:16, background:"none", border:"none", cursor:"pointer", color:"var(--t3)" }}><Icons.Plus style={{ transform: "rotate(45deg)" }} /></button>
            <h3 style={{ fontSize:18, fontWeight:800, marginBottom:20 }}>Change Password</h3>
            <AuthField type="password" label="Current Password" value={passForm.current} onChange={v => setPassForm({...passForm, current:v})} />
            <AuthField type="password" label="New Password" value={passForm.newPass} onChange={v => setPassForm({...passForm, newPass:v})} />
            <AuthField type="password" label="Confirm New Password" value={passForm.confirm} onChange={v => setPassForm({...passForm, confirm:v})} />
            <GradBtn onClick={handleChangePassword} disabled={loading} style={{ marginTop:10 }}>
              {loading ? <Spinner /> : "Update Password"}
            </GradBtn>
          </div>
        </div>
      )}

      <div style={{ textAlign:"center", padding:"6px 0 16px", fontSize:10, color:"var(--t3)" }}>
        RemindMe v4.0 · Modern Reminder App
      </div>
    </div>
  );
}
