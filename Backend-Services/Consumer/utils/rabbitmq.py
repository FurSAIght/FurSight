import random
import paho.mqtt.client as mqtt_client
import os
from utils.log import Logger

class RabbitMQClient:
    client: mqtt_client.Client
    def __init__(self, logger: Logger) -> None:
        self.logger = logger

        self.broker = os.environ.get('MQTT_BROKER')
        self.port = int(os.environ.get('MQTT_PORT', 1883))
        self.topic = os.environ.get('MQTT_TOPIC', '*')
        self.client_id = f'subscriber-{random.randint(0, 1000)}'
        self.username = os.environ.get('MQTT_USERNAME', '')
        self.password = os.environ.get('MQTT_PASSWORD', '')
        
        self._connect_mqtt()

    def _connect_mqtt(self) -> None:
        def on_connect(client: mqtt_client.Client, userdata, flags, rc, properties=None):
            if rc != 0:
                self.logger.error(f"Failed to connect, return code {rc}\n")
                raise Exception("Failed to connect to MQTT Broker")
            
            self.logger.info("Connected to MQTT Broker!")
            client.subscribe(self.topic, qos=1)
            self.logger.info(f"Subscribed to topic {self.topic}")
            
        self.client = mqtt_client.Client(client_id=self.client_id, callback_api_version=mqtt_client.CallbackAPIVersion.VERSION2)
        self.client.username_pw_set(self.username, self.password)
        self.client.on_connect = on_connect
        self.client.connect_async(self.broker, self.port)
        
    def __enter__(self):
        self.client.loop_forever()
        return self
    
    def __exit__(self, exc_type, exc_value, exc_traceback):
        self.client.disconnect()
        self.logger.info("Disconnected from topic %s", self.topic)