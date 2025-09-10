const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function testConnection(payload: any) {
  const res = await fetch(`${BASE_URL}/db-connections/test`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function saveConnection(payload: any) {
  const res = await fetch(`${BASE_URL}/db-connections`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function sendMessage(payload: any) {
  const res = await fetch(`${BASE_URL}/chat-sessions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}