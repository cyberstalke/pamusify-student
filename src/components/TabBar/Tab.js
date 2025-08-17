import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import CustomTabBar from "./CustomTabBar";
import Home from "../../screens/Home";
import Calendar from "../../screens/Calendar";
import QRScannerPage from "../../screens/QRScannerPage";
import LeaderboardScreen from "../../screens/LeaderboardScreen";
import ProfileScreen from "../../screens/ProfileScreen";

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
                options={{tabBarLabel: "Home", tabBarIcon: "home"}}
            />
            <BottomTab.Screen
                name="Calendar"
                component={Calendar} // Используем новый компонент
                options={{tabBarLabel: "Calendar", tabBarIcon: "calendar"}}
            />
            <BottomTab.Screen
                name="QR"
                component={QRScannerPage} // Используем новый компонент
                options={{tabBarLabel: "QR", tabBarIcon: "qr-code"}}
            />
            <BottomTab.Screen
                name="Leaderboard"
                component={LeaderboardScreen} // Используем новый компонент
                options={{
                    tabBarLabel: "Board",
                    tabBarIcon: "trophy",
                }}
            />
            <BottomTab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{tabBarLabel: "Afsar", tabBarIcon: "person"}}
            />
        </BottomTab.Navigator>
    );
}
