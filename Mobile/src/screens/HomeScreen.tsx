import React, { useState } from "react";
import { View, SafeAreaView, ScrollView } from "react-native";
import ButtonSwitch from "../components/ButtonSwitch";
import SensorInfo from "../components/SensorInfo";
import mainStyles from "../utils/mainStyles";
import ModeApp from "../components/ModeApp";
import TimeScheduler from "../components/TimeScheduler";

const HomeScreen = () => {
  const [fanOn, setFanOn] = useState(false);

  const toggleFan = () => setFanOn(!fanOn);

  const handleTimeChange = (time: Date) => {
    console.log("Scheduled time:", time);
  };

  return (
      <SafeAreaView style={mainStyles.container}>
        <ScrollView>
          <View style={mainStyles.row}>
            <SensorInfo title="Temperature" icon="thermometer" value="24°C" />
            <SensorInfo title="Humidity" icon="water-percent" value="60%" />
            <SensorInfo title="Air Quality" icon="weather-windy" value="Good" />
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