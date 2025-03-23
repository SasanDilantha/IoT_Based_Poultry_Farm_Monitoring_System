import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { ScrollView } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const ModeApp = () => {
  const [data, setData] = useState({
    temperature: 24,
    humidity: 60,
    airQuality: 80,
  });

  const [chartData, setChartData] = useState({
    temperatureData: [24],
    humidityData: [60],
    airQualityData: [80],
    timestamps: [new Date()], // Store timestamps for each data point
  });

  const MAX_DATA_POINTS = 20;

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const newTemp = Math.floor(Math.random() * 10) + 20;
        const newHumidity = Math.floor(Math.random() * 20) + 50;
        const newAirQuality = Math.floor(Math.random() * 50) + 50;
        const newTimestamp = new Date();

        setChartData((prevChartData) => ({
          temperatureData: [...prevChartData.temperatureData, newTemp].slice(-MAX_DATA_POINTS),
          humidityData: [...prevChartData.humidityData, newHumidity].slice(-MAX_DATA_POINTS),
          airQualityData: [...prevChartData.airQualityData, newAirQuality].slice(-MAX_DATA_POINTS),
          timestamps: [...prevChartData.timestamps, newTimestamp].slice(-MAX_DATA_POINTS),
        }));

        return {
          temperature: newTemp,
          humidity: newHumidity,
          airQuality: newAirQuality,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const chartWidth = chartData.temperatureData.length * 60;

  // Format time for display (HH:MM:SS)
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
          {/* Color Legend */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.colorDot, { backgroundColor: '#FF5733' }]} />
              <Text style={styles.legendText}>Temp</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.colorDot, { backgroundColor: '#33A1FF' }]} />
              <Text style={styles.legendText}>Humidity</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.colorDot, { backgroundColor: '#FF9F4D' }]} />
              <Text style={styles.legendText}>Air Qlty</Text>
            </View>
          </View>

          <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
            <LineChart
                data={{
                  labels: chartData.timestamps.map(t => formatTime(t)),
                  datasets: [
                    {
                      data: chartData.temperatureData,
                      strokeWidth: 2,
                      color: () => '#FF5733',
                    },
                    {
                      data: chartData.humidityData,
                      strokeWidth: 2,
                      color: () => '#33A1FF',
                    },
                    {
                      data: chartData.airQualityData,
                      strokeWidth: 2,
                      color: () => '#FF9F4D',
                    },
                  ],
                }}
                width={chartWidth}
                height={220}
                chartConfig={{
                  backgroundGradientFrom: "#fff",
                  backgroundGradientTo: "#fff",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(128, 128, 128, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(128, 128, 128, ${opacity})`,
                  propsForLabels: {
                    fontSize: 9,
                  },
                  propsForDots: {
                    r: "4",
                    strokeWidth: "2",
                    stroke: "#fff",
                  },
                }}
                bezier
                style={styles.chartStyle}
                withDots={false}
            />
          </ScrollView>
        </View>
      </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 15,
    margin: 10,
    overflow: "hidden",
  },
  chartStyle: {
    borderRadius: 10,
    paddingRight: 20,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    fontSize: 10,
    color: '#666',
  },
});

export default ModeApp;