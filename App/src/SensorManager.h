#ifndef SENSOR_MANAGER_H
#define SENSOR_MANAGER_H

#include <DHT.h>
#include <MQ135.h>

class SensorManager {
private:
    DHT dht;
    MQ135 mq135_sensor;
public:
    SensorManager(uint8_t dhtPin, uint8_t dhtType, uint8_t mq135Pin);
    void begin();
    float getTemperature();
    float getHumidity();
    float getAirQuality();
};

#endif
