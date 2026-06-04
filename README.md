# Wiki Plugins DAP Pymodaq

Wiki technique documentant les **trois plugins** développés pour le framework
d'acquisition **PyMODAQ** dans le cadre du projet **DAP** (BTS CIEL, session 2026) :
plugin **Arduino**, plugin **Raspberry Pi 3** et plugin **Raspberry Pi Zero**.

Site **statique multi-pages** déployé via **GitHub Pages**.

## Aperçu

Wiki de documentation présentant le contexte du projet puis, pour chaque sous-projet
(« repo »), les pages techniques associées (présentation, installation, configuration,
lancement, architecture matérielle). Construit en **vanilla** (HTML5 / CSS3 /
JavaScript ES6+), sans framework ni étape de build : les fichiers de `public/` sont
servis directement.

Pages :

- **Accueil** (`index.html`) — contexte du projet DAP, objectifs, technologies, équipe.
- **Plugin Arduino** (`Arduino/presentation.html`) — présentation du montage Arduino.
- **Plugin RPi 3** (`RPI3B/*.html`) — présentation, installation OS, configuration de
  l'environnement virtuel, lancement du script.
- **Plugin RPi Zero** (`RPI0/rpi_zero.html`) — architecture matérielle.

## Stack technique

- **HTML5** sémantique
- **CSS vanilla** (variables CSS, Flexbox/Grid, thème sombre)
- **JavaScript vanilla** (ES6+, script classique `defer`, `IntersectionObserver` pour la
  table des matières, menu arborescent responsive)
- **Polices** : Inter + Fira Code (Google Fonts)
- **Hébergement** : GitHub Pages
- **CI/CD** : GitHub Actions (lint + déploiement)

Aucune dépendance d'exécution, aucun backend.

## Mention IA

Ce wiki a été conçu et développé avec l'assistance d'outils d'intelligence
artificielle, utilisés comme de véritables **outils de productivité**. C'est une
démarche assumée : l'IA fait aujourd'hui partie intégrante du métier de développeur et
du marché actuel, et nous choisissons de **nous y adapter et de la maîtriser** plutôt
que de l'ignorer.

Ce qui fait la différence, c'est l'**usage**. Nous nous **documentons en profondeur**
sur ces outils pour les exploiter avec discernement, comme un véritable levier de
productivité. L'IA accélère la mise en œuvre — elle ne remplace ni la conception, ni les
décisions techniques, ni la compréhension du code. La **grande majorité des
fonctionnalités** et de la **stack technique** employées ici nous sont familières : nous
savons ce qui a été construit, pourquoi, et comment le faire évoluer et le maintenir.

Concrètement, un projet de cette envergure représente normalement **3 à 5 semaines de
travail à temps plein** (soit plusieurs mois en parallèle de nos études). En nous
appuyant sur l'IA, nous l'avons réalisé en une fraction de ce temps, en concentrant
notre énergie sur l'**architecture**, la **qualité** et les **détails** plutôt que sur
les tâches répétitives — exactement le gain de productivité recherché dans un
environnement de travail moderne.

## Structure du projet

```
wiki-plugins-dap-pymodaq/
├── public/                      # Tout ce qui est servi sur le web (racine du site)
│   ├── index.html               # Accueil (point d'entrée)
│   ├── style.css                # Styles + variables de thème
│   ├── script.js                # Comportements UI (menu, TOC, scroll-spy, copie)
│   ├── version.json             # Version courante
│   ├── .nojekyll                # Désactive le traitement Jekyll de GitHub Pages
│   ├── Arduino/                 # Plugin Arduino
│   │   └── presentation.html
│   ├── RPI3B/                   # Plugin Raspberry Pi 3
│   │   ├── presentation.html
│   │   ├── rpi3_install.html
│   │   ├── configuration_rpi3b.html
│   │   ├── lancement_du_script.html
│   │   └── images/
│   └── RPI0/                    # Plugin Raspberry Pi Zero
│       ├── rpi_zero.html
│       └── images/
├── package.json                 # Outillage de lint/format (dev uniquement)
├── eslint.config.js             # Config ESLint (JS)
├── .stylelintrc.json            # Config Stylelint (CSS)
├── .prettierrc.json             # Config Prettier (format)
├── ARCHITECTURE.md              # Choix techniques et organisation
├── CHANGELOG.md                 # Historique des versions
├── SPRINTS.md                   # Backlog et avancement par sprint
└── README.md
```

Voir [ARCHITECTURE.md](ARCHITECTURE.md) pour le détail des choix techniques.

## Développement local

Aucune compilation n'est nécessaire. Il suffit de servir le dossier `public/` via HTTP.

```bash
# Avec Python (déjà installé)
python -m http.server 8000 --directory public
# → http://localhost:8000
```

> ⚠️ Ouvrir `public/index.html` par double-clic (`file://`) fonctionne, mais privilégier
> un petit serveur local reproduit fidèlement le comportement de GitHub Pages.

## Qualité de code (linters)

Les linters sont optionnels en local (nécessitent [Node.js](https://nodejs.org/)) et
s'exécuteront automatiquement en CI à chaque push (à partir du Sprint 1).

```bash
npm install         # une seule fois
npm run lint        # ESLint + Stylelint
npm run lint:format # Vérification du formatage Prettier
npm run format      # Applique le formatage Prettier
```

## Déploiement

Le déploiement est **automatique** : tout push sur `main` déclenche le workflow
GitHub Actions ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) qui
lint le code puis publie `public/` sur GitHub Pages.

> ℹ️ Prérequis (une seule fois) : dans **Settings → Pages** du dépôt, choisir la
> source **« GitHub Actions »** (et non « Deploy from a branch »).

## Référencement (SEO)

Chaque page porte un titre et une description propres, des balises **Open Graph**
(partage sur les réseaux), un lien **canonical**, une couleur de thème (`theme-color`)
et un `favicon`. Le site fournit un `sitemap.xml` et un `robots.txt`.

> ⚠️ Les URL absolues (Open Graph, canonical, `sitemap.xml`, `robots.txt`) utilisent la
> base `https://wiki-plugins-dap-pymodaq.github.io`. Si le site est déployé à une autre
> adresse, adapter cette base dans les pages, `sitemap.xml` et `robots.txt`.

## Méthode de travail et versionnage

- Le projet avance par **sprints** (1 sprint = 1 fonctionnalité), suivis dans
  [SPRINTS.md](SPRINTS.md).
- On **commite directement sur `main`** ; un **tag Git** (`vX.Y.Z`) est posé à chaque
  version publiée.
- Versionnage sémantique `MAJEUR.MINEUR.CORRECTIF`. La version courante est définie
  dans [public/version.json](public/version.json) et historisée dans
  [CHANGELOG.md](CHANGELOG.md).
- Les fichiers de documentation racine sont mis à jour **à chaque sprint**.
