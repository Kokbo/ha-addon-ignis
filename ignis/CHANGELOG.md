# Changelog

## 0.9.0

- First release, based on Ignis 0.9.0 (Obsidian 1.14.4).
- Vaults in `/share/obsidian` (configurable to any folder under `/share` or `/media`).
- Obsidian app, Ignis settings and the Obsidian Sync login are kept in the add-on's
  data folder, so Obsidian is downloaded once instead of on every start.
- obsidian-headless 0.0.14 included in the image for Obsidian Sync.
- Options for write coalescing, allowed live-sync origins, private proxy hosts,
  ignored paths, Obsidian version and file owner.
