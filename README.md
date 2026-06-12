# Wubb Portfolio
### Charles Blackwood — Strictly Mobile Dev

A Three.js portfolio featuring Wubb, a tiny chaotic boxy creature.

---

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Add your Wubb model
Copy `wubb.glb` into:
```
public/models/wubb.glb
```

### 3. Run locally
```bash
npm run dev
```

### 4. Build for production
```bash
npm run build
```

### 5. Deploy to GitHub Pages
Push the `dist/` folder to your `gh-pages` branch, or use the GitHub Pages action.

---

## Customise

### Update your info
Edit `src/js/faces.js` — all content for each cube face lives here:
- Your bio and fun facts
- Project cards
- Social links (update with your real handles)
- Skills

### Swap the Wubb model
Replace `public/models/wubb.glb` with any GLB file.
If no model is found, a placeholder Wubb is generated procedurally.

---

## File Structure
```
wubb-portfolio/
├── index.html
├── vite.config.js
├── package.json
├── src/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── main.js       ← Scene, cube, Wubb logic
│       └── faces.js      ← All content for each face
├── public/
│   └── models/
│       └── wubb.glb      ← Your Wubb model goes here
```

---

## Controls
- **Drag** the cube to rotate it
- **Spin fast** to launch Wubb
- **Click** the cube to open the current face's content
- **🔊** button toggles sound

---

Built entirely from a mobile phone. 📱
