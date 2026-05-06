// Shared helpers & constants used across pages
export const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
export const DOT_COLOR   = { Birthday:"#EC4899", Anniversary:"#0EA5E9", Other:"#8B5CF6" };
export const STRIPE_COLOR= { Birthday:"linear-gradient(180deg,#F472B6,#EC4899)", Anniversary:"linear-gradient(180deg,#38BDF8,#0EA5E9)", Other:"linear-gradient(180deg,#A78BFA,#8B5CF6)" };
export const BADGE = {
  Birthday:   { bg:"#FDF2F8", color:"#9D174D" },
  Anniversary:{ bg:"#EFF6FF", color:"#1E40AF" },
  Other:      { bg:"#F5F3FF", color:"#5B21B6" },
};
export const AV_PALETTE = [
  { bg:"#FDF2F8", color:"#9D174D" },
  { bg:"#EFF6FF", color:"#1E40AF" },
  { bg:"#F5F3FF", color:"#5B21B6" },
  { bg:"#F0FDF4", color:"#166534" },
  { bg:"#FFF7ED", color:"#C2410C" },
];

export const getInitials = (n) => {
  if (!n) return "?";
  return n.split(" ").filter(Boolean).map(w=>w[0]).join("").slice(0,2).toUpperCase();
};
export const fmtDate     = (s) => {
  if (!s) return "–";
  const d = new Date(s);
  return isNaN(d.getTime()) ? "–" : d.toLocaleDateString("en-US",{month:"short",day:"numeric"});
};

export function daysUntil(dateStr) {
  if (!dateStr) return 999;
  const t = new Date(); t.setHours(0,0,0,0);
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 999;
  
  // Use local date parts to avoid UTC shift issues
  const nxt = new Date(t.getFullYear(), d.getMonth(), d.getDate());
  const target = nxt >= t ? nxt : new Date(t.getFullYear()+1, d.getMonth(), d.getDate());
  return Math.round((target - t) / 86400000);
}

export function pillInfo(n) {
  if (n === 0) return { label:"Today!",   bg:"#F0FDF4", color:"#166534" };
  if (n <= 7)  return { label:n===1?"Tomorrow":n+" days", bg:"#FFFBEB", color:"#B45309" };
  return { label:n+" days", bg:"#F9FAFB", color:"#9CA3AF" };
}
