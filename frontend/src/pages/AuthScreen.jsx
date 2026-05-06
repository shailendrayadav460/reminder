import { useState } from "react";
import { authApi } from "../api/client";
import { AuthField, GradBtn, Spinner } from "../components/UI";
import { Icons } from "../components/Icons";

export default function AuthScreen({ onLogin }) {
  const [page, setPage] = useState("login"); // "login" | "signup"
  const [err, setErr]   = useState("");
  const [loading, setLoading] = useState(false);

  // Login state
  const [lEmail, setLEmail] = useState("");
  const [lPass,  setLPass]  = useState("");

  // Signup state
  const [sName,  setSName]  = useState("");
  const [sEmail, setSEmail] = useState("");
  const [sPass,  setSPass]  = useState("");
  const [sPass2, setSPass2] = useState("");

  const switchPage = (p) => { setPage(p); setErr(""); };

  async function doLogin() {
    setErr("");
    if (!lEmail.trim() || !lPass) { setErr("Please fill in all fields."); return; }
    setLoading(true);
    try {
      const data = await authApi.login({ email: lEmail.trim().toLowerCase(), password: lPass });
      onLogin(data.user, data.token);
    } catch (e) {
      setErr(e.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function doSignup() {
    setErr("");
    if (!sName.trim() || !sEmail.trim() || !sPass || !sPass2) { setErr("Please fill in all fields."); return; }
    if (!sEmail.includes("@")) { setErr("Enter a valid email address."); return; }
    if (sPass.length < 6) { setErr("Password must be at least 6 characters."); return; }
    if (sPass !== sPass2) { setErr("Passwords do not match."); return; }
    setLoading(true);
    try {
      const data = await authApi.register({ name: sName.trim(), email: sEmail.trim().toLowerCase(), password: sPass });
      onLogin(data.user, data.token);
    } catch (e) {
      setErr(e.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const feats_login = [
    { icon: "🎂", title: "Track Birthdays",  sub: "Get reminders days before" },
    { icon: "💍", title: "Anniversaries",    sub: "Never forget the important ones" },
    { icon: "📲", title: "Auto Greetings",   sub: "Send via WhatsApp or email" },
  ];
  const feats_signup = [
    { icon: "📅", title: "Smart Calendar",   sub: "Visual overview of all events" },
    { icon: "🔔", title: "Early Reminders",  sub: "Set alerts days in advance" },
    { icon: "🔗", title: "n8n Integration",  sub: "Automate with webhooks" },
  ];
  const feats = page === "login" ? feats_login : feats_signup;

  return (
    <div className="auth-layout">
      {/* ── LEFT PANEL ── */}
      <div className="auth-left">
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <div style={{ width: 80, height: 80, borderRadius: 24, background: "rgba(255,255,255,0.15)",
            border: "1.5px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: 36, margin: "0 auto 20px" }}>
            {page === "login" ? "🎉" : "✨"}
          </div>
          <div style={{ fontSize: 32, fontWeight: 800, color: "#fff", letterSpacing: -1 }}>RemindMe</div>
          <div style={{ color: "rgba(255,255,255,0.72)", fontSize: 14, marginTop: 8, fontWeight: 500 }}>
            {page === "login" ? "Never miss a special moment" : "Create your free account"}
          </div>
        </div>
        <div className="auth-left-features" style={{ marginTop: 44, display: "flex", flexDirection: "column",
          width: "100%", maxWidth: 280, position: "relative", zIndex: 1 }}>
          {feats.map((f, i) => (
            <div key={i} className="auth-feature">
              <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>
                {f.icon}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{f.title}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 2 }}>{f.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="auth-right">
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div style={{ fontSize: 26, fontWeight: 800, color: "var(--t1)", letterSpacing: -0.5, marginBottom: 4 }}>
            {page === "login" ? "Welcome back!" : "Create account"}
          </div>
          <div style={{ fontSize: 13, color: "var(--t3)", marginBottom: 28, fontWeight: 500 }}>
            {page === "login" ? "Sign in to your account to continue" : "Get started for free — no credit card needed"}
          </div>

          {/* Error */}
          {err && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#DC2626",
              fontSize: 12, padding: "11px 14px", borderRadius: 10, marginBottom: 14, fontWeight: 600 }}>
              {err}
            </div>
          )}

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20,
            color: "var(--t3)", fontSize: 12, fontWeight: 600, letterSpacing: 0.3 }}>
            <div style={{ flex: 1, height: 1, background: "var(--bdr)" }}/>
            {page === "login" ? "sign in" : "sign up"} with email
            <div style={{ flex: 1, height: 1, background: "var(--bdr)" }}/>
          </div>

          {/* Form fields */}
          {page === "login" ? (
            <>
              <AuthField label="Email address" type="email" value={lEmail}
                onChange={setLEmail} placeholder="name@example.com"/>
              <AuthField label="Password" type="password" value={lPass}
                onChange={setLPass} placeholder="Enter your password"
                onKeyDown={e => e.key === "Enter" && doLogin()}/>
              <GradBtn onClick={doLogin} disabled={loading}>
                {loading ? <Spinner/> : "Sign In →"}
              </GradBtn>
            </>
          ) : (
            <>
              <AuthField label="Full Name" value={sName} onChange={setSName} placeholder="Your full name"/>
              <AuthField label="Email address" type="email" value={sEmail}
                onChange={setSEmail} placeholder="name@example.com"/>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <AuthField label="Password" type="password" value={sPass}
                  onChange={setSPass} placeholder="Min. 6 chars"/>
                <AuthField label="Confirm" type="password" value={sPass2}
                  onChange={setSPass2} placeholder="Repeat"/>
              </div>
              <GradBtn onClick={doSignup} disabled={loading} style={{ marginTop: 4 }}>
                {loading ? <Spinner/> : "Create Account →"}
              </GradBtn>
            </>
          )}

          {/* Switch */}
          <div style={{ textAlign: "center", fontSize: 13, color: "var(--t2)", marginTop: 22, fontWeight: 500 }}>
            {page === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
            <span onClick={() => switchPage(page === "login" ? "signup" : "login")}
              style={{ color: "var(--p1)", fontWeight: 700, cursor: "pointer" }}>
              {page === "login" ? "Create one" : "Sign in"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
