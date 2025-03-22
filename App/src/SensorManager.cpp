#include "SensorManager.h"

SensorManager::SensorManager(uint8_t dhtPin, uint8_t dhtType, uint8_t mq135Pin) 
    : dht(dhtPin, dhtType), mq135_sensor(mq135Pin) {}

void SensorManager::begin() {
    dht.begin();
}

float SensorManager::getTemperature() {
    return dht.readTemperature();
}

float SensorManager::getHumidity() {
    return dht.readHumidity();
}

float SensorManager::getAirQuality() {
    return mq135_sensor.getCorrectedPPM(getTemperature(), getHumidity());
}
