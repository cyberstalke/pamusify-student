import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  useColorScheme,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Обновим импорты данных, чтобы использовать английские имена
import { weeklyData, monthlyData, allTimeData } from "../data/leaderData";
import { getColors } from "../utils/colors";

const { width } = Dimensions.get("window");
// Переводим периоды на английский
const periods = ["Weekly", "Monthly", "All Time"];

// Компонент для одной строки в списке лидеров
const LeaderboardItem = ({ item }) => {
  const schem = useColorScheme();
  const colors = getColors(schem);
  return (
    <View
      style={[styles.itemContainer, { backgroundColor: colors.cardSecondary }]}
    >
      <View style={styles.itemLeft}>
        <Text style={[styles.rankText, { color: colors.textPrimary }]}>
          {item.rank}
        </Text>
        <View
          style={[
            styles.avatarContainer,
            { backgroundColor: colors.background },
          ]}
        >
          {/* Убедимся, что аватар правильно проверяется и отображается */}
          {item.avatar ? (
            <Animated.Image
              source={{ uri: item.avatar }}
              style={styles.avatar}
            />
          ) : (
            // Отображаем иконку, если аватара нет
            <MaterialCommunityIcons
              name="account-circle"
              size={40}
              color={colors.textSecondary}
            />
          )}
        </View>
        {/* Отображаем имя пользователя */}
        <Text style={[styles.nameText, { color: colors.textPrimary }]}>
          {item.name}
        </Text>
      </View>
      <View style={styles.itemRight}>
        <MaterialCommunityIcons
          name="diamond"
          size={20}
          color={colors.tabIconActive}
        />
        <Text style={[styles.scoreText, { color: colors.textPrimary }]}>
          {item.score}
        </Text>
      </View>
    </View>
  );
};

// Компонент для списка лидеров
const LeaderboardList = ({ data }) => (
  <View style={styles.listContainer}>
    {data.map((item) => (
      <LeaderboardItem key={item.id} item={item} />
    ))}
  </View>
);

// Основной компонент экрана
const LeaderboardScreen = () => {
  const [activePeriod, setActivePeriod] = useState(periods[0]);
  const [data, setData] = useState(weeklyData);
  const schem = useColorScheme();
  const colors = getColors(schem);
  const isDark = schem === "dark";

  const translateX = useSharedValue(0);

  useEffect(() => {
    let newData;
    switch (activePeriod) {
      case "Weekly":
        newData = weeklyData;
        break;
      case "Monthly":
        newData = monthlyData;
        break;
      case "All Time": // Обновляем название
        newData = allTimeData;
        break;
      default:
        newData = weeklyData;
        break;
    }
    setData(newData);
  }, [activePeriod]);

  const onGestureEvent = (event) => {
    "worklet";
    const { translationX } = event.nativeEvent;
    translateX.value = translationX;
  };

  const onHandlerStateChange = (event) => {
    "worklet";
    if (event.nativeEvent.state === 5) {
      // State.END
      const { translationX } = event.nativeEvent;
      const index = periods.indexOf(activePeriod);

      if (translationX < -50 && index < periods.length - 1) {
        // Swipe left
        runOnJS(setActivePeriod)(periods[index + 1]);
      } else if (translationX > 50 && index > 0) {
        // Swipe right
        runOnJS(setActivePeriod)(periods[index - 1]);
      }

      translateX.value = withTiming(0, { duration: 300 });
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  // Нижняя навигационная панель
  const Footer = () => (
    <View style={[styles.footer, { backgroundColor: colors.tabBarBackground }]}>
      <TouchableOpacity style={styles.footerButton}>
        <MaterialCommunityIcons
          name="home-outline"
          size={24}
          color={colors.tabIconInactive}
        />
        <Text style={[styles.footerText, { color: colors.tabIconInactive }]}>
          Home
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton}>
        <MaterialCommunityIcons
          name="book-open-page-variant-outline"
          size={24}
          color={colors.tabIconInactive}
        />
        <Text style={[styles.footerText, { color: colors.tabIconInactive }]}>
          Courses
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton}>
        <MaterialCommunityIcons
          name="star-shooting-outline"
          size={24}
          color={colors.tabIconInactive}
        />
        <Text style={[styles.footerText, { color: colors.tabIconInactive }]}>
          Games
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.footerButton, styles.activeFooterButton]}
      >
        <MaterialCommunityIcons
          name="trophy-outline"
          size={24}
          color={colors.tabIconActive}
        />
        <Text style={[styles.footerText, { color: colors.tabIconActive }]}>
          Leaderboard
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton}>
        <MaterialCommunityIcons
          name="account-outline"
          size={24}
          color={colors.tabIconInactive}
        />
        <Text style={[styles.footerText, { color: colors.tabIconInactive }]}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <GestureHandlerRootView
      style={{ flex: 1, paddingTop: Platform.OS === "android" ? 40 : 0 }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.cardSecondary }}>
        <View
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          <StatusBar style={isDark ? "light" : "dark"} />
          <View
            style={[styles.header, { backgroundColor: colors.cardSecondary }]}
          >
            <TouchableOpacity
              style={[
                styles.levelSelector,
                { backgroundColor: colors.background },
              ]}
            >
              <Text style={[styles.levelText, { color: colors.textPrimary }]}>
                Super Start: A2
              </Text>
              <MaterialCommunityIcons
                name="chevron-down"
                size={24}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
            <View style={[styles.periodSelector]}>
              {periods.map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.periodButton,
                    activePeriod === period && styles.activePeriodButton,
                    activePeriod === period && {
                      backgroundColor: colors.tabIconActive,
                    },
                  ]}
                  onPress={() => setActivePeriod(period)}
                >
                  <Text
                    style={[styles.periodText, { color: colors.textPrimary }]}
                  >
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <PanGestureHandler
            onGestureEvent={onGestureEvent}
            onHandlerStateChange={onHandlerStateChange}
          >
            <Animated.View style={[styles.animatedContent, animatedStyle]}>
              <LeaderboardList data={data} />
            </Animated.View>
          </PanGestureHandler>

          <Footer />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  levelSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  levelText: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 5,
  },
  periodSelector: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderRadius: 15,
    padding: 5,
    marginBottom: 20,
  },
  periodButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activePeriodButton: {
    borderRadius: 10,
  },
  periodText: {
    fontWeight: "bold",
  },
  animatedContent: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  rankText: {
    fontSize: 16,
    fontWeight: "bold",
    width: 30,
    textAlign: "center",
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    marginLeft: 10,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  nameText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  itemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  scoreText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 10,
  },
  footerButton: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    marginTop: 5,
  },
  activeFooterButton: {},
  activeFooterText: {
    color: "#00C4FF",
  },
});

export default LeaderboardScreen;
