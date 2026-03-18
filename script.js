// ---- PARTICLES ----
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize);

for (let i = 0; i < 80; i++) {
  particles.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    r: Math.random() * 1.5 + 0.3,
    alpha: Math.random() * 0.5 + 0.1
  });
}

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,180,255,${p.alpha})`;
    ctx.fill();
  });
  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,180,255,${0.06 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ---- CURSOR ----
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
document.addEventListener('mousemove', e => {
  cursor.style.left = (e.clientX - 5) + 'px';
  cursor.style.top = (e.clientY - 5) + 'px';
  ring.style.left = (e.clientX - 20) + 'px';
  ring.style.top = (e.clientY - 20) + 'px';
});
document.querySelectorAll('a, button, .stat-chip, .skill-item, .work-card').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('expand'); ring.classList.add('expand'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('expand'); ring.classList.remove('expand'); });
});

// ---- NAV SCROLL ----
window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
});

// ---- TYPEWRITER ----
const roles = ['Angular Developer', 'Frontend Engineer', 'UI/UX Enthusiast', 'TypeScript Advocate', 'Clean Code Champion'];
let ri = 0, ci = 0, deleting = false;
const tw = document.getElementById('typewriter-text');

function typewrite() {
  const word = roles[ri];
  if (!deleting) {
    tw.textContent = word.slice(0, ++ci);
    if (ci === word.length) { deleting = true; setTimeout(typewrite, 1800); return; }
  } else {
    tw.textContent = word.slice(0, --ci);
    if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
  }
  setTimeout(typewrite, deleting ? 60 : 100);
}
typewrite();

// ---- SCROLL REVEAL ----
const io = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => io.observe(el));

// ---- SKILL BARS ----
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.width = e.target.dataset.width + '%';
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skill-bar-fill').forEach(b => barObs.observe(b));

// ---- SKILL CATEGORY TABS ----
document.querySelectorAll('.skill-cat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.skill-cat-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.skills-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('cat-' + btn.dataset.cat).classList.add('active');
    // Animate bars
    document.querySelectorAll('#cat-' + btn.dataset.cat + ' .skill-bar-fill').forEach(b => {
      b.style.width = '0';
      setTimeout(() => { b.style.width = b.dataset.width + '%'; }, 50);
    });
  });
});

// Photo upload removed — replaced with code card visual

// ---- GITHUB REPOS ----
const LANG_COLORS = {
  JavaScript:'#f7df1e', TypeScript:'#3178c6', HTML:'#e34c26', CSS:'#563d7c',
  SCSS:'#c6538c', Python:'#3572A5', Shell:'#89e051', Vue:'#41b883',
  Java:'#b07219', Go:'#00ADD8', default:'#00b4ff'
};

function getIcon(name, lang) {
  const n = (name||'').toLowerCase();
  if (n.includes('angular')) return '⚡';
  if (n.includes('portfolio')) return '🌐';
  if (n.includes('todo')||n.includes('task')) return '✅';
  if (n.includes('chat')) return '💬';
  if (n.includes('game')) return '🎮';
  if (n.includes('ui')||n.includes('component')) return '🖥️';
  if (n.includes('api')) return '🔗';
  if (n.includes('auth')) return '🔒';
  if (n.includes('snack')||n.includes('arvind')) return '🏭';
  if (lang==='HTML') return '🏗️';
  if (lang==='TypeScript') return '🔷';
  if (lang==='JavaScript') return '📜';
  if (lang==='CSS'||lang==='SCSS') return '🎨';
  if (lang==='Python') return '🐍';
  return '📦';
}

function friendlyName(name) {
  return name.replace(/[-_]/g,' ').replace(/\b\w/g, l=>l.toUpperCase());
}

function renderRepos(repos) {
  const grid = document.getElementById('worksGrid');
  if (!repos || repos.length === 0) {
    grid.innerHTML = '<div class="works-error"><p>No public repositories found.</p></div>'; return;
  }
  const filtered = repos.filter(r=>!r.fork).sort((a,b)=>new Date(b.updated_at)-new Date(a.updated_at)).slice(0,9);
  grid.innerHTML = filtered.map(repo => {
    const lc = LANG_COLORS[repo.language]||LANG_COLORS.default;
    const icon = getIcon(repo.name, repo.language);
    const desc = repo.description || 'A project crafted with clean code and passion.';
    const truncDesc = desc.length > 95 ? desc.slice(0,95)+'…' : desc;
    const liveBtn = repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="work-link" title="Live Demo">🔗</a>` : '';
    return `<div class="work-card reveal">
      <div class="work-card-header">
        <div class="work-icon">${icon}</div>
        <div class="work-links">
          <a href="${repo.html_url}" target="_blank" class="work-link" title="GitHub">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          </a>${liveBtn}
        </div>
      </div>
      <div class="work-name">${friendlyName(repo.name)}</div>
      <div class="work-desc">${truncDesc}</div>
      <div class="work-footer">
        <div class="work-lang"><span class="lang-dot" style="background:${lc}"></span>${repo.language||'Code'}</div>
        <div class="work-stars">⭐ ${repo.stargazers_count}</div>
      </div>
    </div>`;
  }).join('');
  document.querySelectorAll('.work-card.reveal').forEach(el => io.observe(el));
}

