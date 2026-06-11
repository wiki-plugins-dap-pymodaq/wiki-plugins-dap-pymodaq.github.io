# Architecture

Ce document décrit l'organisation du wiki et les choix techniques.

## Nature du projet

Wiki de **documentation Sphinx**, déployé sur **GitHub Pages**. Le contenu est rédigé en
**reStructuredText** (`.rst`), en **anglais**, et compilé en HTML statique par
`sphinx-build`. Il n'y a ni backend, ni base de données.

Le wiki documente **deux plugins** PyMoDAQ du projet DAP : **Arduino** et **Raspberry**
(ce dernier unifie les anciens montages Raspberry Pi 3 et Pi Zero).

## Choix du thème : sphinx_rtd_theme

Le thème retenu est **`sphinx_rtd_theme`** (Read the Docs), **identique à celui de la
documentation officielle PyMoDAQ** (<https://pymodaq.cnrs.fr>). `html_theme_options` reste
proche des valeurs par défaut (bleu `#2980b9`, polices Roboto Slab / Lato) ; seuls
`navigation_depth` et `collapse_navigation` sont ajustés pour la navigation.

Extension principale : **`sphinx_design`** (cartes / grilles de l'accueil), comme la doc
officielle. `sphinx.ext.githubpages` génère le `.nojekyll` requis par GitHub Pages.

Le thème fournit « gratuitement » : recherche plein-texte, sommaire latéral et « on this
page », navigation précédent/suivant, responsive et fil d'Ariane.

## Organisation des fichiers

```
docs/
├── requirements.txt              # sphinx, sphinx-rtd-theme, sphinx-design
└── source/
    ├── conf.py                   # thème, version (= version du wiki), langue (en)
    ├── index.rst                 # accueil : intro + cartes vers les 2 plugins
    ├── _static/css/custom.css    # ajustements CSS minimes
    ├── arduino/                  # section plugin Arduino
    └── raspberry/                # section plugin Raspberry
```

La sortie de build (`docs/_build/`) n'est **pas** versionnée (régénérée par la CI).

## Build et déploiement

- **Local** : `pip install -r docs/requirements.txt` puis
  `sphinx-build -b html docs/source docs/_build/html`.
- **CI/CD** : à chaque push sur `main`, GitHub Actions
  ([deploy.yml](.github/workflows/deploy.yml)) installe les dépendances, build le site et
  le publie sur GitHub Pages (job `build` → `deploy`).

## Conventions

- **Contenu** : reStructuredText, anglais ; une section par plugin sous `docs/source/`.
- **Versionnage** : SemVer défini dans `conf.py` (`version` / `release`), tag Git par
  version, historisé dans `CHANGELOG.md`.
- **Fidélité au thème officiel** : on évite les surcharges CSS lourdes ; `custom.css`
  reste minimal.

## Historique

La version précédente du wiki était un site **vanilla** (HTML/CSS/JS dans `public/`,
outillage Node ESLint/Stylelint). Elle a été remplacée par ce projet Sphinx à la **v1.4.0**
(refonte « v2.0 ») ; elle reste accessible dans l'historique Git (tag **`v1.3.0`**).
