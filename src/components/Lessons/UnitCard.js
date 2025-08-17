import React from "react";
import { View, Text, StyleSheet, useColorScheme } from "react-native";
import { getColors } from "../../utils/colors";

const UnitCard = ({ title, subtitle }) => {
  const schem = useColorScheme();
  const colors = getColors(schem);

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
      <Text style={[styles.subtitle, { color: "white" }]}>{subtitle}</Text>
      <Text style={[styles.title, { color: "white" }]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 15,
    marginBottom: 20,
    shadowColor: "#00c7be",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5.46,
    // Android Shadow property
    elevation: 9,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "bold",
    opacity: 0.8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
});

export default UnitCard;
