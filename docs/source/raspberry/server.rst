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
  (``HardwareBackend`` → ``JsonRequestHandler`` → ``ZmqServer`` on port 5555).

Requirements and installation
-----------------------------

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

Running the server
------------------

.. code-block:: bash

   python main.py

.. note::

   **Simulation mode** — if the I2C bus or the ``pigpio`` daemon are unreachable (for
   instance when running on a regular PC), the server automatically falls back to
   simulated objects (``MagicMock``), so the network communication can be tested without
   a real Raspberry Pi.
