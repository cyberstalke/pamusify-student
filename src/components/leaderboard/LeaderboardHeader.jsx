import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function LeaderboardHeader({
  periods,
  activePeriod,
  onChangePeriod,
  colors,
  styles,
}) {
  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.eyebrow}>Leaderboard</Text>
          <Text style={styles.title}>Top Students</Text>
        </View>

        <TouchableOpacity activeOpacity={0.85} style={styles.levelSelector}>
          <Text style={styles.levelText}>Super Start: A2</Text>
          <MaterialCommunityIcons
            name="chevron-down"
            size={22}
            color={colors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.periodSelector}>
        {periods.map((period) => {
          const isActive = activePeriod === period;

          return (
            <TouchableOpacity
              key={period}
              activeOpacity={0.86}
              onPress={() => onChangePeriod(period)}
              style={[
                styles.periodButton,
                isActive && styles.activePeriodButton,
              ]}
            >
              <Text
                style={[styles.periodText, isActive && styles.activePeriodText]}
              >
                {period}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
