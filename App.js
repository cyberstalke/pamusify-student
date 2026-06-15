import { StyleSheet } from "react-native";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OnboardingScreen from "./src/screens/OnboardingScreen";
import LoginScreen from "./src/screens/LoginScreen";
import Home from "./src/screens/Home";
import TabNavigator from "./src/components/TabBar/Tab";
import { fonts } from "./src/utils/fonts";
import Lessons from "./src/screens/Lessons";
import LearningPage from "./src/screens/LearningPage";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import ScanScreen from "./src/screens/ScanScreen";
import { TimeProvider } from "./src/context/TimeProvider";
import { AuthProvider } from "./src/context/AuthContext";
import LibraryScreen from "./src/screens/LibraryScreen";
import PdfViewerScreen from "./src/components/PdfViewerScreen";
import SpellingScreen from "./src/screens/SpellingScreen";
import MyCourse from "./src/screens/MyCourse";
import GameScreen from "./src/screens/GameScreen";
import MultipleChoiceScreen from "./src/screens/MultipleChoiceScreen";
import StoriesScreen from "./src/screens/StoriesScreen";
import GrammarPracticeScreen from "./src/screens/GrammarPracticeScreen";
import VocabularyScreen from "./src/screens/VocabularyScreen";
import ReadingScreen from "./src/screens/ReadingScreen";
import ListeningScreen from "./src/screens/ListeningScreen";

const Stack = createStackNavigator();

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
    "Poppins-SemiBold": require("./assets/fonts/Poppins-SemiBold.ttf"),
  });

  const [initialRoute, setInitialRoute] = useState(null);

  useEffect(() => {
    const resolveRoute = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (token) {
          setInitialRoute("tab");
          return;
        }
        const seenOnboarding = await AsyncStorage.getItem("hasSeenOnboarding");
        setInitialRoute(seenOnboarding ? "login" : "onboarding");
      } catch {
        setInitialRoute("onboarding");
      }
    };
    resolveRoute();
  }, []);

  useEffect(() => {
    if (fontsLoaded && initialRoute) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, initialRoute]);

  if (!fontsLoaded || !initialRoute) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <TimeProvider>
          <NavigationContainer>
            <Stack.Navigator
              initialRouteName={initialRoute}
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="onboarding" component={OnboardingScreen} />
              <Stack.Screen name="login" component={LoginScreen} />
              <Stack.Screen name="home" component={Home} />
              <Stack.Screen name="tab" component={TabNavigator} />
              <Stack.Screen name="lessons" component={Lessons} />
              <Stack.Screen name="LearningPage" component={LearningPage} />
              <Stack.Screen name="Scan" component={ScanScreen} />
              <Stack.Screen name="LibraryScreen" component={LibraryScreen} />
              <Stack.Screen name="PdfViewer" component={PdfViewerScreen} />
              <Stack.Screen name="Spelling" component={SpellingScreen} />
              <Stack.Screen name="MyCourse" component={MyCourse} />
              <Stack.Screen name="GamesScreen" component={GameScreen} />
              <Stack.Screen name="Multiple" component={MultipleChoiceScreen} />
              <Stack.Screen name="StoriesScreen" component={StoriesScreen} />
              <Stack.Screen name="GrammarPractice" component={GrammarPracticeScreen} />
              <Stack.Screen name="Vocabulary" component={VocabularyScreen} />
              <Stack.Screen name="Reading" component={ReadingScreen} />
              <Stack.Screen name="Listening" component={ListeningScreen} />
            </Stack.Navigator>
          </NavigationContainer>
        </TimeProvider>
      </AuthProvider>
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
