// hooks/useSpellingQuiz.js

import { useState, useEffect, useRef } from "react";
import { Animated, Dimensions } from "react-native";
import * as Speech from "expo-speech";
import { quizData, shuffleArray, totalTimeLimit } from "../data/quizData"; // Обновленный импорт

const useSpellingQuiz = () => {
    const [quizzes, setQuizzes] = useState(shuffleArray([...quizData]));
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [letters, setLetters] = useState([]);
    const [answer, setAnswer] = useState([]);
    const [isCorrect, setIsCorrect] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentStep, setCurrentStep] = useState("intro");
    const [timer, setTimer] = useState(totalTimeLimit);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [modalType, setModalType] = useState(null);
    const animatedProgress = useRef(new Animated.Value(0)).current;
    const [shuffledImageOptions, setShuffledImageOptions] = useState([]);
    const [isTimeUp, setIsTimeUp] = useState(false);
    const [showTimeUpModal, setShowTimeUpModal] = useState(false);

    const currentQuiz = quizzes[currentQuizIndex] || {};

    // --- ЭФФЕКТЫ ---

    // Эффект для установки нового слова/квиза
    useEffect(() => {
        if (quizzes.length === 0) return;
        const newLetters = shuffleArray(
            currentQuiz.word.split("").map((letter, index) => ({
                value: letter,
                isUsed: false,
                // originalIndex: index, // Больше не нужно
            }))
        );
        setLetters(newLetters);
        setAnswer([]);
        setIsCorrect(null);
        setCurrentStep("intro");
        setShuffledImageOptions(shuffleArray(currentQuiz.options));
    }, [currentQuizIndex, quizzes, currentQuiz.word, currentQuiz.options]);

    // Эффект для таймера
    useEffect(() => {
        if (quizCompleted || totalTimeLimit === 0 || isTimeUp) return;
        const interval = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer <= 1) {
                    clearInterval(interval);
                    setQuizCompleted(true);
                    setIsTimeUp(true);
                    setShowTimeUpModal(true);
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [quizCompleted, isTimeUp]);

    // Эффект для анимации прогресса
    useEffect(() => {
        const progress = (currentQuizIndex + 1) / quizzes.length;
        Animated.timing(animatedProgress, {
            toValue: progress,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [currentQuizIndex, quizzes.length, animatedProgress]);

    // --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---

    // Функция для произнесения слова
    const speakWord = (word) => {
        Speech.speak(word, {
            language: "en-US",
            rate: 0.8,
        });
    };

    // Форматирование времени
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    const formattedTime = `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;

    // --- ОБРАБОТЧИКИ ---

    // Нажатие на букву в нижнем ряду
    const handleLetterPress = (letterObject, index) => {
        if (letterObject.isUsed) return;
        const newLetters = [...letters];
        newLetters[index] = { ...letterObject, isUsed: true };
        setLetters(newLetters);
        setAnswer([...answer, letterObject.value]);
    };

    // Нажатие на букву в поле ответа
    const handleAnswerPress = (letter, index) => {
        const newAnswer = [...answer];
        const removedLetter = newAnswer.splice(index, 1)[0];
        setAnswer(newAnswer);
        // Находим и разблокируем только одну соответствующую букву
        const newLetters = letters.map((item) => {
            if (item.value === removedLetter && item.isUsed) {
                // Мы возвращаем только первый встреченный элемент, который соответствует
                // и который еще не "разблокирован"
                if (!item.isUsed) return item; // Защита
                return { ...item, isUsed: false };
            }
            return item;
        });

        // Из-за того, что исходный код не отслеживал *какую* именно букву нужно разблокировать
        // (потому что в `handleAnswerPress` не передавался `originalIndex` буквы,
        // а только её `value`), мы вынуждены использовать немного более сложную логику,
        // чтобы разблокировать только одну букву с этим значением.
        let letterRestored = false;
        const restoredLetters = letters.map((item) => {
            if (!letterRestored && item.value === removedLetter && item.isUsed) {
                letterRestored = true;
                return { ...item, isUsed: false };
            }
            return item;
        });
        setLetters(restoredLetters);
    };

    // Выбор изображения
    const handleImageChoice = (chosenImage) => {
        if (chosenImage === currentQuiz.image) {
            setCurrentStep("spelling");
        } else {
            setModalMessage("틀렸습니다. 다시 시도해 보세요!");
            setModalType("failure");
            setModalVisible(true);
        }
    };

    // Переход к следующему шагу (после неудачного выбора изображения)
    const handleNextStep = () => {
        setModalVisible(false);
        setModalType(null);
    };

    // Переход к следующему квизу
    const handleNextQuiz = () => {
        setModalVisible(false);
        if (currentQuizIndex < quizzes.length - 1) {
            setCurrentQuizIndex(currentQuizIndex + 1);
        } else {
            setQuizCompleted(true);
        }
    };

    // Проверка ответа
    const checkAnswer = () => {
        const correct = answer.join("") === currentQuiz.word;
        setIsCorrect(correct);
        setModalMessage(
            correct ? "잘했어요! 정답입니다!" : "틀렸습니다. 다시 시도해 보세요."
        );
        setModalType(correct ? "success" : "failure");
        setModalVisible(true);
    };

    const isImageChoiceFailureModal =
        modalVisible && modalType === "failure" && currentStep === "image-choice";
    const isSpellingModal =
        modalVisible &&
        (modalType === "success" || modalType === "failure") &&
        currentStep === "spelling";
    const showFinalCompletionModal = quizCompleted && !showTimeUpModal && !isTimeUp;


    return {
        // Состояние
        currentQuiz,
        currentQuizIndex,
        quizzesLength: quizzes.length,
        letters,
        answer,
        isCorrect,
        modalVisible,
        currentStep,
        timer,
        quizCompleted,
        modalMessage,
        modalType,
        animatedProgress,
        shuffledImageOptions,
        isTimeUp,
        showTimeUpModal,
        formattedTime,
        totalTimeLimit,

        // Обработчики
        speakWord,
        handleLetterPress,
        handleAnswerPress,
        handleImageChoice,
        handleNextStep,
        handleNextQuiz,
        checkAnswer,
        setCurrentStep,
        setShowTimeUpModal,
        setModalVisible,

        // Вспомогательные переменные для модальных окон
        isImageChoiceFailureModal,
        isSpellingModal,
        showFinalCompletionModal,
    };
};

export default useSpellingQuiz;