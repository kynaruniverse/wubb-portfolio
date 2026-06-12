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
        <p class="tagline">Strictly Mobile Dev</p>
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
        <p>I build games and apps that live in your pocket. Mobile-first, always — because that's where real people actually use software.</p>
        <p>Currently working in Godot 4 and React, shipping on Android, always experimenting.</p>
        <div class="fun-facts">
          <div class="fun-fact">📱 100% mobile workflow</div>
          <div class="fun-fact">🎮 Game dev & web dev</div>
          <div class="fun-fact">🔧 SPCK Editor + GitHub</div>
          <div class="fun-fact">⚡ Always building something</div>
        </div>
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
          <p>A creature-collection RPG built in Godot 4. Battle systems, fusion mechanics, and a full creature roster.</p>
          <span class="project-tag">Godot 4 · Android</span>
        </div>
        <div class="project-card">
          <h3>Spitfact</h3>
          <p>Real-time global polling and opinion analytics. React 18 + Supabase + Netlify.</p>
          <span class="project-tag">React · Supabase</span>
        </div>
        <div class="project-card">
          <h3>This Portfolio</h3>
          <p>Built entirely from a mobile phone. Three.js, Vite, and a chaotic little creature called Wubb.</p>
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
            <span class="skill-name">Android Dev</span>
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
            <span class="skill-icon">🔧</span>
            <span class="skill-name">Git & Vite</span>
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
          <a href="mailto:your@email.com" class="social-link">
            <span class="social-icon">📧</span>
            <span>your@email.com</span>
          </a>
          <a href="https://github.com/yourhandle" target="_blank" class="social-link">
            <span class="social-icon">🐙</span>
            <span>GitHub</span>
          </a>
          <a href="https://twitter.com/yourhandle" target="_blank" class="social-link">
            <span class="social-icon">🐦</span>
            <span>Twitter / X</span>
          </a>
          <a href="https://linkedin.com/in/yourhandle" target="_blank" class="social-link">
            <span class="social-icon">💼</span>
            <span>LinkedIn</span>
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
        <h2>You found Wubb's secret 🎉</h2>
        <p>Wubb has escaped. This is your fault.<br/>There's no going back now.</p>
      </div>
    `
  }
}
