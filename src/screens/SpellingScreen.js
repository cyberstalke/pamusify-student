import React, {useState, useEffect, useRef} from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Modal,
    Image,
    Animated,
    Dimensions,
    SafeAreaView,
} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Feather";
import * as Speech from 'expo-speech';
import {getColors} from "../utils/colors";

// Updated quiz data with Korean translations
const quizData = [
    {
        word: "apple",
        translation: "사과",
        image: "https://img.icons8.com/?size=512&id=30840&format=png",
        options: [
            "https://img.icons8.com/?size=512&id=30840&format=png",
            "https://cdn-icons-png.flaticon.com/512/6482/6482627.png",
        ],
        difficulty: "Easy",
    },
    {
        word: "keyboard",
        translation: "키보드",
        image: "https://cdn-icons-png.flaticon.com/512/689/689392.png",
        options: [
            "https://cdn-icons-png.flaticon.com/512/689/689392.png",
            "https://icon-library.com/images/computer-mouse-icon-png/computer-mouse-icon-png-5.jpg",
        ],
        difficulty: "Medium",
    },
    {
        word: "programming",
        translation: "프로그래밍",
        image: "https://cdn-icons-png.flaticon.com/512/2621/2621040.png",
        options: [
            "https://cdn-icons-png.flaticon.com/512/2621/2621040.png",
            "https://cdn-icons-png.flaticon.com/512/10343/10343606.png",
        ],
        difficulty: "Hard",
    },
    {
        word: "developer",
        translation: "개발자",
        image: "https://cdn-icons-png.flaticon.com/512/6840/6840478.png",
        options: [
            "https://cdn-icons-png.flaticon.com/512/6840/6840478.png",
            "https://cdn-icons-png.flaticon.com/512/1034/1034960.png",
        ],
        difficulty: "Medium",
    },
    {
        word: "javascript",
        translation: "자바스크립트",
        image: "https://cdn-icons-png.flaticon.com/512/5968/5968292.png",
        options: [
            "https://cdn-icons-png.flaticon.com/512/5968/5968292.png",
            "https://cdn-icons-png.flaticon.com/512/1199/1199120.png",
        ],
        difficulty: "Hard",
    },
];

