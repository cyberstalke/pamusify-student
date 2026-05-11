import { StatusBar } from "expo-status-bar";
import React, { useMemo } from "react";
import { View, useColorScheme, SafeAreaView } from "react-native";
import Animated, { FadeInDown, Layout } from "react-native-reanimated";

import { getColors } from "../utils/colors";
import Header from "../components/Lessons/Header";
import UnitCard from "../components/Lessons/UnitCard";
import LessonCard from "../components/Lessons/LessonCard";
import { createLessonsStyles } from "../styles/lessons.styles";

const AnimatedFlatList = Animated.FlatList;

const LESSONS_DATA = [
  {
    type: "unit",
    id: "u1s1",
    title: "Unit 1 Session 1",
    subtitle: "1-bo‘lim • 6 ta dars",
    description: "Personal information mavzusini bosqichma-bosqich o‘rganamiz.",
  },
  {
    type: "lesson",
    id: 1,
    title: "Personal information",
    subtitle: "Darsni boshlash",
    progress: 0.25,
    xp: 20,
  },
  {
    type: "lesson",
    id: 2,
    title: "Talking about myself",
    subtitle: "Keyingi dars",
    locked: true,
    progress: 0,
    xp: 20,
  },
  {
    type: "lesson",
    id: 3,
    title: "It's all about me",
    subtitle: "Speaking practice",
    locked: true,
    progress: 0,
    xp: 25,
  },
  {
    type: "lesson",
    id: 4,
    title: "Writing about myself",
    subtitle: "Writing task",
    locked: true,
    progress: 0,
    xp: 25,
  },
  {
    type: "lesson",
    id: 5,
    title: "To be and its forms",
    subtitle: "Grammar boost",
    locked: true,
    progress: 0,
    xp: 30,
  },
  {
    type: "lesson",
    id: 6,
    title: "About myself",
    subtitle: "Final practice",
    locked: true,
    progress: 0,
    xp: 35,
  },
  {
    type: "unit",
    id: "u1s2",
    title: "Unit 1 Session 2",
    subtitle: "2-bo‘lim • 6 ta dars",
    description: "Yangi mavzular ochilishi uchun oldingi darslarni tugating.",
    locked: true,
  },
];

export default function Lessons({ navigation }) {
  const scheme = useColorScheme();
  const colors = getColors(scheme);
  const styles = useMemo(() => createLessonsStyles(colors), [colors]);

  const renderItem = ({ item, index }) => {
    return (
      <Animated.View
        entering={FadeInDown.delay(index * 70)
          .duration(420)
          .springify()
          .damping(16)}
        layout={Layout.springify().damping(18)}
      >
        {item.type === "unit" ? (
          <UnitCard
            title={item.title}
            subtitle={item.subtitle}
            description={item.description}
            locked={item.locked}
            colors={colors}
            styles={styles}
          />
        ) : (
          <LessonCard
            title={item.title}
            subtitle={item.subtitle}
            locked={item.locked}
            progress={item.progress}
            xp={item.xp}
            index={index}
            colors={colors}
            styles={styles}
            onPress={() => {
              if (!item.locked) {
                navigation.navigate("Spelling", { lessonId: item.id });
              }
            }}
          />
        )}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Animated.View
          entering={FadeInDown.duration(450).springify().damping(16)}
        >
          <Header title="Super Start: A2" colors={colors} styles={styles} />
        </Animated.View>

        <AnimatedFlatList
          data={LESSONS_DATA}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          itemLayoutAnimation={Layout.springify().damping(18)}
        />
      </View>

      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
    </SafeAreaView>
  );
}
