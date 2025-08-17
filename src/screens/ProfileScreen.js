import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Platform,
    useColorScheme, SafeAreaView,
} from "react-native";
import {StatusBar} from "expo-status-bar";
import {MaterialCommunityIcons} from "@expo/vector-icons";

// Импортируем хук, который мы создали в TimeProvider.js
import {useTime} from "../context/TimeProvider";
import {getColors} from "../utils/colors";

const {width} = Dimensions.get("window");

// Компонент для значков достижений
const AchievementBadge = ({days}) => (
    <View style={styles.badgeContainer}>
        <Text style={styles.badgeText}>{days}</Text>
        <Text style={styles.badgeSubText}>kunlik seriya</Text>
    </View>
);

// Компонент для карточки курса
const CourseCard = ({courseName}) => (
    <View style={styles.courseCard}>
        {/* Здесь будет аватарка, можно добавить свою */}
        <View style={styles.courseAvatar}/>
        <Text style={styles.courseText}>{courseName}</Text>
    </View>
);

// Главный компонент экрана профиля
const ProfileScreen = () => {
    // Получаем общее время из нашего контекста
    const {totalTimeSpent} = useTime();
    const schem = useColorScheme();
    const colors = getColors(schem);
    const isDark = schem === "dark";

    const totalSeconds = Math.floor(totalTimeSpent / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Нижняя навигационная панель
    const Footer = () => (
        <View style={styles.footer}>
            <TouchableOpacity style={styles.footerButton}>
                <MaterialCommunityIcons name="home-outline" size={24} color="#7F7F7F"/>
                <Text style={styles.footerText}>Asosiy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerButton}>
                <MaterialCommunityIcons
                    name="book-open-page-variant-outline"
                    size={24}
                    color="#7F7F7F"
                />
                <Text style={styles.footerText}>Kurslar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerButton}>
                <MaterialCommunityIcons
                    name="star-shooting-outline"
                    size={24}
                    color="#7F7F7F"
                />
                <Text style={styles.footerText}>O'yinlar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.footerButton}>
                <MaterialCommunityIcons
                    name="trophy-outline"
                    size={24}
                    color="#7F7F7F"
                />
                <Text style={styles.footerText}>Liderbord</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.footerButton, styles.activeFooterButton]}
            >
                <MaterialCommunityIcons name="account" size={24} color="#00C4FF"/>
                <Text style={[styles.footerText, styles.activeFooterText]}>Profil</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                style={{
                    ...(isDark ? "light" : "dark"),
                    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
                }}
            />
            <ScrollView>
                {/* Заголовок */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Profil</Text>
                    <TouchableOpacity>
                        <MaterialCommunityIcons name="cog" size={24} color="#fff"/>
                    </TouchableOpacity>
                </View>

                {/* Информация о пользователе */}
                <View style={styles.profileCard}>
                    <View style={styles.profileAvatarContainer}>
                        <View style={styles.profileAvatar}>
                            <Text style={styles.profileInitials}>AA</Text>
                        </View>
                        <TouchableOpacity style={styles.editIcon}>
                            <MaterialCommunityIcons
                                name="pencil-outline"
                                size={16}
                                color="#000"
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>Abdulaziz Abduvaliyev</Text>
                        <Text style={styles.profileJoinDate}>Qo'shilgan: Avgust 2025</Text>
                    </View>
                </View>

                {/* Достижения */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Yutuqlar</Text>
                        <TouchableOpacity>
                            <Text style={styles.sectionLink}>Barchasi</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.badgesScrollView}
                    >
                        <AchievementBadge days="7"/>
                        <AchievementBadge days="30"/>
                        <AchievementBadge days="90"/>
                        <AchievementBadge days="365"/>
                    </ScrollView>
                </View>

                {/* Активность */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Faollik</Text>
                        <TouchableOpacity>
                            <Text style={styles.sectionLink}>Barchasi</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.activityCard}>
                        <View style={styles.activityInfo}>
                            <MaterialCommunityIcons
                                name="timer-sand"
                                size={30}
                                color="#00C4FF"
                            />
                            <View style={styles.activityTextContainer}>
                                <Text style={styles.activityTitle}>Sarflangan</Text>
                                <Text
                                    style={styles.activityTime}
                                >{`${hours}s : ${minutes}d`}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.activityDropdown}>
                            <Text style={styles.activityDropdownText}>Haftalik</Text>
                            <MaterialCommunityIcons
                                name="chevron-down"
                                size={20}
                                color="#fff"
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Курсы */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Kurslarim</Text>
                    </View>
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.coursesScrollView}
                    >
                        <CourseCard courseName="Super Start: A2"/>
                    </ScrollView>
                </View>
            </ScrollView>

            {/* Нижняя навигация */}
            <Footer/>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0A0E1A",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingTop: 50,
        paddingHorizontal: 15,
        backgroundColor: "#0F1321",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        paddingBottom: 20,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
    },
    profileCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 15,
        backgroundColor: "#1E2333",
        borderRadius: 15,
        margin: 15,
    },
    profileAvatarContainer: {
        position: "relative",
    },
    profileAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: "#D100F7",
        justifyContent: "center",
        alignItems: "center",
    },
    profileInitials: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
    },
    editIcon: {
        position: "absolute",
        bottom: -5,
        right: -5,
        backgroundColor: "#fff",
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    profileInfo: {
        marginLeft: 15,
    },
    profileName: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    profileJoinDate: {
        color: "#aaa",
        fontSize: 14,
    },
    section: {
        marginHorizontal: 15,
        marginTop: 20,
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    sectionTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },
    sectionLink: {
        color: "#00C4FF",
        fontWeight: "bold",
    },
    badgesScrollView: {
        paddingVertical: 10,
    },
    badgeContainer: {
        width: width / 4 - 20, // Расчет ширины для 4 значков
        height: width / 4 - 20,
        borderRadius: (width / 4 - 20) / 2,
        backgroundColor: "#2D2D2D",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
        borderWidth: 2,
        borderColor: "#D19000",
        opacity: 0.6,
    },
    badgeText: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
    },
    badgeSubText: {
        color: "#fff",
        fontSize: 10,
        marginTop: -5,
    },
    activityCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#1E2333",
        borderRadius: 15,
        padding: 15,
    },
    activityInfo: {
        flexDirection: "row",
        alignItems: "center",
    },
    activityTextContainer: {
        marginLeft: 10,
    },
    activityTitle: {
        color: "#aaa",
        fontSize: 14,
    },
    activityTime: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    activityDropdown: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#2D2D2D",
        borderRadius: 10,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    activityDropdownText: {
        color: "#fff",
        marginRight: 5,
    },
    coursesScrollView: {
        paddingVertical: 10,
    },
    courseCard: {
        backgroundColor: "#1E2333",
        borderRadius: 15,
        padding: 15,
        marginRight: 10,
        width: width * 0.7,
        flexDirection: "row",
        alignItems: "center",
    },
    courseAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#2D2D2D",
    },
    courseText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 10,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#1E2333",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingVertical: 10,
    },
    footerButton: {
        alignItems: "center",
    },
    footerText: {
        color: "#7F7F7F",
        fontSize: 12,
        marginTop: 5,
    },
    activeFooterButton: {},
    activeFooterText: {
        color: "#00C4FF",
    },
});

export default ProfileScreen;
