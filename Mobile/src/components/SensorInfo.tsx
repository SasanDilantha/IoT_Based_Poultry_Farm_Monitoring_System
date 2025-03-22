import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Feather";

interface SensorInfoProps {
  title: string;
  value: string;
}

const SensorInfo = ({ title, value }: SensorInfoProps) => {
  const getIcon = (title: string) => {
    switch (title) {
      case "Temperature":
        return "thermometer";
      case "Humidity":
        return "droplet";
      case "Air Quality":
        return "wind";
      default:
        return "alert-circle";
    }
  };

  return (
    <View style={styles.container}>
      <Icon name={getIcon(title)} size={40} color="#007AFF" />
      <Text style={styles.text}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

export default SensorInfo;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    borderColor: "#ddd",
    borderWidth: 1,
    flexBasis: "30%",
    minWidth: 100, 
    margin: 5,
  },
  text: {
    textAlign: "center",
    fontSize: 14, 
    fontWeight: "600",
  },
  value: {
    textAlign: "center",
    fontSize: 20, 
    fontWeight: "bold",
    color: "#4CAF50",
  },
});
