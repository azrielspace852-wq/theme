/* =========================================================
   Special For Zura — interaksi & animasi
   AXION Neuralis & AZRIEL SPACE
   ========================================================= */
(function () {
  "use strict";

  /* ---------- util ---------- */
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  /* sentral timer (A5) */
  var timers = [];
  function later(fn, ms) { var t = setTimeout(fn, ms); timers.push(t); return t; }
  function clearAllTimers() { timers.forEach(clearTimeout); timers = []; }

  var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- tanggal di nav (format Indonesia) ---------- */
  try {
    var navDate = $("#navDate");
    if (navDate) {
      navDate.textContent = new Date().toLocaleDateString("id-ID", {
        weekday: "long", day: "numeric", month: "long", year: "numeric"
      });
    }
  } catch (e) { /* abaikan */ }

  /* ---------- LOADER ---------- */
  var loader = $("#loader");
  function hideLoader() {
    later(function () { if (loader) loader.classList.add("hidden"); }, reducedMotion ? 100 : 900);
  }
  if (document.readyState === "complete") hideLoader();
  else window.addEventListener("load", hideLoader);
  later(hideLoader, 3500); // fallback maksimal

  /* ---------- CANVAS: kelopak / hati melayang ---------- */
  var canvas = $("#petals");
  var ctx = canvas ? canvas.getContext("2d") : null;
  var petals = [];
  var rafPetals = null;
  var COLORS = ["rgba(232,164,184,", "rgba(212,175,106,", "rgba(245,198,208,", "rgba(200,150,180,"];

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  function makePetal(burst) {
    return {
      x: burst ? burst.x : Math.random() * canvas.width,
      y: burst ? burst.y : -20 - Math.random() * canvas.height * 0.3,
      r: 3 + Math.random() * 6,
      vx: (Math.random() - 0.5) * (burst ? 6 : 0.6),
      vy: burst ? (Math.random() - 0.7) * 7 : 0.3 + Math.random() * 0.7,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.01 + Math.random() * 0.02,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 0.5 + Math.random() * 0.5,
      life: 1,
      decay: burst ? 0.008 + Math.random() * 0.012 : 0,
      rot: Math.random() * Math.PI,
      rotSpeed: (Math.random() - 0.5) * 0.04,
      burst: !!burst
    };
  }

  function drawHeart(c, x, y, size, rot) {
    c.save();
    c.translate(x, y);
    c.rotate(rot);
    c.beginPath();
    var s = size / 14;
    c.moveTo(0, 5 * s);
    c.bezierCurveTo(-9 * s, -3 * s, -5 * s, -10 * s, 0, -5 * s);
    c.bezierCurveTo(5 * s, -10 * s, 9 * s, -3 * s, 0, 5 * s);
    c.fill();
    c.restore();
  }

  function initPetals() {
    if (!ctx || reducedMotion) return;
    petals = [];
    var count = Math.min(40, Math.floor(window.innerWidth / 28));
    for (var i = 0; i < count; i++) {
      var p = makePetal(null);
      p.y = Math.random() * canvas.height; // sebar di seluruh layar saat init
      petals.push(p);
    }
  }

  function loopPetals() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = petals.length - 1; i >= 0; i--) {
      var p = petals[i];
      p.sway += p.swaySpeed;
      p.x += p.vx + Math.sin(p.sway) * 0.5;
      p.y += p.vy;
      p.rot += p.rotSpeed;
      if (p.burst) {
        p.vy += 0.08; // gravitasi lembut
        p.life -= p.decay;
        if (p.life <= 0) { petals.splice(i, 1); continue; }
      } else if (p.y > canvas.height + 30) {
        petals[i] = makePetal(null); // daur ulang
        continue;
      }
      ctx.globalAlpha = p.alpha * (p.burst ? p.life : 1);
      ctx.fillStyle = p.color + "1)";
      drawHeart(ctx, p.x, p.y, p.r * 2, p.rot);
    }
    ctx.globalAlpha = 1;
    rafPetals = requestAnimationFrame(loopPetals);
  }

  initPetals();
  if (!reducedMotion) loopPetals();

  /* ---------- burst hati dari tombol ---------- */
  function heartBurst(x, y) {
    if (reducedMotion) return;
    for (var i = 0; i < 46; i++) petals.push(makePetal({ x: x, y: y }));
  }

  var burstBtn = $("#burstBtn");
  if (burstBtn) {
    burstBtn.addEventListener("click", function (e) {
      var rect = burstBtn.getBoundingClientRect();
      heartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
      burstBtn.textContent = "Untukmu, selalu.";
      later(function () { burstBtn.textContent = "Rayakan sebentar"; }, 2600);
    });
  }

  /* ---------- REVEAL ON SCROLL ---------- */
  var revealEls = $$(".reveal");
  if ("IntersectionObserver" in window && !reducedMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* ---------- TYPEWRITER surat ---------- */
  var LETTER_TEXT =
    "Zura,\n\n" +
    "Ada kalanya aku diam bukan karena tak ada kata, tapi karena terlalu banyak yang ingin aku ucapkan. " +
    "Sejak mengenalmu, hari-hariku terasa sedikit lebih berwarna. Senyummu adalah hal pertama yang aku ingat di pagi hari, " +
    "dan namamu adalah hal terakhir yang aku bisikkan sebelum tidur.\n\n" +
    "Aku tidak pandai merangkai kata-kata indah. Tapi izinkan aku mengatakan satu hal: kamu berarti lebih dari sekadar kata-kata. " +
    "Dan hari ini… ada sesuatu yang ingin aku rayakan bersamamu.";

  var twEl = $("#typewriter");
  var twStarted = false;
  var twRaf = null;

  function startTypewriter() {
    if (twStarted || !twEl) return;
    twStarted = true;
    if (reducedMotion) { twEl.textContent = LETTER_TEXT; return; }
    var i = 0;
    var start = performance.now();
    var speed = 38; // ms per karakter
    function frame(now) {
      if (i >= LETTER_TEXT.length) { twRaf = null; return; }
      if (now - start >= speed) {
        start = now;
        twEl.textContent = LETTER_TEXT.slice(0, ++i);
      }
      twRaf = requestAnimationFrame(frame);
    }
    twRaf = requestAnimationFrame(frame);
  }

  /* mulai typewriter saat section letter terlihat */
  var letterSection = $("#letter");
  if (letterSection && "IntersectionObserver" in window) {
    var ioTw = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) { startTypewriter(); ioTw.disconnect(); }
    }, { threshold: 0.25 });
    ioTw.observe(letterSection);
  } else {
    later(startTypewriter, 1200);
  }

  /* ---------- ENVELOPE: buka saat diklik ---------- */
  var envelope = $("#envelope");
  var envelopeWrap = $("#envelopeWrap");
  var scrollHint = $(".scroll-hint");
  var envOpened = false;

  function openEnvelope() {
    if (envOpened || !envelope) return;
    envOpened = true;
    envelope.classList.add("open");
    if (envelopeWrap) envelopeWrap.classList.add("opened");
    if (scrollHint) scrollHint.classList.add("show");
    // burst kecil dari amplop
    var rect = envelope.getBoundingClientRect();
    heartBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
    // setelah surat terangkat, gulir halus ke section surat
    later(function () {
      var target = $("#letter");
      if (target) target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
      later(startTypewriter, 700);
    }, 1300);
  }

  if (envelope) {
    envelope.addEventListener("click", openEnvelope);
    envelope.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openEnvelope(); }
    });
  }

  /* ---------- bersihkan saat halaman ditutup ---------- */
  window.addEventListener("beforeunload", function () {
    if (twRaf) cancelAnimationFrame(twRaf);
    if (rafPetals) cancelAnimationFrame(rafPetals);
    clearAllTimers();
  });
})();
