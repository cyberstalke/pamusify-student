import React, {useState, useEffect} from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {getColors} from "../utils/colors"; // Import useNavigation hook

const wordData = {
    animals: ['dog', 'cat', 'lion', 'tiger', 'bear', 'horse', 'mouse', 'bird', "cow", "sheep", "snake"],
    food: ['apple', 'banana', 'pizza', 'sushi', 'bread', 'rice', 'milk', 'cheese'],
    colours: ['red', 'blue', 'green', 'yellow', 'black', 'white', 'purple', 'orange'],
};

const GameScreen = () => {
    const navigation = useNavigation(); // Get the navigation object

    // 1. Randomly select a topic on game start
    const topics = Object.keys(wordData);
    const [topic, setTopic] = useState(topics[Math.floor(Math.random() * topics.length)]);

    const [words, setWords] = useState([]);
    const [usedWords, setUsedWords] = useState([]);
    const [messages, setMessages] = useState([]);
    const [inputWord, setInputWord] = useState('');
    const [turn, setTurn] = useState('player'); // 'player' or 'robot'
    const [timer, setTimer] = useState(30);

    // This useEffect will set the words list based on the randomly chosen topic
    useEffect(() => {
        setWords(wordData[topic]);
    }, [topic]);

    // Use useEffect for the game timer
    useEffect(() => {
        if (turn === null) {
            return;
        }

        const interval = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer <= 1) {
                    handleTurnEnd();
                    return 30;
                }
                return prevTimer - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [turn]);

    // Use useEffect to handle the robot's turn
    useEffect(() => {
        if (turn === 'robot') {
            setTimeout(() => {
                const availableWords = words.filter((word) => !usedWords.includes(word));
                if (availableWords.length > 0) {
                    const robotWord = availableWords[Math.floor(Math.random() * availableWords.length)];
                    addMessage('robot', robotWord);
                    setUsedWords((prev) => [...prev, robotWord]);
                } else {
                    // No more words left, player wins
                    handleEndGame('win');
                    return;
                }
                setTurn('player');
                setTimer(30);
            }, 1500);
        }
    }, [turn, words, usedWords]);

    // Function to add a new message to the chat
    const addMessage = (sender, text) => {
        setMessages((prev) => [...prev, {sender, text}]);
    };

    // Function to handle a player's submitted word
    const handlePlayerSubmit = () => {
        const trimmedWord = inputWord.trim().toLowerCase();

        if (turn !== 'player' || trimmedWord === '') {
            return;
        }

        // 2. Check if the word is already used
        if (usedWords.includes(trimmedWord)) {
            Alert.alert('Oops!', 'This word has already been used. Try another one.');
            setInputWord('');
            return;
        }

        // Check if the word is valid (exists in the topic list)
        if (words.includes(trimmedWord)) {
            addMessage('player', trimmedWord);
            setUsedWords((prev) => [...prev, trimmedWord]);
            setInputWord('');

            // Check if the game should end
            if (usedWords.length + 1 === words.length) {
                handleEndGame('win');
            } else {
                setTurn('robot');
                setTimer(30);
            }
        } else {
            Alert.alert('Invalid word!', `"${trimmedWord}" is not in the list for this topic.`);
        }
    };

    // Function to handle when a turn ends (timer runs out)
    const handleTurnEnd = () => {
        const winner = turn === 'player' ? 'robot' : 'player';
        handleEndGame(winner === 'player' ? 'win' : 'lose');
    };

    // 3. Central function to handle the end of the game
    const handleEndGame = (outcome) => {
        let title = '';
        let message = '';

        if (outcome === 'win') {
            title = 'Congratulations! 🎉';
            message = 'You won the game!';
        } else {
            title = 'Game Over! 🤖';
            message = 'The robot won this time.';
        }

        Alert.alert(
            title,
            message,
            [
                {
                    text: 'Play Again',
                    onPress: () => {
                        // Reset the state to start a new game
                        const newTopic = topics[Math.floor(Math.random() * topics.length)];
                        setTopic(newTopic);
                        setWords(wordData[newTopic]);
                        setUsedWords([]);
                        setMessages([]);
                        setInputWord('');
                        setTurn('player');
                        setTimer(30);
                    },
                },
                {
                    text: 'Go Back',
                    onPress: () => navigation.goBack(), // Go back to the previous screen
                    style: 'cancel',
                },
            ]
        );
        setTurn(null); // Stop the game
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={styles.header}>
                <Text style={styles.topicText}>Topic: {topic.toUpperCase()}</Text>
                <Text style={styles.timerText}>Time: {timer}s</Text>
            </View>

            <ScrollView style={styles.chatContainer}>
                {messages.map((message, index) => (
                    <View
                        key={index}
                        style={[
                            styles.messageBubble,
                            message.sender === 'player' ? styles.playerMessage : styles.robotMessage,
                        ]}
                    >
                        <Text style={message.sender === 'player' ? styles.playerMessageText : styles.robotMessageText}>
                            {message.text}
                        </Text>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Type your word..."
                    value={inputWord}
                    onChangeText={setInputWord}
                    onSubmitEditing={handlePlayerSubmit}
                    editable={turn === 'player'}
                />
                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={handlePlayerSubmit}
                    disabled={turn !== 'player'}
                >
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
};

const colors = getColors("white");

// --- Styles ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // Заменить на переменную из colors
        backgroundColor: colors.background,
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        // Заменить на переменную из colors
        backgroundColor: colors.cardSecondary,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    topicText: {
        fontSize: 18,
        fontWeight: 'bold',
        // Заменить на переменную из colors
        color: colors.textPrimary,
    },
    timerText: {
        fontSize: 18,
        fontWeight: 'bold',
        // Заменить на переменную из colors
        color: colors.purple, // Или другой цвет, который вам больше нравится для таймера
    },
    chatContainer: {
        flex: 1,
        padding: 10,
    },
    messageBubble: {
        padding: 10,
        borderRadius: 15,
        marginVertical: 5,
        maxWidth: '70%',
    },
    playerMessage: {
        // Заменить на переменную из colors
        backgroundColor: colors.tabIconActive,
        alignSelf: 'flex-end',
    },
    robotMessage: {
        // Заменить на переменную из colors
        backgroundColor: colors.cardBackground,
        alignSelf: 'flex-start',
    },
    playerMessageText: {
        fontSize: 16,
        // Заменить на переменную из colors
        color: colors.textPrimary,
    },
    robotMessageText: {
        fontSize: 16,
        // Заменить на переменную из colors
        color: colors.textPrimary,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        // Заменить на переменную из colors
        backgroundColor: colors.cardSecondary,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    textInput: {
        flex: 1,
        // Заменить на переменную из colors
        backgroundColor: colors.progressLine,
        // Заменить на переменную из colors
        color: colors.textPrimary,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
    },
    sendButton: {
        // Заменить на переменную из colors
        backgroundColor: colors.tabIconActive,
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    sendButtonText: {
        // Заменить на переменную из colors
        color: colors.textPrimary,
        fontWeight: 'bold',
    },
});

export default GameScreen;