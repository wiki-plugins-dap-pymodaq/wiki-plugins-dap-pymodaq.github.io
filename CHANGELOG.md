# Changelog

Toutes les modifications notables de ce projet sont documentées ici.

Le format suit [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/)
et le projet respecte le [versionnage sémantique](https://semver.org/lang/fr/) (`MAJEUR.MINEUR.CORRECTIF`).

## [1.0.0] - 2026-06-04

Première version « production ».

### Ajouté
- **SEO** par page : `meta description`, balises **Open Graph** (`og:*`), lien
  **canonical** (URL absolue) et `theme-color`.
- **`favicon.svg`** (motif de signal d'acquisition, aux couleurs du thème).
- **`sitemap.xml`** et **`robots.txt`** (base `https://wiki-plugins-dap-pymodaq.github.io`).

### Modifié
- **Performance** : `loading="lazy"` ajouté sur toutes les images de contenu.
- Documentation racine actualisée (déploiement « production », section SEO).

## [0.4.1] - 2026-06-04

### Corrigé
- La note de version ne s'affichait pas à l'ouverture en `file://` (double-clic), car
  `fetch('version.json')` est bloqué par le navigateur pour les fichiers locaux. Ajout
  d'une **version de repli** (`FALLBACK_VERSION`) affichée immédiatement, puis remplacée
  par la valeur canonique de `version.json` dès que le site est servi en HTTP (serveur
  local ou GitHub Pages).

## [0.4.0] - 2026-06-04

### Ajouté
- **Version courante affichée** en pied de barre latérale, lue dynamiquement depuis
  `public/version.json` (`loadVersion`).
- **Notifications (toasts)** accessibles (`role="status"`, `aria-live`) en remplacement
  de `alert()` pour le retour de copie.
- **Accessibilité** : lien d'évitement (« skip-link ») vers le contenu (`#contenu`),
  `aria-label` sur la navigation, `aria-current="page"` sur le lien actif,
  `aria-expanded` sur les groupes du menu, prise en compte de `prefers-reduced-motion`.

### Modifié
- **Suppression de tous les styles inline** (~93 occurrences) : externalisés en classes
  CSS réutilisables (utilitaires d'espacement, `figure-img`/`figure-caption`,
  `sub-list`, `cmd-text`, variantes d'info-box, etc.).
- **Boutons « Copier »** : handlers `onclick` inline remplacés par une délégation
  d'événements dans `script.js` (plus aucun handler inline dans le HTML).
- `<main>` doté d'un `id="contenu"` (cible du skip-link).

## [0.3.0] - 2026-06-04

### Ajouté
- **Coquille partagée (DRY)** : la barre latérale (sidebar), le bouton de menu mobile et
  l'overlay sont désormais injectés depuis une **source unique** (`NAV_GROUPS` dans
  `script.js`) au lieu d'être dupliqués dans chaque page HTML.
- Attributs `data-base` (chemin relatif vers la racine) et `data-page` (clé de la page
  active) portés par `<html>` : les liens et le lien actif sont calculés automatiquement,
  ce qui supprime durablement la classe de bugs des hotfixes v0.0.1.
- Logo cliquable (retour à l'accueil) et règles CSS associées (`a.logo`, `.sidebar-back`).

### Modifié
- Les contrôles de la coquille (menu, overlay, menu arborescent) utilisent
  `addEventListener` au lieu de handlers `onclick` inline.
- `script.js` restructuré autour de l'injection de la coquille (`injectShell`,
  `buildSidebar`) ; `buildTOC` conservé (table des matières + scroll-spy).

## [0.2.0] - 2026-06-04

### Ajouté
- **CI/CD** : workflow GitHub Actions (`.github/workflows/deploy.yml`) qui lint le code
  (ESLint + Stylelint, informatif) puis publie `public/` sur GitHub Pages à chaque push
  sur `main` (Source : « GitHub Actions »).
- `.gitattributes` (normalisation des fins de ligne en LF).

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
