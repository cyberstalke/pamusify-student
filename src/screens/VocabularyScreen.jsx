import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  useColorScheme,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation, useRoute } from "@react-navigation/native";
import Animated, {
  FadeInDown,
  FadeIn,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from "react-native-reanimated";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { getColors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import { contentApi } from "../api/content";

export default function VocabularyScreen() {
  const scheme = useColorScheme();
  const colors = getColors(scheme);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isDark = scheme === "dark";
  const navigation = useNavigation();
  const route = useRoute();

  const [words, setWords] = useState([]);
  const [loadingWords, setLoadingWords] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState([]);
  const [unknown, setUnknown] = useState([]);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const lessonId = route.params?.lessonId;
    if (!lessonId) {
      setLoadingWords(false);
      setLoadError("No lesson selected.");
      return;
    }
    contentApi.vocabulary(lessonId)
      .then((res) => {
        const data = res?.data || res;
        setWords(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Vocabulary API error:", err);
        setLoadError("Failed to load vocabulary.");
      })
      .finally(() => setLoadingWords(false));
  }, []);

  // scaleX squeeze-flip: collapses to 0, swaps content, expands back
  const scaleX = useSharedValue(1);
  const cardAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scaleX: scaleX.value }],
  }));

  const flipCard = useCallback(() => {
    scaleX.value = withTiming(0, { duration: 150 }, (finished) => {
      "worklet";
      if (finished) {
        runOnJS(setFlipped)((f) => !f);
        scaleX.value = withTiming(1, { duration: 150 });
      }
    });
  }, []);

  const advance = useCallback(() => {
    // Reset to front face instantly, then advance
    scaleX.value = withTiming(0, { duration: 100 }, (finished) => {
      "worklet";
      if (finished) {
        runOnJS(setFlipped)(false);
        scaleX.value = withTiming(1, { duration: 0 });
      }
    });
    if (current + 1 >= words.length) {
      setDone(true);
    } else {
      setCurrent((c) => c + 1);
    }
  }, [current, words.length]);

  const handleKnow = useCallback(() => {
    setKnown((k) => [...k, words[current].id]);
    advance();
  }, [current, advance, words]);

  const handleUnknown = useCallback(() => {
    setUnknown((u) => [...u, words[current].id]);
    advance();
  }, [current, advance, words]);

  const handleRestart = () => {
    setCurrent(0);
    setFlipped(false);
    setKnown([]);
    setUnknown([]);
    setDone(false);
    scaleX.value = 1;
  };

  const progress = words.length > 0 ? (current / words.length) * 100 : 0;
  const word = words[current];

  if (loadingWords) {
    return (
      <SafeAreaView style={[styles.safe, { paddingTop: Platform.OS === "android" ? 40 : 0, justifyContent: "center", alignItems: "center" }]}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <ActivityIndicator size="large" color="#00c7be" />
      </SafeAreaView>
    );
  }

  if (loadError || words.length === 0) {
    return (
      <SafeAreaView style={[styles.safe, { paddingTop: Platform.OS === "android" ? 40 : 0, justifyContent: "center", alignItems: "center" }]}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <Text style={{ fontSize: 16, color: colors.textSecondary, textAlign: "center", paddingHorizontal: 24 }}>
          {loadError || "No vocabulary words available for this lesson."}
        </Text>
        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => navigation.goBack()} activeOpacity={0.85}>
          <Text style={{ fontSize: 15, color: "#00c7be", fontFamily: fonts.semiBold }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (done) {
    const reviewWords = words.filter((w) => unknown.includes(w.id));

    return (
      <SafeAreaView style={[styles.safe, { paddingTop: Platform.OS === "android" ? 40 : 0 }]}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <ScrollView contentContainerStyle={styles.resultsContainer} showsVerticalScrollIndicator={false}>
          <Animated.View entering={ZoomIn.springify().damping(14)} style={styles.resultsBadge}>
            <MaterialCommunityIcons
              name={known.length >= words.length * 0.7 ? "star-circle" : "book-open-variant"}
              size={44}
              color="#fff"
            />
          </Animated.View>
          <Animated.Text entering={FadeInDown.delay(150)} style={styles.resultsTitle}>
            {known.length >= words.length * 0.7 ? "Great job!" : "Keep learning!"}
          </Animated.Text>
          <View style={styles.statRow}>
            <Animated.View entering={FadeInDown.delay(220)} style={[styles.statCard, { borderColor: "#16a34a" }]}>
              <Ionicons name="checkmark-circle" size={28} color="#16a34a" />
              <Text style={[styles.statNum, { color: "#16a34a" }]}>{known.length}</Text>
              <Text style={styles.statLabel}>Known</Text>
            </Animated.View>
            <Animated.View entering={FadeInDown.delay(280)} style={[styles.statCard, { borderColor: "#dc2626" }]}>
              <Ionicons name="close-circle" size={28} color="#dc2626" />
              <Text style={[styles.statNum, { color: "#dc2626" }]}>{unknown.length}</Text>
              <Text style={styles.statLabel}>Review</Text>
            </Animated.View>

          </View>

          {reviewWords.length > 0 && (
            <Animated.View entering={FadeInDown.delay(340)} style={styles.reviewBox}>
              <Text style={styles.reviewTitle}>Words to review</Text>
              {reviewWords.map((w) => (
                <View key={w.id} style={styles.reviewRow}>
                  <Text style={styles.reviewWord}>{w.word}</Text>
                  <Text style={styles.reviewDef}>{w.definition}</Text>
                </View>
              ))}
            </Animated.View>
          )}

          <Animated.View entering={FadeInDown.delay(420)} style={styles.resultsBtns}>
            <TouchableOpacity style={styles.restartBtn} onPress={handleRestart} activeOpacity={0.85}>
              <Ionicons name="refresh" size={20} color="#fff" />
              <Text style={styles.restartBtnText}>Again</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.restartBtn, styles.backBtn]}
              onPress={() => navigation.goBack()}
              activeOpacity={0.85}
            >
              <Text style={[styles.restartBtnText, { color: colors.textPrimary }]}>Back</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: Platform.OS === "android" ? 40 : 0 }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerLabel}>Vocabulary</Text>
          <Text style={styles.headerSub}>{current + 1} / {words.length} words</Text>
        </View>
        <View style={styles.knownPill}>
          <Ionicons name="checkmark-circle" size={15} color="#16a34a" />
          <Text style={styles.knownText}>{known.length}</Text>
        </View>
      </Animated.View>

      {/* Progress */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <View style={styles.body}>
        <Animated.Text entering={FadeIn.delay(200)} style={styles.flipHint}>
          Tap card to {flipped ? "see word" : "see definition"}
        </Animated.Text>

        {/* Card — single view, content swaps on flip */}
        <TouchableOpacity activeOpacity={0.95} onPress={flipCard} style={styles.cardContainer}>
          <Animated.View style={[styles.card, cardAnimStyle]}>
            {!flipped ? (
              // Front face
              <>
                <View style={styles.posBadge}>
                  <Text style={styles.posText}>{word.part_of_speech || word.pos}</Text>
                </View>
                <Text style={styles.wordText}>{word.word}</Text>
                <Text style={styles.phoneticText}>{word.phonetic}</Text>
                <View style={styles.tapHintRow}>
                  <Ionicons name="sync-outline" size={16} color={colors.textSecondary} />
                  <Text style={styles.tapHintText}>Tap to flip</Text>
                </View>
              </>
            ) : (
              // Back face
              <>
                <Text style={styles.defTitle}>Definition</Text>
                <Text style={styles.defText}>{word.definition}</Text>
                <View style={styles.divider} />
                <Text style={styles.exampleLabel}>Example</Text>
                <Text style={styles.exampleText}>"{word.example}"</Text>
              </>
            )}
          </Animated.View>
        </TouchableOpacity>

        {/* Action buttons */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.unknownBtn]}
            onPress={handleUnknown}
            activeOpacity={0.85}
          >
            <Ionicons name="close" size={26} color="#dc2626" />
            <Text style={[styles.actionBtnText, { color: "#dc2626" }]}>Not yet</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, styles.knownBtn]}
            onPress={handleKnow}
            activeOpacity={0.85}
          >
            <Ionicons name="checkmark" size={26} color="#16a34a" />
            <Text style={[styles.actionBtnText, { color: "#16a34a" }]}>Know it</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: "row", alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 18, paddingVertical: 14,
    },
    backButton: {
      width: 44, height: 44, borderRadius: 14,
      backgroundColor: colors.cardSecondary,
      alignItems: "center", justifyContent: "center",
    },
    headerCenter: { flex: 1, alignItems: "center" },
    headerLabel: { fontSize: 16, fontFamily: fonts.semiBold, color: colors.textPrimary },
    headerSub: { fontSize: 12, fontFamily: fonts.regular, color: colors.textSecondary, marginTop: 2 },
    knownPill: {
      flexDirection: "row", alignItems: "center", gap: 4,
      paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12,
      backgroundColor: colors.cardSecondary,
    },
    knownText: { fontSize: 14, fontFamily: fonts.semiBold, color: colors.textPrimary },
    progressTrack: {
      height: 5, backgroundColor: colors.progressLine,
      marginHorizontal: 18, borderRadius: 99, marginBottom: 16,
    },
    progressFill: { height: 5, borderRadius: 99, backgroundColor: "#00c7be" },
    body: { flex: 1, paddingHorizontal: 18, alignItems: "center" },
    flipHint: {
      fontSize: 13, fontFamily: fonts.regular,
      color: colors.textSecondary, marginBottom: 14,
    },
    cardContainer: { width: "100%", height: 280 },
    card: {
      width: "100%", height: 280,
      borderRadius: 28, padding: 26,
      backgroundColor: colors.cardSecondary,
      alignItems: "center", justifyContent: "center",
      shadowColor: "#000", shadowOpacity: 0.1,
      shadowRadius: 20, shadowOffset: { width: 0, height: 8 },
      elevation: 6,
    },
    posBadge: {
      paddingHorizontal: 12, paddingVertical: 5,
      borderRadius: 99, backgroundColor: "#00c7be22",
      marginBottom: 16,
    },
    posText: { fontSize: 12, fontFamily: fonts.semiBold, color: "#00c7be" },
    wordText: {
      fontSize: 36, fontFamily: fonts.semiBold,
      color: colors.textPrimary, textAlign: "center", marginBottom: 8,
    },
    phoneticText: {
      fontSize: 16, fontFamily: fonts.regular,
      color: colors.textSecondary, marginBottom: 20,
    },
    tapHintRow: { flexDirection: "row", alignItems: "center", gap: 6 },
    tapHintText: { fontSize: 12, fontFamily: fonts.regular, color: colors.textSecondary },
    defTitle: {
      fontSize: 12, fontFamily: fonts.semiBold,
      color: "#00c7be", marginBottom: 10, alignSelf: "flex-start",
    },
    defText: {
      fontSize: 16, fontFamily: fonts.semiBold,
      color: colors.textPrimary, textAlign: "center", lineHeight: 24, marginBottom: 16,
    },
    divider: { width: "100%", height: 1, backgroundColor: colors.progressLine, marginBottom: 14 },
    exampleLabel: {
      fontSize: 12, fontFamily: fonts.semiBold,
      color: colors.textSecondary, marginBottom: 8, alignSelf: "flex-start",
    },
    exampleText: {
      fontSize: 13, fontFamily: fonts.regular,
      color: colors.textSecondary, textAlign: "center", lineHeight: 20, fontStyle: "italic",
    },
    actionRow: {
      flexDirection: "row", gap: 16,
      marginTop: 28, width: "100%",
    },
    actionBtn: {
      flex: 1, height: 64, borderRadius: 20,
      alignItems: "center", justifyContent: "center",
      gap: 4, borderWidth: 2,
    },
    unknownBtn: { backgroundColor: "#dc262610", borderColor: "#dc262620" },
    knownBtn: { backgroundColor: "#16a34a10", borderColor: "#16a34a20" },
    actionBtnText: { fontSize: 13, fontFamily: fonts.semiBold },
    // Results
    resultsContainer: {
      paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40, alignItems: "center",
    },
    resultsBadge: {
      width: 90, height: 90, borderRadius: 28,
      backgroundColor: "#00c7be",
      alignItems: "center", justifyContent: "center",
      marginBottom: 24,
      shadowColor: "#00c7be", shadowOpacity: 0.4, shadowRadius: 16, shadowOffset: { width: 0, height: 8 },
      elevation: 10,
    },
    resultsTitle: {
      fontSize: 28, fontFamily: fonts.semiBold,
      color: colors.textPrimary, marginBottom: 20,
    },
    statRow: { flexDirection: "row", gap: 16, marginBottom: 24, width: "100%" },
    statCard: {
      flex: 1, borderRadius: 20, padding: 20,
      backgroundColor: colors.cardSecondary,
      alignItems: "center", borderWidth: 1.5,
    },
    statNum: { fontSize: 28, fontFamily: fonts.semiBold, marginTop: 8 },
    statLabel: { fontSize: 13, fontFamily: fonts.regular, color: colors.textSecondary, marginTop: 4 },
    reviewBox: {
      width: "100%", borderRadius: 20,
      backgroundColor: colors.cardSecondary,
      padding: 18, marginBottom: 24,
    },
    reviewTitle: { fontSize: 15, fontFamily: fonts.semiBold, color: colors.textPrimary, marginBottom: 12 },
    reviewRow: {
      marginBottom: 12, paddingBottom: 12,
      borderBottomWidth: 1, borderBottomColor: colors.progressLine,
    },
    reviewWord: { fontSize: 15, fontFamily: fonts.semiBold, color: colors.textPrimary, marginBottom: 2 },
    reviewDef: { fontSize: 13, fontFamily: fonts.regular, color: colors.textSecondary },
    resultsBtns: { flexDirection: "row", gap: 12, width: "100%" },
    restartBtn: {
      flex: 1, height: 52, borderRadius: 16,
      backgroundColor: "#00c7be",
      flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    },
    backBtn: { backgroundColor: colors.cardSecondary },
    restartBtnText: { fontSize: 16, fontFamily: fonts.semiBold, color: "#fff" },
  });
