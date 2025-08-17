import React, {useState, useEffect, useRef} from "react";
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Modal,
    Animated,
    SafeAreaView,
} from "react-native";
// I removed LinearGradient as we are now using a solid background color from your theme.
import Icon from "react-native-vector-icons/Feather";
import {getColors} from "../utils/colors";


// Quiz data remains the same
const quizData = [
    {
        question: "What does 'API' stand for?",
        options: [
            "Application Programming Interface",
            "Automated Program Interaction",
            "Application Process Integration",
        ],
        correctAnswer: "Application Programming Interface",
        difficulty: "Medium",
    },
    {
        question: "Which of these is a JavaScript framework?",
        options: ["Django", "React", "Laravel"],
        correctAnswer: "React",
        difficulty: "Easy",
    },
    {
        question: "What is the purpose of CSS?",
        options: [
            "To structure a web page",
            "To style a web page",
            "To program the logic of a web page",
        ],
        correctAnswer: "To style a web page",
        difficulty: "Easy",
    },
    {
        question: "Which company developed the Go programming language?",
        options: ["Apple", "Facebook", "Google"],
        correctAnswer: "Google",
        difficulty: "Hard",
    },
    {
        question: "What is 'git' used for?",
        options: [
            "Writing code",
            "Version control",
            "Database management"
        ],
        correctAnswer: "Version control",
        difficulty: "Medium",
    },
];

const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

const totalTimeLimit = 120;

