## Node-RED Flows Documentation - Section Summary

**Node-RED** simplifies middleware data processing through its visual interface, where components can be arranged to create data flows. This visual approach removes the need to write complex code for **real-time operations** like data transformation, filtering, and routing. It functions as a centralized platform paired with the RaspberryPi, connecting sensors, databases, and applications while managing the **data flow** between them.

### Flow_1: Real-Time Temperature Data Processing

**Purpose**: This flow processes temperature sensor data in real-time, calculates a moving average, and logs data for debugging.
 
#### Flow Actions

- The flow collects temperature readings from an MQTT broker.
- Extracted temperature values are processed to calculate a moving average(Weighted).
- Aggregate timestamp and moving average for output.
- Generate logs at key points for debugging.