/**
 * features.js
 * Powers: Status Widget, Currency Ticker, Audio Waveform,
 *         Specs Drawer, Device Mockup Switcher, Copy Email / vCard
 */

(function () {
  'use strict';

  /* ─── 1. STATUS WIDGET & PARAMARIBO TIME ─────────────────────────────── */
  function initStatusWidget() {
    const widget = document.getElementById('status-widget-time');
    if (!widget) return;

    function updateTime() {
      // Paramaribo is UTC-3 (no DST)
      const now = new Date();
      const pbo = new Date(now.toLocaleString('en-US', { timeZone: 'America/Paramaribo' }));
      const h = String(pbo.getHours()).padStart(2, '0');
      const m = String(pbo.getMinutes()).padStart(2, '0');
      widget.textContent = `${h}:${m}`;
    }
    updateTime();
    setInterval(updateTime, 30000);
  }

  /* ─── 2. LIVE CURRENCY TICKER ────────────────────────────────────────── */
  function initCurrencyTicker() {
    const tickerEl = document.getElementById('currency-ticker');
    if (!tickerEl) return;

    // Realistic SRD baseline rates (used as fallback + seeded for live feel)
    const SEED = { USD: 36.5, EUR: 39.8, BRL: 6.9 };

    function renderTicker(rates) {
      const pairs = [
        { label: 'USD/SRD', val: rates.USD },
        { label: 'EUR/SRD', val: rates.EUR },
        { label: 'BRL/SRD', val: rates.BRL },
      ];
      tickerEl.innerHTML = pairs.map(p => {
        const change = ((Math.random() - 0.48) * 0.08).toFixed(2);
        const up = parseFloat(change) >= 0;
        return `<span class="ticker-pair">
          <span class="ticker-label">${p.label}</span>
          <span class="ticker-value">${p.val.toFixed(2)}</span>
          <span class="ticker-change ${up ? 'up' : 'down'}">${up ? '▲' : '▼'} ${Math.abs(change)}</span>
        </span>`;
      }).join('<span class="ticker-sep">·</span>');
    }

    // Try free API (no key needed)
    fetch('https://open.er-api.com/v6/latest/SRD')
      .then(r => r.json())
      .then(data => {
        if (data && data.rates) {
          const r = data.rates;
          // API gives SRD as base → invert to get X/SRD
          const rates = {
            USD: r.USD ? (1 / r.USD) : SEED.USD,
            EUR: r.EUR ? (1 / r.EUR) : SEED.EUR,
            BRL: r.BRL ? (1 / r.BRL) : SEED.BRL,
          };
          renderTicker(rates);
        } else {
          renderTicker(SEED);
        }
      })
      .catch(() => renderTicker(SEED));
  }

  /* ─── 3. AUDIO WAVEFORM PLAYER (Cyberpad) ────────────────────────────── */
  function initAudioPlayer() {
    const btn = document.getElementById('audio-play-btn');
    const canvas = document.getElementById('audio-waveform');
    if (!btn || !canvas) return;

    const ctx2d = canvas.getContext('2d');
    let audioCtx = null;
    let isPlaying = false;
    let animFrame = null;
    let oscillators = [];
    let gainNode = null;
    let analyser = null;
    let startTime = 0;
    const DURATION = 5; // seconds

    // A minor pentatonic arpeggio freqs
    const NOTES = [220, 261.63, 329.63, 392, 440, 523.25];

    function drawIdle() {
      const W = canvas.width, H = canvas.height;
      ctx2d.clearRect(0, 0, W, H);
      ctx2d.strokeStyle = 'rgba(160, 80, 255, 0.35)';
      ctx2d.lineWidth = 1.5;
      ctx2d.beginPath();
      for (let x = 0; x < W; x++) {
        const y = H / 2 + Math.sin((x / W) * Math.PI * 6) * (H * 0.15);
        x === 0 ? ctx2d.moveTo(x, y) : ctx2d.lineTo(x, y);
      }
      ctx2d.stroke();
    }

    function drawLive() {
      const W = canvas.width, H = canvas.height;
      const bufLen = analyser.frequencyBinCount;
      const data = new Uint8Array(bufLen);
      analyser.getByteTimeDomainData(data);

      ctx2d.clearRect(0, 0, W, H);

      // Glow gradient
      const grad = ctx2d.createLinearGradient(0, 0, W, 0);
      grad.addColorStop(0, '#a050ff');
      grad.addColorStop(0.5, '#d4af37');
      grad.addColorStop(1, '#a050ff');

      ctx2d.strokeStyle = grad;
      ctx2d.lineWidth = 2;
      ctx2d.shadowColor = '#a050ff';
      ctx2d.shadowBlur = 8;
      ctx2d.beginPath();

      const sliceW = W / bufLen;
      let x = 0;
      for (let i = 0; i < bufLen; i++) {
        const v = data[i] / 128.0;
        const y = (v * H) / 2;
        i === 0 ? ctx2d.moveTo(x, y) : ctx2d.lineTo(x, y);
        x += sliceW;
      }
      ctx2d.stroke();
      ctx2d.shadowBlur = 0;

      // Progress bar
      const elapsed = audioCtx.currentTime - startTime;
      const progress = Math.min(elapsed / DURATION, 1);
      ctx2d.fillStyle = 'rgba(212, 175, 55, 0.25)';
      ctx2d.fillRect(0, H - 3, W * progress, 3);

      if (elapsed < DURATION) {
        animFrame = requestAnimationFrame(drawLive);
      } else {
        stopAudio();
      }
    }

    function stopAudio() {
      isPlaying = false;
      cancelAnimationFrame(animFrame);
      oscillators.forEach(o => { try { o.stop(); } catch (_) {} });
      oscillators = [];
      if (gainNode) gainNode.disconnect();
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><polygon points="5,3 19,12 5,21"/></svg> Preview Beat`;
      btn.classList.remove('playing');
      drawIdle();
    }

    function startAudio() {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();

      analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      gainNode = audioCtx.createGain();
      gainNode.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gainNode.connect(analyser);
      analyser.connect(audioCtx.destination);

      // Play arpeggiated chord with rhythm
      NOTES.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        osc.type = i % 2 === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        // Tremolo / rhythm
        const lfo = audioCtx.createOscillator();
        lfo.frequency.value = 4 + i * 0.5;
        const lfoGain = audioCtx.createGain();
        lfoGain.gain.value = 0.3;
        lfo.connect(lfoGain);
        lfoGain.connect(gainNode.gain);
        lfo.start();

        osc.connect(gainNode);
        osc.start(audioCtx.currentTime + i * 0.07);
        osc.stop(audioCtx.currentTime + DURATION);
        oscillators.push(osc);
      });

      isPlaying = true;
      startTime = audioCtx.currentTime;
      btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Playing…`;
      btn.classList.add('playing');
      drawLive();
    }

    btn.addEventListener('click', () => {
      isPlaying ? stopAudio() : startAudio();
    });

    drawIdle();
  }

  /* ─── 4. TECH SPECS DRAWER ───────────────────────────────────────────── */
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

  /* ─── 5. DEVICE MOCKUP SWITCHER ─────────────────────────────────────── */
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

  /* ─── 6. COPY EMAIL / vCARD ─────────────────────────────────────────── */
  function initContactActions() {
    // Copy email button
    const copyBtn = document.getElementById('copy-email-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText('w.mathoera@unasat.sr');
          copyBtn.classList.add('copied');
          copyBtn.querySelector('.copy-label').textContent = '✓ Copied!';
          setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.querySelector('.copy-label').textContent = 'Copy Email';
          }, 2500);
        } catch {
          // Fallback for file:// protocol
          const el = document.createElement('textarea');
          el.value = 'w.mathoera@unasat.sr';
          document.body.appendChild(el);
          el.select();
          document.execCommand('copy');
          el.remove();
          copyBtn.classList.add('copied');
          copyBtn.querySelector('.copy-label').textContent = '✓ Copied!';
          setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.querySelector('.copy-label').textContent = 'Copy Email';
          }, 2500);
        }
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

  /* ─── BOOT ───────────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', () => {
    initStatusWidget();
    initCurrencyTicker();
    initAudioPlayer();
    initSpecsDrawer();
    initMockupSwitcher();
    initContactActions();
  });
})();
