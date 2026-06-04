# Sprints — Wiki Plugins DAP Pymodaq

Chaque sprint livre **une fonctionnalité** complète et vérifiée. Le backlog est aligné
sur les habitudes de programmation du portfolio de référence (séparation `public/`,
outillage lint/format, CI/CD, coquille partagée DRY, SEO/accessibilité).

Légende : ✅ terminé · 🚧 en cours · ⬜ à faire

---

## ✅ v0.0.1 — Hotfixes navigation & branding
Trois correctifs livrés en commits séparés :
- **FIX-1** — lien Arduino cassé sur l'accueil (`RPI0/presentation.html` →
  `Arduino/presentation.html`).
- **FIX-2** — unification du logo et des titres en « Wiki Plugins DAP Pymodaq » (7 pages),
  correction du `<title>` Arduino erroné et du `&` non échappé.
- **FIX-3** — sous-lien Arduino manquant ajouté dans les sidebars RPi 3 / RPi Zero.

## ✅ Sprint 0 — Fondations & outillage (v0.1.0)
Restructuration en `public/`, configuration des linters (ESLint/Stylelint/Prettier),
`package.json`, `.gitignore`, `.nojekyll`, `version.json`, et documentation racine
(README, ARCHITECTURE, CHANGELOG, SPRINTS).

## ✅ Sprint 1 — CI/CD GitHub Actions (v0.2.0)
Workflow `.github/workflows/deploy.yml` : job `lint` (ESLint + Stylelint, informatif)
puis job `deploy` publiant `public/` sur GitHub Pages (Source : « GitHub Actions »).
Ajout de `.gitattributes` (normalisation LF).

## ✅ Sprint 2 — Coquille partagée / DRY (v0.3.0)
Sidebar (+ bouton menu mobile et overlay) injectée depuis une **source unique**
(`NAV_GROUPS` dans `script.js`), suppression de la duplication dans chaque page.
Chemins relatifs paramétrés (`data-base`) et lien actif via `data-page`. Contrôles
câblés en `addEventListener`. Résorbe durablement les incohérences de navigation
(cause des hotfixes v0.0.1). Vérifié en navigateur (accueil + sous-page).

## ⬜ Sprint 3 — Qualité du code & accessibilité (v0.4.0)
Externalisation des styles inline → classes CSS (`kebab-case`), remplacement des
handlers `onclick` inline par `addEventListener`, remplacement de `alert()` par un toast
accessible, skip-link, `aria-label`, navigation clavier, `alt` vérifiés,
`prefers-reduced-motion`, mise au propre du lint (Stylelint/ESLint sans erreur).

## ⬜ Sprint 4 — SEO & performance (v1.0.0)
Par page : `description`, Open Graph, `canonical`, `theme-color` ; `favicon`,
`sitemap.xml`, `robots.txt` ; `loading="lazy"` sur les images. Première version
« production », tag Git `v1.0.0`.

---

### Récapitulatif par version

| Version | Livrable                                   | Statut |
| ------- | ------------------------------------------ | ------ |
| v0.0.1  | Hotfixes navigation & branding             | ✅     |
| v0.1.0  | Sprint 0 — Fondations & outillage          | ✅     |
| v0.2.0  | Sprint 1 — CI/CD GitHub Actions            | ✅     |
| v0.3.0  | Sprint 2 — Coquille partagée (DRY)         | ✅     |
| v0.4.0  | Sprint 3 — Qualité code & accessibilité    | ⬜     |
| v1.0.0  | Sprint 4 — SEO, performance, production    | ⬜     |