const shuffleArray = (array) => {
    // Create a copy of the array to avoid modifying the original
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const screenWidth = Dimensions.get("window").width;

const totalTimeLimit = 120;

const SpellingScreen = ({navigation}) => {
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

    useEffect(() => {
        if (quizzes.length === 0) return;
        const currentQuiz = quizzes[currentQuizIndex];
        const newLetters = shuffleArray(
            currentQuiz.word.split("").map((letter, index) => ({
                value: letter,
                isUsed: false,
                originalIndex: index,
            }))
        );
        setLetters(newLetters);
        setAnswer([]);
        setIsCorrect(null);
        setCurrentStep("intro");
        setShuffledImageOptions(shuffleArray(currentQuiz.options));
    }, [currentQuizIndex, quizzes]);

    useEffect(() => {
        if (quizCompleted || totalTimeLimit === 0) return;
        const interval = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer <= 1) {
                    clearInterval(interval);
                    if (currentQuizIndex < quizzes.length - 1) {
                        setShowTimeUpModal(true);
                    }
                    setQuizCompleted(true);
                    setIsTimeUp(true);
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [quizCompleted, currentQuizIndex, quizzes]);

    useEffect(() => {
        const progress = (currentQuizIndex + 1) / quizzes.length;
        Animated.timing(animatedProgress, {
            toValue: progress,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [currentQuizIndex, quizzes.length, animatedProgress]);

    // Function to speak the word
    const speakWord = (word) => {
        Speech.speak(word, {
            language: 'en-US',
            rate: 0.8,
        });
    };

    const handleLetterPress = (letterObject, index) => {
        if (letterObject.isUsed) return;
        const newLetters = [...letters];
        newLetters[index] = {...letterObject, isUsed: true};
        setLetters(newLetters);
        setAnswer([...answer, letterObject.value]);
    };

    const handleAnswerPress = (letter, index) => {
        const newAnswer = [...answer];
        const removedLetter = newAnswer.splice(index, 1)[0];
        setAnswer(newAnswer);
        const newLetters = letters.map(item => {
            if (item.value === removedLetter && item.isUsed) {
                return {...item, isUsed: false};
            }
            return item;
        });
        setLetters(newLetters);
    };

    const handleImageChoice = (chosenImage) => {
        const currentQuiz = quizzes[currentQuizIndex];
        if (chosenImage === currentQuiz.image) {
            setCurrentStep("spelling");
        } else {
            setModalMessage("틀렸습니다. 다시 시도해 보세요!");
            setModalType('failure');
            setModalVisible(true);
        }
    };

    const handleNextStep = () => {
        setModalVisible(false);
        setModalType(null);
    };

    const handleNextQuiz = () => {
        setModalVisible(false);
        if (currentQuizIndex < quizzes.length - 1) {
            setCurrentQuizIndex(currentQuizIndex + 1);
        } else {
            setQuizCompleted(true);
        }
    };

    const checkAnswer = () => {
        const currentQuiz = quizzes[currentQuizIndex];
        const correct = answer.join("") === currentQuiz.word;
        setIsCorrect(correct);
        setModalMessage(correct ? "잘했어요! 정답입니다!" : "틀렸습니다. 다시 시도해 보세요.");
        setModalType(correct ? 'success' : 'failure');
        setModalVisible(true);
    };

    const DifficultyIndicator = ({difficulty}) => {
        let bars = 0;
        let color = "#fff";
        switch (difficulty) {
            case "Easy":
                bars = 1;
                color = "#28A745";
                break;
            case "Medium":
                bars = 2;
                color = "#FFC107";
                break;
            case "Hard":
                bars = 3;
                color = "#DC3545";
                break;
        }

        const barArray = Array.from({length: 3}, (_, i) => (
            <View
                key={i}
                style={[
                    styles.difficultyBar,
                    {
                        backgroundColor: i < bars ? color : "rgba(255,255,255,0.3)",
                    },
                ]}
            />
        ));

        return (
            <View style={styles.difficultyIndicatorContainer}>
                <View style={styles.difficultyBars}>{barArray}</View>
                <Text style={styles.difficultyText}>{difficulty}</Text>
            </View>
        );
    };

    const currentQuiz = quizzes[currentQuizIndex];
    const minutes = Math.floor(timer / 60);
    const seconds = timer % 60;
    const formattedTime = `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;

    const renderContent = () => {
        if (currentStep === "intro") {
            return (
                <View style={styles.introContainer}>
                    <View style={styles.introHeader}>
                        <View style={styles.introHeaderContentLeft}>
                            <DifficultyIndicator difficulty={currentQuiz.difficulty}/>
                        </View>
                    </View>
                    <Image source={{uri: currentQuiz.image}} style={styles.introImage}/>
                    <Pressable onPress={() => speakWord(currentQuiz.word)} style={styles.speakerButton}>
                        <Icon name="volume-2" size={40} color="#000"/>
                    </Pressable>
                    <Text style={styles.introText}>{currentQuiz.translation} - {currentQuiz.word}</Text>
                    <Pressable
                        style={({pressed}) => [
                            styles.continueButton,
                            {opacity: pressed ? 0.7 : 1, marginTop: 40},
                        ]}
                        onPress={() => setCurrentStep("image-choice")}
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
                                <Image source={{uri: option}} style={styles.imageOption}/>
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
                            <DifficultyIndicator difficulty={currentQuiz.difficulty}/>
                        </View>
                        <Text style={styles.headerText}>{currentQuiz.translation}</Text>
                        <Pressable onPress={() => speakWord(currentQuiz.word)} style={styles.speakerButtonSmall}>
                            <Icon name="volume-2" size={30} color="#fff"/>
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
                                {Array.from({length: currentQuiz.word.length - answer.length}).map(
                                    (_, index) => (
                                        <View key={`empty-${index}`} style={styles.emptyLetterBox}/>
                                    )
                                )}
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
                            style={({pressed}) => [
                                styles.continueButton,
                                {opacity: pressed ? 0.7 : 1},
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

    const isImageChoiceFailureModal = modalVisible && modalType === 'failure' && currentStep === 'image-choice';
    const isSpellingModal = modalVisible && (modalType === 'success' || modalType === 'failure') && currentStep === 'spelling';

    const showFinalCompletionModal = quizCompleted && !showTimeUpModal;

    return (
        <LinearGradient
            colors={["#2c3e50", "#34495e"]}
            style={styles.linearGradient}
        >
            <SafeAreaView style={styles.container}>
                <View style={styles.topBar}>
                    <Pressable onPress={() => navigation.goBack()} style={styles.iconButton}>
                        <Icon name="x" size={30} color="#fff"/>
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
                            <Icon name="clock" size={24} color="#fff" style={{marginRight: 5}}/>
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
                    onRequestClose={() => setShowTimeUpModal(false)}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalViewIncorrect}>
                            <Image
                                source={{uri: "https://cdn-icons-png.flaticon.com/512/6659/6659895.png"}}
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
                                source={{uri: "https://icons.veryicon.com/png/o/miscellaneous/8atour/success-35.png"}}
                                style={styles.modalImage}
                            />
                            <Text style={styles.modalText}>퀴즈 완료!</Text>
                            <Pressable style={[styles.button, styles.buttonSuccess]}
                                       onPress={() => navigation.goBack()}>
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
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalViewIncorrect}>
                            <Image
                                source={{uri: "https://cdn-icons-png.flaticon.com/512/6659/6659895.png"}}
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
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={isCorrect ? styles.modalViewCorrect : styles.modalViewIncorrect}>
                            <Image
                                source={{
                                    uri: isCorrect
                                        ? "https://icons.veryicon.com/png/o/miscellaneous/8atour/success-35.png"
                                        : "https://cdn-icons-png.flaticon.com/512/6659/6659895.png"
                                }}
                                style={styles.modalImage}
                            />
                            <Text style={styles.modalText}>
                                {modalMessage}
                            </Text>
                            <Pressable
                                style={[styles.button, isCorrect ? styles.buttonSuccess : styles.buttonFailure]}
                                onPress={handleNextQuiz}
                            >
                                <Text style={styles.textStyle}>계속</Text>
                            </Pressable>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </LinearGradient>
    );
};

const colors = getColors("white");

const styles = StyleSheet.create({
    linearGradient: {
        flex: 1,
        paddingTop: 20,
        // The background colors from the function are already in the gradient
    },
    container: {
        flex: 1,
        justifyContent: "space-between",
        // Using `colors.background` for a solid background
        backgroundColor: colors.background,
    },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    iconButton: {
        padding: 5,
    },
    progressBarContainer: {
        flex: 1,
        height: 10,
        backgroundColor: colors.progressLine,
        borderRadius: 5,
        marginHorizontal: 15,
    },
    progressBar: {
        height: "100%",
        backgroundColor: colors.tabIconActive,
        borderRadius: 5,
    },
    timerContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    timerText: {
        color: colors.textPrimary,
        fontSize: 18,
    },
    introContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    introHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '100%',
        paddingHorizontal: 20,
        position: 'absolute',
        top: 20,
    },
    introHeaderContent: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 50
    },
    introHeaderContentLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 50,
        marginLeft: 0,
    },
    introHeaderText: {
        color: colors.textPrimary,
        fontSize: 18,
        marginLeft: 5,
        fontWeight: 'bold',
    },
    introImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
    },
    introText: {
        color: colors.textPrimary,
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 10,
    },
    speakerButton: {
        backgroundColor: colors.cardSecondary,
        padding: 15,
        borderRadius: 50,
        marginTop: 20,
    },
    imageChoiceContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    imageOptionsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 40,
    },
    imageOptionBox: {
        width: '45%',
        aspectRatio: 1,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: colors.textPrimary,
        overflow: 'hidden',
    },
    imageOption: {
        width: '100%',
        height: '100%',
    },
    mainContent: {
        flex: 1,
        paddingHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        color: colors.textPrimary,
        marginBottom: 20,
        textAlign: "center",
    },
    difficultyContainerLeft: {
        width: '100%',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    difficultyIndicatorContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    difficultyBars: {
        flexDirection: "row",
        marginRight: 10,
    },
    difficultyBar: {
        width: 8,
        height: 25,
        borderRadius: 4,
        marginHorizontal: 2,
        marginTop: 15,
    },
    difficultyText: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 15,
    },
    speakerButtonSmall: {
        marginBottom: 20,
        padding: 10,
    },
    answerRowContainer: {
        marginBottom: 20,
        alignItems: "center",
    },
    answerGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    answerLetterBox: {
        width: 40,
        height: 40,
        backgroundColor: colors.cardSecondary,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        margin: 4,
        borderWidth: 1,
        borderColor: colors.textPrimary,
    },
    emptyLetterBox: {
        width: 40,
        height: 40,
        backgroundColor: "transparent",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.textSecondary,
        margin: 4,
    },
    hint: {
        textAlign: "center",
        color: colors.textSecondary,
        fontSize: 16,
        marginBottom: 20,
    },
    lettersRow: {
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
        paddingHorizontal: 10,
        marginTop: "auto",
    },
    letterBox: {
        width: screenWidth * 0.13,
        aspectRatio: 1,
        backgroundColor: colors.cardBackground,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        margin: 5,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    letterBoxUsed: {
        backgroundColor: "rgba(0, 199, 190, 0.5)",
        borderColor: colors.textPrimary,
    },
    letterText: {
        color: colors.textPrimary,
        fontSize: 26,
        fontWeight: "bold",
    },
    bottomBar: {
        padding: 20,
        alignItems: "center",
    },
    continueButton: {
        width: "100%",
        backgroundColor: colors.cardBackground,
        padding: 18,
        borderRadius: 30,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    continueButtonText: {
        color: colors.textPrimary,
        fontSize: 20,
        fontWeight: "bold",
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    modalViewCorrect: {
        margin: 20,
        backgroundColor: "#2E7D32", // This can be a theme color too
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalViewIncorrect: {
        margin: 20,
        backgroundColor: "#C62828", // This can be a theme color too
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalImage: {
        width: 80,
        height: 80,
        marginBottom: 15,
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 18,
        color: colors.textPrimary,
        fontWeight: "bold",
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        minWidth: 150,
    },
    buttonSuccess: {
        backgroundColor: "#1B5E20", // This can be a theme color too
    },
    buttonFailure: {
        backgroundColor: "#B71C1C", // This can be a theme color too
    },
    textStyle: {
        color: colors.textPrimary,
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default SpellingScreen;