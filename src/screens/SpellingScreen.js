// screens/SpellingScreen.jsx

import React from "react";
import {
    View,
    Text,
    Pressable,
    Modal,
    Image,
    Animated,
    SafeAreaView,
    useColorScheme,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
// Импорт вынесенных модулей
import useSpellingQuiz from "../hooks/useSpellingQuiz";
import DifficultyIndicator from "../components/Spelling/DifficultyIndicator";
import styles from "../styles/SpellingScreenStyles";
import { getColors } from "../utils/colors"; // Предполагается, что getColors все еще нужен

const SpellingScreen = ({ navigation }) => {
    // Используем хук для всей логики
    const {
        // Состояние
        currentQuiz,
        quizzesLength,
        letters,
        answer,
        isCorrect,
        modalVisible,
        currentStep,
        animatedProgress,
        shuffledImageOptions,
        isTimeUp,
        showTimeUpModal,
        formattedTime,
        totalTimeLimit,
        modalMessage,

        // Обработчики
        speakWord,
        handleLetterPress,
        handleAnswerPress,
        handleImageChoice,
        handleNextStep,
        handleNextQuiz,
        checkAnswer,

        // Вспомогательные переменные для модальных окон
        isImageChoiceFailureModal,
        isSpellingModal,
        showFinalCompletionModal,
    } = useSpellingQuiz();

    const colors = getColors("dark"); // Получение цветов для локального использования

    // Рендеринг в зависимости от текущего шага (intro, image-choice, spelling)
    const renderContent = () => {
        if (!currentQuiz || !currentQuiz.word) {
            return <View style={styles.container}><Text style={styles.headerText}>Загрузка...</Text></View>;
        }

        if (currentStep === "intro") {
            return (
                <View style={styles.introContainer}>
                    <View style={styles.introHeader}>
                        <View style={styles.introHeaderContentLeft}>
                            <DifficultyIndicator difficulty={currentQuiz.difficulty} />
                        </View>
                    </View>
                    <Image
                        source={{ uri: currentQuiz.image }}
                        style={styles.introImage}
                    />
                    <Pressable
                        onPress={() => speakWord(currentQuiz.word)}
                        style={styles.speakerButton}
                    >
                        <Icon name="volume-2" size={40} color="#000" />
                    </Pressable>
                    <Text style={styles.introText}>
                        {currentQuiz.translation} - {currentQuiz.word}
                    </Text>
                    <Pressable
                        style={({ pressed }) => [
                            styles.continueButton,
                            { opacity: pressed ? 0.7 : 1, marginTop: 40 },
                        ]}
                        onPress={() => handleNextStep("image-choice")} // Используем handleNextStep для перехода на image-choice
                    >
                        <Text style={styles.continueButtonText}>계속하기</Text>
                    </Pressable>
                </View>
            );
        }

        if (currentStep === "image-choice") {
            return (
                <View style={styles.imageChoiceContainer}>
                    <Text style={styles.headerText}>단어에 맞는 이미지를 찾으세요</Text>
                    <View style={styles.imageOptionsRow}>
                        {shuffledImageOptions.map((option, index) => (
                            <Pressable
                                key={index}
                                onPress={() => handleImageChoice(option)}
                                style={styles.imageOptionBox}
                            >
                                <Image source={{ uri: option }} style={styles.imageOption} />
                            </Pressable>
                        ))}
                    </View>
                </View>
            );
        }

        if (currentStep === "spelling") {
            return (
                <>
                    <View style={styles.mainContent}>
                        <View style={styles.difficultyContainerLeft}>
                            <DifficultyIndicator difficulty={currentQuiz.difficulty} />
                        </View>
                        <Text style={styles.headerText}>{currentQuiz.translation}</Text>
                        <Pressable
                            onPress={() => speakWord(currentQuiz.word)}
                            style={styles.speakerButtonSmall}
                        >
                            <Icon name="volume-2" size={30} color="#fff" />
                        </Pressable>
                        <View style={styles.answerRowContainer}>
                            <View style={styles.answerGrid}>
                                {answer.map((letter, index) => (
                                    <Pressable
                                        key={index}
                                        style={styles.answerLetterBox}
                                        onPress={() => handleAnswerPress(letter, index)}
                                    >
                                        <Text style={styles.letterText}>{letter}</Text>
                                    </Pressable>
                                ))}
                                {Array.from({
                                    length: currentQuiz.word.length - answer.length,
                                }).map((_, index) => (
                                    <View key={`empty-${index}`} style={styles.emptyLetterBox} />
                                ))}
                            </View>
                        </View>
                        <Text style={styles.hint}>올바른 순서로 글자를 누르세요</Text>
                        <View style={styles.lettersRow}>
                            {letters.map((letterObject, index) => (
                                <Pressable
                                    key={index}
                                    style={[
                                        styles.letterBox,
                                        letterObject.isUsed && styles.letterBoxUsed,
                                    ]}
                                    onPress={() => handleLetterPress(letterObject, index)}
                                    disabled={letterObject.isUsed}
                                >
                                    <Text style={styles.letterText}>{letterObject.value}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                    <View style={styles.bottomBar}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.continueButton,
                                { opacity: pressed ? 0.7 : 1 },
                            ]}
                            onPress={checkAnswer}
                            disabled={answer.length !== currentQuiz.word.length}
                        >
                            <Text style={styles.continueButtonText}>확인</Text>
                        </Pressable>
                    </View>
                </>
            );
        }
    };

    return (
        <SafeAreaView style={{ ...styles.container, backgroundColor: colors.background }}>
            <View style={styles.topBar}>
                <Pressable
                    onPress={() => navigation.goBack()}
                    style={styles.iconButton}
                >
                    <Icon name="x" size={30} color="#fff" />
                </Pressable>
                <View style={styles.progressBarContainer}>
                    <Animated.View
                        style={[
                            styles.progressBar,
                            {
                                backgroundColor: isTimeUp ? "#DC3545" : "#2ecc71",
                                width: animatedProgress.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ["0%", "100%"],
                                }),
                            },
                        ]}
                    />
                </View>
                {totalTimeLimit !== 0 && (
                    <View style={styles.timerContainer}>
                        <Icon
                            name="clock"
                            size={24}
                            color="#fff"
                            style={{ marginRight: 5 }}
                        />
                        <Text style={styles.timerText}>{formattedTime}</Text>
                    </View>
                )}
            </View>

            {renderContent()}

            {/* "Time's Up" Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showTimeUpModal}
                onRequestClose={() => navigation.goBack()}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalViewIncorrect}>
                        <Image
                            source={{
                                uri: "https://cdn-icons-png.flaticon.com/512/6659/6659895.png",
                            }}
                            style={styles.modalImage}
                        />
                        <Text style={styles.modalText}>시간 초과! 다시 시도해 보세요.</Text>
                        <Pressable
                            style={[styles.button, styles.buttonFailure]}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.textStyle}>메인 화면으로</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* Quiz Completed Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showFinalCompletionModal}
                onRequestClose={() => navigation.goBack()}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalViewCorrect}>
                        <Image
                            source={{
                                uri: "https://icons.veryicon.com/png/o/miscellaneous/8atour/success-35.png",
                            }}
                            style={styles.modalImage}
                        />
                        <Text style={styles.modalText}>퀴즈 완료!</Text>
                        <Pressable
                            style={[styles.button, styles.buttonSuccess]}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.textStyle}>메인 화면으로</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* Image Choice Failure Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isImageChoiceFailureModal}
                onRequestClose={() => handleNextStep()} // Используем обработчик из хука
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalViewIncorrect}>
                        <Image
                            source={{
                                uri: "https://cdn-icons-png.flaticon.com/512/6659/6659895.png",
                            }}
                            style={styles.modalImage}
                        />
                        <Text style={styles.modalText}>{modalMessage}</Text>
                        <Pressable
                            style={[styles.button, styles.buttonFailure]}
                            onPress={handleNextStep}
                        >
                            <Text style={styles.textStyle}>다시 시도</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            {/* Spelling Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={isSpellingModal}
                onRequestClose={() => handleNextQuiz()} // Используем обработчик из хука
            >
                <View style={styles.centeredView}>
                    <View
                        style={
                            isCorrect ? styles.modalViewCorrect : styles.modalViewIncorrect
                        }
                    >
                        <Image
                            source={{
                                uri: isCorrect
                                    ? "https://icons.veryicon.com/png/o/miscellaneous/8atour/success-35.png"
                                    : "https://cdn-icons-png.flaticon.com/512/6659/6659895.png",
                            }}
                            style={styles.modalImage}
                        />
                        <Text style={styles.modalText}>{modalMessage}</Text>
                        <Pressable
                            style={[
                                styles.button,
                                isCorrect ? styles.buttonSuccess : styles.buttonFailure,
                            ]}
                            onPress={handleNextQuiz}
                        >
                            <Text style={styles.textStyle}>계속</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default SpellingScreen;