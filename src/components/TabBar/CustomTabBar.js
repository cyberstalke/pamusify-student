import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  useColorScheme,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getColors } from "../../utils/colors";
import { fonts } from "../../utils/fonts";
import { vh, vwFontSize } from "../../utils/wFontSize";

export default function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const scheme = useColorScheme();
  const colors = getColors(scheme);
  const isDark = scheme === "dark";

  return (
    <View
      style={[
        styles.tabBar,
        {
          paddingBottom: insets.bottom,
          backgroundColor: colors.tabBarBackground,
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const animatedIconStyle = useAnimatedStyle(() => {
          return {
            transform: [
              {
                scale: withSpring(isFocused ? 1.3 : 1, {
                  damping: 15,
                  stiffness: 120,
                }),
              },
            ],
          };
        });

        const animatedTextStyle = useAnimatedStyle(() => {
          return {
            opacity: withTiming(isFocused ? 1 : 0, { duration: 200 }),
          };
        });

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabItem}
            activeOpacity={0.8}
          >
            <Animated.View style={animatedIconStyle}>
              <Ionicons
                name={
                  isFocused
                    ? options.tabBarIcon
                    : `${options.tabBarIcon}-outline`
                }
                size={26}
                color={
                  isFocused ? colors.tabIconActive : colors.tabIconInactive
                }
              />
            </Animated.View>
            {isFocused && (
              <Animated.Text
                style={[
                  styles.label,
                  animatedTextStyle,
                  { color: colors.tabIconActive },
                ]}
              >
                {label}
              </Animated.Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    paddingTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: vwFontSize(11.5),
    marginTop: vh(4),
    fontFamily: fonts.bold,
  },
});
