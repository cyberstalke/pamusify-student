import React from "react";
import { Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function UnitCard({
  title,
  subtitle,
  description,
  locked,
  colors,
  styles,
}) {
  return (
    <View style={[styles.unitCard, locked && styles.unitCardLocked]}>
      <View style={styles.unitIcon}>
        <MaterialCommunityIcons
          name={locked ? "lock-outline" : "flag-variant"}
          size={24}
          color="#fff"
        />
      </View>

      <View style={styles.unitContent}>
        <Text style={styles.unitTitle}>{title}</Text>
        <Text style={styles.unitSubtitle}>{subtitle}</Text>
        <Text style={styles.unitDescription}>{description}</Text>
      </View>

      <MaterialCommunityIcons
        name="chevron-right"
        size={24}
        color={colors.textSecondary}
      />
    </View>
  );
}
