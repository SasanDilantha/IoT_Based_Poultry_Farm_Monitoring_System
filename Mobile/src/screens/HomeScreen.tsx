import React, { useState } from "react";
import { View, Text, SafeAreaView, ScrollView, Alert, TouchableOpacity, TextInput } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ButtonSwitch from "../components/ButtonSwitch";
import SensorInfo from "../components/SensorInfo";
import mainStyles from "../utils/mainStyles";
import ModeApp from "../components/ModeApp";

import DateTimePicker from '@react-native-community/datetimepicker';

const HomeScreen = () => {
  const [time, setTime] = useState(new Date()); // Initial time state
  const [showPicker, setShowPicker] = useState(false);
  const [manualTime, setManualTime] = useState(""); // Manual time input state

  const onTimeChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      setTime(selectedDate);
      setManualTime(formatTime(selectedDate)); // Update manual input field as well
    }
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
  };

  const [fanOn, setFanOn] = useState(false);
  const [lightOn, setLightOn] = useState(false);

  const toggleFan = () => setFanOn(!fanOn);

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

        <View style={mainStyles.switchContainer}>
          <View style={mainStyles.row}>
            <View style={mainStyles.switchImageContainer}>
              <Icon name="lightning-bolt" size={24} color="#333" />
            </View>
            <View>
              {/* Touchable for Time Picker */}
              <TouchableOpacity onPress={() => setShowPicker(true)}>
                <Text style={mainStyles.switchTitle}>{manualTime || formatTime(time)}</Text>
              </TouchableOpacity>

              {/* TextInput for manual time entry */}
              <TextInput
                style={{
                  borderBottomWidth: 1,
                  borderColor: "#ccc",
                  paddingVertical: 5,
                  fontSize: 16,
                  marginTop: 5,
                }}
                placeholder="Enter time (HH:mm)"
                value={manualTime}
                onChangeText={setManualTime}
              />

              <Text>Power usage today</Text>
            </View>
          </View>

          {/* Time picker modal */}
          {showPicker && (
            <DateTimePicker value={time} mode="time" is24Hour={true} onChange={onTimeChange} />
          )}
        </View>

        <View style={[mainStyles.row, { flexWrap: "wrap", justifyContent: "space-evenly" }]}>
          <ButtonSwitch title="Fan" isOn={fanOn} onToggle={toggleFan} />
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
