Instruments
===========

The plugin exposes three PyMoDAQ instruments. The actuator and the 0D viewer talk to the
Raspberry over the network (see :doc:`communication`); the 2D viewer drives the Pi camera
directly and therefore only works on the Raspberry itself.

MoveRasp — actuator (DAQ_Move)
------------------------------

``MoveRasp`` drives the **outputs** of the bench wired to the Raspberry (e.g. a fan or a
heater), either in **PWM** or in **all-or-nothing** mode depending on the bench
configuration.

* The available **axes** are loaded automatically from the bench configuration
  (``ACTUATORS_CONFIG`` in ``config.py``): each actuator becomes a selectable axis with
  its own ``title``, ``units`` and bounds (``min`` / ``max``).
* Selecting an axis updates the units and bounds accordingly; the set-point is then sent
  to the Raspberry as a *piloting* request through the ZMQ link.
* ``Find home`` drives the selected output to ``0``.

On the default bench, two PWM actuators are exposed: a **fan** (*Ventilateur*, 25 kHz)
and a **heater** (*Resistance*, 100 Hz).

ViewRasp — detector (DAQ_Viewer 0D)
-----------------------------------

``ViewRasp`` reads the **sensors** of the bench (I2C sensors and pin inputs) wired to the
Raspberry.

* The settings list every component found in the configuration, grouped under
  **Detectors** and **Actuators**; tick the components you want to acquire.
* On each grab, the selected components are read in a **single multi-acquisition
  request** and returned as 0D data — one labelled channel per component.

On the default bench, the available channels include the relative humidity (AHT10) and
several temperatures (four TMP102 probes and the EMC2101 controller).

PiCamera — detector (DAQ_Viewer 2D)
-----------------------------------

``PiCamera`` streams the **Raspberry Pi camera** using the `Picamera2
<https://github.com/raspberrypi/picamera2>`_ library.

* The ``Resolution`` parameter switches between ``low`` (preview configuration) and
  ``high`` (still configuration).
* A frame is returned as a 2D array (grayscale) or as three channels (RGB); hardware
  averaging over *Naverage* frames is supported.

.. warning::

   ``picamera2`` is **Linux / Raspberry only**. On a Windows or macOS control machine the
   PiCamera viewer is simply not loaded; the remote actuator and 0D detector keep working.
