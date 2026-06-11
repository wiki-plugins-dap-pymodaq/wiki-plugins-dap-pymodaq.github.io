Communication (PyMoDAQ ⇄ Raspberry)
===================================

PyMoDAQ and the Raspberry exchange messages over the network. The link is isolated behind
a dedicated layer, so the transport can be replaced without touching the instruments.

Transport: ZeroMQ
-----------------

On the control computer, ``ZMQLink`` (``hardware/Link_PMQ.py``) opens a ZeroMQ
**DEALER** socket and connects to ``tcp://<ip>:<port>`` with a unique identity. On the
Raspberry, the server runs a **ROUTER** socket (``ZmqServer``) listening on port
**5555**.

The Raspberry IP address and port are read from the plugin configuration
(``address_Rasp`` and ``port``, under the ``Raspberry`` section). Every exchange is
**request / response**: PyMoDAQ sends one JSON frame and the server replies with one JSON
frame.

JSON protocol
-------------

A request is a JSON object carrying a ``type`` field, which the server routes to the
matching handler. Five request types are supported.

**Scan** the connected devices:

.. code-block:: json

   {"type": "scan"}

**Acquire** a single value, from an I2C sensor (by address + channel) or from a pin:

.. code-block:: json

   {"type": "AQ", "register": "add", "add": "0x38", "channel": "temp"}
   {"type": "AQ", "register": "pin", "pin": 18}

**Pilot** a single output (set a pin value):

.. code-block:: json

   {"type": "PI", "register": "pin", "pin": 18, "value": 128}

**Multi** acquisition / piloting, to read or drive several components in one frame:

.. code-block:: json

   {
     "type": "AQ-MULTI",
     "components": [
       {"register": "add", "add": "0x38", "channel": "hum"},
       {"register": "pin", "pin": 18}
     ]
   }

Every response uses the same envelope:

.. code-block:: text

   {"state": "ACK",   "value": <result>}
   {"state": "ERROR", "value": "human-readable message"}

On the PyMoDAQ side these frames are built for you by ``ZMQLink``:

* ``multi_acquisition(addresses, pins)`` builds an ``AQ-MULTI`` request — used by the
  ``ViewRasp`` detector;
* ``pilotage(value, address=…, pin=…)`` builds a ``PI`` request — used by the
  ``MoveRasp`` actuator.

Extending the protocol
----------------------

Adding a new request type is symmetric and touches only two places:

* **Raspberry side** — add an entry to the routing table ``_requestHandlers`` in
  ``handlers/json_handler.py`` together with its handler method, which delegates any
  hardware access to the backend (``IHardwareBackend``);
* **PyMoDAQ side** — add a method to ``ZMQLink`` that builds and sends the new request,
  then call it from the move / viewer plugins.

To replace ZeroMQ by another transport (serial, HTTP…), implement the ``ITransport``
interface on the Raspberry and provide, on the PyMoDAQ side, a class exposing the same
methods as ``ZMQLink``.
