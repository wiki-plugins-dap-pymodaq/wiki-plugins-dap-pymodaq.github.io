Adapting the plugin to a bench
==============================

Every Raspberry has its own bench. The whole difference between two benches is held in a
single file, ``src_raspberry/config.py``: the transport, the request handling and
``main.py`` never change.

The configuration file
----------------------

``config.py`` exposes the I2C bus id, the GPIO pins and two structures describing the
hardware.

**Actuators** — a list of dictionaries. Each actuator selects its driver with the
``driver`` field (``PWM`` or ``DIGITAL``, keys of ``ACTUATOR_DRIVER_REGISTRY``):

.. code-block:: python

   ACTUATORS_CONFIG = [
       {
           'pin':           18,
           'title':         'Ventilateur',
           'name':          'ventilateur',
           'driver':        'PWM',        # 'PWM' or 'DIGITAL'
           'units':         '%',
           'min':           0,
           'max':           255,
           'address':       None,
           'pwm_frequency': 25000,        # PWM only
       },
   ]

**Sensors** — a dictionary keyed by I2C address. Each sensor selects its driver with the
``driver`` field (key of ``SENSOR_DRIVER_REGISTRY``: ``AHT10``, ``TMP102``, ``EMC2101``,
``PT-100``, ``SIMULE``); the ``default`` entry is the fallback for unknown devices:

.. code-block:: python

   SENSORS_CONFIG = {
       0x38: {'driver': 'AHT10',  'title': 'aht10',  'name': 'rh_sortie',  'units': 'RH'},
       0x48: {'driver': 'TMP102', 'title': 'tmp102', 'name': 't_resistance', 'units': '°C'},
       'default': {'driver': 'Unknown', 'title': 'Unknown Sensor', 'name': 'unknow_sensor', 'units': ''},
   }

Ready-made benches
------------------

Two configurations are provided:

* the **default** ``config.py`` — actuators driven in **PWM** (fan + heater), with the
  AHT10 humidity sensor, four TMP102 temperature probes and the EMC2101 controller;
* ``config_examples/config_pizero.py`` — actuators driven in **all-or-nothing**
  (``DIGITAL``) with a **PT-100** probe, illustrating a very different bench.

To switch bench, copy the wanted file from ``config_examples/`` over ``config.py``.

Adding new hardware
-------------------

Adding a component is just writing a small driver class and registering it; nothing else
(transport, request handling, ``main.py``) changes:

* a **new sensor** → a class in ``hardware/sensors.py`` registered in
  ``SENSOR_DRIVER_REGISTRY``;
* a **new actuator mode** → a class in ``hardware/actuators.py`` registered in
  ``ACTUATOR_DRIVER_REGISTRY``.

The driver chosen in ``config.py`` is then resolved from the matching registry at
start-up.
