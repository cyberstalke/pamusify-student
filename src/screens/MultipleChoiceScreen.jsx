import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  SafeAreaView,
  useColorScheme,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRoute } from "@react-navigation/native";
import Animated, {
  FadeInDown,
  FadeIn,
  SlideInDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import Icon from "react-native-vector-icons/Feather";
import { getColors } from "../utils/colors";
import { quizApi } from "../api/quiz";

const TOTAL_TIME_LIMIT = 120;

const shuffleArray = (array) => {
  const newArray = [...array];

  for (let i = newArray.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }

  return newArray;
};

export default function MultipleChoiceScreen({ navigation }) {
  const scheme = useColorScheme();
  const colors = getColors(scheme);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const route = useRoute();

  const [quizzes, setQuizzes] = useState([]);
  const [loadingQuiz, setLoadingQuiz] = useState(true);
  const [loadError, setLoadError] = useState(null);
  // Track answers for submission: [{ question: id, option: selectedId }]
  const answersRef = useRef([]);

  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerStatus, setAnswerStatus] = useState(null);
  const [resultModal, setResultModal] = useState(null);
  const [timer, setTimer] = useState(TOTAL_TIME_LIMIT);
  const [finalScore, setFinalScore] = useState(null);

  const progress = useSharedValue(0);

  const currentQuiz = quizzes[currentQuizIndex];
  const isCompleted = resultModal === "completed";
  const isTimeUp = resultModal === "time-up";
  const isAnswerModal = resultModal === "answer";

  const correctCountRef = useRef(0);
  const quizIdRef = useRef(null);

  useEffect(() => {
    const quizId = route.params?.quizId;
    if (!quizId) {
      setLoadingQuiz(false);
      setLoadError("No quiz selected.");
      return;
    }
    quizIdRef.current = quizId;
    quizApi.take(quizId)
      .then((res) => {
        const data = res?.data || res;
        const questions = Array.isArray(data) ? data : (data?.questions || []);
        setQuizzes(shuffleArray(questions));
      })
      .catch((err) => {
        console.error("Quiz API error:", err);
        setLoadError("Failed to load quiz.");
      })
      .finally(() => setLoadingQuiz(false));
  }, []);

  useEffect(() => {
    if (isCompleted || isTimeUp) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setResultModal("time-up");
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isCompleted, isTimeUp]);

  useEffect(() => {
    progress.value = withTiming((currentQuizIndex + 1) / quizzes.length, {
      duration: 450,
    });

    setSelectedOption(null);
    setAnswerStatus(null);
  }, [currentQuizIndex, quizzes.length]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const handleSelectOption = (option) => {
    if (answerStatus) return;
    setSelectedOption(option);
  };

  const handleCheck = () => {
    if (!selectedOption || !currentQuiz) return;

    const correctAnswer = currentQuiz.correctAnswer || currentQuiz.answer;
    const correct = selectedOption === correctAnswer;

    setAnswerStatus(correct ? "correct" : "wrong");

    if (correct) {
      correctCountRef.current += 1;
    }

    // Record answer for submission
    if (currentQuiz.id) {
      answersRef.current.push({ question: currentQuiz.id, option: selectedOption });
    }

    setTimeout(() => {
      setResultModal("answer");
    }, 450);
  };

  const handleNext = () => {
    setResultModal(null);

    if (currentQuizIndex >= quizzes.length - 1) {
      // Submit answers to backend
      if (quizIdRef.current && answersRef.current.length > 0) {
        quizApi.submit(quizIdRef.current, answersRef.current)
          .then((res) => {
            const data = res?.data || res;
            if (data?.score != null) setFinalScore(data.score);
          })
          .catch((err) => console.error("Quiz submit error:", err));
      }
      setResultModal("completed");
      return;
    }

    setCurrentQuizIndex((prev) => prev + 1);
  };

  const minutes = Math.floor(timer / 60);
  const seconds = timer % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;

  const getOptionState = (option) => {
    if (!answerStatus) {
      return selectedOption === option ? "selected" : "default";
    }

    const correctAnswer = currentQuiz?.correctAnswer || currentQuiz?.answer;
    if (option === correctAnswer) return "correct";
    if (option === selectedOption) return "wrong";

    return "disabled";
  };

  if (loadingQuiz) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <StatusBar style={scheme === "dark" ? "light" : "dark"} />
        <ActivityIndicator size="large" color={colors.tabIconActive} />
      </SafeAreaView>
    );
  }

  if (loadError || quizzes.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <StatusBar style={scheme === "dark" ? "light" : "dark"} />
        <Text style={{ fontSize: 16, color: colors.textSecondary, textAlign: "center", paddingHorizontal: 24 }}>
          {loadError || "No quiz questions available."}
        </Text>
        <Pressable style={{ marginTop: 20 }} onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 15, color: colors.tabIconActive }}>Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />

      <View style={styles.topBar}>
        <Pressable onPress={() => navigation.goBack()} style={styles.closeBtn}>
          <Icon name="x" size={24} color={colors.textPrimary} />
        </Pressable>

        <View style={styles.progressWrapper}>
          <Animated.View style={[styles.progressFill, progressStyle]} />
        </View>

        <View style={styles.timerBox}>
          <Icon name="clock" size={17} color={colors.tabIconActive} />
          <Text style={styles.timerText}>{formattedTime}</Text>
        </View>
      </View>

      <Animated.View entering={FadeIn.duration(350)} style={styles.quizMeta}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{currentQuiz.difficulty}</Text>
        </View>

        <Text style={styles.counterText}>
          {currentQuizIndex + 1} / {quizzes.length}
        </Text>
      </Animated.View>

      <View style={styles.content}>
        <Animated.View
          key={`question-${currentQuizIndex}`}
          entering={FadeInDown.duration(450).springify().damping(17)}
          style={styles.questionCard}
        >
          <Text style={styles.questionLabel}>Choose the correct answer</Text>
          <Text style={styles.questionText}>{currentQuiz.question}</Text>
        </Animated.View>

        <View style={styles.optionsContainer}>
          {currentQuiz.options.map((option, index) => (
            <OptionButton
              key={option}
              option={option}
              index={index}
              state={getOptionState(option)}
              colors={colors}
              styles={styles}
              onPress={() => handleSelectOption(option)}
            />
          ))}
        </View>
      </View>

      <View style={styles.bottomBar}>
        <Pressable
          disabled={!selectedOption || Boolean(answerStatus)}
          onPress={handleCheck}
          style={[
            styles.checkButton,
            (!selectedOption || Boolean(answerStatus)) &&
              styles.checkButtonDisabled,
          ]}
        >
          <Text style={styles.checkButtonText}>Check</Text>
        </Pressable>
      </View>

      <ResultModal
        visible={isAnswerModal}
        correct={answerStatus === "correct"}
        correctAnswer={currentQuiz?.correctAnswer || currentQuiz?.answer}
        onPress={handleNext}
        styles={styles}
      />

      <FinalModal
        visible={isCompleted}
        title="Quiz Completed!"
        subtitle={
          finalScore != null
            ? `Score: ${finalScore}`
            : `${correctCountRef.current}/${quizzes.length} correct answers`
        }
        buttonText="Go to Main Menu"
        success
        onPress={() => navigation.goBack()}
        styles={styles}
      />

      <FinalModal
        visible={isTimeUp}
        title="Time’s Up!"
        subtitle="Try again and beat your score."
        buttonText="Go to Main Menu"
        onPress={() => navigation.goBack()}
        styles={styles}
      />
    </SafeAreaView>
  );
}

