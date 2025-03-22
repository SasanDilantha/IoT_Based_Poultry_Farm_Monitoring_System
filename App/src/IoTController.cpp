#include "IoTController.h"

IoTController::IoTController() 
    : wifi("Xperia_3309", "ds516dila"),
      sensor(4, DHT22, 34),
      display(128, 64, -1),
      http("http://192.168.64.44:5000") {}

void IoTController::setup() {
    Serial.begin(115200);
    wifi.connect();
    sensor.begin();
    display.begin();
}

void IoTController::loop() {
    float temp = sensor.getTemperature();
    float humidity = sensor.getHumidity();
    float airQuality = sensor.getAirQuality();
    String message = http.sendData(temp, humidity, airQuality);
    display.showData(temp, humidity, airQuality, message);
    delay(10000);
}
    