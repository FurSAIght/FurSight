import numpy as np
import time
import paho.mqtt.client as mqtt
from datetime import datetime
import json

# Configuration for MQTT
BROKER_ADDRESS = "raspberrypi"  # RabbitMQ is running on the local machine
BROKER_PORT = 1883            # Default MQTT port for unencrypted traffic
MQTT_TOPIC = "sensor/temp"  # Topic to publish temperature data

# RabbitMQ User Credentials
MQTT_USER = "admin1"        # Username for RabbitMQ
MQTT_PASSWORD = "admin1"    # Password for RabbitMQ

BASE_TEMPERATURE = 20.0       # Base temperature in Celsius
SEASONAL_VARIATION = 10.0     # Seasonal temperature variation (Celsius)
DAILY_VARIATION = 5.0         # Daily fluctuation in temperature (Celsius)
NOISE_AMPLITUDE = 0.5         # Noise amplitude to simulate sensor imperfections
INTERVAL_SECONDS = 5          # Interval for each reading (seconds)

# Initialize the MQTT client
def setup_mqtt_client():
    client = mqtt.Client()  
    client.username_pw_set(MQTT_USER, MQTT_PASSWORD)
    client.connect(BROKER_ADDRESS, BROKER_PORT)
    
    return client

# Generate the temperature reading based on time-based factors and random noise
def simulate_temperature(base_temp, seasonal_variation, daily_variation, noise_amplitude, start_time):
    current_time = datetime.now()
    elapsed_seconds = (current_time - start_time).total_seconds()
    day_of_year = start_time.timetuple().tm_yday

    seasonal_trend = seasonal_variation * np.sin(2 * np.pi * (day_of_year - 81) / 365)
    daily_trend = daily_variation * np.sin(2 * np.pi * elapsed_seconds / (24 * 60 * 60))
    random_noise = np.random.normal(0, noise_amplitude)

    return base_temp + seasonal_trend + daily_trend + random_noise

# Publish temperature data to the MQTT broker
def publish_temperature(client, topic, temperature):
    payload = {
        "timestamp": datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        "temperature": round(temperature, 2)
    }
    client.publish(topic, json.dumps(payload))
    print(f"Published to {topic}: {payload}")

def main():
    client = setup_mqtt_client()
    start_time = datetime.now()
    np.random.seed(42)

    try:
        while True:
            current_temperature = simulate_temperature(
                BASE_TEMPERATURE,
                SEASONAL_VARIATION,
                DAILY_VARIATION,
                NOISE_AMPLITUDE,
                start_time
            )

            publish_temperature(client, MQTT_TOPIC, current_temperature)
            
            time.sleep(INTERVAL_SECONDS)

    except KeyboardInterrupt:
        print("\nTemperature simulation stopped by user.")
    finally:
        client.disconnect()

if __name__ == "__main__":
    main()