function OptionButton({ option, index, state, styles, onPress }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 80)
        .duration(380)
        .springify()}
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
        style={[
          styles.optionButton,
          state === "selected" && styles.optionSelected,
          state === "correct" && styles.optionCorrect,
          state === "wrong" && styles.optionWrong,
          state === "disabled" && styles.optionDisabled,
        ]}
      >
        <Text
          style={[
            styles.optionText,
            (state === "correct" || state === "wrong") &&
              styles.optionTextActive,
          ]}
        >
          {option}
        </Text>

        {state === "correct" && (
          <Icon name="check-circle" size={22} color="#fff" />
        )}
        {state === "wrong" && <Icon name="x-circle" size={22} color="#fff" />}
      </Pressable>
    </Animated.View>
  );
}

function ResultModal({ visible, correct, correctAnswer, onPress, styles }) {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.modalOverlay}>
        <Animated.View
          entering={SlideInDown.duration(350).springify().damping(18)}
          style={[
            styles.resultCard,
            correct ? styles.resultCorrect : styles.resultWrong,
          ]}
        >
          <Icon
            name={correct ? "check-circle" : "x-circle"}
            size={48}
            color="#fff"
          />

          <Text style={styles.resultTitle}>
            {correct ? "Correct!" : "Incorrect"}
          </Text>

          <Text style={styles.resultSubtitle}>
            {correct
              ? "Great job, keep going!"
              : `Correct answer: ${correctAnswer}`}
          </Text>

          <Pressable style={styles.resultButton} onPress={onPress}>
            <Text style={styles.resultButtonText}>Continue</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

