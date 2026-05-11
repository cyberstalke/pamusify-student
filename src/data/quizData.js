// constants/quizData.js

const quizData = [
    {
        word: "two ball",
        translation: "공",
        image: "https://img.icons8.com/ios/452/football-white.png", // White soccer ball
        options: [
            "https://img.icons8.com/ios/452/football-white.png",
            "https://img.icons8.com/ios/452/book-white.png",
        ],
        difficulty: "Easy",
    },
    {
        word: "one cat",
        translation: "고양이",
        image: "https://img.icons8.com/ios/452/cat-white.png",
        options: [
            "https://img.icons8.com/ios/452/cat-white.png",
            "https://img.icons8.com/ios/452/dog-white.png",
        ],
        difficulty: "Easy",
    },
    {
        word: "three dog",
        translation: "개",
        image: "https://img.icons8.com/ios/452/dog-white.png",
        options: [
            "https://img.icons8.com/ios/452/dog-white.png",
            "https://img.icons8.com/ios/452/cat-white.png",
        ],
        difficulty: "Easy",
    },
    {
        word: "red car",
        translation: "자동차",
        image: "https://img.icons8.com/ios/452/car-white.png",
        options: [
            "https://img.icons8.com/ios/452/car-white.png",
            "https://img.icons8.com/ios/452/football-white.png",
        ],
        difficulty: "Easy",
    },
    {
        word: "yellow book",
        translation: "책",
        image: "https://img.icons8.com/ios/452/book-white.png",
        options: [
            "https://img.icons8.com/ios/452/book-white.png",
            "https://img.icons8.com/ios/452/dog-white.png",
        ],
        difficulty: "Easy",
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

// Общее ограничение по времени
const totalTimeLimit = 120;

export { quizData, shuffleArray, totalTimeLimit };