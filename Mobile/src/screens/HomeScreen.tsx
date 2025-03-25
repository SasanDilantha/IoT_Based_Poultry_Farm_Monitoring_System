import React, { useState, useEffect } from "react";
import { View, SafeAreaView, ScrollView, ActivityIndicator } from "react-native";
import ButtonSwitch from "../components/ButtonSwitch";
import SensorInfo from "../components/SensorInfo";
import mainStyles from "../utils/mainStyles";
import ModeApp from "../components/ModeApp";
import TimeScheduler from "../components/TimeScheduler";

const SERVER_URL = "http://192.168.171.15:5000";

const HomeScreen = () => {
  const [fanOn, setFanOn] = useState(false);
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/status`);
      const result = await response.json();
      setSensorData(result);
      setFanOn(result.fanStatus);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const toggleFan = async () => {
    const newStatus = !fanOn;
    try {
      await fetch(`${SERVER_URL}/fan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fanStatus: newStatus }),
      });
      setFanOn(newStatus);
    } catch (error) {
      console.error("Error updating fan status:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleTimeChange = (time) => {
    console.log("Scheduled time:", time);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={mainStyles.loader} />;
  }

  return (
    <SafeAreaView style={mainStyles.container}>
      <ScrollView>
        <View style={mainStyles.row}>
          <SensorInfo title="Temperature" icon="thermometer" value={`${sensorData?.temperature}°C`} />
          <SensorInfo title="Humidity" icon="water-percent" value={`${sensorData?.humidity}%`} />
          <SensorInfo title="Air Quality" icon="weather-windy" value={`${sensorData?.airQuality} PPM`} />
        </View>

        <View>
          <ModeApp />
        </View>

        <TimeScheduler onTimeChange={handleTimeChange} />

        <View style={[mainStyles.row, { flexWrap: "wrap", justifyContent: "space-evenly" }]}>
          <ButtonSwitch title="Fan" isOn={fanOn} onToggle={toggleFan} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
