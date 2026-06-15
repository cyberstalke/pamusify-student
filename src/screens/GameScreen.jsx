import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  useColorScheme,
  Modal,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  FadeInDown,
  FadeIn,
  SlideInDown,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { getColors } from "../utils/colors";
import { contentApi } from "../api/content";

const TURN_TIME = 30;

const FALLBACK_WORD_DATA = {
  animals: ["dog", "cat", "lion", "tiger", "bear", "horse", "mouse", "bird", "cow", "sheep", "snake"],
  food: ["apple", "banana", "pizza", "sushi", "bread", "rice", "milk", "cheese"],
  colours: ["red", "blue", "green", "yellow", "black", "white", "purple", "orange"],
};

export default function GameScreen() {
  const navigation = useNavigation();
  const scheme = useColorScheme();
  const colors = getColors(scheme);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isDark = scheme === "dark";

  const scrollRef = useRef(null);
  const robotTimeoutRef = useRef(null);

  const [wordData, setWordData] = useState(FALLBACK_WORD_DATA);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [topic, setTopic] = useState(null);
  const [usedWords, setUsedWords] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputWord, setInputWord] = useState("");
  const [turn, setTurn] = useState("player");
  const [timer, setTimer] = useState(TURN_TIME);
  const [gameResult, setGameResult] = useState(null);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    contentApi.wordGameTopics()
      .then((res) => {
        const data = res?.data || res;
        if (Array.isArray(data) && data.length > 0) {
          const map = data.reduce((acc, item) => {
            acc[item.topic] = item.words;
            return acc;
          }, {});
          setWordData(map);
          const topics = Object.keys(map);
          setTopic(topics[Math.floor(Math.random() * topics.length)]);
        } else {
          const topics = Object.keys(FALLBACK_WORD_DATA);
          setTopic(topics[Math.floor(Math.random() * topics.length)]);
        }
      })
      .catch((err) => {
        console.error("Word game topics error:", err);
        const topics = Object.keys(FALLBACK_WORD_DATA);
        setTopic(topics[Math.floor(Math.random() * topics.length)]);
      })
      .finally(() => setLoadingTopics(false));
  }, []);

  const words = topic ? (wordData[topic] || []) : [];
  const lastWord = usedWords[usedWords.length - 1];
  const requiredLetter = lastWord ? lastWord.slice(-1) : null;
  const progress = words.length > 0 ? usedWords.length / words.length : 0;

  useEffect(() => {
    if (gameResult) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          finishGame(turn === "player" ? "lose" : "win");
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [turn, gameResult]);

  useEffect(() => {
    if (turn !== "robot" || gameResult) return;

    robotTimeoutRef.current = setTimeout(() => {
      makeRobotMove();
    }, 1100);

    return () => {
      if (robotTimeoutRef.current) clearTimeout(robotTimeoutRef.current);
    };
  }, [turn, usedWords, gameResult]);

  const addMessage = (sender, text) => {
    setMessages((prev) => [
      ...prev,
      {
        id: `${sender}-${text}-${Date.now()}`,
        sender,
        text,
      },
    ]);
  };

  const resetTimer = () => {
    setTimer(TURN_TIME);
  };

  const finishGame = (result) => {
    setTurn(null);
    setGameResult(result);

    if (robotTimeoutRef.current) {
      clearTimeout(robotTimeoutRef.current);
    }
  };

  const resetGame = () => {
    const topics = Object.keys(wordData);
    setTopic(topics[Math.floor(Math.random() * topics.length)]);
    setUsedWords([]);
    setMessages([]);
    setInputWord("");
    setTurn("player");
    setTimer(TURN_TIME);
    setGameResult(null);
    setErrorText("");
  };

  const validatePlayerWord = (word) => {
    if (!word) return "Type a word first.";

    if (requiredLetter && word[0] !== requiredLetter) {
      return `Word must start with "${requiredLetter.toUpperCase()}".`;
    }

    if (usedWords.includes(word)) {
      return "This word has already been used.";
    }

    if (!words.includes(word)) {
      return `"${word}" is not in ${topic}.`;
    }

    return "";
  };

  const handlePlayerSubmit = () => {
    if (turn !== "player" || gameResult) return;

    const word = inputWord.trim().toLowerCase();
    const error = validatePlayerWord(word);

    if (error) {
      setErrorText(error);
      return;
    }

    setErrorText("");
    addMessage("player", word);
    setUsedWords((prev) => [...prev, word]);
    setInputWord("");

    if (usedWords.length + 1 >= words.length) {
      finishGame("win");
      return;
    }

    setTurn("robot");
    resetTimer();
  };

  const makeRobotMove = () => {
    const availableWords = words.filter((word) => !usedWords.includes(word));

    if (!availableWords.length) {
      finishGame("win");
      return;
    }

    const robotOptions = requiredLetter
      ? availableWords.filter((word) => word.startsWith(requiredLetter))
      : availableWords;

    if (!robotOptions.length) {
      finishGame("win");
      return;
    }

    const robotWord =
      robotOptions[Math.floor(Math.random() * robotOptions.length)];

    addMessage("robot", robotWord);
    setUsedWords((prev) => [...prev, robotWord]);

    if (usedWords.length + 1 >= words.length) {
      finishGame("lose");
      return;
    }

    setTurn("player");
    resetTimer();
  };

  if (loadingTopics || !topic) {
    return (
      <SafeAreaView style={[styles.safeArea, { justifyContent: "center", alignItems: "center" }]}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <ActivityIndicator size="large" color={colors.tabIconActive} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.iconButton}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={23}
              color={colors.textPrimary}
            />
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={styles.headerLabel}>Word Chain</Text>
            <Text style={styles.headerTitle}>{topic.toUpperCase()}</Text>
          </View>

          <View style={styles.timerBox}>
            <MaterialCommunityIcons
              name="timer-outline"
              size={18}
              color={timer <= 10 ? "#EF4444" : colors.tabIconActive}
            />
            <Text
              style={[styles.timerText, timer <= 10 && { color: "#EF4444" }]}
            >
              {timer}s
            </Text>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(80).duration(380).springify().damping(17)}
          style={styles.infoCard}
        >
          <View>
            <Text style={styles.infoTitle}>
              {turn === "player" ? "Your turn" : "Robot is thinking..."}
            </Text>
            <Text style={styles.infoSubtitle}>
              {requiredLetter
                ? `Next word must start with "${requiredLetter.toUpperCase()}"`
                : "Start with any word from this topic"}
            </Text>
          </View>

          <View style={styles.progressCircle}>
            <Text style={styles.progressText}>
              {usedWords.length}/{words.length}
            </Text>
          </View>
        </Animated.View>

        <View style={styles.progressTrack}>
          <View
            style={[styles.progressFill, { width: `${progress * 100}%` }]}
          />
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.chat}
          contentContainerStyle={styles.chatContent}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.length === 0 ? (
            <Animated.View
              entering={FadeInDown.duration(400).springify().damping(17)}
              style={styles.emptyCard}
            >
              <MaterialCommunityIcons
                name="robot-happy-outline"
                size={42}
                color={colors.tabIconActive}
              />
              <Text style={styles.emptyTitle}>Start the game</Text>
              <Text style={styles.emptySubtitle}>
                Type a word from {topic}. Robot will answer with a matching
                word.
              </Text>
            </Animated.View>
          ) : (
            messages.map((message, index) => (
              <Animated.View
                key={message.id}
                entering={FadeInDown.delay(index * 35)
                  .duration(300)
                  .springify()
                  .damping(18)}
                layout={Layout.springify().damping(18)}
                style={[
                  styles.messageRow,
                  message.sender === "player" && styles.messageRowRight,
                ]}
              >
                <View
                  style={[
                    styles.avatar,
                    message.sender === "player"
                      ? styles.playerAvatar
                      : styles.robotAvatar,
                  ]}
                >
                  <MaterialCommunityIcons
                    name={
                      message.sender === "player" ? "account" : "robot-outline"
                    }
                    size={18}
                    color="#fff"
                  />
                </View>

                <View
                  style={[
                    styles.messageBubble,
                    message.sender === "player"
                      ? styles.playerBubble
                      : styles.robotBubble,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      message.sender === "player" && styles.playerMessageText,
                    ]}
                  >
                    {message.text}
                  </Text>
                </View>
              </Animated.View>
            ))
          )}
        </ScrollView>

        {errorText ? (
          <Animated.View
            entering={FadeInDown.duration(240)}
            style={styles.errorBox}
          >
            <MaterialCommunityIcons
              name="alert-circle"
              size={17}
              color="#fff"
            />
            <Text style={styles.errorText}>{errorText}</Text>
          </Animated.View>
        ) : null}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder={
              turn === "player" ? "Type your word..." : "Wait for robot..."
            }
            placeholderTextColor={colors.textSecondary}
            value={inputWord}
            onChangeText={(text) => {
              setInputWord(text);
              if (errorText) setErrorText("");
            }}
            onSubmitEditing={handlePlayerSubmit}
            editable={turn === "player" && !gameResult}
            autoCapitalize="none"
          />

          <SendButton
            disabled={
              turn !== "player" || !inputWord.trim() || Boolean(gameResult)
            }
            onPress={handlePlayerSubmit}
            styles={styles}
          />
        </View>

        <ResultModal
          visible={Boolean(gameResult)}
          result={gameResult}
          onRestart={resetGame}
          onBack={() => navigation.goBack()}
          styles={styles}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SendButton({ disabled, onPress, styles }) {
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
        style={[styles.sendButton, disabled && styles.sendButtonDisabled]}
      >
        <MaterialCommunityIcons name="send" size={23} color="#fff" />
      </Pressable>
    </Animated.View>
  );
}

