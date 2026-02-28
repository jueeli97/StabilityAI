const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export async function postJson(path, body){
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!res.ok){
    let message = `Request failed (${res.status})`;
    try{
      const err = await res.json();
      message = err?.message || message;
    } catch {}
    throw new Error(message);
  }

  return res.json();
}