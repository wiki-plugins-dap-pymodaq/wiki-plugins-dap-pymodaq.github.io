# Changelog

Toutes les modifications notables de ce projet sont documentées ici.

Le format suit [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/)
et le projet respecte le [versionnage sémantique](https://semver.org/lang/fr/) (`MAJEUR.MINEUR.CORRECTIF`).

## [0.1.0] - 2026-06-04

### Ajouté
- Séparation `public/` (web) et racine (outillage/docs) : `index.html`, `style.css`,
  `script.js` et les dossiers `Arduino/`, `RPI3B/`, `RPI0/` déplacés sous `public/`.
- Configuration des linters : ESLint (`eslint.config.js`), Stylelint
  (`.stylelintrc.json`) et Prettier (`.prettierrc.json`, `.prettierignore`).
- `package.json` (scripts de lint/format, dépendances de développement).
- `.gitignore` (dépendances, secrets, OS, IDE).
- `public/.nojekyll` (désactive le traitement Jekyll de GitHub Pages).
- `public/version.json` (version courante).
- Documentation racine : `README.md` complet, `ARCHITECTURE.md`, `SPRINTS.md` et ce
  `CHANGELOG.md`.

## [0.0.1] - 2026-06-04

### Corrigé
- **Navigation** : le lien « Plugins Arduino » de la page d'accueil pointait vers
  `RPI0/presentation.html` (inexistant) au lieu de `Arduino/presentation.html`.
- **Navigation** : le groupe « Plugins Arduino » était vide dans plusieurs pages
  (RPi 3 et RPi Zero) ; ajout du sous-lien manquant.
- **Branding** : le `<title>` de la page Arduino indiquait « RPi 3 » par erreur ; le
  `<title>` de `rpi3_install.html` contenait un `&` non échappé.

### Modifié
- **Branding** unifié sur les 7 pages : logo harmonisé (`PyMoDAQ`/`PyDAP` →
  `DAP Pymodaq` + sous-titre « Wiki Plugins · BTS CIEL 2026 ») et titres normalisés en
  « … — Wiki Plugins DAP Pymodaq ».
