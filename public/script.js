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
    links: [{ page: 'arduino-presentation', href: 'Arduino/presentation.html', label: 'Présentation' }],
  },
  {
    id: 'rpi3',
    title: 'Plugins RPi 3',
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
    links: [{ page: 'rpi0-architecture', href: 'RPI0/rpi_zero.html', label: 'Architecture' }],
  },
];

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
        const activeAttr = link.page === activePage ? ' class="active"' : '';
        return `<li><a href="${base}${link.href}"${activeAttr}>${escapeHtml(link.label)}</a></li>`;
      })
      .join('\n');
    return `<li class="nav-group${isActiveGroup ? ' open' : ''}">
  <a href="#" class="nav-group-title">
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
      : `<a href="${base}index.html" class="status-badge sidebar-back">← Retour Accueil</a>`;

  return `<a class="logo" href="${base}index.html">DAP<span>Pymodaq</span><br><small>Wiki Plugins · BTS CIEL 2026</small></a>
${backHome}
<p class="menu-label">Sous-Projets (Repos)</p>
<ul class="nav-links">
${groups}
</ul>
<div class="sidebar-footer">
  Lycée Edouard Branly<br>
  Session 2026
</div>`;
}

// Injecte la coquille partagée (bouton menu mobile, overlay, contenu de la sidebar)
// puis câble les interactions (sans handler `onclick` inline).
function injectShell() {
  const root = document.documentElement;
  const base = root.getAttribute('data-base') || '';
  const activePage = root.getAttribute('data-page') || '';

  const sidebar = document.querySelector('[data-shell="sidebar"]');
  if (!sidebar) return;

  // Bouton menu (mobile) + overlay, insérés juste avant la sidebar.
  const menuBtn = document.createElement('button');
  menuBtn.className = 'mobile-menu-btn';
  menuBtn.type = 'button';
  menuBtn.setAttribute('aria-label', 'Ouvrir le menu');
  menuBtn.textContent = '☰';

  const overlay = document.createElement('div');
  overlay.className = 'overlay';

  sidebar.before(menuBtn, overlay);
  sidebar.innerHTML = buildSidebar(base, activePage);

  // Ouverture/fermeture du menu en mobile.
  const toggleMenu = () => {
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
  };
  menuBtn.addEventListener('click', toggleMenu);
  overlay.addEventListener('click', toggleMenu);

  // Menu arborescent : un seul groupe ouvert à la fois.
  sidebar.querySelectorAll('.nav-group-title').forEach((title) => {
    title.addEventListener('click', (event) => {
      event.preventDefault();
      const group = title.closest('.nav-group');
      const isOpen = group.classList.contains('open');
      sidebar.querySelectorAll('.nav-group').forEach((g) => g.classList.remove('open'));
      if (!isOpen) group.classList.add('open');
    });
  });
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

// Copie le contenu d'un bloc de commande dans le presse-papiers.
// Toujours appelé via `onclick` inline dans le contenu — sera modernisé au Sprint 3.
function copyCommand(btn) {
  const commandText = btn.previousElementSibling.innerText;
  navigator.clipboard.writeText(commandText).then(() => {
    alert('Commande copiée dans le presse-papiers !');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  injectShell();
  buildTOC();
});
