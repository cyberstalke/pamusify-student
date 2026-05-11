import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  SafeAreaView,
  TouchableOpacity,
  Pressable,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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

const AnimatedFlatList = Animated.FlatList;

const students = [
  { id: "1", rank: 1, name: "Ali", classesCount: 24, score: 1200 },
  { id: "2", rank: 2, name: "Dilnoza", classesCount: 20, score: 980 },
  {
    id: "3",
    rank: 3,
    name: "John",
    classesCount: 18,
    score: 870,
    isCurrentUser: true,
  },
  { id: "4", rank: 4, name: "Sara", classesCount: 15, score: 750 },
];

const extraSections = [
  {
    title: "Homework",
    icon: "book-open-page-variant",
    items: [
      { title: "Grammar Practice", subtitle: "12 exercises", icon: "pencil" },
      {
        title: "Vocabulary Exercises",
        subtitle: "24 new words",
        icon: "cards-outline",
      },
    ],
  },
  {
    title: "Extra Materials",
    icon: "star-four-points",
    items: [
      {
        title: "Reading Article",
        subtitle: "5 min read",
        icon: "file-document-outline",
      },
      {
        title: "Listening Audio",
        subtitle: "Practice pronunciation",
        icon: "headphones",
      },
    ],
  },
];

export default function MyCourse() {
  const scheme = useColorScheme();
  const colors = getColors(scheme);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isDark = scheme === "dark";
  const navigation = useNavigation();

  const currentUser = students.find((student) => student.isCurrentUser);

  const renderItem = ({ item, index }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 80)
        .duration(420)
        .springify()
        .damping(16)}
      layout={Layout.springify().damping(18)}
    >
      <StudentCard item={item} index={index} styles={styles} colors={colors} />
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(350)} style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={23}
              color={colors.textPrimary}
            />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerLabel}>Current course</Text>
            <Text style={styles.pageTitle}>My Class</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.notificationButton}
          >
            <MaterialCommunityIcons
              name="bell-outline"
              size={22}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
        </Animated.View>

        <AnimatedFlatList
          data={students}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
          ListHeaderComponent={
            <Animated.View
              entering={FadeInDown.duration(450).springify().damping(16)}
            >
              <View style={styles.heroCard}>
                <View style={styles.heroTop}>
                  <View>
                    <Text style={styles.heroTitle}>Super Start: A2</Text>
                    <Text style={styles.heroSubtitle}>
                      Sizning sinf reytingingiz va dars materiallaringiz
                    </Text>
                  </View>

                  <View style={styles.heroIcon}>
                    <MaterialCommunityIcons
                      name="school"
                      size={30}
                      color="#fff"
                    />
                  </View>
                </View>

                <View style={styles.statsRow}>
                  <StatBox
                    title="Rank"
                    value={`#${currentUser?.rank || "-"}`}
                    icon="trophy-outline"
                    styles={styles}
                    colors={colors}
                  />
                  <StatBox
                    title="Lessons"
                    value={String(currentUser?.classesCount || 0)}
                    icon="book-check-outline"
                    styles={styles}
                    colors={colors}
                  />
                  <StatBox
                    title="Score"
                    value={String(currentUser?.score || 0)}
                    icon="diamond-stone"
                    styles={styles}
                    colors={colors}
                  />
                </View>
              </View>

              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Class Ranking</Text>
                <Text style={styles.sectionHint}>Top students</Text>
              </View>
            </Animated.View>
          }
          ListFooterComponent={
            <View style={styles.footerSections}>
              {extraSections.map((section, sectionIndex) => (
                <Animated.View
                  key={section.title}
                  entering={FadeInDown.delay(350 + sectionIndex * 120)
                    .duration(420)
                    .springify()
                    .damping(16)}
                >
                  <ExtraSection
                    section={section}
                    styles={styles}
                    colors={colors}
                  />
                </Animated.View>
              ))}
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

function StudentCard({ item, index, styles, colors }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const medalColor =
    item.rank === 1
      ? "#F59E0B"
      : item.rank === 2
        ? "#94A3B8"
        : item.rank === 3
          ? "#C084FC"
          : colors.textSecondary;

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPressIn={() => {
          scale.value = withTiming(0.97, { duration: 90 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        style={[
          styles.studentCard,
          item.isCurrentUser && styles.currentUserCard,
        ]}
      >
        <View style={styles.studentLeft}>
          <View
            style={[
              styles.rankBadge,
              item.rank <= 3 && { backgroundColor: medalColor },
            ]}
          >
            <Text
              style={[styles.rankText, item.rank <= 3 && styles.rankTextLight]}
            >
              #{item.rank}
            </Text>
          </View>

          <View style={styles.avatar}>
            <MaterialCommunityIcons
              name="account-circle"
              size={48}
              color={colors.textSecondary}
            />
          </View>

          <View style={styles.studentInfo}>
            <View style={styles.nameRow}>
              <Text numberOfLines={1} style={styles.nameText}>
                {item.name}
              </Text>

              {item.isCurrentUser && (
                <View style={styles.youBadge}>
                  <Text style={styles.youBadgeText}>You</Text>
                </View>
              )}
            </View>

            <Text style={styles.subText}>
              {item.classesCount} lessons completed
            </Text>
          </View>
        </View>

        <View style={styles.scoreBox}>
          <MaterialCommunityIcons
            name="diamond-stone"
            size={18}
            color={colors.tabIconActive}
          />
          <Text style={styles.scoreText}>{item.score}</Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

function StatBox({ title, value, icon, styles, colors }) {
  return (
    <View style={styles.statBox}>
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color={colors.tabIconActive}
      />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
    </View>
  );
}

function ExtraSection({ section, styles, colors }) {
  return (
    <View style={styles.extraSection}>
      <View style={styles.extraSectionHeader}>
        <View style={styles.extraTitleRow}>
          <MaterialCommunityIcons
            name={section.icon}
            size={21}
            color={colors.tabIconActive}
          />
          <Text style={styles.sectionTitle}>{section.title}</Text>
        </View>

        <Text style={styles.sectionHint}>View all</Text>
      </View>

      {section.items.map((item, index) => (
        <ExtraItem
          key={item.title}
          item={item}
          index={index}
          styles={styles}
          colors={colors}
        />
      ))}
    </View>
  );
}

function ExtraItem({ item, index, styles, colors }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 70)
        .duration(380)
        .springify()}
      style={animatedStyle}
    >
      <Pressable
        onPress={() => console.log(`${item.title} pressed`)}
        onPressIn={() => {
          scale.value = withTiming(0.97, { duration: 90 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        style={styles.extraItemContainer}
      >
        <View style={styles.extraItemContent}>
          <View style={styles.extraIcon}>
            <MaterialCommunityIcons
              name={item.icon}
              size={22}
              color={colors.tabIconActive}
            />
          </View>

          <View>
            <Text style={styles.extraItemText}>{item.title}</Text>
            <Text style={styles.extraItemSubtitle}>{item.subtitle}</Text>
          </View>
        </View>

        <MaterialCommunityIcons
          name="chevron-right"
          size={24}
          color={colors.textSecondary}
        />
      </Pressable>
    </Animated.View>
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

    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 18,
      paddingTop: 14,
      paddingBottom: 14,
    },

    backButton: {
      width: 46,
      height: 46,
      borderRadius: 16,
      backgroundColor: colors.cardSecondary,
      alignItems: "center",
      justifyContent: "center",
    },

    notificationButton: {
      width: 46,
      height: 46,
      borderRadius: 16,
      backgroundColor: colors.cardSecondary,
      alignItems: "center",
      justifyContent: "center",
    },

    headerCenter: {
      flex: 1,
      alignItems: "center",
      marginHorizontal: 12,
    },

    headerLabel: {
      fontSize: 12,
      fontWeight: "800",
      color: colors.textSecondary,
    },

    pageTitle: {
      marginTop: 2,
      fontSize: 23,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    flatListContent: {
      paddingHorizontal: 18,
      paddingBottom: 32,
    },

    heroCard: {
      marginTop: 4,
      marginBottom: 22,
      borderRadius: 32,
      padding: 18,
      backgroundColor: colors.cardSecondary,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
      ...Platform.select({
        android: {
          elevation: 5,
        },
      }),
    },

    heroTop: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 12,
      marginBottom: 18,
    },

    heroTitle: {
      fontSize: 24,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    heroSubtitle: {
      marginTop: 6,
      maxWidth: 230,
      fontSize: 13,
      lineHeight: 18,
      fontWeight: "700",
      color: colors.textSecondary,
    },

    heroIcon: {
      width: 58,
      height: 58,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.tabIconActive,
    },

    statsRow: {
      flexDirection: "row",
      gap: 10,
    },

    statBox: {
      flex: 1,
      minHeight: 86,
      borderRadius: 22,
      padding: 12,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
    },

    statValue: {
      marginTop: 6,
      fontSize: 18,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    statTitle: {
      marginTop: 2,
      fontSize: 11,
      fontWeight: "800",
      color: colors.textSecondary,
    },

    sectionHeader: {
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    sectionHint: {
      fontSize: 12,
      fontWeight: "800",
      color: colors.tabIconActive,
    },

    studentCard: {
      minHeight: 78,
      borderRadius: 26,
      padding: 13,
      marginBottom: 12,
      backgroundColor: colors.cardSecondary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: "transparent",
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      ...Platform.select({
        android: {
          elevation: 3,
        },
      }),
    },

    currentUserCard: {
      borderColor: colors.tabIconActive,
      shadowColor: colors.tabIconActive,
      shadowOpacity: 0.22,
    },

    studentLeft: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      minWidth: 0,
    },

    rankBadge: {
      width: 42,
      height: 42,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background,
    },

    rankText: {
      fontSize: 13,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    rankTextLight: {
      color: "#fff",
    },

    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      marginLeft: 11,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background,
    },

    studentInfo: {
      flex: 1,
      minWidth: 0,
      marginLeft: 11,
    },

    nameRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },

    nameText: {
      maxWidth: 110,
      fontSize: 16,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    youBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 999,
      backgroundColor: colors.tabIconActive,
    },

    youBadgeText: {
      fontSize: 10,
      fontWeight: "900",
      color: "#fff",
    },

    subText: {
      marginTop: 3,
      fontSize: 12,
      fontWeight: "700",
      color: colors.textSecondary,
    },

    scoreBox: {
      paddingVertical: 8,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: colors.background,
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      marginLeft: 8,
    },

    scoreText: {
      fontSize: 14,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    footerSections: {
      marginTop: 12,
    },

    extraSection: {
      marginTop: 20,
    },

    extraSectionHeader: {
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    extraTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },

    extraItemContainer: {
      minHeight: 72,
      borderRadius: 24,
      padding: 13,
      marginBottom: 11,
      backgroundColor: colors.cardSecondary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    extraItemContent: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
      minWidth: 0,
    },

    extraIcon: {
      width: 46,
      height: 46,
      borderRadius: 17,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background,
      marginRight: 12,
    },

    extraItemText: {
      fontSize: 15,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    extraItemSubtitle: {
      marginTop: 3,
      fontSize: 12,
      fontWeight: "700",
      color: colors.textSecondary,
    },
  });
