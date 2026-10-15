import { getStore } from "@netlify/blobs";

const store = getStore("name-search-history");
const MAX_ENTRIES = 1000;

function reply(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

function isAdmin(request) {
  const expected = process.env.ADMIN_PASSWORD;
  const supplied = request.headers.get("x-admin-password") || "";
  return Boolean(expected && supplied && supplied === expected);
}

async function readEntries() {
  return (await store.get("entries", { type: "json" })) || [];
}

export default async function handler(request) {
  if (!process.env.ADMIN_PASSWORD) {
    return reply({ error: "Admin password is not configured on the server." }, 503);
  }

  if (request.method === "POST") {
    try {
      const body = await request.json();
      const name = typeof body.name === "string" ? body.name.trim().slice(0, 80) : "";
      if (!name) return reply({ error: "A name is required." }, 400);
      const entries = await readEntries();
      entries.unshift({ name, searchedAt: new Date().toISOString() });
      await store.setJSON("entries", entries.slice(0, MAX_ENTRIES));
      return reply({ ok: true });
    } catch {
      return reply({ error: "Could not record this search." }, 500);
    }
  }

  if (request.method === "GET") {
    if (!isAdmin(request)) return reply({ error: "Unauthorized." }, 401);
    try { return reply({ entries: await readEntries() }); }
    catch { return reply({ error: "Could not read search history." }, 500); }
  }

  if (request.method === "DELETE") {
    if (!isAdmin(request)) return reply({ error: "Unauthorized." }, 401);
    try { await store.setJSON("entries", []); return reply({ ok: true }); }
    catch { return reply({ error: "Could not clear search history." }, 500); }
  }

  return reply({ error: "Method not allowed." }, 405);
}
