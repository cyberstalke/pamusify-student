import {
  StyleSheet,
  TouchableWithoutFeedback,
  useColorScheme,
} from "react-native";
import React from "react";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { getColors } from "../../utils/colors";

const CustomButton = ({ flatListRef, flatListIndex, dataLength }) => {
  const navigation = useNavigation();
  const scheme = useColorScheme(); // "dark" yoki "light"
  const colors = getColors(scheme);

  const buttonAnimationStyle = useAnimatedStyle(() => {
    return {
      width:
        flatListIndex.value === dataLength - 1
          ? withSpring(140)
          : withSpring(60),
      height: 60,
    };
  });
  const arrowAnimationStyle = useAnimatedStyle(() => {
    return {
      width: 30,
      height: 30,
      opacity:
        flatListIndex.value === dataLength - 1 ? withTiming(0) : withTiming(1),
      transform: [
        {
          translateX:
            flatListIndex.value === dataLength - 1
              ? withTiming(100)
              : withTiming(0),
        },
      ],
    };
  });
  const textAnimationStyle = useAnimatedStyle(() => {
    return {
      opacity:
        flatListIndex.value === dataLength - 1 ? withTiming(1) : withTiming(0),
      transform: [
        {
          translateX:
            flatListIndex.value === dataLength - 1
              ? withTiming(0)
              : withTiming(-100),
        },
      ],
    };
  });
  return (
    <TouchableWithoutFeedback
      onPress={() => {
        if (flatListIndex.value < dataLength - 1) {
          flatListRef.current.scrollToIndex({ index: flatListIndex.value + 1 });
        } else {
          navigation.navigate("tab");
        }
      }}
    >
      <Animated.View
        style={[
          { ...styles.container, backgroundColor: "#00c7be" },
          buttonAnimationStyle,
        ]}
      >
        <Animated.Text style={[styles.textButton, textAnimationStyle]}>
          Get Started
        </Animated.Text>
        <Animated.Image
          source={require("../../../assets/images/ArrowIcon.png")}
          style={[styles.arrow, arrowAnimationStyle]}
        />
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  arrow: {
    position: "absolute",
  },
  textButton: { color: "white", fontSize: 16, position: "absolute" },
});
