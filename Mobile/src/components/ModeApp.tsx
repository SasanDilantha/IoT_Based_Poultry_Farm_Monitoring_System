import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { BarChart } from "react-native-chart-kit";

const ModeApp = () => {
  const [data, setData] = useState({
    temperature: 24, // Initial temperature (°C)
    humidity: 60, // Initial humidity (%)
    airQuality: 80, // Initial air quality index (AQI)
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setData({
        temperature: Math.floor(Math.random() * 10) + 20, // Random temp (20-30°C)
        humidity: Math.floor(Math.random() * 20) + 50, // Random humidity (50-70%)
        airQuality: Math.floor(Math.random() * 50) + 50, // Random AQI (50-100)
      });
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <BarChart
        data={{
          labels: ["Temp (°C)", "Humidity (%)", "Air Quality"],
          datasets: [{ data: [data.temperature, data.humidity, data.airQuality] }],
        }}
        width={350}
        height={220}
        yAxisLabel=""
        yAxisSuffix=""
        chartConfig={{
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          barPercentage: 0.5,
          fillShadowGradientOpacity: 1,
          fillShadowGradientFromOpacity: 1,
          fillShadowGradientFrom: "#ff5733", // Temperature (Red)
          fillShadowGradientTo: "#33a1ff", // Humidity (Blue)
          fillShadowGradientToOpacity: 0.8,
        }}
        style={{ borderRadius: 10 }}
      />
    </View>
  );
};

export default ModeApp;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 15,
    margin: 10,
  },
});
