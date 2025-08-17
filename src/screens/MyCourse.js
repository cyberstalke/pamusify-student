import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  useColorScheme,
  SafeAreaView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getColors } from "../utils/colors"; // adjust path if needed

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

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.itemContainer,
        { backgroundColor: colors.cardSecondary },
        item.isCurrentUser && {
          borderWidth: 2,
          borderColor: colors.cardBackground,
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
            {item.classesCount} dars
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.pageTitle, { color: colors.textPrimary }]}>
          My Class
        </Text>

        <FlatList
          data={students}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />

        {/* Extra sections */}
        <View style={styles.extraSection}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            📘 Homework
          </Text>
          <Text style={[styles.sectionItem, { color: colors.textSecondary }]}>
            • Grammar Practice
          </Text>
          <Text style={[styles.sectionItem, { color: colors.textSecondary }]}>
            • Vocabulary Exercises
          </Text>

          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
            ⭐ Extra Materials
          </Text>
          <Text style={[styles.sectionItem, { color: colors.textSecondary }]}>
            • Reading Article
          </Text>
          <Text style={[styles.sectionItem, { color: colors.textSecondary }]}>
            • Listening Audio
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  pageTitle: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: "center",
    elevation: 2,
  },
  itemLeft: { flexDirection: "row", alignItems: "center" },
  rankText: { fontSize: 18, fontWeight: "bold", width: 30 },
  avatarContainer: { marginHorizontal: 10 },
  nameText: { fontSize: 16, fontWeight: "600" },
  subText: { fontSize: 12 },
  itemRight: { flexDirection: "row", alignItems: "center" },
  scoreText: { marginLeft: 5, fontWeight: "bold", fontSize: 16 },
  extraSection: { marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginTop: 10 },
  sectionItem: { fontSize: 14, marginTop: 4 },
});
