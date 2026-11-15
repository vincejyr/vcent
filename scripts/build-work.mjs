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
  <title>Work · Vince J</title>
  <link rel="icon" href="data:,">
${analytics}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=Hanken+Grotesk:wght@400;500;600&display=swap">
  <link rel="stylesheet" href="/assets/css/style.css">
  <style>
    a.button, a.button:hover { display:inline-flex; align-items:center; text-decoration:none; color:var(--paper); }
    .alt { margin:16px 0 0; font-family:var(--sans); font-size:15px; color:var(--muted); }
    .unlock { margin-top:48px; padding-top:32px; border-top:1px solid var(--rule); max-width:360px; }
    .unlock p { margin:0 0 12px; font-family:var(--sans); font-size:15px; color:var(--muted); }
    .unlock input { width:100%; height:48px; padding:0 14px; font:inherit; font-size:16px; border:1px solid var(--rule); background:transparent; color:var(--ink); }
    .unlock button { width:100%; margin-top:10px; }
    .unlock button:disabled { opacity:.6; cursor:wait; }
    #err { margin:10px 0 0; min-height:1.5em; font-family:var(--sans); font-size:14px; color:var(--accent); }
  </style>
</head>
<body>
  <header class="site-header">
    <div class="wrap">
      <a class="site-title" href="/">Vince J</a>
      <nav class="site-nav" aria-label="Main">
        <a href="/writing/">Writing</a>
        <a href="/music-reviews/">Music Reviews</a>
        <a href="/photography/">Photography</a>
        <a href="/newsletter/">Newsletter</a>
        <a href="/work/" aria-current="page">Work</a>
      </nav>
    </div>
  </header>
  <main>
    <div class="wrap">
      <header class="page-head">
        <div class="page-head-text">
          <h1>Work</h1>
        </div>
        <p class="intro">This page contains my professional work experience, body of work and references. To get access to this page, please reach out to me.</p>
      </header>
      <div class="page-body">
        <a class="button" href="https://www.linkedin.com/in/vincentjyrwa/" target="_blank" rel="noopener">Message me on LinkedIn</a>
        <p class="alt">Or email me at <a href="mailto:me@vcent.in">me@vcent.in</a></p>
        <form id="f" class="unlock" autocomplete="off">
          <p>Already have the password?</p>
          <input id="pw" type="password" placeholder="Password" aria-label="Password" required>
          <button class="button" id="go" type="submit">Unlock</button>
          <div id="err" role="alert"></div>
        </form>
      </div>
    </div>
  </main>
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
