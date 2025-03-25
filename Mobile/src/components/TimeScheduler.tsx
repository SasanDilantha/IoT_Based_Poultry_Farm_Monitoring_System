import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from "react-native-vector-icons/FontAwesome6";
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";


const SERVER_URL = "http://192.168.171.15:5000";
interface TimeSchedulerProps {
    onTimeChange: (time: Date) => void;
}

const TimeScheduler = ({ onTimeChange }: TimeSchedulerProps) => {
    const [time, setTime] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);

    const handleTimeChange = (event: any, selectedDate?: Date) => {
        setShowPicker(false);
        if (selectedDate) {
            setTime(selectedDate);
            onTimeChange(selectedDate);
            console.log("Selected Feeding Time:", selectedDate.toLocaleTimeString()); // Log the selected time
        }
    };

    const formatTime = (date: Date) => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `${hours < 10 ? "0" : ""}${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
    };

    // set time
    const setFeedTime = async () => {
        try {
          await fetch(`${SERVER_URL}/set_feed_time`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({"feed_time": time }),
          });
        } catch (error) {
          console.error("Error updating fan status:", error);
        }
      };

    return (
        <View style={styles.card}>
            <Text style={styles.cardTitle}>Schedule Feeding Time</Text>
            <View style={styles.content}>
                <Icon name="bowl-food" size={40} color="#FFA500" style={styles.icon} />
                <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.timePicker}>
                    <Text style={styles.timeText}>{formatTime(time)}</Text>
                    <Icon2 name="clock-outline" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            {/* Display the set feeding time */}
            <Text style={styles.setTimeText}>Set Feeding Time: {formatTime(time)}</Text>

            {/* Built-in clock face for time setting */}
            {showPicker && (
                <DateTimePicker
                    value={time}
                    mode="time"
                    is24Hour={true}
                    display="clock" // Use the built-in clock face
                    onChange={handleTimeChange}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 15,
        padding: 20,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 15,
        textAlign: "center",
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        marginRight: 15,
    },
    timePicker: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F0F8FF",
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
    },
    timeText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginRight: 10,
    },
    setTimeText: {
        fontSize: 16,
        color: "#333",
        textAlign: "center",
        marginTop: 10,
    },
});

export default TimeScheduler;