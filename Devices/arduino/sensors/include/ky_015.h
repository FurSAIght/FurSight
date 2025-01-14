#include <DHT.h>
#include <DHT_U.h>

#define DHTPIN 11
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

void ky_015_init() {
    dht.begin();
}

float ky_015_read_temperature() {
    return dht.readTemperature();
}

float ky_015_read_humidity() {
    return dht.readHumidity();
}
