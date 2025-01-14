from utils.log import Logger
import sys
from utils.rabbitmq import RabbitMQClient
import paho.mqtt.client as mqtt_client
import json
from utils.database import Database

class Client():
        
    def __init__(self, is_dev_mode: bool) -> None:
        self.logger : Logger = Logger(filename="hml", is_dev_mode=is_dev_mode)
        self.mqtt_client = RabbitMQClient(logger=self.logger)
        self.db = Database(logger=self.logger)
        self.setup_callables()
        
        self.logger.info("Client initialized.")
        
    @staticmethod
    def parse_topic(logger: Logger, topic: str) -> tuple:
        """
        Reads a topic string and returns the Raspberry Pi, Arduino, and interface.

        Parameters
        ----------
        logger : Logger
            The logger object to log messages to.
        topic : str
            The topic string to parse.

        Returns
        -------
        tuple
            A tuple containing the Raspberry Pi, Arduino, and interface.

        Raises
        ------
        ValueError
            If the topic string is not in the correct format.
        ValueError
            If the Raspberry Pi or Arduino names are empty.
        ValueError
            If the interface is not one of "cmd", "data", or "rsp".
            
        >>> Client.parse_topic("Rasp_1/Arduino_1/cmd")
        >>> ("1", "1", "cmd")
        >>> # ...
        >>> Client.parse_topic("Rasp_1/Arduino_/data")
        >>> ValueError
        """
        try:
            raspberry, arduino, interface = topic.split("/")
            if not raspberry.startswith("Rasp_") or not arduino.startswith("Arduino_"):
                raise ValueError("Invalid topic format.")
            if interface not in ["cmd", "data", "rsp"]:
                raise ValueError("Invalid interface.")
            
            raspberry = raspberry.replace("Rasp_", "")
            arduino = arduino.replace("Arduino_", "")
            
            if raspberry == "" or arduino == "":
                raise ValueError("Empty Raspberry Pi or Arduino name.")
            
            return raspberry, arduino, interface
        except ValueError as e:
            logger.error(f"An error occurred on function 'parse_topic()': {e}")
            return None

    @staticmethod
    def parse_data(logger: Logger, message: dict) -> tuple:
        """
        {
            "type": "sensor",
            "data": {
                "id": "1",
                "type": "temperature",
                "value": 2550,
                "unit": "C"
            }
        }
        """
        try:
            t = message.get("type")
            
            if t is None:
                raise ValueError("Invalid message format.")
            
            data = message.get("data")
            if data is None:
                raise ValueError("Invalid message format.")
            
            if t == "sensor":
                sensor_id = data.get("id")
                sensor_type = data.get("type")
                value = data.get("value")
                unit = data.get("unit")
                
                if sensor_type is None or value is None or unit is None:
                    raise ValueError("Invalid message format.")
                
                if not isinstance(value, (int, float)):
                    raise ValueError("Invalid message format.")
                
                #if sensor_type not in ["temperature", "humidity", "pressure", "moisture", "sound", ""]:
                #    raise ValueError("Invalid sensor type.")
                
                # This is hardcoded for now, but we can add more types later
                
                #value /= 100 # Convert to float, e.g. 2550 -> 25.50
                
                return sensor_id, sensor_type, value, unit
            else:
                raise ValueError
        except ValueError as e:
            logger.error(f"An error occurred on function 'parse_message()': {e}")
            return None

    def setup_callables(self):
        def on_disconnect(client: mqtt_client.Client, userdata, rc, properties=None):
            self.logger.info("Disconnected from MQTT Broker!")
            
        def on_message(client, userdata, msg: mqtt_client.MQTTMessage) -> None:
            """
            Function to be passed to the MQTT client to handle messages.
            """
            self.logger.info("Received message.")
            try:
                message = json.loads(msg.payload.decode())
            except json.JSONDecodeError:
                self.logger.error("Failed to decode message payload.")
            except ValueError:
                self.logger.error("Failed to decode message payload.")
            except Exception as e:
                self.logger.error(f"An error occurred: {e}")
                
            self.logger.info(f"Topic: {msg.topic}")            
            self.logger.info(f"Payload: {message}")
            
            parsed_topic = self.parse_topic(self.logger, msg.topic)
            
            if parsed_topic is None:
                self.logger.error("Invalid topic format.")
                return
            
            raspberry, arduino, interface = parsed_topic
            
            handler = self.handler(interface)
            
            if handler is None:
                self.logger.error("Invalid interface.")
                return
            
            handler(raspberry, arduino, message)
            
        self.mqtt_client.client.on_message = on_message
        self.mqtt_client.client.on_disconnect = on_disconnect
    
    def handler(self, interface: str):
        if interface == "cmd":
            return self.handle_cmd
        elif interface == "rsp":
            return self.handle_rsp
        elif interface == "data":
            return self.handle_data
        else:
            return None
    
    def handle_cmd(self, raspberry: str, arduino: str, message: dict) -> None:
        raise NotImplementedError("Command interface not implemented.")
    
    def handle_rsp(self, raspberry: str, arduino: str, message: dict) -> None:
        raise NotImplementedError("Response interface not implemented.")
    
    def handle_data(self, raspberry: str, arduino: str, message: dict) -> None:
        self.logger.info(f"Received data from Raspberry Pi ({raspberry}), Arduino ({arduino}).")
        
        parsed_message = self.parse_data(self.logger, message)
            
        if parsed_message is None:
            self.logger.error("Invalid message format.")
            return
        
        id, _sensor_type, value, _unit = parsed_message
        
        self.db.insert_metrics(id, value)
        
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_value, traceback) -> None:
        self.close()
        
    def close(self) -> None:
        self.mqtt_client.client.disconnect()
        
    def execute(self) -> None:
        with self.mqtt_client:
            self.logger.info("Executing...")

def main(is_dev_mode: bool):
    client = Client(is_dev_mode=is_dev_mode)        
    client.execute()
        
if __name__ == "__main__":  
    if len(sys.argv) == 1:
        main(is_dev_mode=False)
    elif len(sys.argv) == 2 and sys.argv[1] == "--dev":
        main(is_dev_mode=True)
    else:
        print("Invalid command.")
        sys.exit(1)