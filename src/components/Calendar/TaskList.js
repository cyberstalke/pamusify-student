import React, { useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  useColorScheme,
  StyleSheet,
  Pressable,
  Platform,
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { getColors } from "../../utils/colors";

export default function TaskList({
  tasks,
  selectedDate,
  handleDeleteTask,
  handleCompleteTask,
  isTaskCompleted,
  colors: propColors,
  openEditModal,
}) {
  const scheme = useColorScheme();
  const colors = propColors || getColors(scheme);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const dayTasks = tasks?.[selectedDate] || [];

  if (!dayTasks.length) {
    return (
      <Animated.View
        entering={FadeInDown.duration(350).springify().damping(16)}
        style={styles.emptyState}
      >
        <View style={styles.emptyIcon}>
          <Ionicons
            name="calendar-clear-outline"
            size={34}
            color={colors.tabIconActive}
          />
        </View>

        <Text style={styles.emptyTitle}>No tasks yet</Text>
        <Text style={styles.emptySubtitle}>
          Bugungi rejangizni qo‘shing va kuningizni tartibga soling.
        </Text>
      </Animated.View>
    );
  }

  const renderRightActions = (index, dateKey) => (
    <View style={styles.swipeActions}>
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.deleteAction}
        onPress={() => handleDeleteTask(index, dateKey)}
      >
        <MaterialIcons name="delete" size={24} color="#fff" />
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.wrapper}>
      {dayTasks.map((task, index) => (
        <Animated.View
          key={`${task.title}-${task.from}-${index}`}
          entering={FadeInDown.delay(index * 60)
            .duration(360)
            .springify()
            .damping(16)}
          layout={Layout.springify().damping(18)}
        >
          <Swipeable
            overshootRight={false}
            renderRightActions={() => renderRightActions(index, selectedDate)}
          >
            <TaskCard
              task={task}
              index={index}
              completed={isTaskCompleted(index)}
              colors={colors}
              styles={styles}
              onEdit={() => openEditModal(task, index)}
              onComplete={() => handleCompleteTask(index)}
            />
          </Swipeable>
        </Animated.View>
      ))}
    </View>
  );
}

function TaskCard({
  task,
  index,
  completed,
  colors,
  styles,
  onEdit,
  onComplete,
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPressIn={() => {
          scale.value = withTiming(0.98, { duration: 90 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        style={[styles.card, completed && styles.cardCompleted]}
      >
        <View style={styles.timeBox}>
          <Text style={[styles.timeText, completed && styles.completedText]}>
            {task.from}
          </Text>
          {task.to ? (
            <Text
              style={[styles.timeSubText, completed && styles.completedText]}
            >
              {task.to}
            </Text>
          ) : (
            <Text
              style={[styles.timeSubText, completed && styles.completedText]}
            >
              Task
            </Text>
          )}
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text
              numberOfLines={1}
              style={[styles.title, completed && styles.completedText]}
            >
              {task.title}
            </Text>

            {completed && (
              <View style={styles.doneBadge}>
                <Text style={styles.doneBadgeText}>Done</Text>
              </View>
            )}
          </View>

          <View style={styles.metaRow}>
            <Ionicons
              name={completed ? "checkmark-circle" : "time-outline"}
              size={15}
              color={completed ? "#22C55E" : colors.textSecondary}
            />
            <Text style={[styles.metaText, completed && styles.completedText]}>
              {completed ? "Completed" : "Planned task"}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onEdit}
            style={styles.iconButton}
          >
            <Ionicons name="pencil" size={19} color={colors.textPrimary} />
          </TouchableOpacity>

          {!completed && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onComplete}
              style={[styles.iconButton, styles.checkButton]}
            >
              <Ionicons name="checkmark" size={20} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    wrapper: {
      paddingHorizontal: 18,
      paddingTop: 12,
      paddingBottom: 20,
    },

    card: {
      minHeight: 82,
      marginBottom: 12,
      borderRadius: 26,
      padding: 13,
      backgroundColor: colors.cardSecondary || colors.cardBackground,
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.06)",
      shadowColor: "#000",
      shadowOpacity: 0.07,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 8 },
      ...Platform.select({
        android: {
          elevation: 4,
        },
      }),
    },

    cardCompleted: {
      opacity: 0.62,
      backgroundColor: colors.cardSecondary || "#2A2A2A",
    },

    timeBox: {
      width: 66,
      minHeight: 56,
      borderRadius: 20,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },

    timeText: {
      fontSize: 15,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    timeSubText: {
      marginTop: 2,
      fontSize: 10,
      fontWeight: "800",
      color: colors.textSecondary,
    },

    content: {
      flex: 1,
      minWidth: 0,
    },

    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },

    title: {
      flex: 1,
      fontSize: 16,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    metaRow: {
      marginTop: 7,
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },

    metaText: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.textSecondary,
    },

    completedText: {
      color: colors.textSecondary,
    },

    doneBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 999,
      backgroundColor: "#22C55E",
    },

    doneBadgeText: {
      fontSize: 10,
      fontWeight: "900",
      color: "#fff",
    },

    actions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginLeft: 10,
    },

    iconButton: {
      width: 40,
      height: 40,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background,
    },

    checkButton: {
      backgroundColor: colors.tabIconActive,
    },

    swipeActions: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
      marginRight: 18,
    },

    deleteAction: {
      height: "100%",
      minWidth: 92,
      borderRadius: 24,
      paddingHorizontal: 14,
      backgroundColor: colors.red || "#EF4444",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 6,
    },

    deleteText: {
      fontSize: 13,
      fontWeight: "900",
      color: "#fff",
    },

    emptyState: {
      marginHorizontal: 18,
      marginTop: 18,
      borderRadius: 30,
      padding: 24,
      alignItems: "center",
      backgroundColor: colors.cardSecondary || colors.cardBackground,
    },

    emptyIcon: {
      width: 68,
      height: 68,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background,
      marginBottom: 14,
    },

    emptyTitle: {
      fontSize: 19,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    emptySubtitle: {
      marginTop: 7,
      fontSize: 13,
      lineHeight: 19,
      fontWeight: "700",
      color: colors.textSecondary,
      textAlign: "center",
    },
  });
