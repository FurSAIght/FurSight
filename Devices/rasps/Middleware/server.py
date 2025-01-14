import paho.mqtt.client as mqtt
import os
from supabase import create_client, Client

broker = "middleware_rabbitmq_ip"
port = 1883

# topics to subscribe to (with middleware RaspZ prefix)
topicX = "RaspZ/Arduino_X/*"
topicY = "RaspZ/Arduino_Y/*"

supabase_url = "https://url.supabase.co"
supabase_key = "KEY"
supabase: Client = create_client(supabase_url, supabase_key)


def on_message(client, userdata, message):
    payload = message.payload.decode()
    topic = message.topic

    data = {"topic": topic, "message": payload}

    response = supabase.table("temperaturas-table").insert(data).execute()
    print("Inserted data:", response)


client = mqtt.Client()
client.on_message = on_message

client.connect(broker, port)
client.subscribe(topicX)
client.subscribe(topicY)

client.loop_forever()
