import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Platform,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation, useRoute } from "@react-navigation/native";
import Animated, {
  FadeInDown,
  FadeIn,
  ZoomIn,
} from "react-native-reanimated";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { getColors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import { contentApi } from "../api/content";

export default function ReadingScreen() {
  const scheme = useColorScheme();
  const colors = getColors(scheme);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isDark = scheme === "dark";
  const navigation = useNavigation();
  const route = useRoute();

  const [article, setArticle] = useState(null);
  const [loadingArticle, setLoadingArticle] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [phase, setPhase] = useState("read"); // "read" | "quiz" | "done"
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const lessonId = route.params?.lessonId;
    if (!lessonId) {
      setLoadingArticle(false);
      setLoadError("No lesson selected.");
      return;
    }
    contentApi.reading(lessonId)
      .then((res) => {
        const data = res?.data || res;
        const first = Array.isArray(data) ? data[0] : data;
        if (!first) {
          setLoadError("No reading content available for this lesson.");
        } else {
          // Normalise body: API may return array of strings; wrap each into paragraph block
          const rawBody = first.body || [];
          const body = rawBody.map((item) =>
            typeof item === "string" ? { type: "paragraph", text: item } : item
          );
          setArticle({ ...first, body });
        }
      })
      .catch((err) => {
        console.error("Reading API error:", err);
        setLoadError("Failed to load reading content.");
      })
      .finally(() => setLoadingArticle(false));
  }, []);

  if (loadingArticle) {
    return (
      <SafeAreaView style={[styles.safe, { paddingTop: Platform.OS === "android" ? 40 : 0, justifyContent: "center", alignItems: "center" }]}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <ActivityIndicator size="large" color="#00c7be" />
      </SafeAreaView>
    );
  }

  if (loadError || !article) {
    return (
      <SafeAreaView style={[styles.safe, { paddingTop: Platform.OS === "android" ? 40 : 0, justifyContent: "center", alignItems: "center" }]}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <Text style={{ fontSize: 16, color: colors.textSecondary, textAlign: "center", paddingHorizontal: 24 }}>
          {loadError || "No reading content available."}
        </Text>
        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => navigation.goBack()} activeOpacity={0.85}>
          <Text style={{ fontSize: 15, color: "#00c7be", fontFamily: fonts.semiBold }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const question = (article.questions || [])[qIndex];

  const handleAnswer = (opt) => {
    if (answered) return;
    setSelected(opt);
    setAnswered(true);
    if (opt === question.answer) setScore((s) => s + 1);
    setTimeout(() => {
      if (qIndex + 1 >= article.questions.length) {
        setPhase("done");
      } else {
        setQIndex((i) => i + 1);
        setSelected(null);
        setAnswered(false);
      }
    }, 1000);
  };

  if (phase === "done") {
    return (
      <SafeAreaView style={[styles.safe, { paddingTop: Platform.OS === "android" ? 40 : 0 }]}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <View style={styles.doneContainer}>
          <Animated.View entering={ZoomIn.springify().damping(14)} style={styles.doneBadge}>
            <MaterialCommunityIcons name="book-check" size={44} color="#fff" />
          </Animated.View>
          <Animated.Text entering={FadeInDown.delay(150)} style={styles.doneTitle}>
            Article Complete!
          </Animated.Text>
          <Animated.Text entering={FadeInDown.delay(220)} style={styles.doneScore}>
            Comprehension: {score} / {article.questions.length}
          </Animated.Text>
          <Animated.View entering={FadeInDown.delay(300)} style={styles.doneBtns}>
            <TouchableOpacity
              style={styles.doneBtn}
              onPress={() => { setPhase("read"); setQIndex(0); setScore(0); setSelected(null); setAnswered(false); }}
              activeOpacity={0.85}
            >
              <Ionicons name="refresh" size={20} color="#fff" />
              <Text style={styles.doneBtnText}>Read Again</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.doneBtn, styles.doneBtnBack]}
              onPress={() => navigation.goBack()}
              activeOpacity={0.85}
            >
              <Text style={[styles.doneBtnText, { color: colors.textPrimary }]}>Back</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  if (phase === "quiz") {
    return (
      <SafeAreaView style={[styles.safe, { paddingTop: Platform.OS === "android" ? 40 : 0 }]}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => setPhase("read")} activeOpacity={0.8}>
            <MaterialCommunityIcons name="arrow-left" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerLabel}>Comprehension</Text>
            <Text style={styles.headerSub}>{qIndex + 1} of {article.questions.length}</Text>
          </View>
          <View style={{ width: 44 }} />
        </Animated.View>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${(qIndex / article.questions.length) * 100}%` }]} />
        </View>

        <ScrollView contentContainerStyle={styles.quizBody} showsVerticalScrollIndicator={false}>
          <Animated.View key={qIndex} entering={FadeInDown.duration(380).springify().damping(16)} style={styles.qCard}>
            <Text style={styles.qText}>{question.question}</Text>
          </Animated.View>
          {question.options.map((opt, idx) => {
            const isSelected = selected === opt;
            const isCorrect = opt === question.answer;
            let bg = colors.cardSecondary;
            let border = "transparent";
            let textColor = colors.textPrimary;
            if (answered) {
              if (isCorrect) { bg = "#16a34a22"; border = "#16a34a"; textColor = "#16a34a"; }
              else if (isSelected) { bg = "#dc262622"; border = "#dc2626"; textColor = "#dc2626"; }
            }
            return (
              <Animated.View key={opt} entering={FadeInDown.delay(80 + idx * 60).duration(350).springify()}>
                <TouchableOpacity
                  activeOpacity={0.82}
                  onPress={() => handleAnswer(opt)}
                  style={[styles.optionBtn, { backgroundColor: bg, borderColor: border }]}
                >
                  <Text style={[styles.optionText, { color: textColor }]}>{opt}</Text>
                  {answered && isCorrect && <Ionicons name="checkmark-circle" size={20} color="#16a34a" />}
                  {answered && isSelected && !isCorrect && <Ionicons name="close-circle" size={20} color="#dc2626" />}
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Read phase
  return (
    <SafeAreaView style={[styles.safe, { paddingTop: Platform.OS === "android" ? 40 : 0 }]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerLabel}>Reading</Text>
        </View>
        <View style={styles.metaBadge}>
          <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.metaText}>{article.readTime}</Text>
        </View>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.articleBody}>
        <Animated.View entering={FadeInDown.duration(400).springify().damping(16)}>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{article.level}</Text>
          </View>
          <Text style={styles.articleTitle}>{article.title}</Text>
        </Animated.View>

        {article.body.map((block, i) => {
          if (block.type === "heading") {
            return (
              <Animated.Text key={i} entering={FadeInDown.delay(i * 40).duration(350)} style={styles.blockHeading}>
                {block.text}
              </Animated.Text>
            );
          }
          if (block.type === "quote") {
            return (
              <Animated.View key={i} entering={FadeInDown.delay(i * 40).duration(350)} style={styles.quoteBlock}>
                <View style={styles.quoteLine} />
                <Text style={styles.quoteText}>{block.text}</Text>
              </Animated.View>
            );
          }
          if (block.type === "intro") {
            return (
              <Animated.Text key={i} entering={FadeInDown.delay(i * 40).duration(350)} style={styles.introText}>
                {block.text}
              </Animated.Text>
            );
          }
          return (
            <Animated.Text key={i} entering={FadeInDown.delay(i * 40).duration(350)} style={styles.bodyText}>
              {block.text}
            </Animated.Text>
          );
        })}

        <Animated.View entering={FadeInDown.delay(500).duration(400)} style={styles.quizCta}>
          <View>
            <Text style={styles.ctaTitle}>Test your understanding</Text>
            <Text style={styles.ctaSub}>{article.questions.length} comprehension questions</Text>
          </View>
          <TouchableOpacity style={styles.ctaBtn} onPress={() => setPhase("quiz")} activeOpacity={0.85}>
            <Text style={styles.ctaBtnText}>Start Quiz</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
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
    metaBadge: {
      flexDirection: "row", alignItems: "center", gap: 4,
      paddingHorizontal: 10, paddingVertical: 7, borderRadius: 12,
      backgroundColor: colors.cardSecondary,
    },
    metaText: { fontSize: 12, fontFamily: fonts.regular, color: colors.textSecondary },
    articleBody: { paddingHorizontal: 22, paddingBottom: 40, paddingTop: 8 },
    levelBadge: {
      alignSelf: "flex-start",
      paddingHorizontal: 12, paddingVertical: 5,
      borderRadius: 99, backgroundColor: "#00c7be22", marginBottom: 14,
    },
    levelText: { fontSize: 12, fontFamily: fonts.semiBold, color: "#00c7be" },
    articleTitle: {
      fontSize: 24, fontFamily: fonts.semiBold,
      color: colors.textPrimary, lineHeight: 32, marginBottom: 20,
    },
    introText: {
      fontSize: 16, fontFamily: fonts.semiBold,
      color: colors.textPrimary, lineHeight: 26, marginBottom: 20,
    },
    blockHeading: {
      fontSize: 18, fontFamily: fonts.semiBold,
      color: colors.textPrimary, marginTop: 8, marginBottom: 12,
    },
    bodyText: {
      fontSize: 15, fontFamily: fonts.regular,
      color: colors.textPrimary, lineHeight: 26, marginBottom: 16,
    },
    quoteBlock: {
      flexDirection: "row", gap: 14,
      marginVertical: 18, paddingVertical: 4,
    },
    quoteLine: { width: 4, borderRadius: 2, backgroundColor: "#00c7be" },
    quoteText: {
      flex: 1, fontSize: 15, fontFamily: fonts.semiBold,
      color: colors.textSecondary, lineHeight: 24, fontStyle: "italic",
    },
    quizCta: {
      marginTop: 24, borderRadius: 24, padding: 20,
      backgroundColor: colors.cardSecondary,
      flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    },
    ctaTitle: { fontSize: 15, fontFamily: fonts.semiBold, color: colors.textPrimary, marginBottom: 4 },
    ctaSub: { fontSize: 13, fontFamily: fonts.regular, color: colors.textSecondary },
    ctaBtn: {
      flexDirection: "row", alignItems: "center", gap: 6,
      paddingHorizontal: 16, paddingVertical: 12,
      borderRadius: 14, backgroundColor: "#00c7be",
    },
    ctaBtnText: { fontSize: 14, fontFamily: fonts.semiBold, color: "#fff" },
    // Quiz
    progressTrack: {
      height: 5, backgroundColor: colors.progressLine,
      marginHorizontal: 18, borderRadius: 99, marginBottom: 16,
    },
    progressFill: { height: 5, borderRadius: 99, backgroundColor: "#00c7be" },
    quizBody: { paddingHorizontal: 18, paddingBottom: 40 },
    qCard: {
      borderRadius: 24, padding: 22,
      backgroundColor: colors.cardSecondary, marginBottom: 20,
    },
    qText: { fontSize: 18, fontFamily: fonts.semiBold, color: colors.textPrimary, lineHeight: 28 },
    optionBtn: {
      borderRadius: 16, padding: 16, marginBottom: 10,
      flexDirection: "row", alignItems: "center", justifyContent: "space-between",
      borderWidth: 1.5,
    },
    optionText: { fontSize: 15, fontFamily: fonts.semiBold, flex: 1, lineHeight: 22 },
    // Done
    doneContainer: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 },
    doneBadge: {
      width: 90, height: 90, borderRadius: 28,
      backgroundColor: "#00c7be", alignItems: "center", justifyContent: "center",
      marginBottom: 24,
      shadowColor: "#00c7be", shadowOpacity: 0.4, shadowRadius: 16, shadowOffset: { width: 0, height: 8 },
      elevation: 10,
    },
    doneTitle: { fontSize: 28, fontFamily: fonts.semiBold, color: colors.textPrimary, marginBottom: 8 },
    doneScore: { fontSize: 18, fontFamily: fonts.regular, color: colors.textSecondary, marginBottom: 32 },
    doneBtns: { flexDirection: "row", gap: 12, width: "100%" },
    doneBtn: {
      flex: 1, height: 52, borderRadius: 16,
      backgroundColor: "#00c7be",
      flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    },
    doneBtnBack: { backgroundColor: colors.cardSecondary },
    doneBtnText: { fontSize: 16, fontFamily: fonts.semiBold, color: "#fff" },
  });
