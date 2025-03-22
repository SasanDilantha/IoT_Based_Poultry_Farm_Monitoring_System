#include "HttpClientMgr.h"

HttpClientMgr::HttpClientMgr(String serverUrl) {
    this->serverUrl = serverUrl;
}

String HttpClientMgr::sendData(float temp, float humidity, float airQuality) {
    HTTPClient http;
    String url = String(serverUrl) + "/update?temp=" + temp + "&humidity=" + humidity + "&ammonia=" + airQuality;
    http.begin(url);
    int httpCode = http.GET();
    String response = (httpCode == 200) ? http.getString() : "No Response";
    http.end();
    return response;
}
