Raspberry plugin
================

``pymodaq_plugins_raspberry`` lets PyMoDAQ control an experimental device (or test
bench) through a **Raspberry Pi**. A small server runs *on the Raspberry Pi* and drives
the sensors and actuators; PyMoDAQ talks to it over the network and exposes a detector
(to read the sensors) and an actuator (to drive the outputs), as if they were local
instruments.

This single plugin **replaces** the former *Raspberry Pi 3* and *Raspberry Pi Zero*
plugins: a given bench is now just a configuration of the same code base.

.. note::

   Detailed documentation (instruments, ZeroMQ / JSON communication protocol and the
   on-Pi server) is added in a later sprint.
