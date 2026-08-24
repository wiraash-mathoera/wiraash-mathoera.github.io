/**
 * easter-eggs.js
 * Hidden surprises for the curious visitor. — W
 *
 * Eggs:
 *   A) Konami Code       → golden particle burst + toast
 *   B) DevTools Console  → styled ASCII greeting
 *   C) Logo click x5     → cyan accent mode flash + toast
 *   D) Hero name hover   → glitch text animation
 *   E) Footer click x3   → Suriname pride popup
 */

(function () {
  'use strict';

  // ─── Shared Helpers ────────────────────────────────────────────────────────

  /** Creates or returns the toast element */
  function getToast() {
    let t = document.getElementById('ee-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'ee-toast';
      document.body.appendChild(t);
    }
    return t;
  }

  /** Show a toast with optional icon and auto-hide after duration ms */
  function showToast(message, icon = '✦', duration = 3500) {
    const toast = getToast();
    toast.innerHTML = `<span class="ee-toast-icon">${icon}</span>${message}`;
    toast.classList.add('show');
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => toast.classList.remove('show'), duration);
  }

  // ─── Egg A: Konami Code ────────────────────────────────────────────────────

  const KONAMI = [
    'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
    'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
    'b','a'
  ];
  let konamiIdx = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key === KONAMI[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === KONAMI.length) {
        konamiIdx = 0;
        fireKonamiEgg();
      }
    } else {
      konamiIdx = e.key === KONAMI[0] ? 1 : 0;
    }
  });

  function fireKonamiEgg() {
    const canvas = document.createElement('canvas');
    canvas.id = 'ee-particle-canvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const particles = [];
    const COLORS = ['#d4af37', '#00c8b4', '#a050ff', '#ff6b6b', '#fdfcfb', '#d97706'];

    for (let i = 0; i < 180; i++) {
      particles.push({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.5) * 18,
        alpha: 1,
        radius: Math.random() * 5 + 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        gravity: Math.random() * 0.25 + 0.1,
        decay: Math.random() * 0.015 + 0.01,
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach(p => {
        if (p.alpha <= 0) return;
        alive = true;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.alpha -= p.decay;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;

        // Glow
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      });

      if (alive) {
        requestAnimationFrame(animate);
      } else {
        canvas.remove();
      }
    }
    animate();

    showToast('You found the Konami Code. Respect. — W', '🎮', 4000);
  }

  // ─── Egg B: DevTools Console Message ──────────────────────────────────────

  const CSS_TITLE = [
    'color: #d4af37',
    'font-size: 18px',
    'font-weight: bold',
    'font-family: monospace',
  ].join(';');

  const CSS_BODY = [
    'color: #a39c93',
    'font-size: 12px',
    'font-family: monospace',
    'line-height: 1.6',
  ].join(';');

  const CSS_GOLD = [
    'color: #d4af37',
    'font-size: 12px',
    'font-weight: bold',
    'font-family: monospace',
  ].join(';');

  console.log(
    '\n%c  W · M  \n',
    'background:#d4af37;color:#100f0d;font-size:22px;font-weight:900;font-family:monospace;padding:6px 18px;border-radius:6px;'
  );
  console.log('%cHey, curious one 👋', CSS_TITLE);
  console.log(
    '%cYou found the console. Nice.\n\nI\'m Wiraash — product engineer, builder, and digital\ninnovator based in Suriname 🇸🇷\n\nThis site is hand-crafted with HTML, CSS & vanilla JS.\nNo frameworks. No build tools. Just craft.\n',
    CSS_BODY
  );
  console.log('%c→ github.com/wiraash-mathoera', CSS_GOLD);
  console.log('%c→ linkedin.com/in/wiraash-mathoera-642bb9243', CSS_GOLD);
  console.log(' ');

  // ─── Egg C: Logo Click x5 — Cyan Accent Mode ──────────────────────────────

  const navLogo = document.getElementById('nav-logo');
  if (navLogo) {
    let logoClicks = 0;
    let logoTimer = null;
    let cyanActive = false;

    navLogo.addEventListener('click', (e) => {
      // Only trigger if it's NOT navigating (i.e., fast rapid clicks)
      logoClicks++;
      clearTimeout(logoTimer);
      logoTimer = setTimeout(() => { logoClicks = 0; }, 1500);

      if (logoClicks >= 5) {
        logoClicks = 0;
        e.preventDefault();

        if (cyanActive) {
          document.body.classList.remove('ee-cyan-mode');
          cyanActive = false;
          showToast('Back to gold. That\'s the real you. — W', '✦', 3000);
        } else {
          document.body.classList.add('ee-cyan-mode');
          cyanActive = true;
          showToast('Okay okay, you got me. Cyan mode unlocked. — W', '💙', 3500);
        }
      }
    });
  }

  // ─── Egg D: Hero Name Hover Glitch ────────────────────────────────────────

  const heroName = document.getElementById('hero-name');
  if (heroName) {
    // Store the full text content for the pseudo-element data attribute
    heroName.setAttribute('data-text', heroName.textContent.trim());

    let glitchCooldown = false;

    heroName.addEventListener('mouseenter', () => {
      if (glitchCooldown) return;
      glitchCooldown = true;

      // Refresh data-text in case of DOM changes
      heroName.setAttribute('data-text', heroName.textContent.trim());
      heroName.classList.add('ee-glitch-active');

      // Remove after animation completes (3 iterations × 0.4s = 1.2s)
      setTimeout(() => {
        heroName.classList.remove('ee-glitch-active');
        // Cooldown: prevent re-trigger for 1s after finishing
        setTimeout(() => { glitchCooldown = false; }, 1000);
      }, 1300);
    });
  }

  // ─── Egg E: Footer "Made in Suriname" Click x3 ────────────────────────────

  const footerMadeIn = document.getElementById('footer-made-in');
  if (footerMadeIn) {
    let footerClicks = 0;
    let footerTimer = null;

    // Create the flag popup element
    const flagPopup = document.createElement('div');
    flagPopup.id = 'ee-flag-popup';
    flagPopup.textContent = '🇸🇷 Proud to build from Suriname.';
    document.body.appendChild(flagPopup);

    footerMadeIn.style.cursor = 'default';
    footerMadeIn.style.userSelect = 'none';

    footerMadeIn.addEventListener('click', () => {
      footerClicks++;
      clearTimeout(footerTimer);
      footerTimer = setTimeout(() => { footerClicks = 0; }, 2000);

      if (footerClicks >= 3) {
        footerClicks = 0;
        flagPopup.classList.add('show');
        setTimeout(() => flagPopup.classList.remove('show'), 3500);
      }
    });
  }

})();
