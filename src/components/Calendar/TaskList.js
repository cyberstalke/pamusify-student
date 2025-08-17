import React from "react";
import { View, Text, TouchableOpacity, useColorScheme } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { getColors } from "../../utils/colors";

export default function TaskList({
  tasks,
  selectedDate,
  handleDeleteTask,
  handleCompleteTask,
  isTaskCompleted,
  colors,
  openEditModal,
}) {
  const renderRightActions = (index, dateKey) => (
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity
        style={{
          backgroundColor: colors.red || "red",
          justifyContent: "center",
          padding: 10,
          borderRadius: 15,
          marginVertical: 7,
          paddingHorizontal: 15,
        }}
        onPress={() => handleDeleteTask(index, dateKey)}
      >
        <MaterialIcons name="delete" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
  const schem = useColorScheme();
  const color = getColors(schem);

  return (
    <View style={{ padding: 20 }}>
      {(tasks[selectedDate] || []).map((task, i) => (
        <Swipeable
          key={i}
          renderRightActions={() => renderRightActions(i, selectedDate)}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
              backgroundColor: isTaskCompleted(i)
                ? "gray"
                : color.cardBackground,
              borderRadius: 16,
              padding: 15,
              borderWidth: 0.5,
              opacity: isTaskCompleted(i) ? 0.6 : 1,
            }}
          >
            <View
              style={{
                width: 80,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>
                {task.from}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
                {task.title}
              </Text>
            </View>

            {/* Edit button */}
            <TouchableOpacity
              onPress={() => openEditModal(task, i)}
              style={{ marginRight: 10 }}
            >
              <Ionicons name="pencil" size={24} color="white" />
            </TouchableOpacity>

            {!isTaskCompleted(i) && (
              <TouchableOpacity
                onPress={() => handleCompleteTask(i)}
                style={{ marginRight: 10 }}
              >
                <Ionicons name="checkmark-circle" size={24} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </Swipeable>
      ))}
    </View>
  );
}
