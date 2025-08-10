// Этот код аналогичен предыдущему, но мы будем получать данные через props
// и использовать `navigation` для перехода на следующий экран.
// Просто скопируй предыдущий код и внеси небольшие изменения.

import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";

const { width } = Dimensions.get("window");

const ChoiceScreen = ({ navigation, route }) => {
  const { quiz } = route.params;

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const feedbackHeight = useSharedValue(0);

  const handlePress = (label) => {
    setSelectedAnswer(label);
    const correct = label === quiz.correctAnswer;
    setIsCorrect(correct);

    feedbackHeight.value = withSpring(150, { damping: 10, stiffness: 100 });
  };

  const speak = (word) => {
    Speech.speak(word, { language: "en" });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: feedbackHeight.value,
      transform: [{ translateY: feedbackHeight.value === 0 ? 150 : 0 }],
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{quiz.question}</Text>
        <Pressable style={styles.soundButton} onPress={() => speak(quiz.word)}>
          <Ionicons name="volume-high-outline" size={24} color="#fff" />
          <Text style={styles.soundButtonText}>{quiz.word}</Text>
        </Pressable>
      </View>
      <View style={styles.optionsContainer}>
        {quiz.options.map((option, index) => (
          <Pressable
            key={index}
            style={[
              styles.option,
              selectedAnswer === option.label && {
                borderColor: isCorrect ? "#4CAF50" : "#F44336",
              },
            ]}
            onPress={() => handlePress(option.label)}
          >
            <Image source={{ uri: option.image }} style={styles.image} />
            <Text style={styles.imageLabel}>{option.label}</Text>
          </Pressable>
        ))}
      </View>

      {selectedAnswer && (
        <Animated.View
          style={[
            styles.feedbackContainer,
            animatedStyle,
            { backgroundColor: isCorrect ? "#4CAF50" : "#F44336" },
          ]}
        >
          <View style={styles.feedbackHeader}>
            <Ionicons
              name={
                isCorrect ? "checkmark-circle-outline" : "close-circle-outline"
              }
              size={24}
              color="#fff"
            />
            <Text style={styles.feedbackText}>
              {isCorrect ? "Yaxshi bajarildi!" : "Notoʻgʻri javob!"}
            </Text>
          </View>
          {!isCorrect && (
            <Text style={styles.correctAnswerText}>
              Toʻgʻri javob: {quiz.correctAnswer}
            </Text>
          )}
          <Pressable
            style={styles.nextButton}
            onPress={() => {
              // Переход на следующий экран
              navigation.navigate("NextScreen");
            }}
          >
            <Text style={styles.nextButtonText}>Keyingi</Text>
          </Pressable>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  //... стили из предыдущего ответа
});

export default ChoiceScreen;
