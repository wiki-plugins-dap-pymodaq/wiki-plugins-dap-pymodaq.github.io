Raspberry-side server
=====================

The code that must run on the Raspberry Pi lives in the ``src_raspberry/`` folder at the
root of the plugin repository. It makes the bridge between the hardware (I2C sensors,
GPIO actuators) and the network.

.. note::

   This folder is an **addition** to the plugin and is *not packaged*: it is not part of
   the Python distribution of the PyMoDAQ plugin and does not modify it.

Layered architecture
--------------------

The server is split into independent layers, each behind an interface; only ``main.py``
is not interchangeable, as it assembles the others.

.. code-block:: text

   ZmqServer  ──►  JsonRequestHandler  ──►  HardwareBackend
  (transport)       (request routing)       (component comm.)
        ▲                  ▲                       ▲
   ITransport       IRequestHandler         IHardwareBackend

* **transport/** — communication with the PyMoDAQ client. ``zmq_server.py`` implements
  ``ZmqServer`` (ZeroMQ ROUTER); it only handles networking and framing.
* **handlers/** — request handling. ``json_handler.py`` implements
  ``JsonRequestHandler`` (JSON decoding + routing). It performs **no hardware access**:
  everything is delegated to the backend.
* **hardware/** — communication with the components. ``backend.py`` implements
  ``HardwareBackend`` (sensors + actuators); ``sensors.py`` holds the sensor drivers and
  the ``SENSOR_DRIVER_REGISTRY`` (``AHT10``, ``TMP102``, ``EMC2101``, ``PT-100``,
  ``SIMULE``); ``actuators.py`` holds the actuator drivers and the
  ``ACTUATOR_DRIVER_REGISTRY`` (``PWM``, ``DIGITAL``); ``scanner.py`` detects I2C
  addresses.
* **config.py** — the description of the bench (pins, sensors, actuators). The **only**
  file to adapt from one bench to another (see :doc:`configuration`).
* **main.py** — entry point: instantiates and wires the three layers
  (``HardwareBackend`` → ``JsonRequestHandler`` → ``ZmqServer``, port 5555 by default).

Quick installation (recommended)
--------------------------------

A ready-to-use package installs the server on the Raspberry Pi and makes it start with
the board — see :doc:`/downloads` (*Raspberry Pi installation package*).

#. Flash **Raspberry Pi OS (64-bit)**, enable SSH, and connect the board to the network
   (Internet is needed during the installation).
#. Copy the package to the board and run the installer:

   .. code-block:: bash

      scp install-dap-raspberry.zip <user>@<raspberry-ip>:~     # from the control computer
      unzip install-dap-raspberry.zip && cd install-dap-raspberry  # on the Raspberry Pi
      sudo bash install.sh

#. Report the IP address printed at the end in ``config_raspberry.toml`` on the control
   computer (``address_Rasp``), then ``sudo reboot`` if the installer asks for it (first
   activation of I2C).

The installer:

* installs the system packages (``python3-venv``, ``i2c-tools``, ``pigpio``), enables I2C
  and the ``pigpiod`` daemon;
* copies the server to ``/opt/pymodaq-raspberry`` with its own Python environment;
* installs the ``pymodaq-raspberry`` systemd service (starts at boot, restarts on failure);
* stops and disables the former ``pilotage.service`` (manual procedure below), which uses
  the same port;
* keeps an existing, modified ``config.py`` when run again (the new version is saved as
  ``config.py.new``).

Options: ``--port <n>`` (other listening port), ``--user <account>`` (account running the
server, default: the one calling ``sudo``), ``--no-autostart``. Without administrator
rights, ``bash install.sh`` installs the server in ``~/pymodaq-raspberry`` and starts it at
boot through the user's crontab, without changing the system.

Everyday commands:

.. code-block:: bash

   sudo systemctl status pymodaq-raspberry     # state of the server
   journalctl -u pymodaq-raspberry -f          # live log
   sudo systemctl restart pymodaq-raspberry    # after editing config.py
   sudo bash uninstall.sh                      # remove it (from the package folder)

Manual installation
-------------------

#. **OS Installation** — Flash **Raspberry Pi OS (64-bit)** on a micro-SD card (8 GB min.). Connect via SSH and update the system: ``sudo apt update && sudo apt upgrade -y``.
#. **Enable I2C** — ``sudo raspi-config`` → *Interfacing Options* → *I2C*.
#. **pigpio daemon** (hardware GPIO control):

   .. code-block:: bash

      sudo apt-get update
      sudo apt-get install pigpio python3-pigpio
      sudo systemctl enable pigpiod
      sudo systemctl start pigpiod

#. **Python dependencies**:

   .. code-block:: bash

      python3 -m venv .venv
      source .venv/bin/activate
      pip install -r requirements.txt
      
   .. note::

      If the ``requirements.txt`` file is missing, you can create it with the following content:

      .. code-block:: text

         Adafruit-Blinka>=8.69.0
         adafruit-circuitpython-busdevice>=5.2.15
         adafruit-circuitpython-connectionmanager>=3.1.6
         adafruit-circuitpython-emc2101>=1.2.12
         adafruit-circuitpython-register>=1.11.1
         adafruit-circuitpython-requests>=4.1.15
         adafruit-circuitpython-typing>=1.12.3
         Adafruit-PlatformDetect>=3.86.0
         Adafruit-PureIO>=1.1.11
         binho-host-adapter>=0.1.6
         board>=1.0
         pigpio>=1.78
         pyftdi>=0.57.1
         pyserial>=3.5
         pyusb>=1.3.1
         pyzmq>=27.1.0
         RPi.GPIO>=0.7.1
         smbus2>=0.6.0
         sysv_ipc>=1.2.0
         typing_extensions>=4.15.0

Running and Auto-start (systemd)
--------------------------------

**Manual test:**

.. code-block:: bash

   python main.py              # listens on port 5555
   python main.py --port 5556  # other port (report it in the plugin configuration)
   python main.py --verbose    # also logs every request and its response

.. note::

   **Automatic simulation mode** — if the I2C bus is unreachable, if no sensor answers on
   it (bench not wired), or if the ``pigpio`` daemon is not running, the server falls back
   to simulation for the concerned part and logs a warning. The simulated temperatures and
   humidity follow a simple thermal model that reacts to the heater and the fan, and each
   simulated reading lasts as long as a real one. The server starts this way on any
   platform (Windows, macOS, Linux), so a whole demonstration can run on a single PC —
   see ``src_raspberry/README.md``.

**In production:** the quick installation above creates the service for you. To do it by
hand, create a systemd service file at ``/etc/systemd/system/pilotage.service``:

.. code-block:: ini

   [Unit]
   Description=Thermal control ZeroMQ Server
   After=network.target pigpiod.service

   [Service]
   ExecStart=/home/admin/PYMODAQ_PLUGIN_RASPPI3/PY_ENV/bin/python /home/admin/PYMODAQ_PLUGIN_RASPPI3/main.py
   WorkingDirectory=/home/admin/PYMODAQ_PLUGIN_RASPPI3
   StandardOutput=inherit
   StandardError=inherit
   Restart=always
   User=admin

   [Install]
   WantedBy=multi-user.target

.. warning::

   Make sure to put a space between the python binary and the path to ``main.py`` in ``ExecStart`` (two separate paths separated by a space).

Then, reload the daemon and start the service:

.. code-block:: bash

   sudo systemctl daemon-reload
   sudo systemctl enable pilotage.service
   sudo systemctl start pilotage.service

**Troubleshooting:**
* Check service status: ``sudo systemctl status pilotage.service`` (should be ``active (running)``).
* Check I2C devices on the bus: ``sudo i2cdetect -y 1``.

Hardware Configuration (config.py)
----------------------------------

The entire topology is centralized in ``src_raspberry/config.py``:

.. code-block:: python

   I2C_BUS_ID      = 1
   VENTILATEUR_PIN = 18     # PWM 25000 Hz
   RESISTANCE_PIN  = 23     # PWM 100 Hz (via MOSFET)

   CAPTEUR_AHT10   = 0x38   # rh_sortie
   CAPTEUR_TMP102  = 0x48   # t_resistance
   # 0x49 t_dissipateur, 0x4A t_entree, 0x4B t_sortie (TMP102)
   CAPTEUR_EMC2101 = 0x4C   # T_emc

To change a pin or an address, modify ``ACTUATORS_CONFIG`` (actuators) or ``SENSORS_CONFIG`` (sensors) in this single file.
