import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Platform,
  Switch,
  Alert,
  StyleSheet,
  useColorScheme,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { getColors } from "../../utils/colors";

export default function AddTaskModal({
  modalVisible,
  setModalVisible,
  newTask,
  setNewTask,
  handleAddTask,
  colors,
}) {
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const schem = useColorScheme();
  const color = getColors(schem);

  const [tempDate, setTempDate] = useState(
    newTask.date ? new Date(newTask.date) : new Date()
  );
  const [tempTime, setTempTime] = useState(
    newTask.from ? moment(newTask.from, "HH:mm").toDate() : new Date()
  );

  useEffect(() => {
    setTempDate(newTask.date ? new Date(newTask.date) : new Date());
    setTempTime(
      newTask.from ? moment(newTask.from, "HH:mm").toDate() : new Date()
    );
  }, [newTask.date, newTask.from, modalVisible]);

  const confirmDate = () => {
    setNewTask((prev) => ({
      ...prev,
      date: moment(tempDate).format("YYYY-MM-DD"),
    }));
    setDatePickerVisible(false);
  };

  const cancelDate = () => {
    setDatePickerVisible(false);
    setTempDate(newTask.date ? new Date(newTask.date) : new Date());
  };

  const confirmTime = () => {
    setNewTask((prev) => ({
      ...prev,
      from: moment(tempTime).format("HH:mm"),
    }));
    setTimePickerVisible(false);
  };

  const cancelTime = () => {
    setTimePickerVisible(false);
    setTempTime(
      newTask.from ? moment(newTask.from, "HH:mm").toDate() : new Date()
    );
  };

  const onCreateTask = () => {
    if (!newTask.title || newTask.title.trim() === "") {
      Alert.alert("Upsss!", "Please enter a task title");
      return;
    }
    if (!newTask.dailyRepeat && !newTask.date) {
      Alert.alert("Upsss!", "Please select a date");
      return;
    }
    if (!newTask.from || newTask.from.trim() === "") {
      Alert.alert("Upps!", "Please select a time");
      return;
    }
    handleAddTask();
    setModalVisible(false);
  };

  return (
    <Modal
      presentationStyle="pageSheet"
      visible={modalVisible}
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: colors.cardSecondary,
            padding: 20,
            borderRadius: 20,
            width: "100%",
          }}
        >
          {/* Title input */}
          <TextInput
            placeholder="Task Title"
            placeholderTextColor={colors.textSecondary}
            value={newTask.title}
            onChangeText={(text) =>
              setNewTask((prev) => ({ ...prev, title: text }))
            }
            style={{
              borderBottomWidth: 1,
              borderBottomColor: colors.textSecondary,
              marginBottom: 10,
              color: colors.textPrimary,
              fontSize: 18,
              fontWeight: "600",
            }}
          />

          {/* Daily toggle */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 15,
              marginBottom: 15,
            }}
          >
            <Text style={{ color: colors.textPrimary, fontSize: 16 }}>
              Daily Repeat
            </Text>
            <Switch
              trackColor={{ false: "#767577", true: colors.green }}
              thumbColor={newTask.dailyRepeat ? "#ffffff" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={(value) =>
                setNewTask((prev) => ({ ...prev, dailyRepeat: value }))
              }
              value={newTask.dailyRepeat}
            />
          </View>

          {/* Date select button */}
          {!newTask.dailyRepeat && (
            <>
              <TouchableOpacity
                onPress={() => setDatePickerVisible(true)}
                style={styles.selectButton(colors)}
              >
                <Text style={{ color: colors.textPrimary, fontSize: 16 }}>
                  {newTask.date
                    ? `Date: ${moment(newTask.date).format("MMMM DD, YYYY")}`
                    : "Select Date"}
                </Text>
              </TouchableOpacity>

              <Modal
                visible={datePickerVisible}
                transparent
                animationType="fade"
              >
                <View style={styles.modalBackground}>
                  <View
                    style={[
                      styles.pickerContainer,
                      { backgroundColor: colors.cardSecondary },
                    ]}
                  >
                    <DateTimePicker
                      value={tempDate}
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={(event, selectedDate) => {
                        if (selectedDate) setTempDate(selectedDate);
                      }}
                      {...(Platform.OS === "ios"
                        ? {
                            themeVariant: "light",
                            textColor: colors.textPrimary,
                          }
                        : {})}
                      style={{ width: "100%" }}
                    />
                    <View style={styles.buttonRow}>
                      <TouchableOpacity
                        onPress={cancelDate}
                        style={styles.modalButton(colors, false)}
                      >
                        <Text
                          style={{ color: colors.textPrimary, fontSize: 16 }}
                        >
                          Cancel
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={confirmDate}
                        style={styles.modalButton(colors, true)}
                      >
                        <Text style={{ color: "#00c7be", fontSize: 16 }}>
                          Confirm
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </>
          )}

          {/* Time select button */}
          <TouchableOpacity
            onPress={() => setTimePickerVisible(true)}
            style={styles.selectButton(colors)}
          >
            <Text style={{ color: colors.textPrimary, fontSize: 16 }}>
              {newTask.from ? `From: ${newTask.from}` : "Select Time"}
            </Text>
          </TouchableOpacity>

          <Modal visible={timePickerVisible} transparent animationType="fade">
            <View style={styles.modalBackground}>
              <View
                style={[
                  styles.pickerContainer,
                  { backgroundColor: colors.cardSecondary },
                ]}
              >
                <DateTimePicker
                  value={tempTime}
                  mode="time"
                  is24Hour={true}
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(event, selectedTime) => {
                    if (selectedTime) setTempTime(selectedTime);
                  }}
                  {...(Platform.OS === "ios"
                    ? {
                        themeVariant: "light",
                        textColor: colors.textPrimary,
                      }
                    : {})}
                  style={{ width: "100%" }}
                />
                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    onPress={cancelTime}
                    style={styles.modalButton(colors, false)}
                  >
                    <Text style={{ color: colors.textPrimary, fontSize: 16 }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={confirmTime}
                    style={styles.modalButton(colors, true)}
                  >
                    <Text style={{ color: "#00c7be", fontSize: 16 }}>
                      Confirm
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          {/* Create Task button */}
          <TouchableOpacity
            onPress={onCreateTask}
            style={{
              backgroundColor: color.cardBackground,
              padding: 15,
              borderRadius: 10,
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <Text
              style={{
                color: "white",
                fontWeight: "600",
                fontSize: 16,
              }}
            >
              Create Task
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  selectButton: (colors) => ({
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
  }),
  modalBackground: {
    flex: 1,
    backgroundColor: "#00000066",
    justifyContent: "center",
    alignItems: "center",
  },
  pickerContainer: {
    width: "90%",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  buttonRow: {
    marginTop: 15,
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  modalButton: (colors, isConfirm) => ({
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 10,
    backgroundColor: isConfirm ? colors.green : "transparent",
    borderWidth: isConfirm ? 0 : 1,
    borderColor: colors.textPrimary,
    alignItems: "center",
  }),
});
