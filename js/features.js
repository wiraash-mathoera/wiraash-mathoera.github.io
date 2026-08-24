/**
 * features.js
 * Powers: Specs Drawer, Device Mockup Switcher, Copy Email & vCard
 */

(function () {
  'use strict';

  /* ── 1. TECH SPECS DRAWER ── */
  function initSpecsDrawer() {
    document.querySelectorAll('.specs-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const drawer = btn.closest('.project-bento-item, .bento-item')
          ?.querySelector('.specs-drawer');
        if (!drawer) return;
        const open = drawer.classList.toggle('open');
        btn.setAttribute('aria-expanded', open);
        btn.querySelector('.specs-toggle-icon').textContent = open ? '−' : '+';
      });
    });
  }

  /* ── 3. DEVICE MOCKUP SWITCHER ── */
  function initMockupSwitcher() {
    document.querySelectorAll('.mockup-toggle-group').forEach(group => {
      group.querySelectorAll('.mockup-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const wrapper = group.closest('.project-grid-inner')
            ?.querySelector('.project-image-wrapper');
          if (!wrapper) return;
          group.querySelectorAll('.mockup-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          const mode = btn.dataset.mode;
          wrapper.classList.toggle('mockup-mobile', mode === 'mobile');
        });
      });
    });
  }

  /* ── 4. COPY EMAIL / vCARD ── */
  function initContactActions() {
    // Copy email button
    const copyBtn = document.getElementById('copy-email-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        const email = 'w.mathoera@unasat.sr';
        try {
          await navigator.clipboard.writeText(email);
        } catch {
          const el = document.createElement('textarea');
          el.value = email;
          document.body.appendChild(el);
          el.select();
          document.execCommand('copy');
          el.remove();
        }
        copyBtn.classList.add('copied');
        copyBtn.querySelector('.copy-label').textContent = '✓ Copied!';
        setTimeout(() => {
          copyBtn.classList.remove('copied');
          copyBtn.querySelector('.copy-label').textContent = 'Copy Email';
        }, 2500);
      });
    }

    // Download vCard
    const vcardBtn = document.getElementById('download-vcard-btn');
    if (vcardBtn) {
      vcardBtn.addEventListener('click', () => {
        const vcf = [
          'BEGIN:VCARD',
          'VERSION:3.0',
          'FN:Wiraash Mathoera',
          'N:Mathoera;Wiraash;;;',
          'TITLE:Product Engineer & Digital Innovator',
          'ORG:SuriLine / SuriKoers / Cyberpad Studio',
          'EMAIL;type=INTERNET:w.mathoera@unasat.sr',
          'URL:https://github.com/wiraash-mathoera',
          'NOTE:Founder of SuriLine\\, SuriKoers\\, and Cyberpad Studio. Based in Paramaribo\\, Suriname.',
          'END:VCARD'
        ].join('\n');

        const blob = new Blob([vcf], { type: 'text/vcard' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'wiraash-mathoera.vcf';
        a.click();
        URL.revokeObjectURL(url);
      });
    }
  }

  /* ── BOOT ── */
  document.addEventListener('DOMContentLoaded', () => {
    initSpecsDrawer();
    initMockupSwitcher();
    initContactActions();
  });
})();
