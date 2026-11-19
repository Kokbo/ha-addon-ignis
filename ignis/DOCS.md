# Ignis (Obsidian)

[Ignis](https://github.com/Nystik-gh/ignis) runs the real Obsidian app in a normal
browser tab. It is not a remote desktop: Ignis replaces the Electron APIs that Obsidian
uses, and your vault stays on the server. This add-on runs Ignis on Home Assistant and
keeps the vaults in `/share/obsidian`.

On first start the add-on downloads Obsidian from Obsidian's official GitHub releases.
It is kept in the add-on's data folder, so later starts are fast.

## Getting started

1. Start the add-on and click **Open web UI** (or go to `http://<home-assistant>:8080`).
2. With no vaults yet, Ignis opens its vault manager. Create a vault, or copy an
   existing vault folder into `/share/obsidian/` (for example with the Samba add-on)
   and reload.

Every subfolder of the vault folder is a separate vault.

## Security – read this first

Ignis has **no login**. Anyone who can reach port 8080 can read and change every
vault, and can use the server's built-in web proxy. Do not forward the port on your
router.

For use outside your home network, publish Ignis through a reverse proxy that adds
authentication and HTTPS, such as a Cloudflare Tunnel with Cloudflare Access, Nginx
Proxy Manager with an access list, or Traefik with Authelia. When you do, add the
public address (for example `https://notes.example.com`) to **Allowed origins for live
sync**.

### Why HTTPS matters

On plain HTTP at an address other than `localhost`, browsers switch off the Web Crypto
and clipboard APIs. Ignis then shows a warning banner, and plugins that need those
APIs (some sync, encryption and copy features) fail. Over the LAN on
`http://<ip>:8080` Obsidian works for everyday editing; for full functionality use an
HTTPS address.

## Why there is no sidebar panel

Home Assistant's sidebar (ingress) serves add-ons under a long sub-path. Ignis loads its
API, live sync and vault files from the root of the site (`/api`, `/ws`,
`/vault-files`), so it cannot run under that sub-path. You can still add a sidebar link
to your own HTTPS address with a *Webpage* dashboard.

## Options

| Option | Default | What it does |
| --- | --- | --- |
| Vault folder | `/share/obsidian` | Folder holding your vaults. Must be under `/share` or `/media`. |
| Write coalesce window (ms) | `0` | Groups rapid saves; use 200–1000 on SMB/NFS storage. |
| Allowed origins for live sync | empty | Restrict live-sync connections to these addresses. |
| Private hosts plugins may reach | empty | LAN IPs or ranges plugins may call through the proxy. |
| Ignored paths | empty | Extra patterns the file watcher skips. |
| Obsidian version | empty | Run a newer Obsidian than this release is pinned to. |
| User ID / Group ID | `1000` | Owner of the files Ignis writes. |

More server settings (proxy allowlist, cache sizes, ignore rules) are in Obsidian under
**Settings → Ignis**. They are stored in the add-on's data folder.

## Obsidian Sync

The add-on includes `obsidian-headless`, so Ignis's server-side Obsidian Sync works.
Its login is stored in the add-on's data folder and survives restarts and updates.

## Plugins

Most community plugins work. Plugins that need Node native modules or start other
programs (`child_process`) load but fail when used. See the
[Ignis plugin compatibility notes](https://github.com/Nystik-gh/ignis).

## Backups

- The vaults are in `/share`; include the **Share** folder in your Home Assistant
  backups, or keep a backup through Obsidian Sync or a separate tool.
- The add-on's own backup contains the Ignis settings and the downloaded Obsidian app.

## Licence

Ignis is licensed under AGPL-3.0. Obsidian itself is not part of this add-on or of the
Ignis image; it is downloaded from Obsidian's official releases and is subject to
[Obsidian's terms](https://obsidian.md/terms).
