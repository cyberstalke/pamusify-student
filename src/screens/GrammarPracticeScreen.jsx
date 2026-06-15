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
  withSpring,
  withTiming,
  withSequence,
} from "react-native-reanimated";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { getColors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import { quizApi } from "../api/quiz";

const STATE = { IDLE: "idle", CORRECT: "correct", WRONG: "wrong" };

export default function GrammarPracticeScreen() {
  const scheme = useColorScheme();
  const colors = getColors(scheme);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isDark = scheme === "dark";
  const navigation = useNavigation();
  const route = useRoute();

  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answerState, setAnswerState] = useState(STATE.IDLE);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState([]);

  useEffect(() => {
    const lessonId = route.params?.lessonId;
    if (!lessonId) {
      setLoadingQuestions(false);
      setLoadError("No lesson selected.");
      return;
    }
    quizApi.grammar(lessonId)
      .then((res) => {
        const data = res?.data || res;
        setQuestions(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Grammar API error:", err);
        setLoadError("Failed to load grammar questions.");
      })
      .finally(() => setLoadingQuestions(false));
  }, []);

  const cardScale = useSharedValue(1);
  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const question = questions[current];
  const progress = questions.length > 0 ? (current / questions.length) * 100 : 0;

  const handleSelect = useCallback(
    (option) => {
      if (answerState !== STATE.IDLE || !question) return;
      const correct = option === question.answer;
      setSelected(option);
      setAnswerState(correct ? STATE.CORRECT : STATE.WRONG);
      if (correct) {
        setScore((s) => s + 1);
        cardScale.value = withSequence(
          withSpring(1.03, { damping: 6 }),
          withSpring(1)
        );
      } else {
        setWrongAnswers((w) => [...w, { question: question.question || question.sentence, correct: question.answer, chosen: option }]);
        cardScale.value = withSequence(
          withTiming(0.97, { duration: 60 }),
          withTiming(1.01, { duration: 60 }),
          withTiming(1, { duration: 60 })
        );
      }

      setTimeout(() => {
        if (current + 1 >= questions.length) {
          setDone(true);
        } else {
          setCurrent((c) => c + 1);
          setSelected(null);
          setAnswerState(STATE.IDLE);
        }
      }, 1100);
    },
    [answerState, current, question, questions.length]
  );

  const handleRestart = () => {
    setCurrent(0);
    setSelected(null);
    setAnswerState(STATE.IDLE);
    setScore(0);
    setDone(false);
    setWrongAnswers([]);
  };

  if (loadingQuestions) {
    return (
      <SafeAreaView style={[styles.safe, { paddingTop: Platform.OS === "android" ? 40 : 0, justifyContent: "center", alignItems: "center" }]}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <ActivityIndicator size="large" color="#00c7be" />
      </SafeAreaView>
    );
  }

  if (loadError || questions.length === 0) {
    return (
      <SafeAreaView style={[styles.safe, { paddingTop: Platform.OS === "android" ? 40 : 0, justifyContent: "center", alignItems: "center" }]}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <Text style={{ fontSize: 16, color: colors.textSecondary, textAlign: "center", paddingHorizontal: 24 }}>
          {loadError || "No grammar questions available for this lesson."}
        </Text>
        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => navigation.goBack()} activeOpacity={0.85}>
          <Text style={{ fontSize: 15, color: "#00c7be", fontFamily: fonts.semiBold }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (done) {
    return (
      <SafeAreaView style={[styles.safe, { paddingTop: Platform.OS === "android" ? 40 : 0 }]}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <ScrollView contentContainerStyle={styles.resultsContainer} showsVerticalScrollIndicator={false}>
          <Animated.View entering={ZoomIn.springify().damping(14)} style={styles.resultsBadge}>
            <MaterialCommunityIcons
              name={score >= questions.length * 0.7 ? "trophy" : "emoticon-sad-outline"}
              size={44}
              color="#fff"
            />
          </Animated.View>
          <Animated.Text entering={FadeInDown.delay(150)} style={styles.resultsTitle}>
            {score >= questions.length * 0.7 ? "Well done!" : "Keep practising!"}
          </Animated.Text>
          <Animated.Text entering={FadeInDown.delay(220)} style={styles.resultsScore}>
            {score} / {questions.length} correct
          </Animated.Text>

          {wrongAnswers.length > 0 && (
            <Animated.View entering={FadeInDown.delay(300)} style={styles.reviewBox}>
              <Text style={styles.reviewTitle}>Review mistakes</Text>
              {wrongAnswers.map((w, i) => (
                <View key={i} style={styles.reviewItem}>
                  <Text style={styles.reviewQ}>{w.question.replace("___", `[${w.correct}]`)}</Text>
                  <Text style={styles.reviewWrong}>Your answer: {w.chosen}</Text>
                </View>
              ))}
            </Animated.View>
          )}

          <Animated.View entering={FadeInDown.delay(400)} style={styles.resultsBtns}>
            <TouchableOpacity style={styles.restartBtn} onPress={handleRestart} activeOpacity={0.85}>
              <Ionicons name="refresh" size={20} color="#fff" />
              <Text style={styles.restartBtnText}>Try Again</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.restartBtn, styles.backBtn]} onPress={() => navigation.goBack()} activeOpacity={0.85}>
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
          <Text style={styles.headerLabel}>Grammar Practice</Text>
          <Text style={styles.headerSub}>{current + 1} of {questions.length}</Text>
        </View>
        <View style={styles.scorePill}>
          <MaterialCommunityIcons name="star" size={15} color="#F59E0B" />
          <Text style={styles.scoreText}>{score}</Text>
        </View>
      </Animated.View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
        {/* Question card */}
        <Animated.View
          key={current}
          entering={FadeInDown.duration(380).springify().damping(16)}
          style={cardStyle}
        >
          <View style={styles.questionCard}>
            <View style={styles.questionNumBadge}>
              <Text style={styles.questionNumText}>Q{current + 1}</Text>
            </View>
            <Text style={styles.sentenceText}>
              {(question.question || question.sentence || "").replace("___", "_______")}
            </Text>
            <View style={styles.hintRow}>
              <Ionicons name="bulb-outline" size={15} color={colors.tabIconActive} />
              <Text style={styles.hintText}>{question.hint}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Options */}
        <View style={styles.options}>
          {question.options.map((opt, idx) => {
            const isSelected = selected === opt;
            const isCorrect = opt === question.answer;
            let bg = colors.cardSecondary;
            let border = "transparent";
            let textColor = colors.textPrimary;

            if (answerState !== STATE.IDLE) {
              if (isCorrect) { bg = "#16a34a22"; border = "#16a34a"; textColor = "#16a34a"; }
              else if (isSelected) { bg = "#dc262622"; border = "#dc2626"; textColor = "#dc2626"; }
            }

            return (
              <Animated.View
                key={opt}
                entering={FadeInDown.delay(80 + idx * 60).duration(350).springify()}
              >
                <TouchableOpacity
                  activeOpacity={0.82}
                  onPress={() => handleSelect(opt)}
                  style={[styles.optionBtn, { backgroundColor: bg, borderColor: border }]}
                >
                  <View style={styles.optionLeft}>
                    <View style={[styles.optionIndex, isSelected && answerState !== STATE.IDLE && { backgroundColor: border }]}>
                      <Text style={styles.optionIndexText}>{String.fromCharCode(65 + idx)}</Text>
                    </View>
                    <Text style={[styles.optionText, { color: textColor }]}>{opt}</Text>
                  </View>
                  {answerState !== STATE.IDLE && isCorrect && (
                    <Ionicons name="checkmark-circle" size={22} color="#16a34a" />
                  )}
                  {answerState !== STATE.IDLE && isSelected && !isCorrect && (
                    <Ionicons name="close-circle" size={22} color="#dc2626" />
                  )}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 18,
      paddingVertical: 14,
    },
    backButton: {
      width: 44, height: 44, borderRadius: 14,
      backgroundColor: colors.cardSecondary,
      alignItems: "center", justifyContent: "center",
    },
    headerCenter: { flex: 1, alignItems: "center" },
    headerLabel: { fontSize: 16, fontFamily: fonts.semiBold, color: colors.textPrimary },
    headerSub: { fontSize: 12, fontFamily: fonts.regular, color: colors.textSecondary, marginTop: 2 },
    scorePill: {
      flexDirection: "row", alignItems: "center", gap: 4,
      paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12,
      backgroundColor: colors.cardSecondary,
    },
    scoreText: { fontSize: 14, fontFamily: fonts.semiBold, color: colors.textPrimary },
    progressTrack: {
      height: 5, backgroundColor: colors.progressLine,
      marginHorizontal: 18, borderRadius: 99, marginBottom: 16,
    },
    progressFill: {
      height: 5, borderRadius: 99, backgroundColor: "#00c7be",
    },
    body: { paddingHorizontal: 18, paddingBottom: 40 },
    questionCard: {
      borderRadius: 26, padding: 22,
      backgroundColor: colors.cardSecondary,
      marginBottom: 20,
    },
    questionNumBadge: {
      alignSelf: "flex-start",
      paddingHorizontal: 12, paddingVertical: 5,
      borderRadius: 99, backgroundColor: "#00c7be22",
      marginBottom: 14,
    },
    questionNumText: { fontSize: 13, fontFamily: fonts.semiBold, color: "#00c7be" },
    sentenceText: {
      fontSize: 20, fontFamily: fonts.semiBold,
      color: colors.textPrimary, lineHeight: 30, marginBottom: 14,
    },
    hintRow: { flexDirection: "row", alignItems: "center", gap: 6 },
    hintText: { fontSize: 12, fontFamily: fonts.regular, color: colors.textSecondary },
    options: { gap: 10 },
    optionBtn: {
      borderRadius: 18, padding: 16,
      flexDirection: "row", alignItems: "center",
      justifyContent: "space-between",
      borderWidth: 1.5,
    },
    optionLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
    optionIndex: {
      width: 32, height: 32, borderRadius: 10,
      backgroundColor: colors.background,
      alignItems: "center", justifyContent: "center", marginRight: 12,
    },
    optionIndexText: { fontSize: 13, fontFamily: fonts.semiBold, color: colors.textSecondary },
    optionText: { fontSize: 16, fontFamily: fonts.semiBold },
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
      color: colors.textPrimary, marginBottom: 8,
    },
    resultsScore: {
      fontSize: 18, fontFamily: fonts.regular,
      color: colors.textSecondary, marginBottom: 28,
    },
    reviewBox: {
      width: "100%", borderRadius: 20,
      backgroundColor: colors.cardSecondary, padding: 18, marginBottom: 24,
    },
    reviewTitle: { fontSize: 15, fontFamily: fonts.semiBold, color: colors.textPrimary, marginBottom: 12 },
    reviewItem: { marginBottom: 12, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.progressLine },
    reviewQ: { fontSize: 14, fontFamily: fonts.semiBold, color: colors.textPrimary, marginBottom: 4 },
    reviewWrong: { fontSize: 13, fontFamily: fonts.regular, color: "#dc2626" },
    resultsBtns: { flexDirection: "row", gap: 12, width: "100%" },
    restartBtn: {
      flex: 1, height: 52, borderRadius: 16,
      backgroundColor: "#00c7be",
      flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    },
    backBtn: { backgroundColor: colors.cardSecondary },
    restartBtnText: { fontSize: 16, fontFamily: fonts.semiBold, color: "#fff" },
  });
