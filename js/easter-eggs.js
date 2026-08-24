/**
 * easter-eggs.js
 * 
 * Contains 3 Bespoke & Beautiful Easter Eggs:
 * 1. 🇸🇷 Sranan Golden Star Constellation (Type "suriname" or "sranan")
 * 2. 📐 Architect / Blueprint X-Ray Scan (Type "build" or press "B")
 * 3. 🎨 Secret Luxe Theme Studio (Type "theme" or "aura")
 */

(function () {
  'use strict';

  /* ── 1. KEYWORD INPUT BUFFER ── */
  let buffer = '';
  const MAX_BUFFER = 20;

  /* ── 2. TOAST NOTIFIER (Luxury Glass Style) ── */
  function showToast(icon, title, subtitle, duration = 4500) {
    let toast = document.getElementById('ee-luxury-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'ee-luxury-toast';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `
      <div class="ee-toast-inner">
        <span class="ee-toast-icon">${icon}</span>
        <div class="ee-toast-text">
          <div class="ee-toast-title">${title}</div>
          ${subtitle ? `<div class="ee-toast-sub">${subtitle}</div>` : ''}
        </div>
      </div>
    `;

    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, duration);
  }

  /* ── 3. EASTER EGG #1: SURINAME GOLDEN STAR ── */
  function triggerSurinameStar() {
    if (window.liveBackground && typeof window.liveBackground.morphToStar === 'function') {
      window.liveBackground.morphToStar(7000);
      showToast('🇸🇷', 'Sranan Tongo • Golden Star Constellation', 'The golden star of Suriname rises in starlight.');
      createGoldFlare();
    }
  }

  function createGoldFlare() {
    const flare = document.createElement('div');
    flare.className = 'ee-gold-flare';
    document.body.appendChild(flare);
    setTimeout(() => flare.classList.add('active'), 20);
    setTimeout(() => {
      flare.classList.remove('active');
      setTimeout(() => flare.remove(), 1000);
    }, 4000);
  }

  /* ── 4. EASTER EGG #2: ARCHITECT BLUEPRINT MODE ── */
  let isBlueprintActive = false;

  function toggleBlueprintMode(forceState) {
    isBlueprintActive = typeof forceState === 'boolean' ? forceState : !isBlueprintActive;
    
    if (isBlueprintActive) {
      document.body.classList.add('blueprint-mode');
      
      // Laser scanline effect
      const scanline = document.createElement('div');
      scanline.className = 'ee-blueprint-scanner';
      document.body.appendChild(scanline);
      setTimeout(() => scanline.remove(), 1600);

      // Add blueprint HUD if not present
      let hud = document.getElementById('ee-blueprint-hud');
      if (!hud) {
        hud = document.createElement('div');
        hud.id = 'ee-blueprint-hud';
        hud.innerHTML = `
          <div class="ee-hud-inner">
            <span class="ee-hud-dot"></span>
            <span class="ee-hud-title">📐 ARCHITECT CAD MODE</span>
            <span class="ee-hud-sep">|</span>
            <span class="ee-hud-info">SCALE: 1:1 • GRID: 24px</span>
            <button id="ee-hud-close" class="ee-hud-btn" title="Exit Blueprint Mode">EXIT [ESC / B]</button>
          </div>
        `;
        document.body.appendChild(hud);
        hud.querySelector('#ee-hud-close').addEventListener('click', () => toggleBlueprintMode(false));
      }
      hud.classList.add('show');
      showToast('📐', 'Architect Blueprint Mode Activated', 'Viewing underlying grid systems & component dimensions. Press [B] or [ESC] to exit.');
    } else {
      document.body.classList.remove('blueprint-mode');
      const hud = document.getElementById('ee-blueprint-hud');
      if (hud) hud.classList.remove('show');
    }
  }

  /* ── 5. EASTER EGG #3: LUXE THEME STUDIO ── */
  const THEMES = [
    {
      id: 'gold',
      name: 'Original (Paramaribo Gold)',
      subtitle: 'Default signature amber & gold luxury',
      isDefault: true,
      accent: '#d4af37',
      rgb: '212, 175, 55',
      accent2: '#f59e0b',
      orb1: 'rgba(212, 175, 55, 0.12)',
      orb2: 'rgba(245, 158, 11, 0.08)'
    },
    {
      id: 'emerald',
      name: 'Amazon Rainforest Emerald',
      subtitle: 'Suriname tropical emerald flora',
      accent: '#10b981',
      rgb: '16, 185, 129',
      accent2: '#059669',
      orb1: 'rgba(16, 185, 129, 0.15)',
      orb2: 'rgba(5, 150, 105, 0.1)'
    },
    {
      id: 'violet',
      name: 'Cyberpad Neon Violet',
      subtitle: 'Futuristic music studio synthwave',
      accent: '#a855f7',
      rgb: '168, 85, 247',
      accent2: '#c084fc',
      orb1: 'rgba(168, 85, 247, 0.15)',
      orb2: 'rgba(192, 132, 252, 0.1)'
    },
    {
      id: 'azure',
      name: 'Electric Azure',
      subtitle: 'Deep oceanic digital cyan',
      accent: '#06b6d4',
      rgb: '6, 182, 212',
      accent2: '#0ea5e9',
      orb1: 'rgba(6, 182, 212, 0.15)',
      orb2: 'rgba(14, 165, 233, 0.1)'
    },
    {
      id: 'diamond',
      name: 'Diamond Monochrome',
      subtitle: 'Ultra-pure architectural silver',
      accent: '#ffffff',
      rgb: '255, 255, 255',
      accent2: '#cbd5e1',
      orb1: 'rgba(255, 255, 255, 0.1)',
      orb2: 'rgba(203, 213, 225, 0.06)'
    }
  ];

  function resetToOriginal() {
    const root = document.documentElement;
    root.style.removeProperty('--accent-gold');
    root.style.removeProperty('--accent-amber');
    root.style.removeProperty('--border-glow');

    const orb1 = document.querySelector('.orb-1');
    const orb2 = document.querySelector('.orb-2');
    if (orb1) orb1.style.background = '';
    if (orb2) orb2.style.background = '';

    if (window.liveBackground && typeof window.liveBackground.setThemeColor === 'function') {
      window.liveBackground.setThemeColor(212, 175, 55);
    }

    localStorage.removeItem('dsa26_aura_theme');
    showToast('👑', 'Original Atmosphere Restored', 'Paramaribo Gold (Default) is active.');
  }

  function applyTheme(theme) {
    if (theme.isDefault) {
      resetToOriginal();
      return;
    }

    const root = document.documentElement;
    root.style.setProperty('--accent-gold', theme.accent);
    root.style.setProperty('--accent-amber', theme.accent2);
    root.style.setProperty('--border-glow', `rgba(${theme.rgb}, 0.3)`);

    const orb1 = document.querySelector('.orb-1');
    const orb2 = document.querySelector('.orb-2');
    if (orb1) orb1.style.background = theme.orb1;
    if (orb2) orb2.style.background = theme.orb2;

    if (window.liveBackground && typeof window.liveBackground.setThemeColor === 'function') {
      const parts = theme.rgb.split(',').map(n => parseInt(n.trim(), 10));
      window.liveBackground.setThemeColor(parts[0], parts[1], parts[2]);
    }

    localStorage.setItem('dsa26_aura_theme', theme.id);
  }

  function openThemeStudio() {
    let modal = document.getElementById('ee-theme-studio');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'ee-theme-studio';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.innerHTML = `
        <div class="ee-theme-backdrop"></div>
        <div class="ee-theme-panel">
          <div class="ee-theme-header">
            <div>
              <div class="ee-theme-tag">SECRET AURA STUDIO</div>
              <h3 class="ee-theme-title font-serif">Select Atmosphere</h3>
            </div>
            <div class="ee-theme-header-actions">
              <button id="ee-theme-reset-btn" class="ee-theme-reset-btn" title="Reset to Original Default">↺ Reset Original</button>
              <button id="ee-theme-close" class="ee-theme-close-btn" aria-label="Close">&times;</button>
            </div>
          </div>
          <div class="ee-theme-list">
            ${THEMES.map(t => `
              <button class="ee-theme-card ${t.isDefault ? 'ee-theme-default-card' : ''}" data-theme-id="${t.id}">
                <span class="ee-theme-swatch" style="background: linear-gradient(135deg, ${t.accent}, ${t.accent2});"></span>
                <div class="ee-theme-info">
                  <div class="ee-theme-name-row">
                    <span class="ee-theme-name">${t.name}</span>
                    ${t.isDefault ? '<span class="ee-default-tag">ORIGINAL</span>' : ''}
                  </div>
                  <span class="ee-theme-desc">${t.subtitle}</span>
                </div>
                <span class="ee-theme-arrow">&nearr;</span>
              </button>
            `).join('')}
          </div>
          <div class="ee-theme-footer">
            <button id="ee-theme-reset-footer-btn" class="ee-theme-footer-reset">↺ Restore Original Default</button>
            <span>Themes save across all pages automatically.</span>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector('.ee-theme-backdrop').addEventListener('click', closeThemeStudio);
      modal.querySelector('#ee-theme-close').addEventListener('click', closeThemeStudio);

      const handleReset = () => {
        resetToOriginal();
        closeThemeStudio();
      };

      modal.querySelector('#ee-theme-reset-btn').addEventListener('click', handleReset);
      modal.querySelector('#ee-theme-reset-footer-btn').addEventListener('click', handleReset);

      modal.querySelectorAll('.ee-theme-card').forEach(btn => {
        btn.addEventListener('click', () => {
          const tid = btn.getAttribute('data-theme-id');
          const t = THEMES.find(item => item.id === tid);
          if (t) {
            applyTheme(t);
            if (!t.isDefault) {
              showToast('🎨', `Aura Changed: ${t.name}`, t.subtitle);
            }
            closeThemeStudio();
          }
        });
      });
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeThemeStudio() {
    const modal = document.getElementById('ee-theme-studio');
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  // Restore saved theme on initial page load
  function restoreSavedTheme() {
    const saved = localStorage.getItem('dsa26_aura_theme');
    if (saved && saved !== 'gold') {
      const t = THEMES.find(item => item.id === saved);
      if (t) applyTheme(t);
    }
  }

  /* ── 6. DEVTOOLS CONSOLE RIDDLES ── */
  function printConsoleHints() {
    console.log(
      '%c✦ Wiraash Mathoera — Digital Portfolio ✦\n%cLooking for secrets? 3 easter eggs are hidden here:\n\n' +
      '%c1. 🇸🇷 Sranan Golden Star:%c Type %csuriname%c or %csranan%c on your keyboard.\n' +
      '%c2. 📐 Architect Blueprint:%c Press key %cB%c or type %cbuild%c.\n' +
      '%c3. 🎨 Secret Theme Studio:%c Type %ctheme%c or %caura%c to change the atmosphere.\n',
      'color: #d4af37; font-size: 14px; font-weight: bold; font-family: serif;',
      'color: #a39c93; font-size: 11px;',
      'color: #ffd700; font-weight: bold;', 'color: #e6e4df;', 'color: #d4af37; font-weight: bold;', 'color: #e6e4df;', 'color: #d4af37; font-weight: bold;', 'color: #e6e4df;',
      'color: #00f0ff; font-weight: bold;', 'color: #e6e4df;', 'color: #00f0ff; font-weight: bold;', 'color: #e6e4df;', 'color: #00f0ff; font-weight: bold;', 'color: #e6e4df;',
      'color: #a855f7; font-weight: bold;', 'color: #e6e4df;', 'color: #a855f7; font-weight: bold;', 'color: #e6e4df;', 'color: #a855f7; font-weight: bold;', 'color: #e6e4df;'
    );
  }

  /* ── 7. INTERACTIVE HINTS MODAL ── */
  function openHintsModal() {
    let modal = document.getElementById('ee-hints-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'ee-hints-modal';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.innerHTML = `
        <div class="ee-hints-backdrop"></div>
        <div class="ee-hints-panel">
          <div class="ee-hints-header">
            <div>
              <div class="ee-hints-tag">PORTFOLIO SECRETS</div>
              <h3 class="ee-hints-title font-serif">Easter Egg Hints</h3>
            </div>
            <button id="ee-hints-close" class="ee-hints-close-btn" aria-label="Close hints">&times;</button>
          </div>

          <div class="ee-hints-list">
            <!-- Hint 1 -->
            <div class="ee-hint-card">
              <div class="ee-hint-badge">🇸🇷 SECRET #1</div>
              <div class="ee-hint-content">
                <div class="ee-hint-name">Golden Star Constellation</div>
                <p class="ee-hint-desc">Whisper the name of the motherland to see the particles align into a golden starlight constellation.</p>
                <div class="ee-hint-trigger-row">
                  <span class="ee-hint-code">Type: <strong>suriname</strong> or <strong>sranan</strong></span>
                  <button class="ee-hint-try-btn" id="try-star-btn">Try Now &nearr;</button>
                </div>
              </div>
            </div>

            <!-- Hint 2 -->
            <div class="ee-hint-card">
              <div class="ee-hint-badge" style="color:#00f0ff; border-color:rgba(0,240,255,0.3);">📐 SECRET #2</div>
              <div class="ee-hint-content">
                <div class="ee-hint-name">Architect Blueprint CAD Mode</div>
                <p class="ee-hint-desc">Scan beneath the surface into technical CAD wireframes, component dimensions and grid layouts.</p>
                <div class="ee-hint-trigger-row">
                  <span class="ee-hint-code">Press key: <strong>B</strong> or type <strong>build</strong></span>
                  <button class="ee-hint-try-btn" id="try-blueprint-btn">Try Now &nearr;</button>
                </div>
              </div>
            </div>

            <!-- Hint 3 -->
            <div class="ee-hint-card">
              <div class="ee-hint-badge" style="color:#a855f7; border-color:rgba(168,85,247,0.3);">🎨 SECRET #3</div>
              <div class="ee-hint-content">
                <div class="ee-hint-name">Secret Aura Studio</div>
                <p class="ee-hint-desc">Unlock 5 custom luxury atmosphere color palettes across the entire website experience.</p>
                <div class="ee-hint-trigger-row">
                  <span class="ee-hint-code">Type: <strong>theme</strong> or <strong>aura</strong></span>
                  <button class="ee-hint-try-btn" id="try-theme-btn">Try Now &nearr;</button>
                </div>
              </div>
            </div>
          </div>

          <div class="ee-hints-footer">
            <span>You can type these anywhere on the page at any time.</span>
          </div>
        </div>
      `;
      document.body.appendChild(modal);

      modal.querySelector('.ee-hints-backdrop').addEventListener('click', closeHintsModal);
      modal.querySelector('#ee-hints-close').addEventListener('click', closeHintsModal);

      modal.querySelector('#try-star-btn').addEventListener('click', () => {
        closeHintsModal();
        setTimeout(triggerSurinameStar, 300);
      });

      modal.querySelector('#try-blueprint-btn').addEventListener('click', () => {
        closeHintsModal();
        setTimeout(() => toggleBlueprintMode(true), 300);
      });

      modal.querySelector('#try-theme-btn').addEventListener('click', () => {
        closeHintsModal();
        setTimeout(openThemeStudio, 300);
      });
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeHintsModal() {
    const modal = document.getElementById('ee-hints-modal');
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  /* ── 8. GLOBAL KEYBOARD & TRIGGER LISTENER ── */
  document.addEventListener('keydown', (e) => {
    const tag = e.target.tagName.toLowerCase();
    if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;

    if (e.key === 'Escape') {
      if (isBlueprintActive) {
        toggleBlueprintMode(false);
        return;
      }
      const themeModal = document.getElementById('ee-theme-studio');
      if (themeModal && themeModal.classList.contains('open')) {
        closeThemeStudio();
        return;
      }
      const hintsModal = document.getElementById('ee-hints-modal');
      if (hintsModal && hintsModal.classList.contains('open')) {
        closeHintsModal();
        return;
      }
    }

    // Single key 'b' shortcut for blueprint
    if ((e.key === 'b' || e.key === 'B') && !e.metaKey && !e.ctrlKey && !e.altKey) {
      toggleBlueprintMode();
      return;
    }

    // Accumulate word buffer
    if (e.key.length === 1 && /[a-zA-Z]/.test(e.key)) {
      buffer = (buffer + e.key.toLowerCase()).slice(-MAX_BUFFER);

      if (buffer.endsWith('suriname') || buffer.endsWith('sranan')) {
        buffer = '';
        triggerSurinameStar();
      } else if (buffer.endsWith('build') || buffer.endsWith('blueprint')) {
        buffer = '';
        toggleBlueprintMode();
      } else if (buffer.endsWith('theme') || buffer.endsWith('aura')) {
        buffer = '';
        openThemeStudio();
      } else if (buffer.endsWith('hints') || buffer.endsWith('secret') || buffer.endsWith('help')) {
        buffer = '';
        openHintsModal();
      }
    }
  });

  // Custom event listeners
  window.addEventListener('open-theme-studio', openThemeStudio);
  window.addEventListener('toggle-blueprint-mode', () => toggleBlueprintMode());
  window.addEventListener('trigger-suriname-star', triggerSurinameStar);
  window.addEventListener('open-hints-modal', openHintsModal);

  // Attach discreet footer click trigger for hints
  function attachFooterHintsTrigger() {
    // Look for footer-copyright elements across pages
    const footers = document.querySelectorAll('.footer-copyright');
    footers.forEach(p => {
      // Wrap or add a discreet clickable star
      if (!p.querySelector('.ee-footer-trigger')) {
        const span = document.createElement('span');
        span.className = 'ee-footer-trigger';
        span.title = '✦ Discover portfolio secrets';
        span.setAttribute('role', 'button');
        span.setAttribute('tabindex', '0');
        span.innerHTML = ' <span class="ee-footer-sparkle">✦</span>';
        span.addEventListener('click', (e) => {
          e.preventDefault();
          openHintsModal();
        });
        span.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openHintsModal();
          }
        });
        p.appendChild(span);
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    restoreSavedTheme();
    printConsoleHints();
    attachFooterHintsTrigger();
  });

})();

