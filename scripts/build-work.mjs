#!/usr/bin/env node
// Builds the password-protected /work page.
//
//   WORK_PASSWORD='...' node scripts/build-work.mjs
//
// Reads  _private/work.src.html  (plaintext page, git-ignored) and
//        _private/resume.pdf     (git-ignored), embeds the PDF, encrypts the
// whole page with AES-256-GCM (key = PBKDF2-SHA256, 600k iterations) and writes
// work/index.html, which is the only file that gets committed.
// The password is never written to disk. Uses Node built-ins only.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { webcrypto as crypto } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const password = process.env.WORK_PASSWORD;
if (!password) {
  console.error("Set WORK_PASSWORD in the environment.");
  process.exit(1);
}

const ITERATIONS = 600000;
const b64 = (buf) => Buffer.from(buf).toString("base64");

const pdf = readFileSync(join(root, "_private/resume.pdf"));
const plaintext = readFileSync(join(root, "_private/work.src.html"), "utf8").replace(
  "__RESUME_B64__",
  b64(pdf)
);

// Same PostHog snippet as the rest of the site, so visits to /work are counted.
const analytics = readFileSync(join(root, "_includes/analytics.html"), "utf8");

const salt = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const baseKey = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
const key = await crypto.subtle.deriveKey(
  { name: "PBKDF2", salt, iterations: ITERATIONS, hash: "SHA-256" },
  baseKey,
  { name: "AES-GCM", length: 256 },
  false,
  ["encrypt"]
);
const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(plaintext));

// Jekyll front matter keeps the page out of the sitemap and out of the layout;
// {% raw %} stops Liquid from touching the page script.
const page = `---
layout: null
permalink: /work/
sitemap: false
---
{% raw %}<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <meta name="robots" content="noindex, nofollow">
  <title>Private · Vince J</title>
  <link rel="icon" href="data:,">
${analytics}
  <style>
    :root { --bg:#faf8f4; --ink:#1d1b18; --muted:#6b665e; --rule:#d9d4ca; --accent:#8a3b12; }
    @media (prefers-color-scheme: dark) { :root { --bg:#17161a; --ink:#ece8e1; --muted:#9a958c; --rule:#34323a; --accent:#e0905f; } }
    * { box-sizing: border-box; }
    body { margin:0; min-height:100vh; display:grid; place-items:center; background:var(--bg); color:var(--ink); font:16px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
    form { width:min(360px, calc(100vw - 32px)); }
    h1 { font:500 28px/1.2 Georgia, serif; margin:0 0 6px; }
    p { margin:0 0 20px; color:var(--muted); font-size:15px; }
    input, button { width:100%; font:inherit; padding:12px 14px; border-radius:4px; border:1px solid var(--rule); background:transparent; color:var(--ink); }
    button { margin-top:10px; background:var(--ink); color:var(--bg); border-color:var(--ink); cursor:pointer; }
    button:disabled { opacity:.6; cursor:wait; }
    #err { margin:10px 0 0; color:var(--accent); min-height:1.5em; font-size:14px; }
  </style>
</head>
<body>
  <form id="f" autocomplete="off">
    <h1>Private page</h1>
    <p>Enter the password to continue.</p>
    <input id="pw" type="password" placeholder="Password" aria-label="Password" autofocus required>
    <button id="go" type="submit">Unlock</button>
    <div id="err" role="alert"></div>
  </form>
  <script>
    var D = ${JSON.stringify({ s: b64(salt), i: b64(iv), c: b64(ciphertext), n: ITERATIONS })};
    function u8(s) { var b = atob(s), a = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); return a; }
    document.getElementById("f").addEventListener("submit", async function (e) {
      e.preventDefault();
      var btn = document.getElementById("go"), err = document.getElementById("err");
      err.textContent = ""; btn.disabled = true; btn.textContent = "Unlocking…";
      try {
        var base = await crypto.subtle.importKey("raw", new TextEncoder().encode(document.getElementById("pw").value), "PBKDF2", false, ["deriveKey"]);
        var key = await crypto.subtle.deriveKey({ name: "PBKDF2", salt: u8(D.s), iterations: D.n, hash: "SHA-256" }, base, { name: "AES-GCM", length: 256 }, false, ["decrypt"]);
        var plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: u8(D.i) }, key, u8(D.c));
        document.open(); document.write(new TextDecoder().decode(plain)); document.close();
      } catch (x) {
        err.textContent = "Wrong password."; btn.disabled = false; btn.textContent = "Unlock";
      }
    });
  </script>
</body>
</html>{% endraw %}
`;

mkdirSync(join(root, "work"), { recursive: true });
writeFileSync(join(root, "work/index.html"), page);
console.log(`Wrote work/index.html (${(page.length / 1024).toFixed(0)} KB)`);
