# Architecture

Ce document décrit l'organisation du wiki et les choix techniques.

## Nature du projet

Wiki de documentation **statique multi-pages**, déployé sur **GitHub Pages**. GitHub
Pages ne sert que des fichiers statiques (HTML/CSS/JS) : il n'y a **ni backend, ni base
de données, ni code serveur**.

Le wiki documente les **trois plugins** PyMODAQ du projet DAP : Arduino, Raspberry Pi 3
et Raspberry Pi Zero.

## Choix du frontend : Vanilla

Un wiki de documentation n'exige aucune interactivité lourde : on reste donc en
**vanilla**, sans framework ni bundler.

- **HTML5 sémantique** : `<nav>`, `<main>`, `<section>`, `<header>`, `<footer>`.
- **CSS vanilla** : variables CSS pour le thème (sombre), Flexbox et Grid.
- **JavaScript vanilla (ES6+)** : menu latéral arborescent (ouverture/fermeture des
  groupes), surlignage du lien actif, génération automatique d'une table des matières
  (TOC) par page avec scroll-spy (`IntersectionObserver`), menu mobile, copie de
  commandes dans le presse-papiers.

Aucune dépendance d'exécution. Le script est un script classique chargé via `defer`.

## Organisation des fichiers

```
public/                          # Racine web (seul dossier publié)
├── index.html                   # Accueil (contexte projet, objectifs, équipe)
├── style.css                    # Styles + variables de thème
├── script.js                    # Comportements UI partagés
├── version.json                 # Version courante
├── .nojekyll                    # Empêche GitHub Pages de traiter le site avec Jekyll
├── Arduino/presentation.html    # Plugin Arduino
├── RPI3B/                       # Plugin Raspberry Pi 3
│   ├── presentation.html
│   ├── rpi3_install.html
│   ├── configuration_rpi3b.html
│   ├── lancement_du_script.html
│   └── images/
└── RPI0/                        # Plugin Raspberry Pi Zero
    ├── rpi_zero.html
    └── images/

# Racine du dépôt (hors web) : outillage et documentation
package.json                     # Dépendances de développement (linters)
eslint.config.js                 # Config ESLint (JS)
.stylelintrc.json                # Config Stylelint (CSS)
.prettierrc.json                 # Config Prettier (format)
```

La séparation entre `public/` (servi sur le web) et le reste du dépôt (outillage, docs)
évite d'exposer les fichiers de configuration.

## Navigation

Chaque page embarque une **barre latérale** (sidebar) listant les sous-projets et leurs
pages, avec un menu arborescent repliable. Le lien de la page courante est surligné
automatiquement et son groupe est déplié à l'ouverture.

Depuis le Sprint 2, la sidebar (et le pied de page) sont injectés par `script.js` depuis
une **source unique** (modèle `NAV_GROUPS`), ce qui supprime la duplication HTML qui
causait des incohérences (liens cassés, groupes vides). Depuis le Sprint 5, la barre est
**rétractable** en mode « rail » étroit (desktop) : état par défaut selon la page,
mémorisé en `localStorage`, avec un script inline anti-clignotement dans chaque `<head>`.

## Principaux comportements JavaScript (`script.js`)

- `injectShell` / `buildSidebar` — construit et injecte la coquille partagée (sidebar,
  bouton menu mobile, overlay, skip-link) depuis le modèle `NAV_GROUPS`, marque la page
  active (`data-page`) et préfixe les liens par `data-base`.
- `setupCollapse` / `applyCollapsed` — barre rétractable (rail) : état par défaut selon
  la page, mémorisé en `localStorage`, bouton de repli (`aria-expanded`).
- `buildTOC` — génère une table des matières à partir des `<h2>` + scroll-spy
  (`IntersectionObserver`).
- `loadVersion` — affiche la version courante (lue dans `version.json`, repli en `file://`).
- `showToast` — notifications accessibles (`role="status"`).
- `copyCommand` — copie le contenu d'un bloc de commande (via délégation d'événements).

## Conventions

- **Commentaires** : français pour le contenu/métier, anglais pour le code technique
  générique.
- **CSS** : nommage des classes en `kebab-case`, variables `--kebab-case`.
- **JS** : variables et fonctions en `camelCase`, constantes en `UPPER_SNAKE_CASE`.
- **URL / fichiers** : à terme en `kebab-case` (uniformisation prévue dans un sprint
  ultérieur ; certains fichiers actuels utilisent `snake_case`).

## Pistes d'amélioration suivies dans SPRINTS.md

- **Coquille partagée** (DRY) pour la sidebar/footer (Sprint 2).
- **Qualité & accessibilité** : suppression des styles inline et des handlers `onclick`
  inline, remplacement de `alert()` par un toast, skip-link, attributs ARIA (Sprint 3).
- **SEO & performance** : métadonnées, Open Graph, `canonical`, `sitemap.xml`,
  `robots.txt`, favicon, `loading="lazy"` (Sprint 4).
