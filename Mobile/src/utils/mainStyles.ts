import { StyleSheet } from "react-native";

const mainStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F8FF", // Light Blue Background
    padding: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  modeButton: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#ddd",
    borderWidth: 1,
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    marginVertical: 5,
  },
  switchContainer: {
    marginVertical: 10,
    backgroundColor: "#E3F2FD",
    padding: 20,
    borderRadius: 20,
  },
  switchImageContainer: {
    width: 64,
    height: 64,
    backgroundColor: "#fff",
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  switchTitle: {
    paddingVertical: 10,
    fontSize: 24,
    fontWeight: "bold",
  },
  sensorContainer: {
    borderColor: "#ddd",
    borderWidth: 1,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginHorizontal: 5,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sensorValue: {
    textAlign: "center",
    paddingBottom: 20,
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  messageContainer: {
    marginVertical: 10,
    padding: 15,
    backgroundColor: "#DFF6D8", // Light green background
    borderRadius: 10,
    alignItems: "center",
  },
  messageText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#388E3C", // Dark green text
  },
  timeSchedulerContainer: {
    marginVertical: 10,
    backgroundColor: "#E3F2FD",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
  },
  timePicker: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  timeText: {
    fontSize: 18,
    marginLeft: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 5,
    fontSize: 16,
    width: "50%",
    textAlign: "center",
  },
  buttonSwitchContainer: {
    marginVertical: 10,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonSwitchText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default mainStyles;