// API base URL — reads from Vite env or falls back to localhost
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

function getToken() {
  return localStorage.getItem("rm_token");
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.msg || "Something went wrong");
  }

  return data;
}

// Auth
export const authApi = {
  register: (body) => request("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
};

// Profile
export const profileApi = {
  get: () => request("/api/profile"),
  update: (body) => request("/api/profile", { method: "PUT", body: JSON.stringify(body) }),
  changePassword: (body) => request("/api/profile/password", { method: "PUT", body: JSON.stringify(body) }),
  uploadAvatar: (formData) => {
    // Note: No "Content-Type" header here, fetch will set it automatically with boundary for FormData
    const token = localStorage.getItem("rm_token");
    return fetch(`${BASE_URL}/api/profile/avatar`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData,
    }).then(res => res.json());
  },
};

// Events
export const eventsApi = {
  getAll: () => request("/api/events"),
  create: (body) => request("/api/events", { method: "POST", body: JSON.stringify(body) }),
  update: (id, body) => request(`/api/events/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  remove: (id) => request(`/api/events/${id}`, { method: "DELETE" }),
};
