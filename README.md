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
- **CI/CD** : GitHub Actions (lint + déploiement) — *ajouté au Sprint 1*

Aucune dépendance d'exécution, aucun backend.

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

Le site est publié sur **GitHub Pages** depuis le dossier `public/`. Le déploiement
automatique via GitHub Actions est mis en place au **Sprint 1** (voir
[SPRINTS.md](SPRINTS.md)).

> ⚠️ Tant que le workflow GitHub Actions n'est pas en place, ne pas pousser cette
> restructuration en `public/` sur une Pages configurée « depuis la racine » : le site
> renverrait des 404. Sprint 0 et Sprint 1 doivent être déployés ensemble.

## Méthode de travail et versionnage

- Le projet avance par **sprints** (1 sprint = 1 fonctionnalité), suivis dans
  [SPRINTS.md](SPRINTS.md).
- On **commite directement sur `main`** ; un **tag Git** (`vX.Y.Z`) est posé à chaque
  version publiée.
- Versionnage sémantique `MAJEUR.MINEUR.CORRECTIF`. La version courante est définie
  dans [public/version.json](public/version.json) et historisée dans
  [CHANGELOG.md](CHANGELOG.md).
- Les fichiers de documentation racine sont mis à jour **à chaque sprint**.