function FinalModal({
  visible,
  title,
  subtitle,
  buttonText,
  success,
  onPress,
  styles,
}) {
  return (
    <Modal animationType="fade" transparent visible={visible}>
      <View style={styles.modalOverlay}>
        <Animated.View
          entering={SlideInDown.duration(350).springify().damping(18)}
          style={[styles.finalCard, success && styles.finalCardSuccess]}
        >
          <Icon name={success ? "award" : "clock"} size={50} color="#fff" />

          <Text style={styles.resultTitle}>{title}</Text>
          <Text style={styles.resultSubtitle}>{subtitle}</Text>

          <Pressable style={styles.resultButton} onPress={onPress}>
            <Text style={styles.resultButtonText}>{buttonText}</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    topBar: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 18,
      paddingTop: 14,
      paddingBottom: 12,
      gap: 12,
    },

    closeBtn: {
      width: 44,
      height: 44,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.cardSecondary,
    },

    progressWrapper: {
      flex: 1,
      height: 12,
      borderRadius: 999,
      overflow: "hidden",
      backgroundColor: colors.progressLine || colors.cardSecondary,
    },

    progressFill: {
      height: "100%",
      borderRadius: 999,
      backgroundColor: colors.tabIconActive,
    },

    timerBox: {
      height: 44,
      paddingHorizontal: 12,
      borderRadius: 16,
      backgroundColor: colors.cardSecondary,
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },

    timerText: {
      fontSize: 15,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    quizMeta: {
      paddingHorizontal: 18,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 4,
    },

    badge: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 999,
      backgroundColor: colors.cardSecondary,
    },

    badgeText: {
      fontSize: 13,
      fontWeight: "900",
      color: colors.tabIconActive,
    },

    counterText: {
      fontSize: 13,
      fontWeight: "900",
      color: colors.textSecondary,
    },

    content: {
      flex: 1,
      paddingHorizontal: 18,
      justifyContent: "center",
    },

    questionCard: {
      padding: 22,
      borderRadius: 30,
      backgroundColor: colors.cardSecondary,
      marginBottom: 28,
    },

    questionLabel: {
      fontSize: 13,
      fontWeight: "900",
      color: colors.tabIconActive,
      marginBottom: 10,
    },

    questionText: {
      fontSize: 27,
      lineHeight: 36,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    optionsContainer: {
      gap: 13,
    },

    optionButton: {
      minHeight: 64,
      borderRadius: 22,
      paddingHorizontal: 18,
      paddingVertical: 16,
      backgroundColor: colors.cardSecondary,
      borderWidth: 2,
      borderColor: "transparent",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    optionSelected: {
      borderColor: colors.tabIconActive,
      backgroundColor: "rgba(142,151,253,0.14)",
    },

    optionCorrect: {
      backgroundColor: "#22C55E",
      borderColor: "#22C55E",
    },

    optionWrong: {
      backgroundColor: "#EF4444",
      borderColor: "#EF4444",
    },

    optionDisabled: {
      opacity: 0.45,
    },

    optionText: {
      fontSize: 17,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    optionTextActive: {
      color: "#fff",
    },

    bottomBar: {
      padding: 18,
      paddingBottom: 22,
      backgroundColor: colors.background,
    },

    checkButton: {
      height: 58,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.tabIconActive,
    },

    checkButtonDisabled: {
      opacity: 0.45,
    },

    checkButtonText: {
      fontSize: 18,
      fontWeight: "900",
      color: "#fff",
    },

    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0,0,0,0.6)",
    },

    resultCard: {
      margin: 16,
      borderRadius: 34,
      padding: 24,
      alignItems: "center",
      backgroundColor: "#EF4444",
    },

    resultCorrect: {
      backgroundColor: "#22C55E",
    },

    resultWrong: {
      backgroundColor: "#EF4444",
    },

    finalCard: {
      margin: 16,
      borderRadius: 34,
      padding: 26,
      alignItems: "center",
      backgroundColor: "#EF4444",
    },

    finalCardSuccess: {
      backgroundColor: "#22C55E",
    },

    resultTitle: {
      marginTop: 14,
      fontSize: 26,
      fontWeight: "900",
      color: "#fff",
      textAlign: "center",
    },

    resultSubtitle: {
      marginTop: 8,
      fontSize: 15,
      fontWeight: "700",
      color: "rgba(255,255,255,0.9)",
      textAlign: "center",
    },

    resultButton: {
      marginTop: 22,
      height: 54,
      alignSelf: "stretch",
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(255,255,255,0.22)",
    },

    resultButtonText: {
      fontSize: 17,
      fontWeight: "900",
      color: "#fff",
    },
  });
