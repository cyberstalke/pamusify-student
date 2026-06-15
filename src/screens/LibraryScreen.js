import React, { useMemo, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  useColorScheme,
  Platform,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import Animated, {
  FadeInDown,
  FadeIn,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { getColors } from "../utils/colors";
import { contentApi } from "../api/content";

const AnimatedFlatList = Animated.FlatList;

export default function LibraryScreen({ navigation }) {
  const scheme = useColorScheme();
  const colors = getColors(scheme);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contentApi.library()
      .then((res) => {
        const list = res?.data || [];
        setBooks(
          list.map((item) => ({
            id: String(item.id),
            title: item.title,
            author: item.author,
            type: item.type,
            lessons: item.lessons_count,
            fileSource: { uri: item.file },
          }))
        );
      })
      .catch((err) => {
        console.error("Library API error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />

      <View style={styles.container}>
        <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => navigation.goBack()}
            style={styles.iconButton}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={23}
              color={colors.textPrimary}
            />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerLabel}>Learning resources</Text>
            <Text style={styles.headerTitle}>Library</Text>
          </View>

          <TouchableOpacity activeOpacity={0.85} style={styles.iconButton}>
            <MaterialCommunityIcons
              name="magnify"
              size={23}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(80).duration(420).springify().damping(17)}
          style={styles.heroCard}
        >
          <View>
            <Text style={styles.heroTitle}>Read and improve</Text>
            <Text style={styles.heroSubtitle}>
              PDF kitoblar, lesson materials va reading practice.
            </Text>
          </View>

          <View style={styles.heroIcon}>
            <MaterialCommunityIcons name="bookshelf" size={30} color="#fff" />
          </View>
        </Animated.View>

        {loading && (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" />
          </View>
        )}

        {!loading && (
          <AnimatedFlatList
            data={books}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
            itemLayoutAnimation={Layout.springify().damping(18)}
            renderItem={({ item, index }) => (
              <Animated.View
                entering={FadeInDown.delay(150 + index * 80)
                  .duration(420)
                  .springify()
                  .damping(17)}
                layout={Layout.springify().damping(18)}
              >
                <BookCard
                  item={item}
                  colors={colors}
                  styles={styles}
                  onPress={() =>
                    navigation.navigate("PdfViewer", {
                      title: item.title,
                      fileSource: item.fileSource,
                    })
                  }
                />
              </Animated.View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

function BookCard({ item, colors, styles, onPress }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={onPress}
        onPressIn={() => {
          scale.value = withTiming(0.97, { duration: 90 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        style={styles.bookCard}
      >
        <View style={styles.bookCover}>
          <MaterialCommunityIcons
            name="book-open-page-variant"
            size={34}
            color="#fff"
          />
          <Text style={styles.coverType}>{item.type}</Text>
        </View>

        <View style={styles.bookInfo}>
          <View style={styles.bookTopRow}>
            <Text numberOfLines={2} style={styles.bookTitle}>
              {item.title}
            </Text>

            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={colors.textSecondary}
            />
          </View>

          <Text style={styles.bookAuthor}>{item.author}</Text>

          <View style={styles.metaRow}>
            <View style={styles.metaPill}>
              <MaterialCommunityIcons
                name="file-document-outline"
                size={14}
                color={colors.tabIconActive}
              />
              <Text style={styles.metaText}>{item.type}</Text>
            </View>

            <View style={styles.metaPill}>
              <MaterialCommunityIcons
                name="book-check-outline"
                size={14}
                color={colors.tabIconActive}
              />
              <Text style={styles.metaText}>{item.lessons} lessons</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.cardSecondary,
      paddingTop: Platform.OS === "android" ? 38 : 0,
    },

    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    header: {
      paddingHorizontal: 18,
      paddingTop: 14,
      paddingBottom: 16,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      backgroundColor: colors.cardSecondary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    iconButton: {
      width: 46,
      height: 46,
      borderRadius: 16,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
    },

    headerCenter: {
      flex: 1,
      alignItems: "center",
      marginHorizontal: 12,
    },

    headerLabel: {
      fontSize: 12,
      fontWeight: "800",
      color: colors.tabIconActive,
    },

    headerTitle: {
      marginTop: 2,
      fontSize: 24,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    heroCard: {
      margin: 18,
      marginBottom: 10,
      borderRadius: 32,
      padding: 18,
      backgroundColor: colors.cardSecondary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
      ...Platform.select({
        android: {
          elevation: 5,
        },
      }),
    },

    heroTitle: {
      fontSize: 23,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    heroSubtitle: {
      maxWidth: 230,
      marginTop: 6,
      fontSize: 13,
      lineHeight: 18,
      fontWeight: "700",
      color: colors.textSecondary,
    },

    heroIcon: {
      width: 58,
      height: 58,
      borderRadius: 22,
      backgroundColor: colors.tabIconActive,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 12,
    },

    listContainer: {
      paddingHorizontal: 18,
      paddingTop: 8,
      paddingBottom: 30,
    },

    bookCard: {
      minHeight: 122,
      borderRadius: 30,
      padding: 14,
      marginBottom: 14,
      backgroundColor: colors.cardSecondary,
      flexDirection: "row",
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.07,
      shadowRadius: 15,
      shadowOffset: { width: 0, height: 8 },
      ...Platform.select({
        android: {
          elevation: 4,
        },
      }),
    },

    bookCover: {
      width: 76,
      height: 94,
      borderRadius: 24,
      backgroundColor: colors.tabIconActive,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 14,
    },

    coverType: {
      marginTop: 5,
      fontSize: 10,
      fontWeight: "900",
      color: "#fff",
      letterSpacing: 0.6,
    },

    bookInfo: {
      flex: 1,
      minWidth: 0,
    },

    bookTopRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: 8,
    },

    bookTitle: {
      flex: 1,
      fontSize: 17,
      lineHeight: 22,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    bookAuthor: {
      marginTop: 6,
      fontSize: 13,
      fontWeight: "700",
      color: colors.textSecondary,
    },

    metaRow: {
      marginTop: 14,
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },

    metaPill: {
      paddingVertical: 7,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: colors.background,
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
    },

    metaText: {
      fontSize: 11,
      fontWeight: "900",
      color: colors.textPrimary,
    },
  });
