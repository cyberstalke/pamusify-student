import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  useColorScheme,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getColors } from "../utils/colors";
import { useNavigation } from "@react-navigation/native";

const MyNavButtons = () => {
  const scheme = useColorScheme();
  const colors = getColors(scheme);
  const navigation = useNavigation();

  const buttons = [
    {
      icon: "bookshelf",
      label: "Библиотека",
      bg: colors.purple,
      route: "LibraryScreen",
    },
    {
      icon: "gamepad-variant",
      label: "Игры",
      bg: colors.tabIconActive,
      route: "GamesScreen",
    },
    {
      icon: "book-open-page-variant",
      label: "Истории",
      bg: colors.cardBackground,
      route: "StoriesScreen",
    },
    {
      icon: "cards-outline",
      label: "Карточки",
      bg: colors.categoryIconBackground,
      route: "CardsScreen",
    },
  ];

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 20,
        backgroundColor: colors.cardSecondary + "CC",
        borderRadius: 25,
        paddingVertical: 14,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
      }}
    >
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

const NavButton = ({ icon, label, colors, bgColor, onPress }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

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
        style={{
          alignItems: "center",
          marginHorizontal: 8, // spacing between buttons
        }}
      >
        <View
          style={{
            backgroundColor: bgColor,
            borderRadius: 50,
            padding: 14,
            marginBottom: 6,
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <MaterialCommunityIcons
            name={icon}
            size={28}
            color={colors.textPrimary}
          />
        </View>
        <Text
          style={{
            color: colors.textPrimary,
            fontSize: 13,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          {label}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default MyNavButtons;
