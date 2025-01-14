#include <ArduinoJson.h>
#include <DHT.h>
#include <DHT_U.h>
#include <PubSubClient.h>
#include <WiFi.h>

#include "ky_015.h"
#include "leds.h"

const char *ssid = "sci";
const char *password = "sciscisci";

const char *mqtt_server = "192.168.139.77";
const int mqtt_port = 1883;

const char *mqtt_user = "admin1";
const char *mqtt_pass = "admin1";

WiFiClient espClient;

PubSubClient client(espClient);

const char *topicX = "sensor/temp_humd";

void setup_wifi() {
  delay(10);
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);

  TURN_ON_BLUE_LED();
  TURN_ON_RED_LED();

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    SWITCH_LED(LED_BLUE);
    SWITCH_LED(LED_RED);
    Serial.print(".");
  }

  TURN_OFF_RED_LED();
  TURN_OFF_BLUE_LED();
  TURN_ON_GREEN_LED();

  Serial.println();
  Serial.println("WiFi connected");
}

void reconnect() {
  TURN_OFF_BUILTIN_LED();
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    
    if (client.connect("ArduinoClient", mqtt_user, mqtt_pass)) {
      TURN_ON_BUILTIN_LED();
      Serial.println("connected");
    } else {
      SWITCH_LED(LED_BUILTIN);
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}

void setup() {
  Serial.begin(115200);

  pinMode(LED_GREEN, OUTPUT);
  pinMode(LED_RED, OUTPUT);
  pinMode(LED_BLUE, OUTPUT);
  pinMode(LED_BUILTIN, OUTPUT);

  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);

  ky_015_init();
}

void loop() {
  if (!client.connected()) {
    reconnect();
  }
  
  client.loop();

  float h = ky_015_read_humidity();
  float t = ky_015_read_temperature();

  if (isnan(h) || isnan(t)) {
    Serial.println("Error while reading the sensor");
    return;
  }

  JsonDocument doc;

  doc["temperature"] = t;
  doc["humidity"] = h;

  const char *payload = doc.as<String>().c_str();

  client.publish(topicX, payload);

  delay(5000);
}
