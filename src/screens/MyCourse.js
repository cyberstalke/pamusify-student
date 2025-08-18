import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  useColorScheme,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getColors } from "../utils/colors"; // adjust path if needed
import { useNavigation } from "@react-navigation/native";

const students = [
  { id: "1", rank: 1, name: "Ali", classesCount: 24, score: 1200 },
  { id: "2", rank: 2, name: "Dilnoza", classesCount: 20, score: 980 },
  {
    id: "3",
    rank: 3,
    name: "John",
    classesCount: 18,
    score: 870,
    isCurrentUser: true,
  },
  { id: "4", rank: 4, name: "Sara", classesCount: 15, score: 750 },
];

export default function MyCourse() {
  const schem = useColorScheme();
  const colors = getColors(schem);
  const isDark = schem === "dark";
  const navigation = useNavigation();

  // Функция для обработки нажатия "Назад"
  const handleGoBack = () => {
    // В реальном приложении здесь будет навигация, например: navigation.goBack();
    navigation.goBack();
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.itemContainer,
        { backgroundColor: colors.cardSecondary },
        item.isCurrentUser && {
          borderWidth: 2,
          borderColor: colors.tabIconActive,
          shadowColor: colors.tabIconActive,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 5,
        },
      ]}
    >
      <View style={styles.itemLeft}>
        <Text style={[styles.rankText, { color: colors.textPrimary }]}>
          {item.rank}
        </Text>
        <View style={styles.avatarContainer}>
          <MaterialCommunityIcons
            name="account-circle"
            size={40}
            color={colors.textSecondary}
          />
        </View>
        <View>
          <Text style={[styles.nameText, { color: colors.textPrimary }]}>
            {item.name}
          </Text>
          <Text style={[styles.subText, { color: colors.textSecondary }]}>
            {item.classesCount} lessons
          </Text>
        </View>
      </View>
      <View style={styles.itemRight}>
        <MaterialCommunityIcons
          name="diamond"
          size={20}
          color={colors.purple}
        />
        <Text style={[styles.scoreText, { color: colors.textPrimary }]}>
          {item.score}
        </Text>
      </View>
    </View>
  );

  const renderExtraItem = ({ title, items }) => (
    <View style={styles.extraSection}>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
        {title}
      </Text>
      {items.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.extraItemContainer,
            { backgroundColor: colors.cardSecondary },
          ]}
          onPress={() => console.log(`${item} pressed`)}
        >
          <View style={styles.extraItemContent}>
            <MaterialCommunityIcons
              name="check-circle-outline"
              size={24}
              color={colors.tabIconActive}
            />
            <Text style={[styles.extraItemText, { color: colors.textPrimary }]}>
              {item}
            </Text>
          </View>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color={colors.textSecondary}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
          <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>
            My Class
          </Text>
          <View></View>
        </View>

        <FlatList
          data={students}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flatListContent}
          ListFooterComponent={() => (
            <>
              {renderExtraItem({
                title: "📘 Homework",
                items: ["Grammar Practice", "Vocabulary Exercises"],
              })}
              {renderExtraItem({
                title: "⭐ Extra Materials",
                items: ["Reading Article", "Listening Audio"],
              })}
            </>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  // Новые стили для заголовка
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "space-between",
  },
  backButton: {
    paddingRight: 15,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  flatListContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  rankText: {
    fontSize: 18,
    fontWeight: "bold",
    width: 30,
  },
  avatarContainer: {
    marginHorizontal: 10,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "600",
  },
  subText: {
    fontSize: 12,
  },
  itemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  scoreText: {
    marginLeft: 5,
    fontWeight: "bold",
    fontSize: 16,
  },
  extraSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  extraItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  extraItemContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  extraItemText: {
    fontSize: 16,
    marginLeft: 10,
  },
});