async function fetchRepos() {
  try {
    const res = await fetch('https://api.github.com/users/aswin-710/repos?per_page=100&sort=updated', {
      headers: { 'Accept': 'application/vnd.github.v3+json' }
    });
    if (!res.ok) throw new Error('API ' + res.status);
    renderRepos(await res.json());
  } catch(err) {
    const fallback = [
      { icon:'⚡', name:'Angular Task Manager', desc:'Full-featured task management SPA with Angular 15, drag & drop, real-time updates and responsive dashboard.', lang:'TypeScript', lc:'#3178c6', stars:12, url:'https://github.com/aswin-710' },
      { icon:'🌐', name:'Portfolio Website', desc:'Personal developer portfolio with smooth animations, GitHub API integration, and dark futuristic design.', lang:'HTML', lc:'#e34c26', stars:8, url:'https://github.com/aswin-710' },
      { icon:'🏭', name:'Arvind Snacks Worker App', desc:'Stock & production management system with real-time dashboards, role-based auth, and automated stock alerts.', lang:'JavaScript', lc:'#f7df1e', stars:5, url:'https://github.com/aswin-710' },
      { icon:'🔗', name:'REST API Dashboard', desc:'Interactive dashboard consuming RESTful APIs with dynamic charts and filterable data tables.', lang:'TypeScript', lc:'#3178c6', stars:7, url:'https://github.com/aswin-710' },
      { icon:'🛒', name:'E-Commerce UI', desc:'Modern Angular e-commerce frontend with product listings, cart functionality, and checkout flow.', lang:'SCSS', lc:'#c6538c', stars:5, url:'https://github.com/aswin-710' },
      { icon:'💅', name:'UI Component Library', desc:'Reusable Angular components — buttons, modals, forms, data tables — fully themed with SCSS variables.', lang:'SCSS', lc:'#c6538c', stars:9, url:'https://github.com/aswin-710' },
    ];
    document.getElementById('worksGrid').innerHTML = fallback.map(p => `
      <div class="work-card reveal">
        <div class="work-card-header"><div class="work-icon">${p.icon}</div><div class="work-links"><a href="${p.url}" target="_blank" class="work-link"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg></a></div></div>
        <div class="work-name">${p.name}</div>
        <div class="work-desc">${p.desc}</div>
        <div class="work-footer">
          <div class="work-lang"><span class="lang-dot" style="background:${p.lc}"></span>${p.lang}</div>
          <div class="work-stars">⭐ ${p.stars}</div>
        </div>
      </div>`).join('');
    document.querySelectorAll('.work-card.reveal').forEach(el => io.observe(el));
  }
}

fetchRepos();
