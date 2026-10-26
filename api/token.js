// Perantara penukaran token Strava. Client Secret dibaca dari Environment Variable Vercel (STRAVA_CLIENT_SECRET).
module.exports = async function (req, res) {
  if (req.method !== "POST") { res.status(405).json({ error: "method" }); return; }
  const secret = process.env.STRAVA_CLIENT_SECRET;
  if (!secret) { res.status(500).json({ error: "STRAVA_CLIENT_SECRET belum diatur" }); return; }
  let b = req.body || {};
  if (typeof b === "string") { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  const p = new URLSearchParams({ client_id: "291086", client_secret: secret, grant_type: String(b.grant_type || "") });
  if (b.grant_type === "authorization_code") p.set("code", String(b.code || ""));
  else if (b.grant_type === "refresh_token") p.set("refresh_token", String(b.refresh_token || ""));
  else { res.status(400).json({ error: "grant_type" }); return; }
  const r = await fetch("https://www.strava.com/oauth/token", { method: "POST", body: p });
  const t = await r.text();
  res.status(r.status).setHeader("content-type", "application/json").send(t);
};