function ResultModal({ visible, result, onRestart, onBack, styles }) {
  const isWin = result === "win";

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <Animated.View
          entering={SlideInDown.duration(350).springify().damping(18)}
          style={[
            styles.resultCard,
            isWin ? styles.resultWin : styles.resultLose,
          ]}
        >
          <MaterialCommunityIcons
            name={isWin ? "trophy-award" : "robot-confused-outline"}
            size={58}
            color="#fff"
          />

          <Text style={styles.resultTitle}>
            {isWin ? "You Win!" : "Game Over"}
          </Text>

          <Text style={styles.resultSubtitle}>
            {isWin
              ? "Great job! You beat the robot."
              : "Robot won this round. Try again!"}
          </Text>

          <Pressable style={styles.resultButton} onPress={onRestart}>
            <Text style={styles.resultButtonText}>Play Again</Text>
          </Pressable>

          <Pressable style={styles.resultGhostButton} onPress={onBack}>
            <Text style={styles.resultGhostText}>Go Back</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
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

    header: {
      paddingHorizontal: 18,
      paddingTop: 14,
      paddingBottom: 16,
      backgroundColor: colors.cardSecondary,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    iconButton: {
      width: 46,
      height: 46,
      borderRadius: 16,
      backgroundColor: colors.background,
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
      color: colors.tabIconActive,
    },

    headerTitle: {
      marginTop: 2,
      fontSize: 21,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    timerBox: {
      height: 46,
      minWidth: 66,
      borderRadius: 16,
      backgroundColor: colors.background,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 5,
    },

    timerText: {
      fontSize: 15,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    infoCard: {
      marginHorizontal: 18,
      marginTop: 16,
      padding: 16,
      borderRadius: 28,
      backgroundColor: colors.cardSecondary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    infoTitle: {
      fontSize: 20,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    infoSubtitle: {
      marginTop: 5,
      fontSize: 13,
      fontWeight: "700",
      color: colors.textSecondary,
      maxWidth: 240,
    },

    progressCircle: {
      width: 54,
      height: 54,
      borderRadius: 20,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
    },

    progressText: {
      fontSize: 13,
      fontWeight: "900",
      color: colors.tabIconActive,
    },

    progressTrack: {
      marginHorizontal: 18,
      marginTop: 12,
      height: 8,
      borderRadius: 999,
      backgroundColor: colors.cardSecondary,
      overflow: "hidden",
    },

    progressFill: {
      height: "100%",
      borderRadius: 999,
      backgroundColor: colors.tabIconActive,
    },

    chat: {
      flex: 1,
    },

    chatContent: {
      padding: 18,
      paddingBottom: 20,
      flexGrow: 1,
      justifyContent: "flex-end",
    },

    emptyCard: {
      padding: 24,
      borderRadius: 30,
      backgroundColor: colors.cardSecondary,
      alignItems: "center",
    },

    emptyTitle: {
      marginTop: 12,
      fontSize: 21,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    emptySubtitle: {
      marginTop: 7,
      fontSize: 13,
      lineHeight: 19,
      fontWeight: "700",
      color: colors.textSecondary,
      textAlign: "center",
    },

    messageRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      marginBottom: 12,
      gap: 8,
    },

    messageRowRight: {
      flexDirection: "row-reverse",
    },

    avatar: {
      width: 34,
      height: 34,
      borderRadius: 13,
      alignItems: "center",
      justifyContent: "center",
    },

    playerAvatar: {
      backgroundColor: colors.tabIconActive,
    },

    robotAvatar: {
      backgroundColor: "#64748B",
    },

    messageBubble: {
      maxWidth: "74%",
      paddingVertical: 12,
      paddingHorizontal: 15,
      borderRadius: 22,
    },

    playerBubble: {
      backgroundColor: colors.tabIconActive,
      borderBottomRightRadius: 6,
    },

    robotBubble: {
      backgroundColor: colors.cardSecondary,
      borderBottomLeftRadius: 6,
    },

    messageText: {
      fontSize: 16,
      fontWeight: "800",
      color: colors.textPrimary,
      textTransform: "capitalize",
    },

    playerMessageText: {
      color: "#fff",
    },

    errorBox: {
      marginHorizontal: 18,
      marginBottom: 8,
      borderRadius: 18,
      paddingVertical: 10,
      paddingHorizontal: 12,
      backgroundColor: "#EF4444",
      flexDirection: "row",
      alignItems: "center",
      gap: 7,
    },

    errorText: {
      flex: 1,
      fontSize: 13,
      fontWeight: "800",
      color: "#fff",
    },

    inputContainer: {
      padding: 14,
      paddingBottom: Platform.OS === "ios" ? 18 : 14,
      backgroundColor: colors.cardSecondary,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },

    textInput: {
      flex: 1,
      minHeight: 52,
      borderRadius: 19,
      paddingHorizontal: 16,
      backgroundColor: colors.background,
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: "800",
    },

    sendButton: {
      width: 52,
      height: 52,
      borderRadius: 19,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.tabIconActive,
    },

    sendButtonDisabled: {
      opacity: 0.45,
    },

    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0,0,0,0.58)",
    },

    resultCard: {
      margin: 16,
      borderRadius: 34,
      padding: 26,
      alignItems: "center",
    },

    resultWin: {
      backgroundColor: "#22C55E",
    },

    resultLose: {
      backgroundColor: "#EF4444",
    },

    resultTitle: {
      marginTop: 14,
      fontSize: 30,
      fontWeight: "900",
      color: "#fff",
    },

    resultSubtitle: {
      marginTop: 8,
      fontSize: 15,
      lineHeight: 21,
      fontWeight: "700",
      color: "rgba(255,255,255,0.88)",
      textAlign: "center",
    },

    resultButton: {
      marginTop: 22,
      height: 54,
      alignSelf: "stretch",
      borderRadius: 20,
      backgroundColor: "rgba(255,255,255,0.24)",
      alignItems: "center",
      justifyContent: "center",
    },

    resultButtonText: {
      fontSize: 17,
      fontWeight: "900",
      color: "#fff",
    },

    resultGhostButton: {
      marginTop: 12,
      height: 46,
      alignSelf: "stretch",
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
    },

    resultGhostText: {
      fontSize: 15,
      fontWeight: "900",
      color: "#fff",
    },
  });
