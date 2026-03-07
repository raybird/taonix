# Taonix SOP

> Current SOP for the v27 runtime. If another document conflicts with this file, follow this file and the root `README.md`.

## 1. Development Flow

### Plan

- Define the task in terms of `TaskSpec`, `ResultSpec`, capability boundaries, and failure handling.
- Prefer changes under `src/`.
- Treat legacy areas as non-core unless there is a clear compatibility reason.

### Build

- Keep runtime logic in `src/core/`.
- Keep capability logic in `src/capabilities/`.
- Keep CLI and MCP thin and delegate to runtime APIs.

### Verify

- Run `npm test`
- Run `node tests/test-integration.js`
- If CLI or MCP behavior changed, run the corresponding smoke command

## 2. Documentation Sync

When behavior changes:

- Update `README.md` if the public interface changed.
- Update `docs/README.md` if architecture or runtime boundaries changed.
- Update `docs/migration/` when legacy mapping or removal status changed.
- Update `docs/legacy-modules.md` when a legacy area is neutralized or removed.

## 3. Release Notes

Historical files such as `docs/CHANGELOG.md`, `docs/ROADMAP.md`, and `docs/RELEASE-V26.md` are archive material.

Do not treat them as the current source of truth for runtime behavior.
