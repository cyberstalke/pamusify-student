import React, { useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";
import { getColors } from "../utils/colors";

// Конфигурация табов вынесена за пределы компонента.
// Это гарантирует, что она не будет пересоздаваться при каждом рендере.
const tabsConfig = [
  {
    name: "All",
    icon: (color, size) => (
      <MaterialCommunityIcons name="apps" size={size} color={color} />
    ),
  },
  {
    name: "My",
    icon: (color, size) => <Ionicons name="heart" size={size} color={color} />,
  },
  {
    name: "Anxious",
    icon: (color, size) => (
      <MaterialCommunityIcons
        name="emoticon-sad-outline"
        size={size}
        color={color}
      />
    ),
  },
  {
    name: "Sleep",
    icon: (color, size) => <Ionicons name="moon" size={size} color={color} />,
  },
  {
    name: "Kids",
    icon: (color, size) => (
      <FontAwesome5 name="child" size={size} color={color} />
    ),
  },
  {
    name: "Focus",
    icon: (color, size) => (
      <MaterialCommunityIcons name="target" size={size} color={color} />
    ),
  },
  {
    name: "Relax",
    icon: (color, size) => <Ionicons name="leaf" size={size} color={color} />,
  },
  {
    name: "Music",
    icon: (color, size) => (
      <Ionicons name="musical-notes" size={size} color={color} />
    ),
  },
  {
    name: "Story",
    icon: (color, size) => (
      <MaterialCommunityIcons
        name="book-open-page-variant"
        size={size}
        color={color}
      />
    ),
  },
];

// Оборачиваем компонент в React.memo, чтобы избежать ненужных перерисовок
const CategoryButtons = React.memo(({ mode = "dark" }) => {
  const [activeTab, setActiveTab] = useState("All");
  const colors = useMemo(() => getColors(mode), [mode]);

  // Используем useCallback, чтобы функция-обработчик не пересоздавалась
  const handlePress = useCallback((tabName) => {
    setActiveTab(tabName);
  }, []);

  return (
    <View style={[styles.container]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
        // Улучшаем поведение скролла для разных платформ
        bounces={Platform.OS === "ios"}
        overScrollMode="never"
      >
        {tabsConfig.map((tab) => {
          const isActive = activeTab === tab.name;

          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.button}
              activeOpacity={0.8}
              onPress={() => handlePress(tab.name)}
              accessibilityRole="button"
              accessibilityLabel={`Select ${tab.name} category`}
            >
              <View
                style={[
                  styles.iconContainer,
                  {
                    backgroundColor: isActive
                      ? colors.cardBackground
                      : colors.categoryIconBackground,
                  },
                ]}
              >
                {tab.icon(
                  isActive ? colors.tabIconActive : colors.tabIconInactive,
                  28
                )}
              </View>
              <Text
                style={[
                  styles.label,
                  {
                    // color: isActive ? "black" : "#98A1BD", // <-- property first
                    color: colors.textPrimary,
                  },
                ]}
              >
                {tab.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
});

export default CategoryButtons;

const styles = StyleSheet.create({
  container: {},
  scrollContainer: {
    paddingHorizontal: 10,
    alignItems: "center",
    margin: 20,
  },
  button: {
    alignItems: "center",
    marginHorizontal: 8,
    paddingVertical: 4,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
  },
});
