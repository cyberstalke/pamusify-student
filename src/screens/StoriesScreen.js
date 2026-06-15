import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  useColorScheme,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Platform,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { getColors } from "../utils/colors";
import { contentApi } from "../api/content";

export default function StoriesScreen() {
  const scheme = useColorScheme();
  const colors = getColors(scheme);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [stories, setStories] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeStory, setActiveStory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contentApi
      .stories()
      .then((res) => {
        const list = res?.data || [];
        setStories(list);
        if (list.length > 0) {
          fetchStoryDetail(list[0].id);
        } else {
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Stories API error:", err);
        setLoading(false);
      });
  }, []);

  const fetchStoryDetail = (id) => {
    setLoading(true);
    contentApi
      .story(id)
      .then((res) => {
        setActiveStory(res?.data || res);
      })
      .catch((err) => {
        console.error("Story detail API error:", err);
      })
      .finally(() => setLoading(false));
  };

  const progress =
    stories.length > 0 ? ((activeIndex + 1) / stories.length) * 100 : 0;

  const goNext = () => {
    if (activeIndex < stories.length - 1) {
      const nextIndex = activeIndex + 1;
      setActiveIndex(nextIndex);
      fetchStoryDetail(stories[nextIndex].id);
    }
  };

  const goPrev = () => {
    if (activeIndex > 0) {
      const prevIndex = activeIndex - 1;
      setActiveIndex(prevIndex);
      fetchStoryDetail(stories[prevIndex].id);
    }
  };

  if (loading && !activeStory) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />

      <Animated.View entering={FadeIn.duration(350)} style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>Short Stories</Text>
          <Text style={styles.headerTitle}>Read & Learn</Text>
        </View>

        <View style={styles.levelBadge}>
          <MaterialCommunityIcons
            name="book-open-page-variant"
            size={18}
            color={colors.tabIconActive}
          />
          <Text style={styles.levelText}>{activeStory?.level || "A2"}</Text>
        </View>
      </Animated.View>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      {activeStory ? (
        <Animated.View
          key={activeStory.id}
          entering={FadeInDown.duration(420).springify().damping(17)}
          style={styles.storyCard}
        >
          <View style={styles.storyTop}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {activeStory.category || activeStory.title}
              </Text>
            </View>

            <View style={styles.timeBox}>
              <Ionicons
                name="time-outline"
                size={15}
                color={colors.textSecondary}
              />
              <Text style={styles.timeText}>{activeStory.time || "—"}</Text>
            </View>
          </View>

          <Text style={styles.storyTitle}>{activeStory.title}</Text>
          <Text style={styles.storyText}>{activeStory.text || ""}</Text>

          {activeStory.words && activeStory.words.length > 0 && (
            <View style={styles.wordsBox}>
              <Text style={styles.wordsTitle}>New words</Text>

              <View style={styles.wordsWrap}>
                {activeStory.words.map((word) => (
                  <View key={word} style={styles.wordPill}>
                    <Text style={styles.wordText}>{word}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </Animated.View>
      ) : (
        <View
          style={[
            styles.storyCard,
            { justifyContent: "center", alignItems: "center" },
          ]}
        >
          <ActivityIndicator size="large" />
        </View>
      )}

      <View style={styles.footer}>
        <ControlButton
          icon="chevron-back"
          disabled={activeIndex === 0}
          onPress={goPrev}
          styles={styles}
        />

        <View style={styles.counterBox}>
          <Text style={styles.counterText}>
            {stories.length > 0
              ? `${activeIndex + 1} / ${stories.length}`
              : "—"}
          </Text>
        </View>

        <ControlButton
          icon="chevron-forward"
          disabled={stories.length === 0 || activeIndex === stories.length - 1}
          onPress={goNext}
          styles={styles}
        />
      </View>
    </View>
  );
}

function ControlButton({ icon, disabled, onPress, styles }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        disabled={disabled}
        onPress={onPress}
        onPressIn={() => {
          scale.value = withTiming(0.92, { duration: 90 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        style={[styles.controlButton, disabled && styles.controlButtonDisabled]}
      >
        <Ionicons name={icon} size={26} color="#fff" />
      </Pressable>
    </Animated.View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 18,
      paddingTop: Platform.OS === "android" ? 42 : 18,
    },

    header: {
      paddingTop: 12,
      paddingBottom: 18,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    headerLabel: {
      fontSize: 13,
      fontWeight: "900",
      color: colors.tabIconActive,
    },

    headerTitle: {
      marginTop: 3,
      fontSize: 29,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    levelBadge: {
      height: 44,
      paddingHorizontal: 13,
      borderRadius: 16,
      backgroundColor: colors.cardSecondary,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },

    levelText: {
      fontSize: 15,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    progressTrack: {
      height: 10,
      borderRadius: 999,
      backgroundColor: colors.cardSecondary,
      overflow: "hidden",
      marginBottom: 18,
    },

    progressFill: {
      height: "100%",
      borderRadius: 999,
      backgroundColor: colors.tabIconActive,
    },

    storyCard: {
      flex: 1,
      borderRadius: 34,
      padding: 22,
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

    storyTop: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 18,
    },

    categoryBadge: {
      paddingVertical: 8,
      paddingHorizontal: 13,
      borderRadius: 999,
      backgroundColor: colors.background,
    },

    categoryText: {
      fontSize: 12,
      fontWeight: "900",
      color: colors.tabIconActive,
    },

    timeBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },

    timeText: {
      fontSize: 12,
      fontWeight: "800",
      color: colors.textSecondary,
    },

    storyTitle: {
      fontSize: 28,
      lineHeight: 35,
      fontWeight: "900",
      color: colors.textPrimary,
      marginBottom: 18,
    },

    storyText: {
      fontSize: 18,
      lineHeight: 31,
      fontWeight: "600",
      color: colors.textPrimary,
    },

    wordsBox: {
      marginTop: 24,
      padding: 15,
      borderRadius: 24,
      backgroundColor: colors.background,
    },

    wordsTitle: {
      fontSize: 14,
      fontWeight: "900",
      color: colors.textPrimary,
      marginBottom: 11,
    },

    wordsWrap: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },

    wordPill: {
      paddingVertical: 7,
      paddingHorizontal: 11,
      borderRadius: 999,
      backgroundColor: colors.cardSecondary,
    },

    wordText: {
      fontSize: 12,
      fontWeight: "800",
      color: colors.textSecondary,
    },

    footer: {
      paddingVertical: 18,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    controlButton: {
      width: 58,
      height: 58,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.tabIconActive,
    },

    controlButtonDisabled: {
      opacity: 0.35,
    },

    counterBox: {
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: 999,
      backgroundColor: colors.cardSecondary,
    },

    counterText: {
      fontSize: 15,
      fontWeight: "900",
      color: colors.textPrimary,
    },
  });
