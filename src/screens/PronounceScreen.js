import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  useColorScheme,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import Animated, {
  FadeInDown,
  FadeIn,
  SlideInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { getColors } from "../utils/colors";

export default function PronounceScreen({ navigation, route }) {
  const scheme = useColorScheme();
  const colors = getColors(scheme);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const quiz = route?.params?.quiz || {
    question: "Listen and pronounce",
    word: "Hello",
    image: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=500",
  };

  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const micScale = useSharedValue(1);
  const micPulse = useSharedValue(1);

  const speak = () => {
    Speech.stop();
    Speech.speak(quiz.word, {
      language: "en",
      rate: 0.85,
      pitch: 1,
    });
  };

  const startRecording = () => {
    if (isRecording) return;

    setFeedback(null);
    setIsRecording(true);

    micPulse.value = withRepeat(withTiming(1.18, { duration: 650 }), -1, true);

    setTimeout(() => {
      setIsRecording(false);
      micPulse.value = withTiming(1, { duration: 250 });
      setFeedback("Yaxshi bajarildi!");
    }, 2000);
  };

  const goNext = () => {
    navigation.navigate("NextScreen");
  };

  const micAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: micScale.value * micPulse.value }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View entering={FadeIn.duration(300)} style={styles.topBar}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.iconButton}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </Pressable>

        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>

        <Pressable onPress={speak} style={styles.iconButton}>
          <Ionicons
            name="volume-high-outline"
            size={23}
            color={colors.textPrimary}
          />
        </Pressable>
      </Animated.View>

      <View style={styles.content}>
        <Animated.View
          entering={FadeInDown.duration(420).springify().damping(17)}
          style={styles.questionCard}
        >
          <View style={styles.badge}>
            <MaterialCommunityIcons
              name="microphone-variant"
              size={16}
              color={colors.tabIconActive}
            />
            <Text style={styles.badgeText}>Pronunciation</Text>
          </View>

          <Text style={styles.questionText}>{quiz.question}</Text>

          <View style={styles.imageWrap}>
            <Image source={{ uri: quiz.image }} style={styles.image} />
          </View>

          <Pressable onPress={speak} style={styles.wordButton}>
            <Ionicons name="volume-high" size={22} color="#fff" />
            <Text style={styles.wordText}>{quiz.word}</Text>
          </Pressable>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(120).duration(420).springify().damping(17)}
          style={styles.recordBox}
        >
          <Text style={styles.recordTitle}>
            {isRecording ? "Listening..." : "Tap and pronounce"}
          </Text>

          <Text style={styles.recordSubtitle}>
            So‘zni eshiting va mikrofon orqali qaytaring.
          </Text>

          <Animated.View style={micAnimatedStyle}>
            <Pressable
              onPress={startRecording}
              onPressIn={() => {
                micScale.value = withTiming(0.94, { duration: 90 });
              }}
              onPressOut={() => {
                micScale.value = withSpring(1);
              }}
              style={[
                styles.microphoneButton,
                isRecording && styles.microphoneRecording,
              ]}
            >
              <Ionicons
                name={isRecording ? "radio" : "mic-outline"}
                size={54}
                color="#fff"
              />
            </Pressable>
          </Animated.View>

          <Pressable style={styles.skipButton} onPress={goNext}>
            <Text style={styles.skipButtonText}>O‘tkazib yuborish</Text>
          </Pressable>
        </Animated.View>
      </View>

      {feedback && (
        <Animated.View
          entering={SlideInDown.duration(350).springify().damping(18)}
          style={styles.feedbackFooter}
        >
          <View style={styles.feedbackIcon}>
            <Ionicons name="checkmark" size={24} color="#fff" />
          </View>

          <View style={styles.feedbackContent}>
            <Text style={styles.feedbackTitle}>{feedback}</Text>
            <Text style={styles.feedbackSubtitle}>
              Talaffuzingiz yaxshi eshitildi.
            </Text>
          </View>

          <Pressable style={styles.nextButton} onPress={goNext}>
            <Text style={styles.nextButtonText}>Keyingi</Text>
          </Pressable>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    topBar: {
      paddingHorizontal: 18,
      paddingTop: 8,
      paddingBottom: 14,
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },

    iconButton: {
      width: 44,
      height: 44,
      borderRadius: 16,
      backgroundColor: colors.cardSecondary,
      alignItems: "center",
      justifyContent: "center",
    },

    progressTrack: {
      flex: 1,
      height: 10,
      borderRadius: 999,
      overflow: "hidden",
      backgroundColor: colors.cardSecondary,
    },

    progressFill: {
      width: "45%",
      height: "100%",
      borderRadius: 999,
      backgroundColor: colors.tabIconActive,
    },

    content: {
      flex: 1,
      paddingHorizontal: 18,
    },

    questionCard: {
      borderRadius: 34,
      padding: 18,
      backgroundColor: colors.cardSecondary,
      alignItems: "center",
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

    badge: {
      alignSelf: "flex-start",
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 999,
      backgroundColor: colors.background,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      marginBottom: 14,
    },

    badgeText: {
      fontSize: 12,
      fontWeight: "900",
      color: colors.tabIconActive,
    },

    questionText: {
      fontSize: 24,
      lineHeight: 31,
      fontWeight: "900",
      color: colors.textPrimary,
      textAlign: "center",
      marginBottom: 18,
    },

    imageWrap: {
      width: 210,
      height: 210,
      borderRadius: 34,
      padding: 8,
      backgroundColor: colors.background,
      marginBottom: 18,
    },

    image: {
      width: "100%",
      height: "100%",
      borderRadius: 28,
    },

    wordButton: {
      minHeight: 54,
      paddingHorizontal: 18,
      borderRadius: 20,
      backgroundColor: colors.tabIconActive,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
    },

    wordText: {
      fontSize: 20,
      fontWeight: "900",
      color: "#fff",
    },

    recordBox: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingBottom: 30,
    },

    recordTitle: {
      fontSize: 24,
      fontWeight: "900",
      color: colors.textPrimary,
      marginBottom: 7,
    },

    recordSubtitle: {
      maxWidth: 270,
      fontSize: 14,
      lineHeight: 20,
      fontWeight: "700",
      color: colors.textSecondary,
      textAlign: "center",
      marginBottom: 28,
    },

    microphoneButton: {
      width: 116,
      height: 116,
      borderRadius: 42,
      backgroundColor: colors.tabIconActive,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.tabIconActive,
      shadowOpacity: 0.45,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      ...Platform.select({
        android: {
          elevation: 8,
        },
      }),
    },

    microphoneRecording: {
      backgroundColor: "#EF4444",
      shadowColor: "#EF4444",
    },

    skipButton: {
      marginTop: 28,
      paddingVertical: 10,
      paddingHorizontal: 16,
    },

    skipButtonText: {
      fontSize: 15,
      fontWeight: "900",
      color: colors.textSecondary,
      textDecorationLine: "underline",
    },

    feedbackFooter: {
      margin: 16,
      borderRadius: 30,
      padding: 16,
      backgroundColor: "#22C55E",
      flexDirection: "row",
      alignItems: "center",
      shadowColor: "#22C55E",
      shadowOpacity: 0.35,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      ...Platform.select({
        android: {
          elevation: 8,
        },
      }),
    },

    feedbackIcon: {
      width: 46,
      height: 46,
      borderRadius: 17,
      backgroundColor: "rgba(255,255,255,0.22)",
      alignItems: "center",
      justifyContent: "center",
      marginRight: 12,
    },

    feedbackContent: {
      flex: 1,
    },

    feedbackTitle: {
      fontSize: 17,
      fontWeight: "900",
      color: "#fff",
    },

    feedbackSubtitle: {
      marginTop: 2,
      fontSize: 12,
      fontWeight: "700",
      color: "rgba(255,255,255,0.86)",
    },

    nextButton: {
      paddingVertical: 11,
      paddingHorizontal: 14,
      borderRadius: 18,
      backgroundColor: "#fff",
    },

    nextButtonText: {
      fontSize: 14,
      fontWeight: "900",
      color: "#16A34A",
    },
  });
