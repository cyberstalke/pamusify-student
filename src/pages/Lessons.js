import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  StyleSheet,
  View,
  FlatList,
  useColorScheme,
  SafeAreaView,
} from "react-native";

import "react-native-reanimated";
import { getColors } from "../utils/colors";
import UnitCard from "../components/Lessons/UnitCard";
import LessonCard from "../components/Lessons/LessonCard";
import Header from "../components/Lessons/Header";

export default function Lessons({ navigation }) {
  const scheme = useColorScheme();
  const colors = getColors(scheme);

  const data = [
    {
      type: "unit",
      title: "Unit 1 Session 1",
      subtitle: "1-bo'lim • 6 ta dars",
    },
    {
      type: "lesson",
      id: 1,
      title: "Personal information",
      subtitle: "Darsni boshlash",
      progress: 0,
    },
    {
      type: "lesson",
      id: 2,
      title: "Talking about myself",
      locked: true,
      progress: 0,
    },
    {
      type: "lesson",
      id: 3,
      title: "It's all about me",
      locked: true,
      progress: 0,
    },
    {
      type: "lesson",
      id: 4,
      title: "Writing about myself",
      locked: true,
      progress: 0,
    },
    {
      type: "lesson",
      id: 5,
      title: "To be and its forms",
      locked: true,
      progress: 0,
    },
    { type: "lesson", id: 6, title: "About myself", locked: true, progress: 0 },
    {
      type: "unit",
      title: "Unit 1 Session 2",
      subtitle: "2-bo'lim • 6 ta dars",
    },
  ];

  const renderItem = ({ item }) => {
    if (item.type === "unit") {
      return <UnitCard title={item.title} subtitle={item.subtitle} />;
    } else {
      return (
        <LessonCard
          title={item.title}
          subtitle={item.subtitle}
          locked={item.locked}
          progress={item.progress}
          onPress={() => {
            if (!item.locked) {
              navigation.navigate("Spelling", { lessonId: item.id });
            }
          }}
        />
      );
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Header title="Super Start: A2" />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContent}
      />
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    paddingTop: 10,
    paddingBottom: 20,
  },
});
