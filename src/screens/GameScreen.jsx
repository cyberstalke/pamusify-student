import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    ScrollView,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

// --- Word Data ---
// This is where you can add more topics and words
const wordData = {
    animals: ['dog', 'cat', 'lion', 'tiger', 'bear', 'horse', 'mouse', 'bird'],
    food: ['apple', 'banana', 'pizza', 'sushi', 'bread', 'rice', 'milk', 'cheese'],
    colors: ['red', 'blue', 'green', 'yellow', 'black', 'white', 'purple', 'orange'],
};

// --- GameScreen Component ---
const GameScreen = () => {
    const [topic, setTopic] = useState('animals');
    const [words, setWords] = useState(wordData[topic]);
    const [usedWords, setUsedWords] = useState([]);
    const [messages, setMessages] = useState([]);
    const [inputWord, setInputWord] = useState('');
    const [turn, setTurn] = useState('player'); // 'player' or 'robot'
    const [timer, setTimer] = useState(30);

    // Use useEffect for the game timer
    useEffect(() => {
        // If it's no one's turn, stop the timer
        if (turn === null) {
            return;
        }

        // Set up the timer to tick down every second
        const interval = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer <= 1) {
                    // Time is up, switch the turn
                    handleTurnEnd();
                    return 30; // Reset the timer
                }
                return prevTimer - 1;
            });
        }, 1000);

        // Clean up the interval when the component unmounts or turn changes
        return () => clearInterval(interval);
    }, [turn]);

    // Use useEffect to handle the robot's turn
    useEffect(() => {
        if (turn === 'robot') {
            setTimeout(() => {
                // Simple "AI" that picks a random unused word
                const availableWords = words.filter((word) => !usedWords.includes(word));
                if (availableWords.length > 0) {
                    const robotWord = availableWords[Math.floor(Math.random() * availableWords.length)];
                    addMessage('robot', robotWord);
                    setUsedWords((prev) => [...prev, robotWord]);
                }
                setTurn('player'); // Switch back to the player
                setTimer(30); // Reset timer for the player
            }, 1500); // 1.5 second delay for the robot's "thinking"
        }
    }, [turn]);

    // Function to add a new message to the chat
    const addMessage = (sender, text) => {
        setMessages((prev) => [...prev, { sender, text }]);
    };

    // Function to handle a player's submitted word
    const handlePlayerSubmit = () => {
        const trimmedWord = inputWord.trim().toLowerCase();

        if (turn !== 'player' || trimmedWord === '') {
            return;
        }

        // Check if the word is valid
        if (words.includes(trimmedWord) && !usedWords.includes(trimmedWord)) {
            addMessage('player', trimmedWord);
            setUsedWords((prev) => [...prev, trimmedWord]);
            setInputWord(''); // Clear the input
            setTurn('robot'); // Switch to the robot's turn
            setTimer(30); // Reset timer for the robot
        } else {
            // Handle invalid word (e.g., show an alert)
            alert('Invalid word! Please try again.');
        }
    };

    // Function to handle when a turn ends (timer runs out)
    const handleTurnEnd = () => {
        if (turn === 'player') {
            alert('Time is up! The robot wins.');
        } else if (turn === 'robot') {
            alert('The robot ran out of time! You win!');
        }
        setTurn(null); // End the game
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
                        <Text style={styles.messageText}>{message.text}</Text>
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
                    editable={turn === 'player'} // Only editable on player's turn
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

// --- Styles ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    topicText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    timerText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E74C3C',
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
        backgroundColor: '#007AFF',
        alignSelf: 'flex-end',
    },
    robotMessage: {
        backgroundColor: '#E5E5EA',
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 16,
        color: '#fff',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    textInput: {
        flex: 1,
        backgroundColor: '#E5E5EA',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
    },
    sendButton: {
        backgroundColor: '#007AFF',
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    sendButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default GameScreen;