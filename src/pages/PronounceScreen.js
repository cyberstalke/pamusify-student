import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";

const PronounceScreen = ({ navigation, route }) => {
  const { quiz } = route.params;
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const speak = (word) => {
    Speech.speak(word, { language: "en" });
  };

  const startRecording = () => {
    setIsRecording(true);
    // Здесь будет код для запуска распознавания речи
    // Например: SpeechRecognizer.start();
    // Мы пока просто имитируем
    setTimeout(() => {
      setIsRecording(false);
      // Имитация успешного результата
      setFeedback("Yaxshi bajarildi!");
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{quiz.question}</Text>
        <Image source={{ uri: quiz.image }} style={styles.image} />
        <Pressable style={styles.soundButton} onPress={() => speak(quiz.word)}>
          <Ionicons name="volume-high-outline" size={24} color="#fff" />
          <Text style={styles.soundButtonText}>{quiz.word}</Text>
        </Pressable>
      </View>

      <View style={styles.mainContent}>
        <Pressable
          style={[styles.microphoneButton, isRecording && styles.recording]}
          onPress={startRecording}
        >
          <Ionicons name="mic-outline" size={64} color="#fff" />
        </Pressable>
        <Pressable
          style={styles.skipButton}
          onPress={() => navigation.navigate("NextScreen")}
        >
          <Text style={styles.skipButtonText}>O'tkazib yuborish</Text>
        </Pressable>
      </View>

      {feedback && (
        <View style={[styles.feedbackFooter, { backgroundColor: "#4CAF50" }]}>
          <Ionicons name="checkmark-circle-outline" size={24} color="#fff" />
          <Text style={styles.feedbackText}>{feedback}</Text>
          <Pressable
            style={styles.nextButton}
            onPress={() => navigation.navigate("NextScreen")}
          >
            <Text style={styles.nextButtonText}>Keyingi</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1E1E",
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
  image: {
    width: 200,
    height: 200,
    borderRadius: 20,
    marginBottom: 20,
  },
  soundButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  soundButtonText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
  },
  mainContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  microphoneButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
  },
  recording: {
    backgroundColor: "#F44336",
  },
  skipButton: {
    marginTop: 20,
  },
  skipButtonText: {
    color: "#fff",
    fontSize: 16,
    textDecorationLine: "underline",
  },
  feedbackFooter: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  feedbackText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    flex: 1,
  },
  nextButton: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 20,
  },
  nextButtonText: {
    color: "#1E1E1E",
    fontWeight: "bold",
  },
});

export default PronounceScreen;
