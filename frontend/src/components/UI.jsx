// Shared UI primitives — imported wherever needed

// ── Toast ──────────────────────────────────────────────────────────────
export function Toast({ msg }) {
  return (
    <div style={{
      position: "fixed", bottom: 80, left: "50%",
      transform: `translateX(-50%) translateY(${msg ? "0" : "16px"})`,
      background: "#111827", color: "#fff", fontSize: 12, fontWeight: 600,
      padding: "10px 22px", borderRadius: 24, zIndex: 9999,
      opacity: msg ? 1 : 0, transition: "opacity 0.3s,transform 0.3s",
      pointerEvents: "none", whiteSpace: "nowrap", maxWidth: "90vw",
      boxShadow: "0 4px 24px rgba(0,0,0,0.28)",
    }}>{msg || " "}</div>
  );
}

// ── Toggle switch ──────────────────────────────────────────────────────
export function Toggle({ checked, onChange }) {
  return (
    <label style={{ position: "relative", width: 46, height: 26, flexShrink: 0, cursor: "pointer", display: "inline-block" }}
      onClick={e => e.stopPropagation()}>
      <input type="checkbox" checked={checked} onChange={onChange}
        style={{ position: "absolute", opacity: 0, width: 0, height: 0 }} />
      <div style={{
        position: "absolute", inset: 0, borderRadius: 13, transition: "background 0.25s",
        background: checked ? "linear-gradient(135deg,#4F46E5,#9333EA)" : "#D1D5DB",
      }}>
        <div style={{
          position: "absolute", width: 20, height: 20, top: 3, left: 3, borderRadius: "50%",
          background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          transition: "transform 0.25s",
          transform: checked ? "translateX(20px)" : "translateX(0)",
        }}/>
      </div>
    </label>
  );
}

// ── Icon Button ────────────────────────────────────────────────────────
export function IconBtn({ onClick, children, title }) {
  return (
    <button onClick={onClick} title={title} style={{
      width: 34, height: 34, borderRadius: "50%",
      background: "var(--icon-bg)", border: "none",
      display: "flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer", color: "var(--icon-stroke)", transition: "background 0.2s",
    }}>{children}</button>
  );
}

// ── Gradient Button ────────────────────────────────────────────────────
export function GradBtn({ onClick, children, style = {}, disabled = false }) {
  return (
    <button onClick={onClick} disabled={disabled} className="btn-grad"
      style={{ padding: "14px", width: "100%", opacity: disabled ? 0.6 : 1, ...style }}>
      {children}
    </button>
  );
}

// ── Auth Input Field ───────────────────────────────────────────────────
export function AuthField({ label, type = "text", value, onChange, placeholder, onKeyDown }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 700, color: "var(--t2)", marginBottom: 6, letterSpacing: 0.5, textTransform: "uppercase" }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} onKeyDown={onKeyDown}
        style={{ width: "100%", padding: "13px 15px", border: "1px solid rgba(79,70,229,0.18)",
          borderRadius: 12, fontSize: 14, background: "var(--input-bg)", color: "var(--t1)",
          transition: "border-color 0.2s", boxSizing: "border-box" }} />
    </div>
  );
}

// ── Form Field Wrapper ─────────────────────────────────────────────────
export function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 13 }}>
      <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: "var(--t2)",
        marginBottom: 5, letterSpacing: 0.4, textTransform: "uppercase" }}>{label}</label>
      {children}
    </div>
  );
}

// ── Shared input/select styles ─────────────────────────────────────────
export const inputSx = {
  width: "100%", padding: "11px 13px",
  border: "0.5px solid rgba(79,70,229,0.2)", borderRadius: 11,
  fontSize: 13, background: "var(--input-bg)", color: "var(--t1)",
  transition: "border-color 0.2s", boxSizing: "border-box",
};
export const selSx = { ...inputSx, appearance: "none", WebkitAppearance: "none" };

// ── Spinner ────────────────────────────────────────────────────────────
export function Spinner() {
  return (
    <div style={{
      width: 18, height: 18, borderRadius: "50%",
      border: "2.5px solid rgba(255,255,255,0.35)",
      borderTopColor: "#fff",
      animation: "rm-spin 0.7s linear infinite",
      display: "inline-block",
    }}/>
  );
}
