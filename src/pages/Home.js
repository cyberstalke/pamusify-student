import {
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import React, { useState } from "react";
import { getColors } from "../utils/colors";
import { StatusBar } from "expo-status-bar";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import { useEffect } from "react";
import {
  Entypo,
  EvilIcons,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { vwFontSize } from "../utils/wFontSize";
import { fonts } from "../utils/fonts";
import ProgressLine from "../components/ProgressLine";
import { useNavigation } from "@react-navigation/native";
import { Heart } from "../../assets/icons";
import MyNavButtons from "../components/MyNavButtons";
import StudentClassCard from "../components/Home/StudentClassCard";

const classStudents = [
  {
    id: 1,
    name: "SuperStar",
    level: "A1",
    students: [
      require("../../assets/images/Avatar.png"),
      require("../../assets/images/Avatar.png"),
      require("../../assets/images/Avatar.png"),
      require("../../assets/images/Avatar.png"),
    ],
  },
];

const Home = () => {
  const schem = useColorScheme();
  const colors = getColors(schem);
  const isDark = schem === "dark";
  const [currentProgress, setCurrentProgress] = useState(25);
  const navigate = useNavigation();

  // Используем useSharedValue для создания анимируемых значений
  const translateY = useSharedValue(50); // Начальное положение ниже экрана
  const opacity = useSharedValue(0); // Начальная прозрачность 0
  const scale = useSharedValue(0.8); // Начальный масштаб 0.8 (немного уменьшен)

  // Эффект, который запускает анимацию при монтировании компонента
  useEffect(() => {
    translateY.value = withTiming(0, { duration: 500 });
    opacity.value = withTiming(1, { duration: 500 });
    scale.value = withTiming(1, { duration: 500 }); // Анимируем масштаб до 1
  }, []);

  // Создаем анимированный стиль
  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }, { scale: scale.value }], // Добавляем масштабирование
      opacity: opacity.value,
    };
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cardSecondary }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <View style={{ backgroundColor: colors.background, flex: 1 }}>
        <View
          style={{
            backgroundColor: colors.cardSecondary,
            padding: 20,
            borderRadius: 20,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
        >
          <Animated.View style={{ marginBottom: 15 }}>
            <View style={{ ...styles.flex, justifyContent: "space-between" }}>
              <Text style={{ ...styles.h1, color: colors.textPrimary }}>
                Silver Stela: A2
              </Text>
              <View style={{ ...styles.flex, gap: 10 }}>
                <View style={{ ...styles.flex }}>
                  <Heart />
                  <Text style={{ ...styles.h1, color: colors.textPrimary }}>
                    0
                  </Text>
                </View>
                <TouchableOpacity>
                  <Ionicons
                    name="notifications"
                    size={vwFontSize(24)}
                    color={colors.textPrimary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
          <ProgressLine progress={currentProgress} mode="dark" />

          <TouchableOpacity
            onPress={() => navigate.navigate("lessons")}
            style={{ ...styles.card }}
          >
            <View style={styles.secondCard}>
              <View>
                <Text style={styles.p}>Day 1 - lesson 4</Text>
                <Text style={styles.h1}>Unit 1 Sssion 1</Text>
              </View>
              <TouchableOpacity>
                <Feather name="play-circle" size={35} color="white" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          <MyNavButtons />
        </View>

        <View
          style={{
            backgroundColor: colors.cardSecondary,
            padding: 20,
            borderRadius: 20,
            marginTop: 20,
          }}
        >
          <Text style={{ ...styles.h1, color: colors.textPrimary }}>
            My Course
          </Text>
          {classStudents.map((course) => (
            <StudentClassCard key={course.id} item={course} />
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  h1: {
    fontFamily: fonts.semiBold,
    fontSize: 20,
  },
  flex: {
    flexDirection: "row",
    alignItems: "center",
  },
  card: {
    borderWidth: 2,
    borderColor: "#00c7be",
    padding: 2,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 15,
    borderBottomWidth: 4,
    borderBottomColor: "#06b8b3",
    shadowColor: "#00c7be",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5.46,
    // Android Shadow property
    elevation: 9,
  },
  secondCard: {
    backgroundColor: "#00c7be",
    padding: 20,
    borderRadius: 17,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  p: {
    color: "white",
    fontFamily: fonts.bold,
    fontSize: vwFontSize(13),
  },
  h1: {
    color: "white",
    fontFamily: fonts.semiBold,
    fontSize: vwFontSize(20),
  },
  classCard: {
    padding: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
