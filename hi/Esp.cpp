#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "your_SSID";
const char* password = "your_PASSWORD";
const char* loginUrl = "http://localhost:3000/users/login"; 
const char* updateUrl = "http://localhost:3000/maps/update-stations";


#define SENSOR_1  4
#define SENSOR_2  5
#define SENSOR_3  18
#define SENSOR_4  19
#define SENSOR_5  21

String authToken;

void setup() {
    Serial.begin(115200);
    WiFi.begin(ssid, password);
    
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.println("\nConnected to WiFi");

    // Set sensor pins 
    pinMode(SENSOR_1, INPUT);
    pinMode(SENSOR_2, INPUT);
    pinMode(SENSOR_3, INPUT);
    pinMode(SENSOR_4, INPUT);
    pinMode(SENSOR_5, INPUT);

    // Perform login
    if (WiFi.status() == WL_CONNECTED) {
        HTTPClient http;
        http.begin(loginUrl);
        http.addHeader("Content-Type", "application/json");

        // Create JSON object for login
        StaticJsonDocument<200> loginDoc;
        loginDoc["email"] = "test(stationname)@test.com";
        loginDoc["password"] = "testpass";

        String loginRequestBody;
        serializeJson(loginDoc, loginRequestBody);

        int httpResponseCode = http.POST(loginRequestBody);
        
        if (httpResponseCode > 0) {
            String response = http.getString();
            Serial.println("Login Response: " + response);

            // Parse the response to get the token
            StaticJsonDocument<200> responseDoc;
            deserializeJson(responseDoc, response);
            authToken = responseDoc["token"].as<String>();
        } else {
            Serial.println("Error in login");
        }

        http.end();
    }
}

void loop() {
    if (WiFi.status() == WL_CONNECTED && authToken.length() > 0) {
        HTTPClient http;
        http.begin(updateUrl);
        http.addHeader("Content-Type", "application/json");
        http.addHeader("Authorization", "Bearer " + authToken);

        // Read sensor values
        bool sensor1 = digitalRead(SENSOR_1);
        bool sensor2 = digitalRead(SENSOR_2);
        bool sensor3 = digitalRead(SENSOR_3);
        bool sensor4 = digitalRead(SENSOR_4);
        bool sensor5 = digitalRead(SENSOR_5);

        // Count the number of false values (ports available)
        int portsAvailable = 0;
        portsAvailable += !sensor1;
        portsAvailable += !sensor2;
        portsAvailable += !sensor3;
        portsAvailable += !sensor4;
        portsAvailable += !sensor5;

        // Create JSON object
        StaticJsonDocument<200> jsonDoc;
        jsonDoc["name"] = "Station name";  // Change to actual station name
        jsonDoc["latitude"] = 12.9718;  // Change to actual latitude
        jsonDoc["longitude"] = 77.6411;  // Change to actual longitude
        jsonDoc["portsAvailable"] = portsAvailable;

        String requestBody;
        serializeJson(jsonDoc, requestBody);

        int httpResponseCode = http.POST(requestBody);
        
        if (httpResponseCode > 0) {
            String response = http.getString();
            Serial.println("Update Response: " + response);
        } else {
            Serial.println("Error in sending data");
        }

        http.end();
    }

    delay(5000);  // Send data every 5 seconds
}