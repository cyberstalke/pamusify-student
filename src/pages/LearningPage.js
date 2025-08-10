import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getColors } from "../utils/colors";
import ProgressLine from "../components/ProgressLine";
import { useNavigation } from "@react-navigation/native";

const correctWord = ["S", "p", "e", "l", "l"];
const shuffledData = ["l", "p", "S", "e", "l"];

const LearningPage = ({ mode = "dark" }) => {
  const colors = getColors(mode);
  const [letters, setLetters] = useState(shuffledData); // pastdagilar
  const [placedLetters, setPlacedLetters] = useState(
    Array(correctWord.length).fill(null)
  ); // slotdagilar

  const [modalVisible, setModalVisible] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const navigation = useNavigation();

  // Pastdan slotga qo‘yish
  const placeLetter = (letter, index) => {
    const slotIndex = placedLetters.indexOf(null);
    if (slotIndex !== -1) {
      const newPlaced = [...placedLetters];
      newPlaced[slotIndex] = letter;
      setPlacedLetters(newPlaced);
      setLetters((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Slotdan pastga qaytarish
  const removeLetterFromSlot = (slotIndex) => {
    const letter = placedLetters[slotIndex];
    if (letter) {
      const newPlaced = [...placedLetters];
      newPlaced[slotIndex] = null;
      setPlacedLetters(newPlaced);
      setLetters((prev) => [...prev, letter]);
    }
  };

  // Javob tekshirish
  const checkAnswer = () => {
    const result =
      JSON.stringify(placedLetters) === JSON.stringify(correctWord);
    setIsCorrect(result);
    setModalVisible(true);
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={styles.container}>
        <TouchableOpacity>
          <Text onPress={() => navigation.goBack()}>Go back</Text>
        </TouchableOpacity>
        <ProgressLine
          progress={
            (placedLetters.filter(Boolean).length / correctWord.length) * 100
          }
          mode={mode}
        />

        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Harflarni to‘g‘ri tartibda joylashtiring
        </Text>

        {/* Slotlar */}
        <View style={styles.placeholderRow}>
          {placedLetters.map((letter, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.placeholderBox,
                { borderColor: colors.tabIconActive },
              ]}
              onPress={() => removeLetterFromSlot(index)}
            >
              {letter && (
                <View
                  style={[
                    styles.letterBox,
                    { backgroundColor: colors.tabIconActive },
                  ]}
                >
                  <Text style={styles.letterText}>{letter}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Pastdagi harflar */}
        <View style={styles.lettersRow}>
          {letters.map((letter, index) => (
            <TouchableOpacity
              key={`${letter}-${index}`}
              onPress={() => placeLetter(letter, index)}
            >
              <View
                style={[
                  styles.letterBox,
                  { backgroundColor: colors.tabIconActive },
                ]}
              >
                <Text style={styles.letterText}>{letter}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.tabIconActive }]}
          onPress={checkAnswer}
        >
          <Text style={styles.buttonText}>Davom etish</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: colors.cardSecondary },
            ]}
          >
            <Text
              style={{
                color: colors.textPrimary,
                fontSize: 20,
                fontWeight: "bold",
              }}
            >
              {isCorrect ? "✅ To'g'ri!" : "❌ Noto'g'ri"}
            </Text>
            {!isCorrect && (
              <Text style={{ color: colors.textSecondary, marginTop: 8 }}>
                Siz harflarni noto'g'ri joylashtirdingiz.
              </Text>
            )}
            <TouchableOpacity
              style={[
                styles.modalButton,
                { backgroundColor: colors.tabIconActive },
              ]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Yopish</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: { flex: 1, paddingHorizontal: 20 },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 20,
    textAlign: "center",
  },
  placeholderRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginBottom: 30,
  },
  placeholderBox: {
    width: 60,
    height: 60,
    borderRadius: 15,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  lettersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  letterBox: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  letterText: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  button: {
    paddingVertical: 15,
    borderRadius: 15,
    marginTop: 40,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalButton: {
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
});

export default LearningPage;
