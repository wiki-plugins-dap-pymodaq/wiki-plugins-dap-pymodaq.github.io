// ──────────────────────────────────────────────────────────────
// Coquille partagée (sidebar) — SOURCE UNIQUE
// La navigation est définie une seule fois ici puis injectée dans chaque page.
// `href` est relatif à la racine du site ; il est préfixé par `data-base`
// (porté par <html>) pour fonctionner depuis n'importe quel sous-dossier.
// ──────────────────────────────────────────────────────────────

const NAV_GROUPS = [
  {
    id: 'arduino',
    title: 'Plugins Arduino',
    code: 'ARD',
    links: [{ page: 'arduino-presentation', href: 'Arduino/presentation.html', label: 'Présentation' }],
  },
  {
    id: 'rpi3',
    title: 'Plugins RPi 3',
    code: 'RP3',
    links: [
      { page: 'rpi3-presentation', href: 'RPI3B/presentation.html', label: 'Présentation' },
      { page: 'rpi3-install', href: 'RPI3B/rpi3_install.html', label: 'Installation OS' },
      { page: 'rpi3-config', href: 'RPI3B/configuration_rpi3b.html', label: 'Configuration Venv' },
      { page: 'rpi3-lancement', href: 'RPI3B/lancement_du_script.html', label: 'Lancement du script' },
    ],
  },
  {
    id: 'rpi0',
    title: 'Plugins RPi Zero',
    code: 'RP0',
    links: [{ page: 'rpi0-architecture', href: 'RPI0/rpi_zero.html', label: 'Architecture' }],
  },
];

// Clé de mémorisation de l'état (réduit/ouvert) de la barre latérale.
const SIDEBAR_KEY = 'wiki-sidebar-collapsed';

// Échappe le HTML pour éviter toute injection via les libellés de navigation.
function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Construit le balisage de la sidebar à partir du modèle, en marquant la page active.
function buildSidebar(base, activePage) {
  const groups = NAV_GROUPS.map((group) => {
    const isActiveGroup = group.links.some((link) => link.page === activePage);
    const items = group.links
      .map((link) => {
        const isActive = link.page === activePage;
        const attrs = isActive ? ' class="active" aria-current="page"' : '';
        return `<li><a href="${base}${link.href}"${attrs}>${escapeHtml(link.label)}</a></li>`;
      })
      .join('\n');
    const railIcon = `<a class="nav-rail-icon${isActiveGroup ? ' active' : ''}" href="${base}${group.links[0].href}" title="${escapeHtml(group.title)}" aria-label="${escapeHtml(group.title)}">${escapeHtml(group.code)}</a>`;
    return `<li class="nav-group${isActiveGroup ? ' open' : ''}">
  ${railIcon}
  <a href="#" class="nav-group-title" aria-expanded="${isActiveGroup ? 'true' : 'false'}">
    <span class="nav-arrow">▶</span> ${escapeHtml(group.title)}
  </a>
  <ul class="nav-sub">
${items}
  </ul>
</li>`;
  }).join('\n');

  const backHome =
    activePage === 'accueil'
      ? ''
      : `<a href="${base}index.html" class="status-badge sidebar-back" aria-label="Retour à l'accueil" title="Retour à l'accueil"><span class="sidebar-back__icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></svg></span><span class="sidebar-back__text">← Retour Accueil</span></a>`;

  return `<button class="sidebar-toggle" type="button" aria-label="Réduire le menu" aria-expanded="true"><span class="sidebar-toggle__icon" aria-hidden="true">«</span></button>
<hr class="rail-divider">
<a class="logo" href="${base}index.html">DAP<span>Pymodaq</span><br><small>Wiki Plugins · BTS CIEL 2026</small></a>
${backHome}
<hr class="rail-divider">
<p class="menu-label">Sous-Projets (Repos)</p>
<ul class="nav-links">
${groups}
</ul>
<div class="sidebar-footer">
  <span class="sidebar-footer__text">Lycée Edouard Branly<br>Session 2026</span>
  <p class="sidebar-version" data-version></p>
</div>`;
}

// Applique l'état réduit/ouvert de la barre (classe sur <html>) et met à jour le bouton.
function applyCollapsed(collapsed) {
  document.documentElement.classList.toggle('is-collapsed', collapsed);
  const btn = document.querySelector('.sidebar-toggle');
  if (!btn) return;
  btn.setAttribute('aria-expanded', String(!collapsed));
  btn.setAttribute('aria-label', collapsed ? 'Déplier le menu' : 'Réduire le menu');
  const icon = btn.querySelector('.sidebar-toggle__icon');
  if (icon) icon.textContent = collapsed ? '»' : '«';
}

// État initial de la barre : uniquement piloté par la préférence mémorisée.
// Par défaut (toute première visite, sans préférence) la barre est OUVERTE ;
// ensuite l'état suit strictement le dernier choix de l'utilisateur (localStorage),
// identique sur toutes les pages.
function setupCollapse(sidebar) {
  let stored = null;
  try {
    stored = localStorage.getItem(SIDEBAR_KEY);
  } catch (e) {
    stored = null;
  }
  let collapsed = stored === 'true';
  applyCollapsed(collapsed);

  const btn = sidebar.querySelector('.sidebar-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    collapsed = !collapsed;
    try {
      localStorage.setItem(SIDEBAR_KEY, String(collapsed));
    } catch (e) {
      // localStorage indisponible (ex. file://) : on applique sans mémoriser.
    }
    applyCollapsed(collapsed);
  });
}

