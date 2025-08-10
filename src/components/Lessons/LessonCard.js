import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { getColors } from "../../utils/colors";

const LessonCard = ({
  title,
  subtitle,
  locked = false,
  progress = 0,
  onPress,
}) => {
  const schem = useColorScheme();
  const colors = getColors(schem);

  const scale = useSharedValue(0.8);
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: withTiming(scale.value, { duration: 500 }) }],
  }));

  React.useEffect(() => {
    scale.value = 1;
  }, []);

  const getIcon = () => {
    if (locked) {
      return <Entypo name="lock" size={24} color="#8f9195" />;
    }
    return (
      <View
        style={[
          styles.avatar,
          { backgroundColor: colors.categoryIconBackground },
        ]}
      />
    );
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={locked ? 1 : 0.7}
      style={[styles.card, { backgroundColor: colors.cardSecondary }]}
    >
      <View style={styles.leftSection}>
        <Animated.View
          style={[
            styles.iconContainer,
            { backgroundColor: colors.categoryIconBackground },
            animatedStyles,
          ]}
        >
          {getIcon()}
        </Animated.View>
        <View>
          <Text style={[styles.lessonTitle, { color: colors.textPrimary }]}>
            {title}
          </Text>
          <Text
            style={[styles.lessonSubtitle, { color: colors.textSecondary }]}
          >
            {subtitle}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 15,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  lessonTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  lessonSubtitle: {
    fontSize: 12,
  },
});

export default LessonCard;
