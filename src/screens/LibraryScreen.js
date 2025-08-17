import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  useColorScheme,
  Platform,
  SafeAreaView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getColors } from "../utils/colors";

// Sample PDF in assets
import samplePdf from "../../assets/pdf/food_and_restaurants_-_answers_1.pdf";

const { width } = Dimensions.get("window");

const books = [
  {
    id: "1",
    title: "Local PDF File",
    author: "Local File Author",
    type: "pdf",
    fileSource: samplePdf,
  },
  {
    id: "2",
    title: "1984 (Online)",
    author: "George Orwell",
    type: "pdf",
    fileSource: {
      uri: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
  },
  {
    id: "3",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    type: "pdf",
    fileSource: {
      uri: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    },
  },
];

export default function LibraryScreen({ navigation }) {
  const scheme = useColorScheme();
  const colors = getColors(scheme);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.bookCard,
        {
          backgroundColor: colors.cardSecondary,
          shadowColor: colors.textPrimary,
        },
      ]}
      onPress={() =>
        navigation.navigate("PdfViewer", {
          title: item.title,
          fileSource: item.fileSource,
        })
      }
    >
      <View
        style={[styles.bookCover, { backgroundColor: colors.progressLine }]}
      >
        <MaterialCommunityIcons
          name="book-open-variant"
          size={40}
          color={colors.textPrimary}
        />
      </View>
      <View style={styles.bookInfo}>
        <Text
          style={[styles.bookTitle, { color: colors.textPrimary }]}
          numberOfLines={2}
        >
          {item.title}
        </Text>
        <Text style={[styles.bookAuthor, { color: colors.textSecondary }]}>
          {item.author}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cardSecondary }}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View
          style={[styles.header, { backgroundColor: colors.tabBarBackground }]}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textPrimary }]}>
            Library
          </Text>
          <View style={styles.headerPlaceholder}></View>
        </View>
        <FlatList
          data={books}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 24, fontWeight: "bold" },
  headerPlaceholder: { width: 34 },
  listContainer: { padding: 15 },

  bookCard: {
    flexDirection: "row",
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    alignItems: "center",

    // Shadow for iOS
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,

    // Shadow for Android
    ...Platform.select({
      android: { elevation: 5 },
    }),
  },

  bookCover: {
    width: 60,
    height: 80,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",

    // Shadow for cover too
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  bookInfo: { marginLeft: 15, flex: 1, justifyContent: "center" },
  bookTitle: { fontSize: 16, fontWeight: "bold" },
  bookAuthor: { fontSize: 12, marginTop: 5 },
});
