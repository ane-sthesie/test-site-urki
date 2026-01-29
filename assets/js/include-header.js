// /assets/js/include-header.js
// Injecte /header.html puis initialise : shrink au scroll + burger + lien actif.

const HEADER_CONFIG = {
  mountSelector: '#site-header',   // Conteneur d'injection
  url: '/header.html',             // Fichier header à la racine
  highlightActive: true,           // .active sur le lien de la page courante
  cacheBust: true                  // Evite le cache lors des mises à jour
};

async function injectHeader(config = {}) {
  const cfg = { ...HEADER_CONFIG, ...config };
  const mount = document.querySelector(cfg.mountSelector);
  if (!mount) {
    console.warn(`[include-header] Point d'ancrage non trouvé: ${cfg.mountSelector}`);
    return;
  }
  if (mount.dataset.headerInjected === 'true') return;

  let fetchUrl = cfg.url;
  if (cfg.cacheBust) {
    const sep = fetchUrl.includes('?') ? '&' : '?';
    fetchUrl = `${fetchUrl}${sep}t=${Date.now()}`;
  }

  try {
    const res = await fetch(fetchUrl, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();

    mount.innerHTML = html;
    mount.dataset.headerInjected = 'true';

    // CORRECTION : chercher dans document, pas dans mount
    // 1) Shrink au scroll (ajoute/retire .scrolled sur <header>)
    initHeaderScrollShrink();

    // 2) Burger (classes alignées avec ton CSS)
    initBurger();

    // 3) Lien actif (optionnel)
    if (cfg.highlightActive) applyActiveLink();

  } catch (err) {
    console.error('[include-header] Erreur injection header:', err);
  }
}

/* === Shrink au scroll : ajoute/retire .scrolled sur <header> === */
function initHeaderScrollShrink() {
  const headerEl = document.querySelector('header#main-header') || document.querySelector('header');
  if (!headerEl) return;

  const threshold = 1; // px (plus sensible)
  const onScroll = () => {
    const scrolled = (window.scrollY || window.pageYOffset || 0) > threshold;
    headerEl.classList.toggle('scrolled', scrolled);
  };

  // Etat initial + listener
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* === Burger : classes alignées avec ton CSS ===
   - Panneau : #menu-burger.active (affiché)
   - Bouton : .menu-toggle.is-active (animation en croix)
   - Sous-menus : .burger-submenu.active (affiché)
*/
function initBurger() {
  const openAnchor = document.querySelector('#openBtn');          // <a id="openBtn">
  const toggleBtn  = document.querySelector('.menu-toggle');      // <button class="menu-toggle">
  const panel      = document.querySelector('#menu-burger');      // <div id="menu-burger">
  if (!openAnchor || !panel) return;

  const togglePanel = (force) => {
    const open = typeof force === 'boolean' ? force : !panel.classList.contains('active');
    panel.classList.toggle('active', open);
    if (toggleBtn) toggleBtn.classList.toggle('is-active', open);
    if (!open) closeAllSubmenus();
  };

  // Ouvrir/fermer le panneau
  openAnchor.addEventListener('click', (e) => {
    e.preventDefault();
    togglePanel();
  });

  // Liens qui ouvrent un sous-menu (data-target = "club" | "triathlon" | "epreuves")
  document.querySelectorAll('.burger-link[data-target]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('data-target');
      openSubmenu(target);
    });
  });

  // Boutons retour
  document.querySelectorAll('.burger-back').forEach(back => {
    back.addEventListener('click', (e) => {
      e.preventDefault();
      closeAllSubmenus();
    });
  });

  // Ferme le burger si on clique un lien interne (hors #)
  document.querySelectorAll('#menu-burger a[href]').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href.startsWith('#')) return;
    a.addEventListener('click', () => togglePanel(false));
  });

  // Ferme sur ÉCHAP
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('active')) togglePanel(false);
  });
}

function openSubmenu(name) {
  if (!name) return;
  closeAllSubmenus();
  const submenu = document.querySelector(`#submenu-${name}`);
  if (submenu) submenu.classList.add('active');
}

function closeAllSubmenus() {
  document.querySelectorAll('.burger-submenu.active').forEach(ul => ul.classList.remove('active'));
}

/* === Lien actif (optionnel) === */
function applyActiveLink() {
  const current = normalizePath(window.location.pathname);
  document.querySelectorAll('a[href]').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (!href || href.startsWith('http') || href.startsWith('#')) return;
    const path = normalizePath(href);
    if (path === current) a.classList.add('active');
  });
}

function normalizePath(path) {
  try {
    const u = new URL(path, window.location.origin);
    let p = u.pathname;
    if (p.length > 1) p = p.replace(/\/+$/, '');
    return p;
  } catch {
    if (path.length > 1) return path.replace(/\/+$/, '');
    return path;
  }
}

// Auto-run
document.addEventListener('DOMContentLoaded', () => {
  injectHeader();
});