import {
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import React from "react";
import { getColors } from "../utils/colors";
import { StatusBar } from "expo-status-bar";

const Home = () => {
  const schem = useColorScheme();
  const colors = getColors(schem);
  const isDark = schem === "dark";
  return (
    <SafeAreaView style={{ backgroundColor: colors.background, flex: 1 }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Text style={{ color: colors.textPrimary }}>Home</Text>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({});
