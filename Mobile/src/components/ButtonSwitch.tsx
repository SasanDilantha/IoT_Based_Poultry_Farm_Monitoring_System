import React, { useEffect, useState, useRef } from "react";
import { View, Text, Switch, StyleSheet, Animated, Easing } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

interface ButtonSwitchProps {
  title: string;
  isOn: boolean;
  onToggle: () => void;
}

const ButtonSwitch = ({ title, isOn, onToggle }: ButtonSwitchProps) => {
  const [currentState, setCurrentState] = useState(isOn);
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setCurrentState(isOn);
    if (title === "Fan" && isOn) {
      startSpinAnimation();
    } else {
      stopSpinAnimation();
    }
  }, [isOn]);

  const startSpinAnimation = () => {
    spinValue.setValue(0);
    Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
    ).start();
  };

  const stopSpinAnimation = () => {
    spinValue.setValue(0);
  };

  const spin = spinValue.interpolate({
    inputRange: [0,0.3],
    outputRange: ["0deg", "360deg"],
  });

  const getIconName = (title: string) => {
    if (title === "Fan") return "fan";
    if (title === "Light") return "lightbulb";
    return "toggle-switch";
  };

  return (
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          {title === "Fan" ? (
              <Animated.View style={{ transform: [{ rotate: spin }] }}>
                <Icon name={getIconName(title)} size={40} color={currentState ? "#FFA500" : "gray"} />
              </Animated.View>
          ) : (
              <Icon name={getIconName(title)} size={40} color={currentState ? "#FFA500" : "gray"} />
          )}
        </View>
        <Text style={styles.text}>{title}</Text>
        <View style={styles.switchRow}>
          <Text style={styles.stateText}>{currentState ? "Fan is On" : "Fan is Off"}</Text>
          <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={currentState ? "#007AFF" : "#f4f3f4"}
              onValueChange={onToggle}
              value={currentState}
          />
        </View>
      </View>
  );
};

export default ButtonSwitch;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    backgroundColor: "#f6f6f6",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 10,
  },
  text: {
    paddingVertical: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    width: "80%",
  },
  stateText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});