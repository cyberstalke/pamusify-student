// components/DifficultyIndicator.jsx

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {getColors} from "../../utils/colors";
// Убедитесь, что путь правильный

const colors = getColors("dark"); // Предполагаем "dark" для стилей

const DifficultyIndicator = ({ difficulty }) => {
    let bars = 0;
    let color = "#fff";
    switch (difficulty) {
        case "Easy":
            bars = 1;
            color = "#28A745"; // Зеленый
            break;
        case "Medium":
            bars = 2;
            color = "#FFC107"; // Желтый
            break;
        case "Hard":
            bars = 3;
            color = "#DC3545"; // Красный
            break;
        default:
            bars = 0;
            color = "#fff";
    }

    const barArray = Array.from({ length: 3 }, (_, i) => (
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

const styles = StyleSheet.create({
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
        marginTop: 15, // Для центрирования с остальными элементами
    },
    difficultyText: {
        color: colors.textPrimary,
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 15, // Для центрирования с остальными элементами
    },
});

export default DifficultyIndicator;