const MultipleChoiceScreen = ({navigation}) => {
    const [quizzes, setQuizzes] = useState(shuffleArray([...quizData]));
    const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [showTimeUpModal, setShowTimeUpModal] = useState(false);
    const [timer, setTimer] = useState(totalTimeLimit);
    const animatedProgress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        setSelectedOption(null);
        setIsCorrect(null);
    }, [currentQuizIndex]);

    useEffect(() => {
        if (quizCompleted || totalTimeLimit === 0) return;
        const interval = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer <= 1) {
                    clearInterval(interval);
                    setShowTimeUpModal(true);
                    setQuizCompleted(true);
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [quizCompleted]);

    useEffect(() => {
        const progress = (currentQuizIndex + 1) / quizzes.length;
        Animated.timing(animatedProgress, {
            toValue: progress,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [currentQuizIndex, quizzes.length, animatedProgress]);

    const handleOptionPress = (option) => {
        setSelectedOption(option);
    };

    const checkAnswer = () => {
        const currentQuiz = quizzes[currentQuizIndex];
        const correct = selectedOption === currentQuiz.correctAnswer;
        setIsCorrect(correct);
        setModalMessage(correct ? "Correct! Well done!" : "Incorrect. Keep trying!");
        setModalVisible(true);
    };

    const handleNextQuiz = () => {
        setModalVisible(false);
        if (currentQuizIndex < quizzes.length - 1) {
            setCurrentQuizIndex(currentQuizIndex + 1);
        } else {
            setQuizCompleted(true);
        }
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
                style={[styles.difficultyBar, {backgroundColor: i < bars ? color : "rgba(255,255,255,0.3)"}]}
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

    return (
        // Using SafeAreaView with the new background color
        <SafeAreaView style={styles.container}>
            <View style={styles.topBar}>
                <Pressable onPress={() => navigation.goBack()} style={styles.iconButton}>
                    <Icon name="x" size={30} color={colors.textPrimary}/>
                </Pressable>
                <View style={styles.progressBarContainer}>
                    <Animated.View
                        style={[
                            styles.progressBar,
                            {
                                width: animatedProgress.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: ["0%", "100%"],
                                }),
                            },
                        ]}
                    />
                </View>
                {totalTimeLimit > 0 && (
                    <View style={styles.timerContainer}>
                        <Icon name="clock" size={24} color={colors.textPrimary} style={{marginRight: 5}}/>
                        <Text style={styles.timerText}>{formattedTime}</Text>
                    </View>
                )}
            </View>

            {!quizCompleted && (
                <View style={styles.mainContent}>
                    <View style={styles.difficultyContainerLeft}>
                        <DifficultyIndicator difficulty={currentQuiz.difficulty}/>
                    </View>
                    <Text style={styles.questionText}>{currentQuiz.question}</Text>
                    <View style={styles.optionsContainer}>
                        {currentQuiz.options.map((option, index) => (
                            <Pressable
                                key={index}
                                style={[
                                    styles.optionButton,
                                    selectedOption === option && styles.selectedOptionButton,
                                ]}
                                onPress={() => handleOptionPress(option)}
                            >
                                <Text style={styles.optionButtonText}>{option}</Text>
                            </Pressable>
                        ))}
                    </View>
                </View>
            )}

            {!quizCompleted && (
                <View style={styles.bottomBar}>
                    <Pressable
                        style={({pressed}) => [
                            styles.continueButton,
                            {opacity: pressed || !selectedOption ? 0.7 : 1},
                        ]}
                        onPress={checkAnswer}
                        disabled={!selectedOption}
                    >
                        <Text style={styles.continueButtonText}>Check</Text>
                    </Pressable>
                </View>
            )}

            {/* Modals remain functionally the same, but text color now uses the theme */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={isCorrect ? styles.modalViewCorrect : styles.modalViewIncorrect}>
                        <Text style={styles.modalText}>{modalMessage}</Text>
                        <Pressable
                            style={[styles.button, isCorrect ? styles.buttonSuccess : styles.buttonFailure]}
                            onPress={handleNextQuiz}
                        >
                            <Text style={styles.textStyle}>Continue</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <Modal animationType="fade" transparent={true} visible={showTimeUpModal}>
                <View style={styles.centeredView}>
                    <View style={styles.modalViewIncorrect}>
                        <Text style={styles.modalText}>Time's Up! Try again.</Text>
                        <Pressable
                            style={[styles.button, styles.buttonFailure]}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.textStyle}>Go to Main Menu</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <Modal animationType="fade" transparent={true} visible={quizCompleted && !showTimeUpModal && !modalVisible}>
                <View style={styles.centeredView}>
                    <View style={styles.modalViewCorrect}>
                        <Text style={styles.modalText}>Quiz Completed!</Text>
                        <Pressable style={[styles.button, styles.buttonSuccess]} onPress={() => navigation.goBack()}>
                            <Text style={styles.textStyle}>Go to Main Menu</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

// Getting the colors for the dark theme
const colors = getColors("dark");

// Styles updated with your color palette
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: colors.background, // Using theme background
    },
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 20, // Adjusted padding
        paddingBottom: 10,
    },
    iconButton: {
        padding: 5,
    },
    progressBarContainer: {
        flex: 1,
        height: 10,
        backgroundColor: colors.progressLine, // Using theme color
        borderRadius: 5,
        marginHorizontal: 15,
    },
    progressBar: {
        height: "100%",
        borderRadius: 5,
        backgroundColor: colors.tabIconActive, // Using theme accent color
    },
    timerContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    timerText: {
        color: colors.textPrimary, // Using theme text color
        fontSize: 18,
    },
    mainContent: {
        flex: 1,
        paddingHorizontal: 20,
        justifyContent: "center",
        paddingBottom: 60, // Pushed content up a bit
    },
    difficultyContainerLeft: {
        position: 'absolute',
        top: 0,
        left: 20,
        alignItems: 'flex-start',
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
    },
    difficultyText: {
        color: colors.textPrimary, // Using theme text color
        fontSize: 16,
        fontWeight: "bold",
    },
    questionText: {
        fontSize: 26, // Slightly smaller for better fit
        fontWeight: "bold",
        color: colors.textPrimary, // Using theme text color
        textAlign: "center",
        marginBottom: 50,
        lineHeight: 34,
    },
    optionsContainer: {
        alignItems: "center",
        width: '100%',
    },
    optionButton: {
        width: "100%",
        backgroundColor: colors.cardSecondary, // Using theme card color
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 15,
        marginBottom: 15,
        borderWidth: 2,
        borderColor: "transparent",
    },
    selectedOptionButton: {
        borderColor: colors.purple, // Using theme purple for highlight
        backgroundColor: 'rgba(142, 151, 253, 0.15)', // A subtle background tint
    },
    optionButtonText: {
        color: colors.textPrimary, // Using theme text color
        fontSize: 17,
        textAlign: 'center',
        fontWeight: '500',
    },
    bottomBar: {
        padding: 20,
        alignItems: "center",
    },
    continueButton: {
        width: "100%",
        backgroundColor: colors.cardBackground, // Using vibrant theme color for main action
        padding: 18,
        borderRadius: 30,
        alignItems: "center",
    },
    continueButtonText: {
        color: '#0d1f31', // Dark text for the bright button
        fontSize: 20,
        fontWeight: "bold",
    },
    // Modal Styles
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
    },
    modalViewCorrect: {
        margin: 20,
        backgroundColor: "#2E7D32", // Keeping semantic color for success
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalViewIncorrect: {
        margin: 20,
        backgroundColor: "#C62828", // Keeping semantic color for failure
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 20,
        color: colors.textPrimary, // Using theme text color
        fontWeight: "bold",
    },
    button: {
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 30,
    },
    buttonSuccess: {
        backgroundColor: "#1B5E20",
    },
    buttonFailure: {
        backgroundColor: "#B71C1C",
    },
    textStyle: {
        color: colors.textPrimary, // Using theme text color
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 16,
    },
});

export default MultipleChoiceScreen;