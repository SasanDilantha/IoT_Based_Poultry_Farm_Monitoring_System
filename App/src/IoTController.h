#ifndef IOT_CONTROLLER_H
#define IOT_CONTROLLER_H

#include "WiFiManager.h"
#include "SensorManager.h"
#include "DisplayManager.h"
#include "HttpClientMgr.h"

class IoTController {
private:
    WiFiManager wifi;
    SensorManager sensor;
    DisplayManager display;
    HttpClientMgr http;
public:
    IoTController();
    void setup();
    void loop();
};

#endif
