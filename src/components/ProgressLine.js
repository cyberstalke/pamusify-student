import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { getColors } from "../utils/colors";

const ProgressLine = ({ progress, mode = "dark" }) => {
  const colors = getColors(mode);
  const width = useSharedValue(0);

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${width.value}%`,
      backgroundColor: "#55ce84",
    };
  });

  useEffect(() => {
    width.value = withDelay(
      500, // Add a slight delay for a smoother initial render
      withTiming(progress, {
        duration: 1000,
        easing: Easing.out(Easing.quad),
      })
    );
  }, [progress, width]);

  return (
    <View style={[styles.container, { backgroundColor: colors.progressLine }]}>
      <Animated.View style={[styles.progressBar, progressStyle]}>
        <Text style={[styles.percentageText, { color: "white" }]}>
          {Math.round(progress)}%
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 18,
    width: "100%",
    borderRadius: 50,
    overflow: "hidden",
    justifyContent: "center",
  },
  progressBar: {
    height: "100%",
    borderRadius: 50,
    justifyContent: "center",
  },
  percentageText: {
    paddingLeft: 8,
    fontSize: 14,
    fontWeight: "600",
  },
});

export default ProgressLine;
