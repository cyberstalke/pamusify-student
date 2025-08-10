import { StyleSheet, useColorScheme, View } from "react-native";
import React from "react";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { getColors } from "../../utils/colors";

const Pagination = ({ data, x, screenWidth }) => {
  const scheme = useColorScheme(); // "dark" yoki "light"
  const colors = getColors(scheme);

  const PaginationComp = ({ i }) => {
    const animatedDotStyle = useAnimatedStyle(() => {
      const widthAnimation = interpolate(
        x.value,
        [(i - 1) * screenWidth, i * screenWidth, (i + 1) * screenWidth],
        [10, 20, 10],
        Extrapolation.CLAMP
      );
      const opacityAnimation = interpolate(
        x.value,
        [(i - 1) * screenWidth, i * screenWidth, (i + 1) * screenWidth],
        [0.5, 1, 0.5],
        Extrapolation.CLAMP
      );
      return {
        width: widthAnimation,
        opacity: opacityAnimation,
      };
    });

    return (
      <Animated.View
        style={[
          {
            height: 10,
            backgroundColor: "#00c7be",
            marginHorizontal: 10,
            borderRadius: 5,
          },
          animatedDotStyle,
        ]}
      />
    );
  };

  return (
    <View style={styles.paginationContainer}>
      {data.map((_, i) => (
        <PaginationComp i={i} key={i} />
      ))}
    </View>
  );
};

export default Pagination;

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: "row",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
