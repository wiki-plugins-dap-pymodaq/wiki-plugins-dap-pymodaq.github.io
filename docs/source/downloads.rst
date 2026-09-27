Downloads
=========

Ready-to-use files for the DAP PyMoDAQ plugins: a turnkey installation package, example
plugin configurations, the conda environment, and a standalone HDF5 → CSV conversion tool.

.. note::

   The configuration files are provided as **working examples**. The IP addresses are
   placeholders — replace them with the values matching your own hardware before use.

Installation package
--------------------

A turnkey **installation package** (Windows) that creates the ``Py26`` conda environment,
installs both plugins (unified **Raspberry** + **Arduino**), and copies the example
configurations and presets to the right PyMoDAQ folders.

* :download:`install-dap-pymodaq.zip </_files/install/install-dap-pymodaq.zip>`

**How to use** — unzip it anywhere, optionally edit the configs / presets in the
``files`` folder, then **double-click** ``Install.bat`` and pick the actions from the
menu. It requires Miniconda or Anaconda. See the ``README.txt`` inside the zip for
details.

* **Plugin versions** — the menu compares the plugin sources shipped in the package with
  the latest versions published on PyPI. The shipped version (tested with the presets and
  configurations of the package) is always installed by default; a newer PyPI version can
  be chosen instead when one exists.
* **Test configuration** — an option installs a Raspberry configuration for the
  **simulation mode** (server running on the same PC, ``127.0.0.1``), to try everything
  without a Raspberry Pi.

Raspberry Pi installation package
---------------------------------

Installs the Raspberry-side server on the board (system packages, I2C, ``pigpio``,
Python environment) and makes it **start automatically with the Raspberry Pi** (systemd
service ``pymodaq-raspberry``).

* :download:`install-dap-raspberry.zip </_files/install/install-dap-raspberry.zip>`

**How to use** — copy the zip to the Raspberry Pi, then:

.. code-block:: bash

   unzip install-dap-raspberry.zip && cd install-dap-raspberry
   sudo bash install.sh

The IP address to report in the plugin configuration is printed at the end. Details in
:doc:`raspberry/server` and in the ``README.txt`` inside the zip.

.. warning::

   The Raspberry preset (``Raspberry.xml``) was **adapted** from the former Raspberry
   Pi 3 preset to the unified plugin (``MoveRasp`` / ``ViewRasp``) and is provided as a
   starting point — verify it loads correctly in PyMoDAQ, or recreate it (*Preset Mode →
   New preset → MoveRasp + ViewRasp*).

Example configurations
----------------------

Example plugin configuration files (``.toml``). On Windows they go in
``%USERPROFILE%\.pymodaq``.

Arduino
~~~~~~~

.. literalinclude:: /_files/configs/config_arduino.toml
   :language: toml

:download:`Download config_arduino.toml </_files/configs/config_arduino.toml>`

Raspberry (unified plugin)
~~~~~~~~~~~~~~~~~~~~~~~~~~

Configuration of the unified ``Raspberry`` plugin for the default bench (replace the IP
address with the one of your board).

.. literalinclude:: /_files/configs/config_raspberry.toml
   :language: toml

:download:`Download config_raspberry.toml </_files/configs/config_raspberry.toml>`

Test configuration for the **simulation mode** (server started on the same PC with
``python src_raspberry/main.py``):

:download:`Download config_demo.toml </_files/configs/config_demo.toml>`

Raspberry Pi 3 (former plugin)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. literalinclude:: /_files/configs/config_raspberrypi3.toml
   :language: toml

:download:`Download config_raspberrypi3.toml </_files/configs/config_raspberrypi3.toml>`

Raspberry Pi Zero (former plugin)
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

.. literalinclude:: /_files/configs/config_raspberrypizero.toml
   :language: toml

:download:`Download config_raspberrypizero.toml </_files/configs/config_raspberrypizero.toml>`

Conda environment
-----------------

The conda environment used for the project. Recreate it with:

.. code-block:: bash

   conda env create -f Py26env.yml
   conda activate Py26

* :download:`Py26env.yml </_files/Py26env.yml>`

HDF5 → CSV converter (tool)
---------------------------

``h5_to_csv_gui.py`` is a small **standalone** PyQt6 tool that converts a PyMoDAQ
*Log Data* ``.h5`` file into a spreadsheet-friendly **CSV**:

* a single common *time* column (timestamp converted to a readable
  ``DD/MM/YYYY HH:MM:SS``);
* one column per signal, named after its ``label``;
* gaps filled with the previous value; French decimal comma and ``;`` column separator.

**Dependencies**: ``pip install PyQt6 h5py numpy``

**Easiest way** — keep ``H5_To_CSV.bat`` and ``h5_to_csv_gui.py`` in the **same folder**
and simply **double-click** ``H5_To_CSV.bat``: it activates the ``Py26`` conda environment
and launches the tool (it works from any location).

Alternatively, run the script yourself from a terminal:

.. code-block:: bash

   python h5_to_csv_gui.py

Downloads:

* :download:`h5_to_csv_gui.py </_files/tools/h5_to_csv_gui.py>`
* :download:`H5_To_CSV.bat </_files/tools/H5_To_CSV.bat>`
