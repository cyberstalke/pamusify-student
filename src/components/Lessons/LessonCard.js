import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export default function LessonCard({
  title,
  subtitle,
  locked = false,
  progress = 0,
  xp = 20,
  index = 0,
  onPress,
  colors,
  styles,
}) {
  const scale = useSharedValue(0.92);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(24);
  const pressScale = useSharedValue(1);

  useEffect(() => {
    opacity.value = withDelay(index * 45, withTiming(1, { duration: 360 }));
    translateY.value = withDelay(index * 45, withSpring(0));
    scale.value = withDelay(index * 45, withSpring(1));
  }, []);

  const animatedCardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value * pressScale.value },
    ],
  }));

  const sideOffset = index % 2 === 0 ? styles.lessonLeft : styles.lessonRight;

  return (
    <Animated.View style={[animatedCardStyle, sideOffset]}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        disabled={locked}
        onPressIn={() => {
          pressScale.value = withTiming(0.96, { duration: 120 });
        }}
        onPressOut={() => {
          pressScale.value = withSpring(1);
        }}
        style={[styles.lessonCard, locked && styles.lessonCardLocked]}
      >
        <View style={styles.lessonTop}>
          <View style={[styles.lessonIcon, locked && styles.lessonIconLocked]}>
            {locked ? (
              <Entypo name="lock" size={22} color="#8f9195" />
            ) : (
              <MaterialCommunityIcons name="play" size={26} color="#fff" />
            )}
          </View>

          <View style={styles.lessonInfo}>
            <Text
              numberOfLines={1}
              style={[styles.lessonTitle, locked && styles.lessonTextLocked]}
            >
              {title}
            </Text>

            <Text
              numberOfLines={1}
              style={[styles.lessonSubtitle, locked && styles.lessonTextLocked]}
            >
              {locked ? "Oldingi darsni tugating" : subtitle}
            </Text>
          </View>
        </View>

        <View style={styles.lessonBottom}>
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.min(progress * 100, 100)}%` },
                locked && styles.progressFillLocked,
              ]}
            />
          </View>

          <View style={styles.xpPill}>
            <MaterialCommunityIcons
              name="star-four-points"
              size={14}
              color={locked ? colors.textSecondary : colors.tabIconActive}
            />
            <Text style={[styles.xpText, locked && styles.lessonTextLocked]}>
              {xp} XP
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}
