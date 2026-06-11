Installing PyMoDAQ and the plugin
=================================

This page explains how to install PyMoDAQ on Windows together with the Arduino plugin,
depending on your profile: **user** (lab sessions) or **developer**.

.. note::

   Based on the official PyMoDAQ guide — `pymodaq.cnrs.fr
   <https://pymodaq.cnrs.fr>`_, *Quick Start (Windows)*.

User installation (lab sessions)
--------------------------------

For students and teachers who only want to *use* PyMoDAQ, without modifying the source.

#. **Install Miniforge** — the Python environment manager recommended by PyMoDAQ.
   Download it from the official website and run the installer with the default settings.
   Miniforge ships ``mamba``, Python and ``pip``.
#. **Open the Miniforge Prompt** from the Start menu (not the regular Windows terminal).
#. **Create the environment** (Python 3.11):

   .. code-block:: bash

      mamba create -n pymodaq_env python=3.11
      mamba activate pymodaq_env

   .. tip::

      Choose the **second-to-last** minor version of Python to stay compatible with all
      PyMoDAQ plugins; avoid the very latest one.

#. **Install PyMoDAQ**:

   .. code-block:: bash

      pip install pymodaq pyqt5

#. **Install the Arduino plugin** (once published on PyPI):

   .. code-block:: bash

      pip install pymodaq_plugins_arduino

#. **Check the installation** by launching a test module:

   .. code-block:: bash

      daq_move

   Select ``Mock`` in the drop-down list and click *Initialization*. If the window opens
   without error, the installation is successful.

Developer installation
----------------------

For developers who want to modify the plugin or work with the development version.

#. **Create the environment** (Python 3.12) in an Anaconda / Miniforge Prompt:

   .. code-block:: bash

      conda create -n pymodaq_dev python=3.12
      conda activate pymodaq_dev
      pip install PyQt6 pymodaq

#. **Install the plugin from source** — clone the repository and install it in *editable*
   mode:

   .. code-block:: bash

      git clone <plugin-repository-url> pymodaq-plugins-arduino
      cd pymodaq-plugins-arduino
      pip install -e .

   The editable install lets your code changes take effect without reinstalling.
