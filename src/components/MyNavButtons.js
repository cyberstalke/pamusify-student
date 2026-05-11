import React, { useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  useColorScheme,
  StyleSheet,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { getColors } from "../utils/colors";

export default function MyNavButtons() {
  const scheme = useColorScheme();
  const colors = getColors(scheme);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const navigation = useNavigation();

  const buttons = [
    {
      icon: "bookshelf",
      label: "Library",
      bg: colors.purple || colors.tabIconActive,
      route: "LibraryScreen",
    },
    {
      icon: "gamepad-variant",
      label: "Games",
      bg: colors.tabIconActive,
      route: "GamesScreen",
    },
    {
      icon: "book-open-page-variant",
      label: "Stories",
      bg: colors.cardBackground || colors.tabIconActive,
      route: "StoriesScreen",
    },
    {
      icon: "cards-outline",
      label: "Cards",
      bg: colors.categoryIconBackground || colors.cardSecondary,
      route: "Multiple",
    },
  ];

  return (
    <View style={styles.container}>
      {buttons.map((btn, index) => (
        <NavButton
          key={btn.label}
          item={btn}
          index={index}
          colors={colors}
          styles={styles}
          onPress={() => navigation.navigate(btn.route)}
        />
      ))}
    </View>
  );
}

function NavButton({ item, index, colors, styles, onPress }) {
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80)
        .duration(380)
        .springify()
        .damping(16)}
      style={[styles.itemWrap, animatedStyle]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withTiming(0.94, { duration: 90 });
          translateY.value = withTiming(3, { duration: 90 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
          translateY.value = withSpring(0);
        }}
        style={styles.button}
      >
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: item.bg,
              shadowColor: item.bg,
            },
          ]}
        >
          <MaterialCommunityIcons name={item.icon} size={27} color="#fff" />
        </View>

        <Text numberOfLines={1} style={styles.label}>
          {item.label}
        </Text>

        <Text numberOfLines={1} style={styles.subLabel}>
          Open
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      gap: 10,
    },

    itemWrap: {
      flex: 1,
    },

    button: {
      minHeight: 116,
      borderRadius: 26,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.06)",
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 12,
      shadowOffset: {
        width: 0,
        height: 7,
      },
      ...Platform.select({
        android: {
          elevation: 4,
        },
      }),
    },

    iconContainer: {
      width: 52,
      height: 52,
      borderRadius: 19,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
      shadowOpacity: 0.25,
      shadowRadius: 10,
      shadowOffset: {
        width: 0,
        height: 6,
      },
      ...Platform.select({
        android: {
          elevation: 5,
        },
      }),
    },

    label: {
      fontSize: 13,
      fontWeight: "900",
      color: colors.textPrimary,
      textAlign: "center",
    },

    subLabel: {
      marginTop: 3,
      fontSize: 10,
      fontWeight: "800",
      color: colors.textSecondary,
      textAlign: "center",
    },
  });
