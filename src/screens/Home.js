import React, { useMemo } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  FadeInDown,
  FadeIn,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { getColors } from "../utils/colors";
import ProgressLine from "../components/ProgressLine";
import MyNavButtons from "../components/MyNavButtons";
import StudentClassCard from "../components/Home/StudentClassCard";
import { Heart } from "../../assets/icons";

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

export default function Home() {
  const scheme = useColorScheme();
  const colors = getColors(scheme);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isDark = scheme === "dark";
  const navigation = useNavigation();

  const currentProgress = 25;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View
            entering={FadeIn.duration(300)}
            style={styles.heroSection}
          >
            <View style={styles.header}>
              <View>
                <Text style={styles.headerLabel}>Current level</Text>
                <Text style={styles.headerTitle}>Silver Stela: A2</Text>
              </View>

              <View style={styles.headerActions}>
                <View style={styles.heartBox}>
                  <Heart />
                  <Text style={styles.heartText}>0</Text>
                </View>

                <TouchableOpacity
                  activeOpacity={0.85}
                  style={styles.iconButton}
                >
                  <Ionicons
                    name="notifications-outline"
                    size={23}
                    color={colors.textPrimary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <Animated.View
              entering={FadeInDown.delay(80)
                .duration(420)
                .springify()
                .damping(17)}
              style={styles.progressCard}
            >
              <View style={styles.progressTop}>
                <View>
                  <Text style={styles.progressLabel}>Daily progress</Text>
                  <Text style={styles.progressValue}>{currentProgress}%</Text>
                </View>

                <View style={styles.progressIcon}>
                  <MaterialCommunityIcons
                    name="rocket-launch"
                    size={26}
                    color="#fff"
                  />
                </View>
              </View>

              <ProgressLine progress={currentProgress} mode="dark" />

              <Text style={styles.progressHint}>
                Bugungi darsni tugating va streak’ni saqlab qoling.
              </Text>
            </Animated.View>

            <ContinueLessonCard
              colors={colors}
              styles={styles}
              onPress={() => navigation.navigate("lessons")}
            />

            <Animated.View
              entering={FadeInDown.delay(220)
                .duration(420)
                .springify()
                .damping(17)}
              layout={Layout.springify()}
              style={styles.navCard}
            >
              <MyNavButtons />
            </Animated.View>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(300)
              .duration(420)
              .springify()
              .damping(17)}
            style={styles.courseSection}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Course</Text>

              <TouchableOpacity activeOpacity={0.85}>
                <Text style={styles.sectionAction}>View all</Text>
              </TouchableOpacity>
            </View>

            {classStudents.map((course) => (
              <StudentClassCard key={course.id} item={course} />
            ))}
          </Animated.View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function ContinueLessonCard({ onPress, colors, styles }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(150).duration(420).springify().damping(17)}
      style={animatedStyle}
    >
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withTiming(0.97, { duration: 90 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        style={styles.lessonCard}
      >
        <View style={styles.lessonContent}>
          <View style={styles.lessonBadge}>
            <MaterialCommunityIcons
              name="book-open-page-variant"
              size={17}
              color={colors.tabIconActive}
            />
            <Text style={styles.lessonBadgeText}>Continue</Text>
          </View>

          <Text style={styles.lessonMeta}>Day 1 • Lesson 4</Text>
          <Text style={styles.lessonTitle}>Unit 1 Session 1</Text>
          <Text style={styles.lessonSubtitle}>Personal information</Text>
        </View>

        <View style={styles.playButton}>
          <Feather name="play" size={25} color="#fff" />
        </View>
      </Pressable>
    </Animated.View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.cardSecondary,
      paddingTop: Platform.OS === "android" ? 38 : 0,
    },

    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    scrollContent: {
      paddingBottom: 30,
    },

    heroSection: {
      padding: 18,
      paddingTop: 16,
      borderBottomLeftRadius: 34,
      borderBottomRightRadius: 34,
      backgroundColor: colors.cardSecondary,
    },

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 16,
    },

    headerLabel: {
      fontSize: 13,
      fontWeight: "900",
      color: colors.tabIconActive,
      marginBottom: 3,
    },

    headerTitle: {
      fontSize: 25,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    headerActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },

    heartBox: {
      height: 44,
      paddingHorizontal: 12,
      borderRadius: 16,
      backgroundColor: colors.background,
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
    },

    heartText: {
      fontSize: 16,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    iconButton: {
      width: 44,
      height: 44,
      borderRadius: 16,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
    },

    progressCard: {
      padding: 16,
      borderRadius: 30,
      backgroundColor: colors.background,
      marginBottom: 16,
    },

    progressTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 14,
    },

    progressLabel: {
      fontSize: 13,
      fontWeight: "800",
      color: colors.textSecondary,
    },

    progressValue: {
      marginTop: 2,
      fontSize: 25,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    progressIcon: {
      width: 54,
      height: 54,
      borderRadius: 20,
      backgroundColor: colors.tabIconActive,
      alignItems: "center",
      justifyContent: "center",
    },

    progressHint: {
      marginTop: 12,
      fontSize: 13,
      lineHeight: 18,
      fontWeight: "700",
      color: colors.textSecondary,
    },

    lessonCard: {
      borderRadius: 30,
      padding: 16,
      backgroundColor: colors.tabIconActive,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      shadowColor: colors.tabIconActive,
      shadowOpacity: 0.35,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      ...Platform.select({
        android: {
          elevation: 6,
        },
      }),
    },

    lessonContent: {
      flex: 1,
      minWidth: 0,
    },

    lessonBadge: {
      alignSelf: "flex-start",
      paddingVertical: 7,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: "rgba(255,255,255,0.2)",
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      marginBottom: 12,
    },

    lessonBadgeText: {
      fontSize: 12,
      fontWeight: "900",
      color: "#fff",
    },

    lessonMeta: {
      fontSize: 13,
      fontWeight: "800",
      color: "rgba(255,255,255,0.82)",
    },

    lessonTitle: {
      marginTop: 3,
      fontSize: 23,
      fontWeight: "900",
      color: "#fff",
    },

    lessonSubtitle: {
      marginTop: 4,
      fontSize: 13,
      fontWeight: "700",
      color: "rgba(255,255,255,0.82)",
    },

    playButton: {
      width: 58,
      height: 58,
      borderRadius: 22,
      backgroundColor: "rgba(255,255,255,0.22)",
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 12,
    },

    navCard: {
      marginTop: 16,
      borderRadius: 28,
      padding: 10,
    },

    courseSection: {
      margin: 18,
      padding: 16,
      borderRadius: 30,
      backgroundColor: colors.cardSecondary,
    },

    sectionHeader: {
      marginBottom: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    sectionTitle: {
      fontSize: 21,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    sectionAction: {
      fontSize: 13,
      fontWeight: "900",
      color: colors.tabIconActive,
    },
  });
