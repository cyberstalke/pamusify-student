import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  SafeAreaView,
  useColorScheme,
  Alert,
  View,
  Platform,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import Animated, {
  FadeInDown,
  FadeIn,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { getColors } from "../utils/colors";
import DaySelector from "../components/Calendar/DaySelector";
import TaskList from "../components/Calendar/TaskList";
import AddTaskModal from "../components/Calendar/AddTaskModal";

const today = moment().format("YYYY-MM-DD");

export default function Calendar() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const colors = getColors(colorScheme);
  const styles = useMemo(() => createStyles(colors), [colors]);
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

  const [editingTaskMeta, setEditingTaskMeta] = useState(null);

  const notificationListener = useRef(null);
  const responseListener = useRef(null);

  const visibleTasks = useMemo(() => {
    const selectedTasks = (tasks[selectedDate] || []).map((task, index) => ({
      ...task,
      _sourceDateKey: selectedDate,
      _sourceIndex: index,
    }));

    const repeatedTasks = Object.entries(tasks)
      .filter(([dateKey]) => dateKey !== selectedDate)
      .flatMap(([dateKey, taskList]) =>
        taskList
          .map((task, index) => ({
            ...task,
            _sourceDateKey: dateKey,
            _sourceIndex: index,
          }))
          .filter((task) => task.dailyRepeat),
      );

    return [...selectedTasks, ...repeatedTasks].sort((a, b) =>
      String(a.from || "").localeCompare(String(b.from || "")),
    );
  }, [tasks, selectedDate]);

  const completedCount = visibleTasks.filter((task) =>
    completedTasks[task._sourceDateKey]?.includes(task._sourceIndex),
  ).length;

  async function registerForPushNotificationsAsync() {
    if (!Constants.isDevice) return;

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
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
      }

      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [navigation]);

  const scheduleNotification = async (task) => {
    try {
      const taskTime = moment(
        `${task.date} ${task.from}`,
        "YYYY-MM-DD HH:mm",
      ).toDate();

      if (taskTime <= new Date()) return;

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "📋 Task Reminder",
          body: task.title,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
          data: {
            screen: "Calendar",
            taskTitle: task.title,
          },
        },
        trigger: taskTime,
      });
    } catch (error) {
      console.error("Error scheduling notification:", error);
    }
  };

  const resetTaskForm = () => {
    setNewTask({
      title: "",
      from: "",
      date: selectedDate,
      dailyRepeat: false,
    });
    setEditingTaskMeta(null);
  };

  const handleOpenCreate = () => {
    resetTaskForm();
    setModalVisible(true);
  };

  const handleOpenEdit = (task) => {
    const cleanTask = {
      title: task.title,
      from: task.from,
      date: task.date || task._sourceDateKey,
      dailyRepeat: Boolean(task.dailyRepeat),
    };

    setNewTask(cleanTask);
    setEditingTaskMeta({
      dateKey: task._sourceDateKey,
      index: task._sourceIndex,
    });
    setModalVisible(true);
  };

  const handleSaveTask = () => {
    const title = newTask.title?.trim();

    if (!title || !newTask.from) {
      Alert.alert("Upss!", "Please enter task title and time.");
      return;
    }

    const dateKey = newTask.dailyRepeat
      ? newTask.date || selectedDate
      : newTask.date || selectedDate;

    const taskPayload = {
      ...newTask,
      title,
      date: dateKey,
    };

    setTasks((prev) => {
      const next = { ...prev };

      if (editingTaskMeta) {
        const oldDateKey = editingTaskMeta.dateKey;
        const oldTasks = [...(next[oldDateKey] || [])];

        oldTasks.splice(editingTaskMeta.index, 1);
        next[oldDateKey] = oldTasks;

        const targetTasks = [...(next[dateKey] || [])];
        targetTasks.push(taskPayload);
        next[dateKey] = targetTasks;

        return next;
      }

      return {
        ...next,
        [dateKey]: [...(next[dateKey] || []), taskPayload],
      };
    });

    scheduleNotification(taskPayload);
    setModalVisible(false);
    resetTaskForm();
  };

  const handleDeleteVisibleTask = (visibleIndex) => {
    const task = visibleTasks[visibleIndex];
    if (!task) return;

    setTasks((prev) => {
      const dateKey = task._sourceDateKey;
      const updated = [...(prev[dateKey] || [])];

      updated.splice(task._sourceIndex, 1);

      return {
        ...prev,
        [dateKey]: updated,
      };
    });

    setCompletedTasks((prev) => {
      const dateKey = task._sourceDateKey;
      const updated = (prev[dateKey] || []).filter(
        (index) => index !== task._sourceIndex,
      );

      return {
        ...prev,
        [dateKey]: updated,
      };
    });
  };

  const handleCompleteVisibleTask = (visibleIndex) => {
    const task = visibleTasks[visibleIndex];
    if (!task) return;

    setCompletedTasks((prev) => {
      const dateKey = task._sourceDateKey;
      const completed = prev[dateKey] || [];

      if (completed.includes(task._sourceIndex)) return prev;

      return {
        ...prev,
        [dateKey]: [...completed, task._sourceIndex],
      };
    });
  };

  const isVisibleTaskCompleted = (visibleIndex) => {
    const task = visibleTasks[visibleIndex];
    if (!task) return false;

    return completedTasks[task._sourceDateKey]?.includes(task._sourceIndex);
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style={isDark ? "light" : "dark"} />

        <View style={styles.container}>
          <DaySelector
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            colors={colors}
          />

          <Animated.View
            entering={FadeInDown.duration(380).springify().damping(18)}
            style={styles.summaryCard}
          >
            <View>
              <Text style={styles.summaryLabel}>
                {moment(selectedDate).format("dddd")}
              </Text>
              <Text style={styles.summaryTitle}>
                {moment(selectedDate).format("DD MMMM")}
              </Text>
            </View>

            <View style={styles.summaryStats}>
              <View style={styles.statPill}>
                <Text style={styles.statValue}>{visibleTasks.length}</Text>
                <Text style={styles.statLabel}>Tasks</Text>
              </View>

              <View style={styles.statPill}>
                <Text style={styles.statValue}>{completedCount}</Text>
                <Text style={styles.statLabel}>Done</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.ScrollView
            entering={FadeIn.duration(250)}
            layout={Layout.springify().damping(18)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            <TaskList
              tasks={{ [selectedDate]: visibleTasks }}
              selectedDate={selectedDate}
              handleDeleteTask={handleDeleteVisibleTask}
              handleCompleteTask={handleCompleteVisibleTask}
              isTaskCompleted={isVisibleTaskCompleted}
              colors={colors}
              openEditModal={(task) => handleOpenEdit(task)}
            />
          </Animated.ScrollView>

          <FloatingButton onPress={handleOpenCreate} styles={styles} />

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

function FloatingButton({ onPress, styles }) {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(250).duration(420).springify().damping(16)}
      style={[styles.fabWrap, animatedStyle]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        onPressIn={() => {
          scale.value = withTiming(0.92, { duration: 90 });
          rotate.value = withTiming(90, { duration: 160 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
          rotate.value = withSpring(0);
        }}
        style={styles.fab}
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </Animated.View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    root: {
      flex: 1,
    },

    safeArea: {
      flex: 1,
      backgroundColor: colors.cardSecondary,
      paddingTop: Platform.OS === "android" ? 38 : 0,
    },

    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    summaryCard: {
      marginHorizontal: 18,
      marginTop: 16,
      marginBottom: 4,
      padding: 16,
      borderRadius: 28,
      backgroundColor: colors.cardSecondary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      ...Platform.select({
        android: {
          elevation: 5,
        },
      }),
    },

    summaryLabel: {
      fontSize: 13,
      fontWeight: "900",
      color: colors.tabIconActive,
      marginBottom: 4,
    },

    summaryTitle: {
      fontSize: 24,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    summaryStats: {
      flexDirection: "row",
      gap: 8,
    },

    statPill: {
      minWidth: 62,
      paddingVertical: 9,
      paddingHorizontal: 10,
      borderRadius: 18,
      backgroundColor: colors.background,
      alignItems: "center",
    },

    statValue: {
      fontSize: 17,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    statLabel: {
      marginTop: 2,
      fontSize: 10,
      fontWeight: "800",
      color: colors.textSecondary,
    },

    scrollContent: {
      paddingBottom: 120,
    },

    fabWrap: {
      position: "absolute",
      right: 24,
      bottom: 34,
    },

    fab: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.tabIconActive,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.tabIconActive,
      shadowOpacity: 0.45,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      ...Platform.select({
        android: {
          elevation: 8,
        },
      }),
    },
  });
