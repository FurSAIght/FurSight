## Simulators Documentation

This section explores scripts that generate realistic sensor data and transmit it to MQTT brokers. These simulators help test IoT data collection systems by mimicking how sensors would behave in real-world environments.

### Temperature Simulator

The **Temperature Simulator** is designed to simulate temperature readings over time. It periodically publishes simulated temperature data to a specified MQTT topic, simulating a temperature sensor that communicates with a central message broker.

#### Key Functions

- `setup_mqtt_client()`: Configures and connects to the MQTT broker.
- `simulate_temperature()`: Generates temperature values based on a combination of seasonal, daily, and random noise factors.
- `publish_temperature()`: Formats and publishes the temperature data to the MQTT broker.

