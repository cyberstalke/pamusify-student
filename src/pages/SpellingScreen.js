import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  PanResponder,
  Animated as RNAnimated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const SpellingScreen = ({ navigation, route }) => {
  const { quiz } = route.params;
  const initialLetters = quiz.word.split("").sort(() => Math.random() - 0.5);

  const [letters, setLetters] = useState(initialLetters);
  const [answer, setAnswer] = useState([]);

  const handleLetterPress = (letter, index) => {
    // Удаляем букву из нижнего ряда
    const newLetters = [...letters];
    newLetters.splice(index, 1);
    setLetters(newLetters);

    // Добавляем в верхний ряд
    setAnswer([...answer, letter]);
  };

  const handleAnswerPress = (letter, index) => {
    // Удаляем из верхнего ряда
    const newAnswer = [...answer];
    newAnswer.splice(index, 1);
    setAnswer(newAnswer);

    // Добавляем обратно в нижний
    setLetters([...letters, letter]);
  };

  const checkAnswer = () => {
    const isCorrect = answer.join("") === quiz.word;
    // ... логика для показа модального окна
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{quiz.question}</Text>
      </View>

      {/* Верхний ряд для ответа */}
      <View style={styles.answerRow}>
        {answer.map((letter, index) => (
          <Pressable
            key={index}
            style={styles.answerLetterBox}
            onPress={() => handleAnswerPress(letter, index)}
          >
            <Text style={styles.letterText}>{letter}</Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.hint}>Harfma-harf aytish</Text>

      {/* Нижний ряд с буквами */}
      <View style={styles.lettersRow}>
        {letters.map((letter, index) => (
          <Pressable
            key={index}
            style={styles.letterBox}
            onPress={() => handleLetterPress(letter, index)}
          >
            <Text style={styles.letterText}>{letter}</Text>
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.continueButton} onPress={checkAnswer}>
        <Text style={styles.continueButtonText}>Davom etish</Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    padding: 20,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    padding: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  answerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  answerLetterBox: {
    width: 50,
    height: 50,
    backgroundColor: "#333",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    borderBottomWidth: 2,
    borderBottomColor: "#666",
  },
  hint: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    marginBottom: 50,
  },
  lettersRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  letterBox: {
    width: 60,
    height: 60,
    backgroundColor: "#3B82F6",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
  },
  letterText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  continueButton: {
    backgroundColor: "#3B82F6",
    padding: 15,
    borderRadius: 25,
    marginTop: 20,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SpellingScreen;
