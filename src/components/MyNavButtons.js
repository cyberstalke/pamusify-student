import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  useColorScheme,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getColors } from "../utils/colors";
import { useNavigation } from "@react-navigation/native";

// MyNavButtons component: Renders a row of custom navigation buttons.
const MyNavButtons = () => {
  // Determine the current color scheme (light/dark)
  const scheme = useColorScheme();
  const colors = getColors(scheme);
  const navigation = useNavigation();

  // Define the buttons with their properties (icon, label, background color, and navigation route)
  const buttons = [
    {
      icon: "bookshelf",
      label: "Library",
      bg: colors.purple,
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
      bg: colors.cardBackground,
      route: "StoriesScreen",
    },
    {
      icon: "cards-outline",
      label: "Cards",
      bg: colors.categoryIconBackground,
      route: "CardsScreen",
    },
  ];

  return (
    <View style={[styles.container]}>
      {/* Map through the buttons array to render a NavButton for each item */}
      {buttons.map((btn, index) => (
        <NavButton
          key={index}
          icon={btn.icon}
          label={btn.label}
          colors={colors}
          bgColor={btn.bg}
          onPress={() => navigation.navigate(btn.route)}
        />
      ))}
    </View>
  );
};

// NavButton component: Represents a single, animated navigation button.
const NavButton = ({ icon, label, colors, bgColor, onPress }) => {
  // Use a ref to control the animated scale value
  const scale = useRef(new Animated.Value(1)).current;

  // Animate the button to scale down when pressed
  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  // Animate the button to scale back up when released
  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 4,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={onPress}
        style={styles.button}
      >
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: bgColor,
              shadowColor: colors.textPrimary, // Тень иконки зависит от темы
            },
          ]}
        >
          <MaterialCommunityIcons
            name={icon}
            size={28}
            color={colors.textPrimary}
          />
        </View>
        <Text style={[styles.label, { color: colors.textPrimary }]}>
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Stylesheet for consistent and reusable styling
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    borderRadius: 25,
  },
  button: {
    alignItems: "center",
    marginHorizontal: 8,
  },
  iconContainer: {
    borderRadius: 10,
    padding: 14,
    marginBottom: 6,
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default MyNavButtons;
