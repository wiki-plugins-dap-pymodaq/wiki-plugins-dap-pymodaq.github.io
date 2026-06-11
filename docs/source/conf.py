# Configuration file for the Sphinx documentation builder.
# Wiki of the DAP PyMoDAQ plugins (Arduino, Raspberry).
# Same theme as the official PyMoDAQ documentation: sphinx_rtd_theme.

# -- Project information -----------------------------------------------------
project = 'DAP Pymodaq Plugins'
author = 'BTS CIEL - Lycee Edouard Branly'
copyright = '2026, BTS CIEL - Lycee Edouard Branly'

version = '1.4.0'
release = '1.4.0'

language = 'en'

# -- General configuration ---------------------------------------------------
extensions = [
    'sphinx_design',          # cards / grids / tabs (used by the official docs)
    'sphinx.ext.githubpages',  # writes .nojekyll for GitHub Pages
]

exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']

# -- HTML output (identical theme to https://pymodaq.cnrs.fr) ----------------
html_theme = 'sphinx_rtd_theme'
html_theme_options = {
    'navigation_depth': 4,
    'collapse_navigation': False,
}
html_static_path = ['_static']
html_css_files = ['css/custom.css']
