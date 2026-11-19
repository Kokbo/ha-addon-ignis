// Reads the Home Assistant add-on options and prints `export NAME='value'` lines
// for run.sh to eval. Values are single-quoted so no option can inject shell code.
"use strict";

const fs = require("fs");

const file = process.argv[2] || "/data/options.json";
const options = JSON.parse(fs.readFileSync(file, "utf8"));

function quote(value) {
  return "'" + String(value).replace(/'/g, "'\\''") + "'";
}

function list(value) {
  return Array.isArray(value)
    ? value.map((v) => String(v).trim()).filter(Boolean)
    : [];
}

const env = {};

if (options.vault_root) {
  env.VAULT_ROOT = options.vault_root.replace(/\/+$/, "");
}

if (Number.isInteger(options.write_coalesce_ms)) {
  env.WRITE_COALESCE_MS = options.write_coalesce_ms;
}

const lists = {
  ws_origins: "WS_ORIGINS",
  proxy_allow_private_hosts: "PROXY_ALLOW_PRIVATE_HOSTS",
  ignored_paths: "IGNORED_PATHS",
};

for (const [key, name] of Object.entries(lists)) {
  const values = list(options[key]);

  if (values.length > 0) {
    env[name] = values.join(",");
  }
}

if (options.obsidian_version) {
  env.OBSIDIAN_VERSION = options.obsidian_version;
}

if (Number.isInteger(options.puid)) {
  env.PUID = options.puid;
}

if (Number.isInteger(options.pgid)) {
  env.PGID = options.pgid;
}

for (const [name, value] of Object.entries(env)) {
  process.stdout.write(`export ${name}=${quote(value)}\n`);
}
