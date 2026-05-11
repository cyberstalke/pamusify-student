import React, { useMemo, useState } from "react";
import { Platform, SafeAreaView, useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { weeklyData, monthlyData, allTimeData } from "../data/leaderData";
import { getColors } from "../utils/colors";

import LeaderboardHeader from "../components/leaderboard/LeaderboardHeader";
import LeaderboardList from "../components/leaderboard/LeaderboardList";
import LeaderboardFooter from "../components/leaderboard/LeaderboardFooter";
import { createLeaderboardStyles } from "../styles/leaderboard.styles";

const periods = ["Weekly", "Monthly", "All Time"];

export default function LeaderboardScreen() {
  const scheme = useColorScheme();
  const colors = getColors(scheme);
  const styles = createLeaderboardStyles(colors);
  const isDark = scheme === "dark";

  const [activePeriod, setActivePeriod] = useState(periods[0]);

  const translateX = useSharedValue(0);

  const data = useMemo(() => {
    if (activePeriod === "Monthly") return monthlyData;
    if (activePeriod === "All Time") return allTimeData;
    return weeklyData;
  }, [activePeriod]);

  const onGestureEvent = (event) => {
    "worklet";
    translateX.value = event.nativeEvent.translationX;
  };

  const onHandlerStateChange = (event) => {
    "worklet";

    if (event.nativeEvent.state !== 5) return;

    const index = periods.indexOf(activePeriod);
    const translationX = event.nativeEvent.translationX;

    if (translationX < -55 && index < periods.length - 1) {
      runOnJS(setActivePeriod)(periods[index + 1]);
    }

    if (translationX > 55 && index > 0) {
      runOnJS(setActivePeriod)(periods[index - 1]);
    }

    translateX.value = withTiming(0, { duration: 260 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <GestureHandlerRootView
      style={[styles.root, Platform.OS === "android" && styles.androidRoot]}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style={isDark ? "light" : "dark"} />

        <LeaderboardHeader
          periods={periods}
          activePeriod={activePeriod}
          onChangePeriod={setActivePeriod}
          colors={colors}
          styles={styles}
        />

        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <Animated.View style={[styles.content, animatedStyle]}>
            <LeaderboardList data={data} colors={colors} styles={styles} />
          </Animated.View>
        </PanGestureHandler>

        <LeaderboardFooter colors={colors} styles={styles} />
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
