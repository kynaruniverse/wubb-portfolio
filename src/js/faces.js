// =============================================
// FACE CONTENT — Edit this to update your portfolio
// =============================================

export const FACES = {

  // FRONT — Hero
  front: {
    id: 'front',
    label: 'Home',
    color: 0xC9B8F0, // lavender
    render: () => `
      <div class="face-hero">
        <h1>Charles<br/>Blackwood</h1>

        <p class="tagline">
          Mobile Engineer • Game Developer • Product Builder
        </p>

        <p style="margin-top:12px;font-size:.9rem;">
          Rotate the cube to explore projects, skills, and contact details.
        </p>
      </div>
    `
  },

  // TOP — About
  top: {
    id: 'top',
    label: 'About',
    color: 0xA8E6CF, // mint
    render: () => `
      <div class="face-about">
        <h2>Hey, I'm Charles 👋</h2>
        <p>I build mobile apps, games, and interactive experiences focused on performance, usability, and playful design.</p>

        <p>My work spans Android development, game development in Godot 4, modern web technologies, and rapid product prototyping.</p>

        <p>I enjoy turning ambitious ideas into working products and shipping them quickly.</p>
        <div class="fun-fact">📱 Built and deployed projects entirely from mobile devices</div>
        <div class="fun-fact">🎮 Game development with Godot 4</div>
        <div class="fun-fact">⚛️ React, Three.js and modern web tooling</div>
        <div class="fun-fact">🚀 Rapid prototyping and product iteration</div>
      </div>
    `
  },

  // RIGHT — Projects
  right: {
    id: 'right',
    label: 'Projects',
    color: 0xFFD3B6, // peach
    render: () => `
      <div class="face-projects">
        <h2>Projects 🚀</h2>
        <div class="project-card">
          <h3>Project Fable</h3>
          <p>A creature-collection RPG built in Godot 4 featuring turn-based combat, creature fusion systems, progression mechanics, and an expanding world.</p>
          <span class="project-tag">Godot 4 · Android</span>
        </div>
        <div class="project-card">
          <h3>Spitfact</h3>
          <p>A real-time polling platform that captures public opinion, aggregates responses instantly, and visualises trends through live analytics.</p>
          <span class="project-tag">React · Supabase</span>
        </div>
        <div class="project-card">
          <h3>This Portfolio</h3>
          <p>An interactive 3D portfolio built with Three.js and Vite, designed and developed entirely from mobile devices.</p>
          <span class="project-tag">Three.js · Mobile Built</span>
        </div>
      </div>
    `
  },

  // LEFT — Skills
  left: {
    id: 'left',
    label: 'Skills',
    color: 0xB8E0FF, // soft blue
    render: () => `
      <div class="face-skills">
        <h2>Skills ⚡</h2>
        <div class="skills-grid">
          <div class="skill-item">
            <span class="skill-icon">📱</span>
            <span class="skill-name">Android</span>
          </div>
          <div class="skill-item">
            <span class="skill-icon">🎮</span>
            <span class="skill-name">Godot 4</span>
          </div>
          <div class="skill-item">
            <span class="skill-icon">⚛️</span>
            <span class="skill-name">React</span>
          </div>
          <div class="skill-item">
            <span class="skill-icon">🌐</span>
            <span class="skill-name">Three.js</span>
          </div>
          <div class="skill-item">
            <span class="skill-icon">🗄️</span>
            <span class="skill-name">Supabase</span>
          </div>
          <div class="skill-item">
            <span class="skill-icon">☁️</span>
            <span class="skill-name">Node.js</span>
          </div>

          <div class="skill-item">
            <span class="skill-icon">🔧</span>
            <span class="skill-name">Git / Vite</span>
          </div>
        </div>
      </div>
    `
  },

  // BOTTOM — Contact
  bottom: {
    id: 'bottom',
    label: 'Contact',
    color: 0xFFB8D4, // pink
    render: () => `
      <div class="face-contact">
        <h2>Find Me 🌍</h2>
        <div class="social-links">
          <a href="mailto:charlesblackwoodofficial@gmail.com" class="social-link">
            <span class="social-icon">📧</span>
            <span>charlesblackwoodofficial@gmail.com</span>
          </a>
          <a href="https://github.com/kynaruniverse" target="_blank" rel="noopener noreferrer" class="social-link">
            <span class="social-icon">🐙</span>
            <span>GitHub</span>
          </a>
        </div>
      </div>
    `
  },

  // BACK — Easter Egg
  back: {
    id: 'back',
    label: '???',
    color: 0x2D1B69, // deep purple
    render: () => `
      <div class="face-egg">
        <h2>Wubb Has Escaped 🎉</h2>

        <p>
        You discovered the hidden face.
        Unfortunately, Wubb now considers himself your project manager.
        </p>

        <p>
        Good luck.
        </p>
      </div>
    `
  }
}
