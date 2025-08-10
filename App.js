import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import OnboardingScreen from "./src/pages/OnboardingScreen";
import Home from "./src/pages/Home";
import TabNavigator from "./src/components/TabBar/Tab";
import { fonts } from "./src/utils/fonts";
import Lessons from "./src/pages/Lessons";
import LearningPage from "./src/pages/LearningPage";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ScanScreen from "./src/pages/ScanScreen";

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
    "Poppins-SemiBold": require("./assets/fonts/Poppins-SemiBold.ttf"),
  });

  if (!fontsLoaded) return <AppLoading />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="onboarding" component={OnboardingScreen} />
          <Stack.Screen name="home" component={Home} />
          <Stack.Screen name="tab" component={TabNavigator} />
          <Stack.Screen name="lessons" component={Lessons} />
          <Stack.Screen name="LearningPage" component={LearningPage} />
          <Stack.Screen name="Scan" component={ScanScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
