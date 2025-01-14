import paho.mqtt.client as mqtt
import time
from datetime import datetime
import socket

rasp_id = "RaspZ"

# receive
middleware_broker = "middleware_rabbitmq_ip"
middleware_port = 1883

# send
server_broker = "server_rabbitmq_ip"
server_port = 1883
topicX = "Arduino_X"
topicY = "Arduino_Y"
batched_messages = []
batch_interval = 60
last_sent_time = time.time()
forward_client = mqtt.Client()


def on_message(client, userdata, message):
    global batched_messages
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    batched_messages.append((message.topic, message.payload.decode(), timestamp))


def forward_messages():
    global batched_messages, last_sent_time
    forward_client.connect(server_broker, server_port)

    for topic, payload, timestamp in batched_messages:
        # prepend the identifier (rasp_id) to the original topic
        new_topic = f"{rasp_id}/{topic}"
        message_with_time = f"{payload} ({timestamp})"
        forward_client.publish(new_topic, message_with_time)

    batched_messages = []
    last_sent_time = time.time()


client = mqtt.Client()
client.on_message = on_message

client.connect(middleware_broker, middleware_port)
client.subscribe(topicX)
client.subscribe(topicY)

while True:
    client.loop()
    # check if it's time to send
    if time.time() - last_sent_time > batch_interval:
        forward_messages()
