import React, { useEffect, useState, useRef } from "react";
import {
  SafeAreaView,
  useColorScheme,
  Alert,
  ScrollView,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

import { getColors } from "../utils/colors";
import DaySelector from "../components/Calendar/DaySelector";
import TaskList from "../components/Calendar/TaskList";
import AddTaskModal from "../components/Calendar/AddTaskModal";
import { StatusBar } from "expo-status-bar";
import { SafeAreaFrameContext } from "react-native-safe-area-context";

const today = moment().format("YYYY-MM-DD");

export default function Calendar() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme);
  const isDark = colorScheme === "dark";
  const [selectedDate, setSelectedDate] = useState(today);
  const [tasks, setTasks] = useState({});
  const [completedTasks, setCompletedTasks] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    from: "",
    date: today,
    dailyRepeat: false,
  });
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const notificationListener = useRef();
  const responseListener = useRef();

  async function registerForPushNotificationsAsync() {
    if (!Constants.isDevice) {
      return;
    }
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      Alert.alert("Permission required", "Enable notifications in settings!");
      return;
    }
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("Expo push token:", token);
    return token;
  }

  useEffect(() => {
    registerForPushNotificationsAsync();

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notification received:", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        if (data.screen === "Calendar") {
          navigation.navigate("Calendar", { taskTitle: data.taskTitle });
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const days = [...Array(7)].map((_, i) => {
    const date = moment().add(i, "days");
    const formatted = date.format("YYYY-MM-DD");
    const isToday = formatted === today;
    return {
      label: date.format("ddd"),
      day: date.format("DD"),
      dateKey: formatted,
      isToday,
    };
  });

  const tasksForSelectedDate = [
    ...(tasks[selectedDate] || []),
    ...Object.entries(tasks)
      .filter(([dateKey]) => dateKey !== selectedDate)
      .flatMap(([_, taskList]) => taskList.filter((task) => task.dailyRepeat)),
  ];

  const handleSaveTask = () => {
    if (!newTask.title.trim() || !newTask.from) {
      Alert.alert("Upss!", "Please enter task title and time.");
      return;
    }

    setTasks((prev) => {
      const dateKey = newTask.date || selectedDate;
      const tasksOnDate = prev[dateKey] ? [...prev[dateKey]] : [];

      if (editingTaskIndex !== null) {
        tasksOnDate[editingTaskIndex] = { ...newTask };
      } else {
        tasksOnDate.push({ ...newTask });
      }
      return { ...prev, [dateKey]: tasksOnDate };
    });

    scheduleNotification(newTask);

    setModalVisible(false);
    setEditingTaskIndex(null);
    setNewTask({
      title: "",
      from: "",
      date: selectedDate,
      dailyRepeat: false,
    });
  };

  const scheduleNotification = async (task) => {
    try {
      const taskTime = moment(
        `${task.date} ${task.from}`,
        "YYYY-MM-DD HH:mm"
      ).toDate();

      if (taskTime <= new Date()) {
        return;
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "📋 Task Reminder",
          body: task.title,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data: { screen: "Calendar", taskTitle: task.title },
        },
        trigger: taskTime,
      });
    } catch (error) {
      console.error("Error scheduling notification:", error);
    }
  };

  const handleDeleteTask = (index, dateKey) => {
    setTasks((prev) => {
      const updated = prev[dateKey]?.filter((_, i) => i !== index) || [];
      return { ...prev, [dateKey]: updated };
    });

    setCompletedTasks((prev) => {
      const updatedCompleted = prev[dateKey]?.filter((i) => i !== index) || [];
      return { ...prev, [dateKey]: updatedCompleted };
    });
  };

  const handleCompleteTask = (index) => {
    setCompletedTasks((prev) => {
      const completed = prev[selectedDate] || [];
      if (!completed.includes(index)) {
        return {
          ...prev,
          [selectedDate]: [...completed, index],
        };
      }
      return prev;
    });
  };

  const isTaskCompleted = (index) => {
    return completedTasks[selectedDate]?.includes(index);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: colors.cardSecondary,
          paddingTop: Platform.OS === "android" ? 40 : 0,
        }}
      >
        <StatusBar
          style={{
            ...(isDark ? "light" : "dark"),
          }}
          translucent={false}
        />
        <View style={{ backgroundColor: colors.background, flex: 1 }}>
          <DaySelector
            days={days}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            colors={colors}
          />

          <ScrollView style={{ marginTop: 20 }}>
            <TaskList
              tasks={{ [selectedDate]: tasksForSelectedDate }}
              selectedDate={selectedDate}
              handleDeleteTask={handleDeleteTask}
              handleCompleteTask={handleCompleteTask}
              isTaskCompleted={isTaskCompleted}
              colors={colors}
              openEditModal={(task, index) => {
                setNewTask({ ...task });
                setEditingTaskIndex(index);
                setModalVisible(true);
              }}
            />
          </ScrollView>

          <TouchableOpacity
            onPress={() => {
              setNewTask({
                title: "",
                from: "",
                date: selectedDate,
                dailyRepeat: false,
              });
              setEditingTaskIndex(null);
              setModalVisible(true);
            }}
            style={{
              position: "absolute",
              bottom: 100,
              right: 30,
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: colors.purple,
              alignItems: "center",
              justifyContent: "center",
              elevation: 5,
              shadowColor: "#000",
              shadowOpacity: 0.3,
              shadowRadius: 5,
              shadowOffset: { width: 0, height: 3 },
            }}
          >
            <Ionicons name="add" size={32} color="white" />
          </TouchableOpacity>

          <AddTaskModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            newTask={newTask}
            setNewTask={setNewTask}
            handleAddTask={handleSaveTask}
            colors={colors}
          />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