// Injecte la coquille partagée (skip-link, bouton menu mobile, overlay, sidebar)
// puis câble les interactions (sans handler `onclick` inline).
function injectShell() {
  const root = document.documentElement;
  const base = root.getAttribute('data-base') || '';
  const activePage = root.getAttribute('data-page') || '';

  const sidebar = document.querySelector('[data-shell="sidebar"]');
  if (!sidebar) return;

  // Lien d'évitement (accessibilité) : premier élément focusable de la page.
  const skip = document.createElement('a');
  skip.className = 'skip-link';
  skip.href = '#contenu';
  skip.textContent = 'Aller au contenu';
  document.body.prepend(skip);

  // Bouton menu (mobile) + overlay, insérés juste avant la sidebar.
  const menuBtn = document.createElement('button');
  menuBtn.className = 'mobile-menu-btn';
  menuBtn.type = 'button';
  menuBtn.setAttribute('aria-label', 'Ouvrir le menu');
  menuBtn.textContent = '☰';

  const overlay = document.createElement('div');
  overlay.className = 'overlay';

  sidebar.before(menuBtn, overlay);
  sidebar.setAttribute('aria-label', 'Navigation principale');
  sidebar.innerHTML = buildSidebar(base, activePage);

  // Ouverture/fermeture du menu en mobile.
  const toggleMenu = () => {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
  };
  menuBtn.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);

  // Menu arborescent : un seul groupe ouvert à la fois (avec aria-expanded).
  const titles = sidebar.querySelectorAll('.nav-group-title');
  titles.forEach((title) => {
    title.addEventListener('click', (event) => {
      event.preventDefault();
      const group = title.closest('.nav-group');
      const willOpen = !group.classList.contains('open');
      sidebar.querySelectorAll('.nav-group').forEach((g) => g.classList.remove('open'));
      titles.forEach((t) => t.setAttribute('aria-expanded', 'false'));
      if (willOpen) {
        group.classList.add('open');
        title.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // Boutons « Copier » : délégation d'événements (plus de onclick inline).
  document.addEventListener('click', (event) => {
    const btn = event.target.closest('.copy-btn-mini');
    if (btn) copyCommand(btn);
  });

  // Barre rétractable (mode rail) : état initial + bouton de repli mémorisé.
  setupCollapse(sidebar);

  loadVersion(base);
}

// Version de repli, affichée quand `fetch` est indisponible (ouverture en `file://`,
// où les navigateurs bloquent la lecture des fichiers locaux). À garder synchronisée
// avec public/version.json, qui reste la source canonique (site déployé en HTTP + CI).
const FALLBACK_VERSION = '1.2.4';

// Affiche la version courante en pied de sidebar : repli immédiat, puis valeur
// canonique lue dans version.json dès que le site est servi en HTTP.
function loadVersion(base) {
  const el = document.querySelector('[data-version]');
  if (!el) return;
  el.textContent = `v${FALLBACK_VERSION}`;
  fetch(`${base}version.json`)
    .then((response) => (response.ok ? response.json() : null))
    .then((data) => {
      if (data && data.version) el.textContent = `v${data.version}`;
    })
    .catch(() => {});
}

// Affiche une notification temporaire (toast) accessible.
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.setAttribute('role', 'status');
  toast.textContent = message;
  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 250);
  }, 2500);
}

// Copie le contenu d'un bloc de commande dans le presse-papiers (+ toast de retour).
function copyCommand(btn) {
  const commandText = btn.previousElementSibling.innerText;
  navigator.clipboard.writeText(commandText).then(
    () => showToast('Commande copiée dans le presse-papiers !'),
    () => showToast('Échec de la copie.')
  );
}

// Génère une table des matières (TOC) sous le lien actif, à partir des <h2>,
// avec scroll-spy (IntersectionObserver).
function buildTOC() {
  const headings = document.querySelectorAll('.content h2');
  if (headings.length < 1) return;

  headings.forEach((h) => {
    if (!h.id) {
      h.id = h.textContent
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }
  });

  const activeLink = document.querySelector('.nav-sub a.active');
  if (!activeLink) return;

  const toc = document.createElement('ul');
  toc.className = 'toc-inline';

  headings.forEach((h) => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent;
    li.appendChild(a);
    toc.appendChild(li);
  });

  activeLink.closest('li').appendChild(toc);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute('id');
        const link = toc.querySelector(`a[href="#${id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
          toc.querySelectorAll('a').forEach((a) => a.classList.remove('toc-active'));
          link.classList.add('toc-active');
        }
      });
    },
    { rootMargin: '0px 0px -70% 0px', threshold: 0 }
  );

  headings.forEach((h) => observer.observe(h));
}

document.addEventListener('DOMContentLoaded', () => {
  injectShell();
  buildTOC();
});
