// styles/SpellingScreenStyles.js

import { StyleSheet, Dimensions } from "react-native";
import { getColors } from "../utils/colors"; // Убедитесь, что путь правильный

const screenWidth = Dimensions.get("window").width;
const colors = getColors("dark"); // Задайте здесь нужную тему

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
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
    // --- Intro Styles ---
    introContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    introHeader: {
        flexDirection: "row",
        justifyContent: "flex-start",
        width: "100%",
        paddingHorizontal: 20,
        position: "absolute",
        top: 20,
    },
    introHeaderContentLeft: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 50,
        marginLeft: 0,
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
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 10,
    },
    speakerButton: {
        backgroundColor: colors.cardSecondary,
        padding: 15,
        borderRadius: 50,
        marginTop: 20,
    },
    // --- Image Choice Styles ---
    imageChoiceContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    imageOptionsRow: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginTop: 40,
    },
    imageOptionBox: {
        width: "45%",
        aspectRatio: 1,
        borderRadius: 10,
        borderWidth: 3,
        borderColor: colors.textPrimary,
        overflow: "hidden",
    },
    imageOption: {
        width: "100%",
        height: "100%",
    },
    // --- Spelling Styles ---
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
        width: "100%",
        alignItems: "flex-start",
        marginBottom: 10,
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
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
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
        shadowOffset: { width: 0, height: 2 },
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
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    continueButtonText: {
        color: colors.textPrimary,
        fontSize: 20,
        fontWeight: "bold",
    },
    // --- Modal Styles ---
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    modalViewCorrect: {
        margin: 20,
        backgroundColor: "#2E7D32", // Green
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
        backgroundColor: "#C62828", // Red
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
        color: "white",
        fontWeight: "bold",
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        minWidth: 150,
    },
    buttonSuccess: {
        backgroundColor: "#1B5E20", // Darker Green
    },
    buttonFailure: {
        backgroundColor: "#B71C1C", // Darker Red
    },
    textStyle: {
        color: colors.textPrimary,
        fontWeight: "bold",
        textAlign: "center",
    },
});

export default styles;