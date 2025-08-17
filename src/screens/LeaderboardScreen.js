import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
  useColorScheme,
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

import { weeklyData, monthlyData, allTimeData } from "../data/leaderData";
import { getColors } from "../utils/colors";

const { width } = Dimensions.get("window");
const periods = ["Haftalik", "Oylik", "Butun davr"];

// Компонент для одной строки в списке лидеров
const LeaderboardItem = ({ item }) => (
  <View style={styles.itemContainer}>
    <View style={styles.itemLeft}>
      <Text style={styles.rankText}>{item.rank}</Text>
      <View style={styles.avatarContainer}>
        {item.avatar ? (
          <Animated.Image source={{ uri: item.avatar }} style={styles.avatar} />
        ) : (
          <MaterialCommunityIcons
            name="account-circle"
            size={40}
            color="#7F7F7F"
          />
        )}
      </View>
      <Text style={styles.nameText}>{item.name}</Text>
    </View>
    <View style={styles.itemRight}>
      <MaterialCommunityIcons name="diamond" size={20} color="#00C4FF" />
      <Text style={styles.scoreText}>{item.score}</Text>
    </View>
  </View>
);

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
      case "Haftalik":
        newData = weeklyData;
        break;
      case "Oylik":
        newData = monthlyData;
        break;
      case "Butun davr":
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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar
          style={{
            ...(isDark ? "light" : "dark"),
            paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
          }}
        />
        <View style={styles.header}>
          <TouchableOpacity style={styles.levelSelector}>
            <Text style={styles.levelText}>Super Start: A2</Text>
            <MaterialCommunityIcons
              name="chevron-down"
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
          <View style={styles.periodSelector}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  activePeriod === period && styles.activePeriodButton,
                ]}
                onPress={() => setActivePeriod(period)}
              >
                <Text style={styles.periodText}>{period}</Text>
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

        <View style={styles.footer}>
          <TouchableOpacity style={styles.footerButton}>
            <MaterialCommunityIcons
              name="home-outline"
              size={24}
              color="#7F7F7F"
            />
            <Text style={styles.footerText}>Asosiy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <MaterialCommunityIcons
              name="book-open-page-variant-outline"
              size={24}
              color="#7F7F7F"
            />
            <Text style={styles.footerText}>Kurslar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <MaterialCommunityIcons
              name="star-shooting-outline"
              size={24}
              color="#7F7F7F"
            />
            <Text style={styles.footerText}>O'yinlar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.footerButton, styles.activeFooterButton]}
          >
            <MaterialCommunityIcons
              name="trophy-outline"
              size={24}
              color="#00C4FF"
            />
            <Text style={[styles.footerText, styles.activeFooterText]}>
              Liderbord
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.footerButton}>
            <MaterialCommunityIcons
              name="account-outline"
              size={24}
              color="#7F7F7F"
            />
            <Text style={styles.footerText}>Profil</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A0E1A",
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 15,
    backgroundColor: "#0F1321",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 20,
  },
  headerText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  levelSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E2333",
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  levelText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 5,
  },
  periodSelector: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#1E2333",
    borderRadius: 15,
    padding: 5,
    marginBottom: 20,
  },
  periodButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activePeriodButton: {
    backgroundColor: "#308DFF",
    borderRadius: 10,
  },
  periodText: {
    color: "#fff",
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
    backgroundColor: "#1E2333",
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  rankText: {
    color: "#fff",
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
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  itemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  scoreText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#1E2333",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 10,
  },
  footerButton: {
    alignItems: "center",
  },
  footerText: {
    color: "#7F7F7F",
    fontSize: 12,
    marginTop: 5,
  },
  activeFooterButton: {
    // Стиль для активной кнопки в футере
  },
  activeFooterText: {
    color: "#00C4FF",
  },
});

export default LeaderboardScreen;
