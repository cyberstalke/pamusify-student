import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
  useColorScheme,
  SafeAreaView,
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  FadeIn,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { useTime } from "../context/TimeProvider";
import { getColors } from "../utils/colors";

const achievements = [
  { id: 1, days: 7, title: "Starter", icon: "fire" },
  { id: 2, days: 30, title: "Focused", icon: "lightning-bolt" },
  { id: 3, days: 90, title: "Strong", icon: "shield-star" },
  { id: 4, days: 365, title: "Legend", icon: "crown" },
];

const courses = [
  {
    id: 1,
    title: "Super Start: A2",
    subtitle: "English basics",
    progress: 42,
  },
];

export default function ProfileScreen() {
  const { totalTimeSpent } = useTime();

  const scheme = useColorScheme();
  const colors = getColors(scheme);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isDark = scheme === "dark";

  const totalSeconds = Math.floor(totalTimeSpent / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <View style={styles.container}>
        <Animated.ScrollView
          entering={FadeIn.duration(250)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View
            entering={FadeInDown.duration(420).springify().damping(17)}
            style={styles.heroCard}
          >
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>AA</Text>
              </View>

              <TouchableOpacity activeOpacity={0.85} style={styles.editButton}>
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={17}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Emma Hayes</Text>
              <Text style={styles.profileSub}>Joined August 2025</Text>

              <View style={styles.levelPill}>
                <MaterialCommunityIcons
                  name="school"
                  size={15}
                  color={colors.tabIconActive}
                />
                <Text style={styles.levelText}>Super Start: A2</Text>
              </View>
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeInDown.delay(80)
              .duration(420)
              .springify()
              .damping(17)}
            style={styles.statsGrid}
          >
            <StatCard
              title="Time"
              value={`${hours}h ${minutes}m`}
              icon="timer-sand"
              styles={styles}
              colors={colors}
            />
            <StatCard
              title="Streak"
              value="7 days"
              icon="fire"
              styles={styles}
              colors={colors}
            />
            <StatCard
              title="XP"
              value="1,240"
              icon="diamond-stone"
              styles={styles}
              colors={colors}
            />
          </Animated.View>

          <SectionHeader
            title="Achievements"
            action="See all"
            styles={styles}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.achievementList}
          >
            {achievements.map((item, index) => (
              <Animated.View
                key={item.id}
                entering={FadeInDown.delay(140 + index * 70)
                  .duration(380)
                  .springify()
                  .damping(16)}
              >
                <AchievementCard item={item} styles={styles} colors={colors} />
              </Animated.View>
            ))}
          </ScrollView>

          <SectionHeader title="Activity" action="Weekly" styles={styles} />

          <Animated.View
            entering={FadeInDown.delay(220)
              .duration(420)
              .springify()
              .damping(17)}
            style={styles.activityCard}
          >
            <View style={styles.activityIcon}>
              <MaterialCommunityIcons
                name="chart-line"
                size={28}
                color={colors.tabIconActive}
              />
            </View>

            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Learning time</Text>
              <Text style={styles.activityValue}>
                {hours}h : {minutes}m
              </Text>
              <View style={styles.activityProgressTrack}>
                <View style={styles.activityProgressFill} />
              </View>
            </View>

            <TouchableOpacity activeOpacity={0.85} style={styles.dropdown}>
              <Text style={styles.dropdownText}>Weekly</Text>
              <MaterialCommunityIcons
                name="chevron-down"
                size={18}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
          </Animated.View>

          <SectionHeader title="My Courses" styles={styles} />

          {courses.map((course, index) => (
            <Animated.View
              key={course.id}
              entering={FadeInDown.delay(280 + index * 80)
                .duration(420)
                .springify()
                .damping(17)}
              layout={Layout.springify()}
            >
              <CourseCard course={course} styles={styles} colors={colors} />
            </Animated.View>
          ))}
        </Animated.ScrollView>
      </View>
    </SafeAreaView>
  );
}

function StatCard({ title, value, icon, styles, colors }) {
  return (
    <View style={styles.statCard}>
      <MaterialCommunityIcons
        name={icon}
        size={23}
        color={colors.tabIconActive}
      />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );
}

