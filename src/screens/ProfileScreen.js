import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
  useColorScheme,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Импортируем хук, который мы создали в TimeProvider.js
import { useTime } from "../context/TimeProvider";
import { getColors } from "../utils/colors";

const { width } = Dimensions.get("window");

// Компонент для значков достижений
const AchievementBadge = ({ days }) => {
  const schem = useColorScheme();
  const colors = getColors(schem);
  return (
    <View
      style={[styles.badgeContainer, { backgroundColor: colors.cardSecondary }]}
    >
      <Text style={[styles.badgeText, { color: colors.textPrimary }]}>
        {days}
      </Text>
      <Text style={[styles.badgeSubText, { color: colors.textPrimary }]}>
        kunlik seriya
      </Text>
    </View>
  );
};

// Компонент для карточки курса
const CourseCard = ({ courseName }) => {
  const schem = useColorScheme();
  const colors = getColors(schem);
  return (
    <View
      style={[styles.courseCard, { backgroundColor: colors.cardSecondary }]}
    >
      {/* Здесь будет аватарка, можно добавить свою */}
      <View
        style={[styles.courseAvatar, { backgroundColor: colors.background }]}
      />
      <Text style={[styles.courseText, { color: colors.textPrimary }]}>
        {courseName}
      </Text>
    </View>
  );
};

// Главный компонент экрана профиля
const ProfileScreen = () => {
  // Получаем общее время из нашего контекста
  const { totalTimeSpent } = useTime();
  const schem = useColorScheme();
  const colors = getColors(schem);
  const isDark = schem === "dark";

  const totalSeconds = Math.floor(totalTimeSpent / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  // Нижняя навигационная панель
  const Footer = () => (
    <View style={[styles.footer, { backgroundColor: colors.tabBarBackground }]}>
      <TouchableOpacity style={styles.footerButton}>
        <MaterialCommunityIcons
          name="home-outline"
          size={24}
          color={colors.tabIconInactive}
        />
        <Text style={[styles.footerText, { color: colors.tabIconInactive }]}>
          Asosiy
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton}>
        <MaterialCommunityIcons
          name="book-open-page-variant-outline"
          size={24}
          color={colors.tabIconInactive}
        />
        <Text style={[styles.footerText, { color: colors.tabIconInactive }]}>
          Kurslar
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton}>
        <MaterialCommunityIcons
          name="star-shooting-outline"
          size={24}
          color={colors.tabIconInactive}
        />
        <Text style={[styles.footerText, { color: colors.tabIconInactive }]}>
          O'yinlar
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.footerButton}>
        <MaterialCommunityIcons
          name="trophy-outline"
          size={24}
          color={colors.tabIconInactive}
        />
        <Text style={[styles.footerText, { color: colors.tabIconInactive }]}>
          Liderbord
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.footerButton, styles.activeFooterButton]}
      >
        <MaterialCommunityIcons
          name="account"
          size={24}
          color={colors.tabIconActive}
        />
        <Text style={[styles.footerText, { color: colors.tabIconActive }]}>
          Profil
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ ...styles.container, backgroundColor: colors.background }}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <ScrollView>
          <View
            style={{
              ...styles.profileCard,
              backgroundColor: colors.cardSecondary,
            }}
          >
            <View style={styles.profileAvatarContainer}>
              <View
                style={[
                  styles.profileAvatar,
                  { backgroundColor: colors.purple },
                ]}
              >
                <Text
                  style={[
                    styles.profileInitials,
                    { color: colors.textPrimary },
                  ]}
                >
                  AA
                </Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.editIcon,
                  { backgroundColor: colors.textPrimary },
                ]}
              >
                <MaterialCommunityIcons
                  name="pencil-outline"
                  size={16}
                  color={colors.background}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.textPrimary }]}>
                Abdulaziz Abduvaliyev
              </Text>
              <Text
                style={[
                  styles.profileJoinDate,
                  { color: colors.textSecondary },
                ]}
              >
                Qo'shilgan: Avgust 2025
              </Text>
            </View>
          </View>

          {/* Достижения */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text
                style={[styles.sectionTitle, { color: colors.textPrimary }]}
              >
                Yutuqlar
              </Text>
              <TouchableOpacity>
                <Text
                  style={[styles.sectionLink, { color: colors.tabIconActive }]}
                >
                  Barchasi
                </Text>
              </TouchableOpacity>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.badgesScrollView}
            >
              <AchievementBadge days="7" />
              <AchievementBadge days="30" />
              <AchievementBadge days="90" />
              <AchievementBadge days="365" />
            </ScrollView>
          </View>

          {/* Активность */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text
                style={[styles.sectionTitle, { color: colors.textPrimary }]}
              >
                Faollik
              </Text>
              <TouchableOpacity>
                <Text
                  style={[styles.sectionLink, { color: colors.tabIconActive }]}
                >
                  Barchasi
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.activityCard,
                { backgroundColor: colors.cardSecondary },
              ]}
            >
              <View style={styles.activityInfo}>
                <MaterialCommunityIcons
                  name="timer-sand"
                  size={30}
                  color={colors.tabIconActive}
                />
                <View style={styles.activityTextContainer}>
                  <Text
                    style={[
                      styles.activityTitle,
                      { color: colors.textSecondary },
                    ]}
                  >
                    Sarflangan
                  </Text>
                  <Text
                    style={[styles.activityTime, { color: colors.textPrimary }]}
                  >{`${hours}s : ${minutes}m`}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[
                  styles.activityDropdown,
                  { backgroundColor: colors.background },
                ]}
              >
                <Text
                  style={[
                    styles.activityDropdownText,
                    { color: colors.textPrimary },
                  ]}
                >
                  Haftalik
                </Text>
                <MaterialCommunityIcons
                  name="chevron-down"
                  size={20}
                  color={colors.textPrimary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Курсы */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text
                style={[styles.sectionTitle, { color: colors.textPrimary }]}
              >
                Kurslarim
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.coursesScrollView}
            >
              <CourseCard courseName="Super Start: A2" />
            </ScrollView>
          </View>
        </ScrollView>

        <Footer />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
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
    justifyContent: "center",
    alignItems: "center",
  },
  profileInitials: {
    fontSize: 24,
    fontWeight: "bold",
  },
  editIcon: {
    position: "absolute",
    bottom: -5,
    right: -5,
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
    fontSize: 18,
    fontWeight: "bold",
  },
  profileJoinDate: {
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
    fontSize: 20,
    fontWeight: "bold",
  },
  sectionLink: {
    fontWeight: "bold",
  },
  badgesScrollView: {
    paddingVertical: 10,
  },
  badgeContainer: {
    width: width / 4 - 20,
    height: width / 4 - 20,
    borderRadius: (width / 4 - 20) / 2,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
    borderWidth: 2,
    borderColor: "#D19000",
    opacity: 0.6,
  },
  badgeText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  badgeSubText: {
    fontSize: 10,
    marginTop: -5,
  },
  activityCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    fontSize: 14,
  },
  activityTime: {
    fontSize: 18,
    fontWeight: "bold",
  },
  activityDropdown: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  activityDropdownText: {
    marginRight: 5,
  },
  coursesScrollView: {
    paddingVertical: 10,
  },
  courseCard: {
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
  },
  courseText: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 10,
  },
  footerButton: {
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    marginTop: 5,
  },
  activeFooterButton: {},
  activeFooterText: {
    color: "#00C4FF",
  },
});

export default ProfileScreen;
