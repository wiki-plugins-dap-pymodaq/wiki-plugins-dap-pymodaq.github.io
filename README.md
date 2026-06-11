# Wiki Plugins DAP Pymodaq

Wiki technique documentant les plugins **PyMoDAQ** développés dans le cadre du projet
**DAP** (BTS CIEL, Lycée Edouard Branly, partenariat **CETHIL**) : le plugin **Arduino**
et le plugin **Raspberry** (qui unifie les anciens montages Raspberry Pi 3 et Pi Zero).

Site de **documentation Sphinx** utilisant le thème **`sphinx_rtd_theme`** — le même que
la documentation officielle de PyMoDAQ (<https://pymodaq.cnrs.fr>) — rédigé en **anglais**
et déployé sur **GitHub Pages**.

## Aperçu

Documentation à deux sections, une par plugin :

- **Arduino plugin** — instruments autour d'une carte Arduino / ESP32 (Telemetrix) :
  LED multicolore, ventilateur/chauffage, acquisition analogique et PT100 / ADS1115,
  extension Dashboard.
- **Raspberry plugin** — pilotage d'un banc expérimental via une Raspberry Pi : un
  actionneur et un détecteur PyMoDAQ dialoguant avec un serveur embarqué sur la Pi via
  ZeroMQ.

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
├── docs/
│   ├── requirements.txt          # Dépendances Sphinx (sphinx, rtd-theme, design)
│   └── source/
│       ├── conf.py               # Configuration Sphinx (thème, version, langue)
│       ├── index.rst             # Accueil (cartes vers les 2 plugins)
│       ├── _static/css/          # CSS d'appoint
│       ├── arduino/              # Documentation du plugin Arduino
│       └── raspberry/            # Documentation du plugin Raspberry
├── .github/workflows/deploy.yml  # CI : build Sphinx + déploiement GitHub Pages
├── ARCHITECTURE.md               # Choix techniques et organisation
├── CHANGELOG.md                  # Historique des versions
├── SPRINTS.md                    # Backlog et avancement par sprint
└── README.md
```

Voir [ARCHITECTURE.md](ARCHITECTURE.md) pour le détail des choix techniques.

## Construire le wiki en local

Prérequis : **Python 3**.

```bash
python -m venv .venv
# Windows :
.venv\Scripts\activate
# Linux / macOS :
# source .venv/bin/activate

pip install -r docs/requirements.txt
sphinx-build -b html docs/source docs/_build/html

# Prévisualiser :
python -m http.server 8000 --directory docs/_build/html
# → http://localhost:8000
```

## Déploiement

Le déploiement est **automatique** : tout push sur `main` déclenche le workflow
GitHub Actions ([.github/workflows/deploy.yml](.github/workflows/deploy.yml)) qui
**build le site Sphinx** puis le publie sur GitHub Pages.

> ℹ️ Prérequis (une seule fois) : dans **Settings → Pages** du dépôt, choisir la
> source **« GitHub Actions »**.

## Méthode de travail et versionnage

- Le projet avance par **sprints** (1 sprint = 1 fonctionnalité), suivis dans
  [SPRINTS.md](SPRINTS.md).
- On **commite directement sur `main`** ; un **tag Git** (`vX.Y.Z`) est posé à chaque
  version publiée.
- Versionnage sémantique `MAJEUR.MINEUR.CORRECTIF`. La version courante est définie
  dans [docs/source/conf.py](docs/source/conf.py) (`version` / `release`) et historisée
  dans [CHANGELOG.md](CHANGELOG.md).
- Les fichiers de documentation racine sont mis à jour **à chaque sprint**.
