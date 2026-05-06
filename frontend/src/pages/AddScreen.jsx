import { useState, useEffect } from "react";
import { eventsApi } from "../api/client";
import { Field, GradBtn, inputSx, selSx, Spinner } from "../components/UI";

export default function AddScreen({ onSave, toast, editEvent, onCancel }) {
  const [form, setForm] = useState({
    name:"", rel:"", type:"", date:"",
    phone:"", email:"", notes:"", days:"1"
  });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({...f, [k]:v}));

  useEffect(() => {
    if (editEvent) {
      setForm({
        name: editEvent.name || "",
        rel: editEvent.rel || "",
        type: editEvent.type || "",
        date: editEvent.date ? new Date(editEvent.date).toISOString().split('T')[0] : "",
        phone: editEvent.phone || "",
        email: editEvent.email || "",
        notes: editEvent.notes || "",
        days: editEvent.days?.toString() || "1"
      });
    }
  }, [editEvent]);

  async function handleSave() {
    if (!form.name.trim() || !form.rel || !form.type || !form.date) {
      toast("⚠️ Please fill in all required fields"); return;
    }
    setLoading(true);
    try {
      const payload = {
        name:  form.name.trim(),
        rel:   form.rel,
        type:  form.type,
        date:  form.date,
        phone: form.phone,
        email: form.email,
        notes: form.notes,
        days:  parseInt(form.days) || 1,
      };

      let res;
      if (editEvent) {
        res = await eventsApi.update(editEvent._id || editEvent.id, payload);
      } else {
        res = await eventsApi.create(payload);
      }
      
      onSave(res, !!editEvent);
      if (!editEvent) {
        setForm({ name:"", rel:"", type:"", date:"", phone:"", email:"", notes:"", days:"1" });
      }
    } catch (err) {
      toast("❌ " + (err.message || "Failed to save event"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 88px" }}>
      <div style={{ background:"var(--surf)", border:"0.5px solid var(--bdr)", borderRadius:20,
        padding:18, marginBottom:12, boxShadow:"var(--shadow)" }}>
        
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <h3 style={{ fontSize:15, fontWeight:800, color:"var(--t1)" }}>
            {editEvent ? "Edit Event" : "Add New Event"}
          </h3>
          {editEvent && (
            <button onClick={onCancel} style={{ fontSize:10, fontWeight:700, color:"var(--t3)", background:"none", border:"none", cursor:"pointer" }}>CANCEL</button>
          )}
        </div>

        <Field label="Person Name *">
          <input value={form.name} onChange={e => set("name", e.target.value)}
            placeholder="e.g. Priya Sharma" style={inputSx}/>
        </Field>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:13 }}>
          <Field label="Relationship *">
            <select value={form.rel} onChange={e => set("rel", e.target.value)} style={selSx}>
              <option value="">Select</option>
              {["Family","Friend","Friend of Family","Colleague","Other"].map(r => <option key={r}>{r}</option>)}
            </select>
          </Field>
          <Field label="Event Type *">
            <select value={form.type} onChange={e => set("type", e.target.value)} style={selSx}>
              <option value="">Select</option>
              {["Birthday","Anniversary","Other"].map(t => <option key={t}>{t}</option>)}
            </select>
          </Field>
        </div>

        <Field label="Date *">
          <input type="date" value={form.date} onChange={e => set("date", e.target.value)} style={inputSx}/>
        </Field>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:13 }}>
          <Field label="Phone (with code)">
            <input value={form.phone} onChange={e => set("phone", e.target.value)}
              placeholder="+91 98765 43210" style={inputSx}/>
          </Field>
          <Field label="Remind (days before)">
            <input type="number" value={form.days} onChange={e => set("days", e.target.value)}
              min="0" max="30" style={inputSx}/>
          </Field>
        </div>

        <Field label="Email">
          <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
            placeholder="name@example.com" style={inputSx}/>
        </Field>

        <Field label="Notes">
          <input value={form.notes} onChange={e => set("notes", e.target.value)}
            placeholder="Gift ideas, preferences..." style={inputSx}/>
        </Field>

        <GradBtn onClick={handleSave} disabled={loading} style={{ marginTop:6 }}>
          {loading ? <Spinner/> : (editEvent ? "Update Event" : "Save Event")}
        </GradBtn>
      </div>
    </div>
  );
}
