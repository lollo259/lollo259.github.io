# The Orem. — Exhibit Locker

Static website for THE OREM REM catalogue (716 exhibits). Plain HTML/CSS/vanilla JS, no build step needed to view.

## Structure
- `index.html`, `assets/app.js`, `assets/style.css` — the site (hash routes: `#/` home, `#/index`, `#/rem-000` …).
- `content/entries/*.md` — one file per exhibit: YAML front matter (`rem, name, aliases, type, category, object_class, source, source_id, explicit, notes`) + verbatim body.
  Body sections are `## Title` followed by `<!-- type: description|containment|addendum|note|log|interview|personnel file|quote -->`. Logs and interviews render as transcripts.
- `data/index.json` — generated list the site reads. Regenerate with `node tools/build-index.mjs` (Node 18+, no dependencies).
- `tools/generate_content.py` — one-off generator used to create the markdown files from `entries.json` (do not re-run after you start editing; it overwrites the files).
- `assets/editor.js` — in-site editor (GitHub contents API). Repo-root `.github/workflows/orem-index.yml` rebuilds `orem/data/index.json` on pushes touching `orem/**`. `setup.html` — one-time password setup.

## Live location
- https://laurencewho.com/orem/ — repo `lollo259/lollo259.github.io`, branch `main`, folder `/orem` (GitHub Pages, CNAME laurencewho.com).
- All paths are relative. Every page has `noindex, nofollow`. There are no links to /orem from the main site, and /orem is deliberately NOT listed in robots.txt (that would advertise it).
- The index-rebuild workflow lives at the repo root: `.github/workflows/orem-index.yml` (runs only for changes under `orem/`).

## Publish on GitHub Pages (generic)
1. Copy the whole folder (including the hidden `.github/` and `.nojekyll`) into your Pages repository and push to `main`.
2. Repository → Settings → Pages → Source: "Deploy from a branch", branch `main`, folder `/` (root).
3. Settings → Actions → General → Workflow permissions: "Read and write" (so the workflow can commit `data/index.json`).
4. Open the site URL.

Local preview: `python3 -m http.server` in this folder, then http://localhost:8000 (opening index.html from disk will not load the data).

## Editing in the site (you are the only editor)
Editing is unlocked by **your password**. `orem/clearance.json` contains your GitHub token *encrypted* with that password
(AES-GCM-256, key from PBKDF2-SHA256 with 650,000 iterations, random salt and IV). The browser decrypts it only when the
right password is entered; a wrong password gives "Clearance denied". No plaintext token is ever stored in the repo.
Until setup is done, the button reads "CLEARANCE NOT CONFIGURED".

### One-time setup
1. **Create the token:** github.com → Settings → Developer settings → Personal access tokens → **Fine-grained tokens** →
   Generate new token. Name `orem-clearance`; expiration of your choice; Resource owner `lollo259`;
   Repository access **Only select repositories → `lollo259/lollo259.github.io`**; Permissions → Repository permissions →
   **Contents: Read and write** (nothing else). Generate and copy it (`github_pat_…`).
2. **Open https://laurencewho.com/orem/setup.html** (not linked anywhere; bookmark it privately).
3. Paste the token, **choose your password** (12+ characters, twice), press *Encrypt & commit*. The page checks the token,
   encrypts it in your browser and commits `orem/clearance.json`. Wait 1–2 minutes for Pages.
4. In the locker press **REQUEST CLEARANCE**, enter the password. The decrypted token stays in that browser tab only
   (sessionStorage) and is forgotten when the tab closes or you press "Revoke clearance".

### Change password / replace token
Open setup.html again: either enter the **current password** (keeps the same token) or paste a **new token**, then the new
password twice. When the token expires, create a new one and paste it there.

### What you can do once cleared
- Edit any exhibit: all fields and the body; upload an image (committed to `orem/assets/img/rem-xxx.ext`, sets `image`,
  and the photo frame shows it instead of the redaction block). *Save & commit* writes `orem/content/entries/rem-xxx.md`.
- Create a new exhibit ("+ New exhibit", or the button on the home/index page).
- The workflow rebuilds `orem/data/index.json`; the live site updates in ~1–2 minutes.

### Security notes
- Choose a strong password: clearance.json is public, so its strength is what protects the token.
- If you suspect the password leaked: delete the token on GitHub (Settings → Developer settings), create a new one, run setup again.

### Fallback
Edit `orem/content/entries/rem-xxx.md` directly on github.com/lollo259/lollo259.github.io (pencil icon → Commit). Keep the `## Title` /
`<!-- type: … -->` markers in bodies.

## Content notes
- Texts are verbatim from the source documents; Italian passages are translated into English and marked as translated; Old English and redactions are kept.
- `explicit: true` exhibits are behind a per-exhibit content-warning gate; the "Explicit" link in the header reveals all (stored in the browser).
- REM-XXX (The Machinist) always sorts last. Great Silence material is excluded.
