import {
  Platform,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import React from "react";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedRef,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import LottieView from "lottie-react-native";

import { useColorScheme } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import Pagination from "../components/Onboarding/Pagination";
import CustomButton from "../components/Onboarding/CustomButton";
import { getColors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import { StatusBar } from "expo-status-bar";

const data = [
  {
    id: 1,
    animation: require("../../assets/lottiefiles/designingwork.json"),
    title: "Say Goodbye to Boring Lessons!",
    text: "We help students escape dull and repetitive learning by making education fun, engaging, and truly effective. Get ready to enjoy every lesson!",
  },
  {
    id: 2,
    animation: require("../../assets/lottiefiles/designingwork.json"),
    title: "Take Control of Your Time and Learning",
    text: "Track your study sessions, stay focused, and manage your time like a pro. With our tools, you’re always in charge of your progress.",
  },
  {
    id: 3,
    animation: require("../../assets/lottiefiles/designingwork.json"),
    title: "Your Journey Starts Here",
    text: "Join thousands of students transforming the way they learn. It’s time to unlock your full potential — let’s do this together!",
  },
];
const OnboardingScreen = () => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();
  const flatListRef = useAnimatedRef(null);
  const x = useSharedValue(0);
  const flatListIndex = useSharedValue(0);

  const scheme = useColorScheme();

  const colors = getColors(scheme);
  const isDark = scheme === "dark";

  const onViewableItemsChanged = ({ viewableItems }) => {
    flatListIndex.value = viewableItems[0]?.index;
  };

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      x.value = event.contentOffset.x;
    },
  });

  const RenderItem = ({ item, index = 0 }) => {
    const imageAnimationStyle = useAnimatedStyle(() => {
      const opacityAnimation = interpolate(
        x.value,
        [
          (index - 1) * SCREEN_WIDTH,
          index * SCREEN_WIDTH,
          (index + 1) * SCREEN_WIDTH,
        ],
        [0, 1, 0],
        Extrapolation.CLAMP
      );
      const translateYAnimation = interpolate(
        x.value,
        [
          (index - 1) * SCREEN_WIDTH,
          index * SCREEN_WIDTH,
          (index + 1) * SCREEN_WIDTH,
        ],
        [100, 0, 100],
        Extrapolation.CLAMP
      );
      return {
        opacity: opacityAnimation,
        width: SCREEN_WIDTH * 0.8,
        height: SCREEN_WIDTH * 0.8,
        transform: [{ translateY: translateYAnimation }],
      };
    });
    const textAnimationStyle = useAnimatedStyle(() => {
      const opacityAnimation = interpolate(
        x.value,
        [
          (index - 1) * SCREEN_WIDTH,
          index * SCREEN_WIDTH,
          (index + 1) * SCREEN_WIDTH,
        ],
        [0, 1, 0],
        Extrapolation.CLAMP
      );
      const translateYAnimation = interpolate(
        x.value,
        [
          (index - 1) * SCREEN_WIDTH,
          index * SCREEN_WIDTH,
          (index + 1) * SCREEN_WIDTH,
        ],
        [100, 0, 100],
        Extrapolation.CLAMP
      );

      return {
        opacity: opacityAnimation,
        transform: [{ translateY: translateYAnimation }],
      };
    });
    return (
      <View style={[styles.itemContainer, { width: SCREEN_WIDTH }]}>
        <Animated.View style={imageAnimationStyle}>
          <LottieView
            source={item.animation}
            autoPlay
            loop
            style={{ width: SCREEN_WIDTH * 0.8, height: SCREEN_WIDTH * 0.8 }}
          />
        </Animated.View>
        <Animated.View style={textAnimationStyle}>
          <Text style={{ ...styles.itemTitle, color: colors.textPrimary }}>
            {item.title}
          </Text>
          <Text style={{ ...styles.itemText, color: colors.textPrimary }}>
            {item.text}
          </Text>
        </Animated.View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{ ...styles.container, backgroundColor: colors.background }}
    >
      <StatusBar
        style={{
          ...(isDark ? "light" : "dark"),
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        }}
      />
      <Animated.FlatList
        ref={flatListRef}
        onScroll={onScroll}
        data={data}
        renderItem={({ item, index = 0 }) => {
          return <RenderItem item={item} index={index} />;
        }}
        keyExtractor={(item) => item.id}
        scrollEventThrottle={16}
        horizontal={true}
        bounces={false}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{
          minimumViewTime: 300,
          viewAreaCoveragePercentThreshold: 10,
        }}
      />
      <View style={styles.bottomContainer}>
        <Pagination data={data} x={x} screenWidth={SCREEN_WIDTH} />
        <CustomButton
          flatListRef={flatListRef}
          flatListIndex={flatListIndex}
          dataLength={data.length}
        />
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  itemTitle: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,

    paddingHorizontal: 50,
    fontFamily: fonts.semiBold,
  },
  itemText: {
    textAlign: "center",
    marginHorizontal: 35,
    lineHeight: 20,
    fontFamily: fonts.bold,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    paddingVertical: 20,
  },
});
