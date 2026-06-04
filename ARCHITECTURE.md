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

> **Dette technique connue (à traiter au Sprint 2)** : la sidebar et le pied de page
> sont actuellement **dupliqués à la main** dans chaque fichier HTML. Cette duplication
> est la cause d'incohérences passées (liens cassés, groupes vides) corrigées en
> v0.0.1. Le Sprint 2 introduira une **coquille partagée** injectée depuis une source
> unique (DRY) avec chemins relatifs paramétrés.

## Principaux comportements JavaScript (`script.js`)

- `toggleMenu` — ouverture/fermeture du menu latéral en mobile.
- `setActiveLink` — surlignage du lien correspondant à la page courante.
- `buildTOC` — génère une table des matières à partir des `<h2>` + scroll-spy
  (`IntersectionObserver`).
- `initTreeMenu` — menu arborescent : ouvre/ferme les groupes, déplie le groupe actif.
- `copyCommand` — copie le contenu d'un bloc de commande dans le presse-papiers.

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
