import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import CustomTabBar from "./CustomTabBar";
import Home from "../../pages/Home";
import Calendar from "../../pages/Calendar";
import QRScannerPage from "../../pages/QRScannerPage";

const BottomTab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <BottomTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          display: "none",
        },
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <BottomTab.Screen
        name="Home"
        component={Home}
        options={{ tabBarLabel: "Home", tabBarIcon: "home" }}
      />
      <BottomTab.Screen
        name="Calendar"
        component={Calendar} // Используем новый компонент
        options={{ tabBarLabel: "Calendar", tabBarIcon: "calendar" }}
      />
      <BottomTab.Screen
        name="QR"
        component={QRScannerPage} // Используем новый компонент
        options={{ tabBarLabel: "QR", tabBarIcon: "qrcode-scan" }}
      />
      <BottomTab.Screen
        name="Music"
        component={Home} // Используем новый компонент
        options={{ tabBarLabel: "Music", tabBarIcon: "musical-notes" }}
      />
      <BottomTab.Screen
        name="Profile"
        component={Home}
        options={{ tabBarLabel: "Afsar", tabBarIcon: "person" }}
      />
    </BottomTab.Navigator>
  );
}
