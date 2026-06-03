'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  initNavbar();
  initTypewriter();
  initScrollReveal();
  initStatCounters();
  initSkillBars();
  initCursorGlow();
  initHolographicCards();
  initPortfolioTabs();
});

/* 1. PARTICLES */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;
  const COUNT = W < 768 ? 45 : 90;
  const particles = [];
  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.size = Math.random() * 2.2 + 0.3;
      this.speedY = -(Math.random() * 0.5 + 0.15);
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.55 + 0.1;
      this.opacityDir = (Math.random() - 0.5) * 0.008;
      const colors = ['168,85,247','110,53,216','192,132,252','103,232,249','216,180,254'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.pulse = Math.random() * Math.PI * 2;
    }
    update() {
      this.y += this.speedY; this.x += this.speedX;
      this.opacity += this.opacityDir; this.pulse += 0.03;
      if (this.opacity > 0.7 || this.opacity < 0.05) this.opacityDir *= -1;
      if (this.y < -10 || this.x < -10 || this.x > W + 10) this.reset();
    }
    draw() {
      const p = 1 + Math.sin(this.pulse) * 0.3;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * p, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
      ctx.shadowBlur = 10; ctx.shadowColor = `rgba(${this.color},0.4)`;
      ctx.fill(); ctx.shadowBlur = 0;
    }
  }
  for (let i = 0; i < COUNT; i++) particles.push(new Particle());
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i+1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 120) {
          ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(168,85,247,${(1-d/120)*0.12})`; ctx.lineWidth = 0.5; ctx.stroke();
        }
      }
    }
  }
  function animate() {
    ctx.clearRect(0, 0, W, H); drawLines();
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }
  animate();
  window.addEventListener('resize', () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; });
}

/* 2. NAVBAR */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}

/* 3. TYPEWRITER */
function initTypewriter() {
  const el = document.getElementById('typedText');
  if (!el) return;
  const words = ['Filmmaker','Video Editor','Content Creator','Motion Designer'];
  let wi = 0, ci = 0, del = false, delay = 120;
  function type() {
    const w = words[wi];
    el.textContent = del ? w.substring(0, ci-1) : w.substring(0, ci+1);
    del ? ci-- : ci++;
    delay = del ? 70 : 130;
    if (!del && ci === w.length) { delay = 1800; del = true; }
    else if (del && ci === 0) { del = false; wi = (wi+1)%words.length; delay = 400; }
    setTimeout(type, delay);
  }
  type();
}

/* 4. SCROLL REVEAL */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
}

/* 5. STAT COUNTERS */
function initStatCounters() {
  const els = document.querySelectorAll('.stat-number[data-target]');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        let cur = 0;
        const step = target / (1800/16);
        const t = setInterval(() => {
          cur += step;
          if (cur >= target) { cur = target; clearInterval(t); }
          el.textContent = Math.floor(cur) + suffix;
        }, 16);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  els.forEach(el => obs.observe(el));
}

/* 6. SKILL BARS */
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('animated'); obs.unobserve(e.target); } });
  }, { threshold: 0.3 });
  fills.forEach(f => obs.observe(f));
}

/* 7. PORTFOLIO TABS */
function initPortfolioTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');
  if (!tabs.length) return;
  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.tab;
      const panel = document.getElementById('tab-' + target);
      if (panel) panel.classList.add('active');
    });
  });
}

/* 8. VIDEO MODAL */
function openModal(videoId, title) {
  const modal = document.getElementById('video-modal');
  const iframe = document.getElementById('modalIframe');
  if (!modal || !iframe) return;
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  const modal = document.getElementById('video-modal');
  const iframe = document.getElementById('modalIframe');
  if (!modal || !iframe) return;
  modal.classList.remove('open');
  iframe.src = '';
  document.body.style.overflow = '';
}
function closeModalOutside(e) {
  if (e.target === document.getElementById('video-modal')) closeModal();
}

/* 9. LIGHTBOX */
function openLightbox(src, cat, title) {
  document.getElementById('lbImg').src = src;
  document.getElementById('lbCat').textContent = cat.toUpperCase();
  document.getElementById('lbTitle').textContent = title;
  document.getElementById('portfolioLightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  document.getElementById('portfolioLightbox').classList.remove('open');
  document.getElementById('lbImg').src = '';
  document.body.style.overflow = '';
}
function closeLBOutside(e) {
  if (e.target === document.getElementById('portfolioLightbox')) closeLightbox();
}

/* 10. CONTACT FORM */
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('.form-submit');
  const succ = document.getElementById('formSuccess');
  if (!btn) return;
  btn.textContent = 'Transmitting...'; btn.disabled = true;
  setTimeout(() => {
    e.target.style.display = 'none';
    if (succ) succ.style.display = 'block';
    setTimeout(() => {
      e.target.reset(); e.target.style.display = '';
      if (succ) succ.style.display = 'none';
      btn.innerHTML = '<i class="fa-regular fa-paper-plane" style="margin-right:10px;"></i> Transmit Message';
      btn.disabled = false;
    }, 4000);
  }, 1600);
}

/* 11. MOBILE NAV */
function toggleMobileNav() {
  const nav = document.getElementById('mobileNav');
  const ham = document.getElementById('hamburger');
  if (!nav) return;
  const isOpen = nav.classList.toggle('open');
  if (ham) ham.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}
function closeMobileNav() {
  const nav = document.getElementById('mobileNav');
  const ham = document.getElementById('hamburger');
  if (!nav) return;
  nav.classList.remove('open');
  if (ham) ham.classList.remove('open');
  document.body.style.overflow = '';
}

/* 12. CURSOR GLOW */
function initCursorGlow() {
  if (window.innerWidth < 768) return;
  const glow = document.createElement('div');
  glow.style.cssText = 'position:fixed;pointer-events:none;z-index:9998;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(168,85,247,0.06) 0%,transparent 70%);transform:translate(-50%,-50%);transition:opacity 0.3s ease;top:0;left:0;';
  document.body.appendChild(glow);
  let mx=0,my=0,cx=0,cy=0;
  document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; }, { passive:true });
  function animate() { cx+=(mx-cx)*0.1; cy+=(my-cy)*0.1; glow.style.left=cx+'px'; glow.style.top=cy+'px'; requestAnimationFrame(animate); }
  animate();
}

/* 13. HOLO CARD TILT */
function initHolographicCards() {
  if (window.innerWidth < 768) return;
  document.querySelectorAll('.video-card,.portfolio-card,.stat-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const rx = ((e.clientY - r.top - r.height/2) / (r.height/2)) * 6;
      const ry = ((e.clientX - r.left - r.width/2) / (r.width/2)) * -6;
      card.style.transform = `translateY(-10px) scale(1.01) perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
}

/* 14. SCROLL PROGRESS */
(function() {
  const bar = document.createElement('div');
  bar.style.cssText = 'position:fixed;top:0;left:0;height:2px;width:0%;background:linear-gradient(90deg,#6E35D8,#A855F7,#67E8F9);z-index:9999;transition:width 0.1s linear;box-shadow:0 0 10px rgba(168,85,247,0.8);';
  document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / total * 100) + '%';
  }, { passive:true });
})();

/* 15. BG ANIMATE */
(function() {
  let hue=260, dir=1;
  function shift() { hue+=dir*0.05; if(hue>280||hue<240) dir*=-1; document.documentElement.style.setProperty('--purple-elec',`hsl(${hue},72%,52%)`); requestAnimationFrame(shift); }
  shift();
})();

/* 16. REVEAL HERO ON LOAD */
window.addEventListener('load', () => {
  document.querySelectorAll('#hero .reveal, .page-hero .reveal').forEach(el => el.classList.add('visible'));
});

/* ESC closes modals */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeModal(); if(typeof closeLightbox==='function') closeLightbox(); }
});
