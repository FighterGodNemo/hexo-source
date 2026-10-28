// Encrypt the private contest-radar analysis payload for publication.
//
// Plaintext: tools/contest-radar/.private/private.plain.json   (gitignored, local only)
// Output:    source/contest-radar/private.enc.json             (published, encrypted)
//
// Password comes from CONTEST_VAULT_PASSWORD (local shell or GitHub Actions secret).
// Envelope: PBKDF2-SHA256 (310k iterations) -> AES-256-GCM.
// The published page decrypts the same envelope with WebCrypto (assets/vault.js).
//
//   node tools/contest-radar/encrypt-vault.mjs            # encrypt
//   node tools/contest-radar/encrypt-vault.mjs --verify    # decrypt & print summary

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { pbkdf2Sync, randomBytes, createCipheriv, createDecipheriv } from "node:crypto";

const TOOL_DIR = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(TOOL_DIR, "..", "..");
const PLAIN = resolve(TOOL_DIR, ".private", "private.plain.json");
const ENC = resolve(ROOT, "source", "contest-radar", "private.enc.json");
const KDF_ITERATIONS = 310000;
const SALT_BYTES = 16;
const IV_BYTES = 12;

const password = (process.env.CONTEST_VAULT_PASSWORD || "").trim();
const verify = process.argv.includes("--verify");

function deriveKey(salt) {
  return pbkdf2Sync(password, salt, KDF_ITERATIONS, 32, "sha256");
}

function encrypt(plainText) {
  const salt = randomBytes(SALT_BYTES);
  const iv = randomBytes(IV_BYTES);
  const key = deriveKey(salt);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const data = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  return {
    v: 1,
    kdf: "PBKDF2-SHA256",
    iterations: KDF_ITERATIONS,
    cipher: "AES-256-GCM",
    salt: salt.toString("base64"),
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
    data: data.toString("base64"),
  };
}

function decrypt(envelope) {
  const salt = Buffer.from(envelope.salt, "base64");
  const iv = Buffer.from(envelope.iv, "base64");
  const tag = Buffer.from(envelope.tag, "base64");
  const key = deriveKey(salt);
  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const out = Buffer.concat([decipher.update(Buffer.from(envelope.data, "base64")), decipher.final()]);
  return out.toString("utf8");
}

if (!password) {
  console.log("[vault] CONTEST_VAULT_PASSWORD is not set — leaving private.enc.json untouched.");
  process.exit(0);
}

if (!existsSync(PLAIN)) {
  console.log(`[vault] ${PLAIN} not found — nothing to encrypt.`);
  process.exit(0);
}

if (verify) {
  const envelope = JSON.parse(readFileSync(ENC, "utf8"));
  const payload = JSON.parse(decrypt(envelope));
  console.log("[vault] verify OK");
  console.log(`[vault] generated_at=${payload.generated_at} projects=${payload.projects.length} event_matches=${Object.keys(payload.event_matches).length} watchlist_matches=${Object.keys(payload.watchlist_matches).length}`);
  const matches = Object.values(payload.event_matches).filter((m) => (m.matched_projects || []).length > 0 || (m.whitelist_ids || []).length > 0);
  console.log(`[vault] events hitting projects/whitelist: ${matches.length}`);
  process.exit(0);
}

const plainText = readFileSync(PLAIN, "utf8");
const payload = JSON.parse(plainText); // fail fast on broken input
// Never clobber a good vault with an empty payload (e.g. CI run without the
// CONTEST_PROJECTS_JSON secret, where project matching has nothing to work on).
if (!Array.isArray(payload.projects) || payload.projects.length === 0) {
  console.log("[vault] private payload has no projects — keeping the existing encrypted vault.");
  process.exit(0);
}
const envelope = encrypt(plainText);
mkdirSync(dirname(ENC), { recursive: true });
writeFileSync(ENC, JSON.stringify(envelope) + "\n", "utf8");
const size = readFileSync(ENC).length;
console.log(`[vault] wrote ${ENC} (${size} bytes, ciphertext ${envelope.data.length} b64 chars)`);
