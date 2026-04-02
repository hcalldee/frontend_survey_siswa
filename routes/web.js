// routes/web.js (tanpa axios, pakai fetch bawaan Node.js v18+)
const express = require("express");
const router = express.Router();

function getCfg() {
  const apiBase = (process.env.API_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
  const appKey = process.env.APP_USER_KEY || "";
  return { apiBase, appKey };
}

function withAppKey(headers = {}) {
  const { appKey } = getCfg();
  if (!appKey) return headers;
  return { ...headers, "x-app-key": appKey };
}

async function readBodySafe(res) {
  const ct = (res.headers.get("content-type") || "").toLowerCase();
  const text = await res.text();

  if (ct.includes("application/json")) {
    try {
      return { isJson: true, body: text ? JSON.parse(text) : {} };
    } catch {
      return { isJson: false, body: text };
    }
  }
  return { isJson: false, body: text };
}

async function proxy(req, res, url, opts = {}) {
  try {
    const r = await fetch(url, {
      ...opts,
      headers: withAppKey(opts.headers || {}),
    });

    const { isJson, body } = await readBodySafe(r);
    res.status(r.status);

    // forward content-type biar client ga bingung
    const ct = r.headers.get("content-type");
    if (ct) res.setHeader("content-type", ct);

    return isJson ? res.json(body) : res.send(body);
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Proxy error",
      error: String(err?.message || err),
    });
  }
}

// ===== Pages =====
router.get("/", (req, res) => res.redirect("/form-quisioner"));

router.get("/form-quisioner", (req, res) => {
  res.render("pages/form-quisioner", {
    apiBase: getCfg().apiBase,
  });
});

// ===== Proxy API (no-login) =====
router.get("/api/master-si", (req, res) => {
  const { apiBase } = getCfg();
  const qs = new URLSearchParams(req.query).toString();
  const url = `${apiBase}/api/public/master-si${qs ? `?${qs}` : ""}`;
  return proxy(req, res, url, { method: "GET" });
});

router.get("/api/kategori/view", (req, res) => {
  const { apiBase } = getCfg();
  const url = `${apiBase}/api/public/kategori/view`;
  return proxy(req, res, url, { method: "GET" });
});

router.get("/api/master-transact-pelatihan", (req, res) => {
  const { apiBase } = getCfg();
  const url = `${apiBase}/api/public/master-transact-pelatihan`;
  return proxy(req, res, url, { method: "GET" });
});

router.get("/api/master-transact-pelatihan/:id", (req, res) => {
  const { apiBase } = getCfg();
  const url = `${apiBase}/api/public/master-transact-pelatihan/${encodeURIComponent(req.params.id)}`;
  return proxy(req, res, url, { method: "GET" });
});

router.post("/api/transact-jawaban/bulk", (req, res) => {
  const { apiBase } = getCfg();
  const url = `${apiBase}/api/transact-jawaban/bulk`;
  return proxy(req, res, url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(req.body || {}),
  });
});

module.exports = router;
