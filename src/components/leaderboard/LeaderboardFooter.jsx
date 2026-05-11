import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const tabs = [
  { label: "Home", icon: "home-outline" },
  { label: "Courses", icon: "book-open-page-variant-outline" },
  { label: "Games", icon: "star-shooting-outline" },
  { label: "Board", icon: "trophy-outline", active: true },
  { label: "Profile", icon: "account-outline" },
];

export default function LeaderboardFooter({ colors, styles }) {
  return (
    <View style={styles.footer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.label}
          activeOpacity={0.85}
          style={[styles.footerButton, tab.active && styles.footerButtonActive]}
        >
          <MaterialCommunityIcons
            name={tab.icon}
            size={23}
            color={tab.active ? colors.tabIconActive : colors.tabIconInactive}
          />
          <Text
            style={[styles.footerText, tab.active && styles.footerTextActive]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