function SectionHeader({ title, action, styles }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {action ? (
        <TouchableOpacity activeOpacity={0.85}>
          <Text style={styles.sectionAction}>{action}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

function AchievementCard({ item, styles, colors }) {
  return (
    <View style={styles.achievementCard}>
      <View style={styles.achievementIcon}>
        <MaterialCommunityIcons
          name={item.icon}
          size={26}
          color={colors.tabIconActive}
        />
      </View>

      <Text style={styles.achievementDays}>{item.days}</Text>
      <Text style={styles.achievementText}>day streak</Text>
      <Text style={styles.achievementTitle}>{item.title}</Text>
    </View>
  );
}

function CourseCard({ course, styles, colors }) {
  return (
    <Pressable style={styles.courseCard}>
      <View style={styles.courseIcon}>
        <MaterialCommunityIcons
          name="book-open-page-variant"
          size={28}
          color="#fff"
        />
      </View>

      <View style={styles.courseContent}>
        <Text style={styles.courseTitle}>{course.title}</Text>
        <Text style={styles.courseSubtitle}>{course.subtitle}</Text>

        <View style={styles.courseProgressTrack}>
          <View
            style={[
              styles.courseProgressFill,
              { width: `${course.progress}%` },
            ]}
          />
        </View>
      </View>

      <MaterialCommunityIcons
        name="chevron-right"
        size={24}
        color={colors.textSecondary}
      />
    </Pressable>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },

    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    scrollContent: {
      paddingHorizontal: 18,
      paddingTop: 16,
      paddingBottom: 118,
    },

    heroCard: {
      borderRadius: 34,
      padding: 18,
      backgroundColor: colors.cardSecondary,
      flexDirection: "row",
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
      ...Platform.select({
        android: { elevation: 5 },
      }),
    },

    avatarWrap: {
      position: "relative",
    },

    avatar: {
      width: 82,
      height: 82,
      borderRadius: 30,
      backgroundColor: colors.tabIconActive,
      alignItems: "center",
      justifyContent: "center",
    },

    avatarText: {
      fontSize: 28,
      fontWeight: "900",
      color: "#fff",
    },

    editButton: {
      position: "absolute",
      right: -4,
      bottom: -4,
      width: 32,
      height: 32,
      borderRadius: 13,
      backgroundColor: colors.textPrimary,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 3,
      borderColor: colors.cardSecondary,
    },

    profileInfo: {
      flex: 1,
      marginLeft: 16,
    },

    profileName: {
      fontSize: 24,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    profileSub: {
      marginTop: 4,
      fontSize: 13,
      fontWeight: "700",
      color: colors.textSecondary,
    },

    levelPill: {
      alignSelf: "flex-start",
      marginTop: 12,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 999,
      backgroundColor: colors.background,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },

    levelText: {
      fontSize: 12,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    statsGrid: {
      flexDirection: "row",
      gap: 10,
      marginTop: 16,
    },

    statCard: {
      flex: 1,
      minHeight: 96,
      borderRadius: 26,
      backgroundColor: colors.cardSecondary,
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
    },

    statValue: {
      marginTop: 8,
      fontSize: 16,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    statTitle: {
      marginTop: 3,
      fontSize: 11,
      fontWeight: "800",
      color: colors.textSecondary,
    },

    sectionHeader: {
      marginTop: 24,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    sectionTitle: {
      fontSize: 20,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    sectionAction: {
      fontSize: 13,
      fontWeight: "900",
      color: colors.tabIconActive,
    },

    achievementList: {
      gap: 10,
      paddingRight: 18,
    },

    achievementCard: {
      width: 118,
      minHeight: 142,
      borderRadius: 28,
      backgroundColor: colors.cardSecondary,
      alignItems: "center",
      justifyContent: "center",
      padding: 12,
    },

    achievementIcon: {
      width: 46,
      height: 46,
      borderRadius: 17,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background,
      marginBottom: 10,
    },

    achievementDays: {
      fontSize: 26,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    achievementText: {
      fontSize: 11,
      fontWeight: "800",
      color: colors.textSecondary,
    },

    achievementTitle: {
      marginTop: 6,
      fontSize: 12,
      fontWeight: "900",
      color: colors.tabIconActive,
    },

    activityCard: {
      borderRadius: 30,
      padding: 16,
      backgroundColor: colors.cardSecondary,
      flexDirection: "row",
      alignItems: "center",
    },

    activityIcon: {
      width: 58,
      height: 58,
      borderRadius: 22,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },

    activityContent: {
      flex: 1,
    },

    activityTitle: {
      fontSize: 13,
      fontWeight: "800",
      color: colors.textSecondary,
    },

    activityValue: {
      marginTop: 3,
      fontSize: 20,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    activityProgressTrack: {
      marginTop: 10,
      height: 7,
      borderRadius: 999,
      backgroundColor: colors.background,
      overflow: "hidden",
    },

    activityProgressFill: {
      width: "65%",
      height: "100%",
      borderRadius: 999,
      backgroundColor: colors.tabIconActive,
    },

    dropdown: {
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: colors.background,
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
      marginLeft: 8,
    },

    dropdownText: {
      fontSize: 12,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    courseCard: {
      minHeight: 86,
      borderRadius: 28,
      padding: 14,
      backgroundColor: colors.cardSecondary,
      flexDirection: "row",
      alignItems: "center",
    },

    courseIcon: {
      width: 58,
      height: 58,
      borderRadius: 22,
      backgroundColor: colors.tabIconActive,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 13,
    },

    courseContent: {
      flex: 1,
    },

    courseTitle: {
      fontSize: 17,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    courseSubtitle: {
      marginTop: 3,
      fontSize: 12,
      fontWeight: "700",
      color: colors.textSecondary,
    },

    courseProgressTrack: {
      marginTop: 10,
      height: 7,
      borderRadius: 999,
      overflow: "hidden",
      backgroundColor: colors.background,
    },

    courseProgressFill: {
      height: "100%",
      borderRadius: 999,
      backgroundColor: colors.tabIconActive,
    },

    footer: {
      position: "absolute",
      left: 14,
      right: 14,
      bottom: 14,
      paddingVertical: 10,
      paddingHorizontal: 8,
      borderRadius: 28,
      backgroundColor: colors.tabBarBackground,
      flexDirection: "row",
      justifyContent: "space-between",
      shadowColor: "#000",
      shadowOpacity: 0.14,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 10 },
      ...Platform.select({
        android: { elevation: 8 },
      }),
    },

    footerButton: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 7,
      borderRadius: 20,
    },

    footerButtonActive: {
      backgroundColor: colors.background,
    },

    footerText: {
      marginTop: 4,
      fontSize: 11,
      fontWeight: "800",
      color: colors.tabIconInactive,
    },

    footerTextActive: {
      color: colors.tabIconActive,
    },
  });
