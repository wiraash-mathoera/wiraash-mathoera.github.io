/**
 * command-menu.js
 * Spotlight-style command palette — triggered by ⌘K / Ctrl+K
 */

(function () {
  'use strict';

  const ITEMS = [
    // Navigation
    { type: 'page', icon: '🏠', label: 'Home', desc: 'Go to homepage', action: () => { window.location.href = './index.html'; } },
    { type: 'page', icon: '🛠️', label: 'Work & Projects', desc: 'See all projects', action: () => { window.location.href = './work.html'; } },
    { type: 'page', icon: '👤', label: 'About', desc: 'Biography & background', action: () => { window.location.href = './about.html'; } },
    { type: 'page', icon: '✉️', label: 'Contact', desc: 'Get in touch', action: () => { window.location.href = './contact.html'; } },
    // Projects
    { type: 'project', icon: '🗺️', label: 'SuriLine', desc: 'Digital directory for Suriname', action: () => { window.open('https://suriline.vercel.app/', '_blank'); } },
    { type: 'project', icon: '💱', label: 'SuriKoers', desc: 'Live exchange rates — Suriname', action: () => { window.open('https://whatsapp.com/channel/0029VbCgk0QAe5ViNQCmtB3d', '_blank'); } },
    { type: 'project', icon: '🎵', label: 'Cyberpad Studio', desc: 'Online beat studio & collaboration', action: () => { window.open('https://cyberpad-studio.vercel.app/html/login.html', '_blank'); } },
    // Contact
    { type: 'contact', icon: '📋', label: 'Copy Email', desc: 'w.mathoera@unasat.sr', action: copyEmail },
    { type: 'contact', icon: '🐙', label: 'GitHub Profile', desc: 'View repositories', action: () => { window.open('https://github.com/wiraash-mathoera', '_blank'); } },
    { type: 'contact', icon: '💼', label: 'LinkedIn', desc: 'Professional profile', action: () => { window.open('https://www.linkedin.com/in/wiraash-mathoera-642bb9243/', '_blank'); } },
  ];

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText('w.mathoera@unasat.sr');
    } catch {
      const el = document.createElement('textarea');
      el.value = 'w.mathoera@unasat.sr';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      el.remove();
    }
    showCopied();
  }

  function showCopied() {
    const toast = document.getElementById('cmd-copy-toast');
    if (!toast) return;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
  }

  /* ── Build DOM ── */
  function buildMenu() {
    // Overlay backdrop
    const overlay = document.createElement('div');
    overlay.id = 'cmd-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = `
      <div id="cmd-panel" role="dialog" aria-modal="true" aria-label="Command menu">
        <div id="cmd-search-row">
          <svg id="cmd-search-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input id="cmd-input" type="text" placeholder="Search pages, projects, actions…" autocomplete="off" spellcheck="false">
          <kbd id="cmd-esc-key">ESC</kbd>
        </div>
        <div id="cmd-results"></div>
        <div id="cmd-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
          <span><kbd>↵</kbd> Select</span>
          <span><kbd>ESC</kbd> Close</span>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);

    // Copy toast
    const toast = document.createElement('div');
    toast.id = 'cmd-copy-toast';
    toast.textContent = '✓ Email copied to clipboard';
    document.body.appendChild(toast);

    return overlay;
  }

  function renderResults(query, overlay) {
    const resultsEl = document.getElementById('cmd-results');
    if (!resultsEl) return;

    const q = query.toLowerCase().trim();
    const filtered = q
      ? ITEMS.filter(i =>
          i.label.toLowerCase().includes(q) ||
          i.desc.toLowerCase().includes(q) ||
          i.type.toLowerCase().includes(q)
        )
      : ITEMS;

    if (filtered.length === 0) {
      resultsEl.innerHTML = '<p class="cmd-empty">No results found.</p>';
      return;
    }

    // Group by type
    const groups = {};
    const typeLabels = { page: 'Pages', project: 'Projects', contact: 'Connect' };
    filtered.forEach(item => {
      if (!groups[item.type]) groups[item.type] = [];
      groups[item.type].push(item);
    });

    let html = '';
    let globalIdx = 0;
    Object.entries(groups).forEach(([type, items]) => {
      html += `<div class="cmd-group-label">${typeLabels[type] || type}</div>`;
      items.forEach(item => {
        html += `<button class="cmd-item" data-idx="${globalIdx}" tabindex="-1">
          <span class="cmd-item-icon">${item.icon}</span>
          <span class="cmd-item-text">
            <span class="cmd-item-label">${item.label}</span>
            <span class="cmd-item-desc">${item.desc}</span>
          </span>
          <svg class="cmd-item-arrow" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>`;
        globalIdx++;
      });
    });

    resultsEl.innerHTML = html;

    // Attach click handlers
    let clickIdx = 0;
    Object.entries(groups).forEach(([, items]) => {
      items.forEach(item => {
        const btn = resultsEl.querySelector(`[data-idx="${clickIdx}"]`);
        if (btn) {
          btn.addEventListener('click', () => { item.action(); closeMenu(overlay); });
        }
        clickIdx++;
      });
    });

    // Highlight first
    highlightItem(0, overlay);
  }

  let currentHighlight = 0;

  function highlightItem(idx, overlay) {
    const items = document.querySelectorAll('.cmd-item');
    if (!items.length) return;
    const clamped = Math.max(0, Math.min(idx, items.length - 1));
    items.forEach(i => i.classList.remove('highlighted'));
    items[clamped]?.classList.add('highlighted');
    items[clamped]?.scrollIntoView({ block: 'nearest' });
    currentHighlight = clamped;
  }

  function openMenu(overlay) {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    currentHighlight = 0;
    const input = document.getElementById('cmd-input');
    if (input) {
      input.value = '';
      setTimeout(() => input.focus(), 50);
      renderResults('', overlay);
      input.addEventListener('input', () => {
        currentHighlight = 0;
        renderResults(input.value, overlay);
      });
    }
  }

  function closeMenu(overlay) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ── Init ── */
  document.addEventListener('DOMContentLoaded', () => {
    const overlay = buildMenu();
    const panel = document.getElementById('cmd-panel');

    // Keyboard shortcut
    document.addEventListener('keydown', e => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        overlay.classList.contains('open') ? closeMenu(overlay) : openMenu(overlay);
        return;
      }
      if (!overlay.classList.contains('open')) return;

      if (e.key === 'Escape') { closeMenu(overlay); return; }

      const items = document.querySelectorAll('.cmd-item');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        highlightItem(currentHighlight + 1, overlay);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        highlightItem(currentHighlight - 1, overlay);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        items[currentHighlight]?.click();
      }
    });

    // Close on backdrop click
    overlay.addEventListener('click', e => {
      if (!panel.contains(e.target)) closeMenu(overlay);
    });

    // ESC button
    document.getElementById('cmd-esc-key')?.addEventListener('click', () => closeMenu(overlay));

    // Trigger pill in navbar (if present)
    document.getElementById('cmd-trigger-pill')?.addEventListener('click', () => openMenu(overlay));
  });
})();
