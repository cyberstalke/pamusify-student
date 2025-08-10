import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Ionicons } from "@expo/vector-icons";

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
          padding: 20,
          borderRadius: 20,
          marginVertical: 5,
        }}
        onPress={() => handleDeleteTask(index, dateKey)}
      >
        <Text style={{ color: "white" }}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
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
              backgroundColor: isTaskCompleted(i) ? "gray" : colors.pamusYellow,
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
    </>
  );
}
