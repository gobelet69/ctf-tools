/* CTF Tools — shared utilities */
'use strict';

const $ = (s, p) => (p || document).querySelector(s);
const $$ = (s, p) => [...(p || document).querySelectorAll(s)];

/* ── Hex / Bytes ── */
function hexToBytes(hex) {
  hex = hex.replace(/\s+/g, '');
  if (hex.length % 2) throw new Error('Odd-length hex string');
  const b = new Uint8Array(hex.length / 2);
  for (let i = 0; i < b.length; i++) {
    const v = parseInt(hex.substr(i * 2, 2), 16);
    if (Number.isNaN(v)) throw new Error('Invalid hex at position ' + i * 2);
    b[i] = v;
  }
  return b;
}

function bytesToHex(bytes, sep = '') {
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join(sep);
}

function bytesToAscii(bytes) {
  return Array.from(bytes, b => String.fromCharCode(b)).join('');
}

function asciiToBytes(str) {
  const b = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) b[i] = str.charCodeAt(i) & 0xff;
  return b;
}

function textToBytes(str) {
  return new TextEncoder().encode(str);
}

function bytesToText(bytes) {
  return new TextDecoder().decode(bytes);
}

/* ── Base64 ── */
function base64Encode(bytes) {
  if (typeof bytes === 'string') bytes = textToBytes(bytes);
  let bin = '';
  bytes.forEach(b => bin += String.fromCharCode(b));
  return btoa(bin);
}

function base64Decode(str) {
  const bin = atob(str.replace(/\s/g, ''));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

/* ── File I/O ── */
function readFile(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(new Uint8Array(r.result));
    r.onerror = () => reject(r.error);
    r.readAsArrayBuffer(file);
  });
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = () => reject(r.error);
    r.readAsText(file);
  });
}

function download(filename, data, mime = 'application/octet-stream') {
  const blob = data instanceof Blob ? data : new Blob([data], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* ── Clipboard ── */
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  }
}

/* ── Safe display ── */
function safeText(el, text) {
  if (typeof el === 'string') el = $(el);
  el.textContent = text;
}

function clearEl(el) {
  if (typeof el === 'string') el = $(el);
  el.textContent = '';
}

function makeEl(tag, attrs, text) {
  const el = document.createElement(tag);
  if (attrs) Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  if (text != null) el.textContent = text;
  return el;
}

/* ── Debounce ── */
function debounce(fn, ms = 200) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

/* ── LocalStorage: Favorites & Recents ── */
const STORAGE_FAVS = 'ctf_favorites';
const STORAGE_RECENT = 'ctf_recents';
const MAX_RECENTS = 20;

function getFavorites() {
  try { return JSON.parse(localStorage.getItem(STORAGE_FAVS)) || []; } catch { return []; }
}

function toggleFavorite(toolId) {
  const favs = getFavorites();
  const idx = favs.indexOf(toolId);
  if (idx === -1) favs.push(toolId);
  else favs.splice(idx, 1);
  localStorage.setItem(STORAGE_FAVS, JSON.stringify(favs));
  return idx === -1;
}

function isFavorite(toolId) {
  return getFavorites().includes(toolId);
}

function getRecents() {
  try { return JSON.parse(localStorage.getItem(STORAGE_RECENT)) || []; } catch { return []; }
}

function trackUsage(toolId) {
  let rec = getRecents().filter(id => id !== toolId);
  rec.unshift(toolId);
  if (rec.length > MAX_RECENTS) rec = rec.slice(0, MAX_RECENTS);
  localStorage.setItem(STORAGE_RECENT, JSON.stringify(rec));
}

/* ── Copy button helper ── */
function addCopyButton(btn, getTextFn) {
  btn.addEventListener('click', async () => {
    const text = typeof getTextFn === 'function' ? getTextFn() : getTextFn;
    const ok = await copyToClipboard(text);
    const orig = btn.textContent;
    btn.textContent = ok ? 'Copied!' : 'Failed';
    setTimeout(() => btn.textContent = orig, 1200);
  });
}

/* ── Hash via WebCrypto ── */
async function hashBytes(algo, data) {
  if (typeof data === 'string') data = textToBytes(data);
  const buf = await crypto.subtle.digest(algo, data);
  return bytesToHex(new Uint8Array(buf));
}

/* ── BigInt helpers ── */
function modPow(base, exp, mod) {
  base = BigInt(base); exp = BigInt(exp); mod = BigInt(mod);
  if (mod === 1n) return 0n;
  let result = 1n;
  base = ((base % mod) + mod) % mod;
  while (exp > 0n) {
    if (exp & 1n) result = (result * base) % mod;
    exp >>= 1n;
    base = (base * base) % mod;
  }
  return result;
}

function gcd(a, b) {
  a = BigInt(a) < 0n ? -BigInt(a) : BigInt(a);
  b = BigInt(b) < 0n ? -BigInt(b) : BigInt(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

function extgcd(a, b) {
  a = BigInt(a); b = BigInt(b);
  let [old_r, r] = [a, b];
  let [old_s, s] = [1n, 0n];
  let [old_t, t] = [0n, 1n];
  while (r !== 0n) {
    const q = old_r / r;
    [old_r, r] = [r, old_r - q * r];
    [old_s, s] = [s, old_s - q * s];
    [old_t, t] = [t, old_t - q * t];
  }
  return { gcd: old_r, x: old_s, y: old_t };
}

function modInverse(a, m) {
  const { gcd: g, x } = extgcd(BigInt(a), BigInt(m));
  if (g !== 1n && g !== -1n) throw new Error('No modular inverse');
  return ((x % BigInt(m)) + BigInt(m)) % BigInt(m);
}

/* ── Shannon Entropy ── */
function shannonEntropy(bytes) {
  const freq = new Float64Array(256);
  for (let i = 0; i < bytes.length; i++) freq[bytes[i]]++;
  let ent = 0;
  for (let i = 0; i < 256; i++) {
    if (freq[i] === 0) continue;
    const p = freq[i] / bytes.length;
    ent -= p * Math.log2(p);
  }
  return ent;
}
