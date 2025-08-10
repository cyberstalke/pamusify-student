import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");
const innerDimension = 300;

export default function Overlay() {
  return (
    <View style={styles.container}>
      <View style={styles.outer} />
      <View style={styles.inner} />
      <View style={styles.outer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  outer: {
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  inner: {
    width: innerDimension,
    height: innerDimension,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#0E7AFE",
    backgroundColor: "transparent",
  },
});
