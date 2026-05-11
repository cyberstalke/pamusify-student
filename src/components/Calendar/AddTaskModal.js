import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Modal,
  ScrollView,
  Platform,
  Switch,
  Alert,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  Pressable,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  FadeIn,
  SlideInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { getColors } from "../../utils/colors";

export default function AddTaskModal({
  modalVisible,
  setModalVisible,
  newTask,
  setNewTask,
  handleAddTask,
  colors: propColors,
}) {
  const scheme = useColorScheme();
  const colors = propColors || getColors(scheme);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);

  const [tempDate, setTempDate] = useState(new Date());
  const [tempTime, setTempTime] = useState(new Date());

  useEffect(() => {
    setTempDate(newTask.date ? new Date(newTask.date) : new Date());
    setTempTime(
      newTask.from ? moment(newTask.from, "HH:mm").toDate() : new Date(),
    );
  }, [newTask.date, newTask.from, modalVisible]);

  const closeModal = () => {
    setModalVisible(false);
  };

  const updateTask = (field, value) => {
    setNewTask((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const confirmDate = () => {
    updateTask("date", moment(tempDate).format("YYYY-MM-DD"));
    setDatePickerVisible(false);
  };

  const cancelDate = () => {
    setTempDate(newTask.date ? new Date(newTask.date) : new Date());
    setDatePickerVisible(false);
  };

  const confirmTime = () => {
    updateTask("from", moment(tempTime).format("HH:mm"));
    setTimePickerVisible(false);
  };

  const cancelTime = () => {
    setTempTime(
      newTask.from ? moment(newTask.from, "HH:mm").toDate() : new Date(),
    );
    setTimePickerVisible(false);
  };

  const onCreateTask = () => {
    const title = newTask.title?.trim();

    if (!title) {
      Alert.alert("Upsss!", "Please enter a task title");
      return;
    }

    if (!newTask.dailyRepeat && !newTask.date) {
      Alert.alert("Upsss!", "Please select a date");
      return;
    }

    if (!newTask.from?.trim()) {
      Alert.alert("Upps!", "Please select a time");
      return;
    }

    handleAddTask();
    closeModal();
  };

  return (
    <Modal
      visible={modalVisible}
      transparent
      animationType="fade"
      onRequestClose={closeModal}
    >
      <Animated.View entering={FadeIn.duration(180)} style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={closeModal} />

        <Animated.View
          entering={SlideInDown.duration(360).springify().damping(18)}
          style={styles.sheet}
        >
          <View style={styles.handle} />

          <View style={styles.header}>
            <View>
              <Text style={styles.label}>Planner</Text>
              <Text style={styles.title}>Create new task</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={closeModal}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={22} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            <View style={styles.inputBox}>
              <MaterialCommunityIcons
                name="format-title"
                size={22}
                color={colors.tabIconActive}
              />

              <TextInput
                placeholder="Task title"
                placeholderTextColor={colors.textSecondary}
                value={newTask.title}
                onChangeText={(text) => updateTask("title", text)}
                style={styles.input}
              />
            </View>

            <View style={styles.repeatCard}>
              <View style={styles.repeatLeft}>
                <View style={styles.repeatIcon}>
                  <Ionicons
                    name="repeat"
                    size={20}
                    color={colors.tabIconActive}
                  />
                </View>

                <View>
                  <Text style={styles.repeatTitle}>Daily Repeat</Text>
                  <Text style={styles.repeatSubtitle}>
                    Har kuni avtomatik qo‘shiladi
                  </Text>
                </View>
              </View>

              <Switch
                trackColor={{
                  false: colors.progressLine || "#767577",
                  true: colors.tabIconActive,
                }}
                thumbColor="#ffffff"
                ios_backgroundColor={colors.progressLine || "#3e3e3e"}
                onValueChange={(value) => updateTask("dailyRepeat", value)}
                value={Boolean(newTask.dailyRepeat)}
              />
            </View>

            {!newTask.dailyRepeat && (
              <SelectButton
                icon="calendar-outline"
                title="Date"
                value={
                  newTask.date
                    ? moment(newTask.date).format("MMMM DD, YYYY")
                    : "Select date"
                }
                onPress={() => setDatePickerVisible(true)}
                colors={colors}
                styles={styles}
              />
            )}

            <SelectButton
              icon="time-outline"
              title="Time"
              value={newTask.from ? newTask.from : "Select time"}
              onPress={() => setTimePickerVisible(true)}
              colors={colors}
              styles={styles}
            />

            <TouchableOpacity
              activeOpacity={0.88}
              onPress={onCreateTask}
              style={styles.createButton}
            >
              <Text style={styles.createButtonText}>Create Task</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>

        <PickerModal
          visible={datePickerVisible}
          title="Select date"
          mode="date"
          value={tempDate}
          onChange={setTempDate}
          onCancel={cancelDate}
          onConfirm={confirmDate}
          colors={colors}
          styles={styles}
        />

        <PickerModal
          visible={timePickerVisible}
          title="Select time"
          mode="time"
          value={tempTime}
          onChange={setTempTime}
          onCancel={cancelTime}
          onConfirm={confirmTime}
          colors={colors}
          styles={styles}
        />
      </Animated.View>
    </Modal>
  );
}

function SelectButton({ icon, title, value, onPress, colors, styles }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withTiming(0.98, { duration: 90 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        style={styles.selectButton}
      >
        <View style={styles.selectLeft}>
          <View style={styles.selectIcon}>
            <Ionicons name={icon} size={20} color={colors.tabIconActive} />
          </View>

          <View>
            <Text style={styles.selectTitle}>{title}</Text>
            <Text style={styles.selectValue}>{value}</Text>
          </View>
        </View>

        <Ionicons
          name="chevron-forward"
          size={20}
          color={colors.textSecondary}
        />
      </Pressable>
    </Animated.View>
  );
}

function PickerModal({
  visible,
  title,
  mode,
  value,
  onChange,
  onCancel,
  onConfirm,
  colors,
  styles,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.pickerOverlay}>
        <Animated.View
          entering={SlideInDown.duration(300).springify().damping(18)}
          style={styles.pickerCard}
        >
          <Text style={styles.pickerTitle}>{title}</Text>

          <DateTimePicker
            value={value}
            mode={mode}
            is24Hour
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedValue) => {
              if (selectedValue) onChange(selectedValue);
            }}
            {...(Platform.OS === "ios"
              ? {
                  textColor: colors.textPrimary,
                  themeVariant: "dark",
                }
              : {})}
            style={styles.datePicker}
          />

          <View style={styles.pickerActions}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onCancel}
              style={styles.pickerCancelButton}
            >
              <Text style={styles.pickerCancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onConfirm}
              style={styles.pickerConfirmButton}
            >
              <Text style={styles.pickerConfirmText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0,0,0,0.55)",
    },

    backdrop: {
      ...StyleSheet.absoluteFillObject,
    },

    sheet: {
      maxHeight: "92%",
      borderTopLeftRadius: 34,
      borderTopRightRadius: 34,
      paddingTop: 10,
      backgroundColor: colors.background,
    },

    handle: {
      alignSelf: "center",
      width: 46,
      height: 5,
      borderRadius: 999,
      backgroundColor: colors.textSecondary,
      opacity: 0.35,
      marginBottom: 14,
    },

    header: {
      paddingHorizontal: 20,
      paddingBottom: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    label: {
      fontSize: 13,
      fontWeight: "900",
      color: colors.tabIconActive,
      marginBottom: 3,
    },

    title: {
      fontSize: 25,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    closeButton: {
      width: 44,
      height: 44,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.cardSecondary,
    },

    content: {
      paddingHorizontal: 20,
      paddingBottom: 30,
    },

    inputBox: {
      minHeight: 62,
      borderRadius: 22,
      paddingHorizontal: 15,
      backgroundColor: colors.cardSecondary,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      marginBottom: 14,
    },

    input: {
      flex: 1,
      fontSize: 17,
      fontWeight: "800",
      color: colors.textPrimary,
      paddingVertical: 14,
    },

    repeatCard: {
      minHeight: 78,
      borderRadius: 24,
      padding: 14,
      backgroundColor: colors.cardSecondary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 14,
    },

    repeatLeft: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      gap: 12,
    },

    repeatIcon: {
      width: 46,
      height: 46,
      borderRadius: 17,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background,
    },

    repeatTitle: {
      fontSize: 16,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    repeatSubtitle: {
      marginTop: 3,
      fontSize: 12,
      fontWeight: "700",
      color: colors.textSecondary,
    },

    selectButton: {
      minHeight: 72,
      borderRadius: 24,
      padding: 14,
      backgroundColor: colors.cardSecondary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 14,
    },

    selectLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      flex: 1,
    },

    selectIcon: {
      width: 46,
      height: 46,
      borderRadius: 17,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background,
    },

    selectTitle: {
      fontSize: 13,
      fontWeight: "800",
      color: colors.textSecondary,
    },

    selectValue: {
      marginTop: 3,
      fontSize: 16,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    createButton: {
      height: 58,
      borderRadius: 22,
      marginTop: 8,
      backgroundColor: colors.tabIconActive,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },

    createButtonText: {
      fontSize: 17,
      fontWeight: "900",
      color: "#fff",
    },

    pickerOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0,0,0,0.55)",
    },

    pickerCard: {
      margin: 14,
      borderRadius: 30,
      padding: 18,
      backgroundColor: colors.cardSecondary,
    },

    pickerTitle: {
      fontSize: 20,
      fontWeight: "900",
      color: colors.textPrimary,
      textAlign: "center",
      marginBottom: 10,
    },

    datePicker: {
      width: "100%",
    },

    pickerActions: {
      flexDirection: "row",
      gap: 10,
      marginTop: 14,
    },

    pickerCancelButton: {
      flex: 1,
      height: 52,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background,
    },

    pickerConfirmButton: {
      flex: 1,
      height: 52,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.tabIconActive,
    },

    pickerCancelText: {
      fontSize: 16,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    pickerConfirmText: {
      fontSize: 16,
      fontWeight: "900",
      color: "#fff",
    },
  });
