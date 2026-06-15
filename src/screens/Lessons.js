import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState, useEffect } from "react";
import { View, useColorScheme, SafeAreaView, ActivityIndicator, Text } from "react-native";
import Animated, { FadeInDown, Layout } from "react-native-reanimated";

import { getColors } from "../utils/colors";
import Header from "../components/Lessons/Header";
import UnitCard from "../components/Lessons/UnitCard";
import LessonCard from "../components/Lessons/LessonCard";
import { createLessonsStyles } from "../styles/lessons.styles";
import { learningApi } from "../api/learning";

const AnimatedFlatList = Animated.FlatList;

export default function Lessons({ navigation }) {
  const scheme = useColorScheme();
  const colors = getColors(scheme);
  const styles = useMemo(() => createLessonsStyles(colors), [colors]);

  const [lessonsData, setLessonsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    learningApi.units()
      .then((res) => {
        const units = res?.data || res || [];
        const flat = [];
        units.forEach((unit) => {
          flat.push({
            type: "unit",
            id: "u" + unit.id,
            title: unit.title,
            subtitle: unit.subtitle,
            description: unit.description,
            locked: unit.locked || false,
          });
          (unit.lessons || []).forEach((lesson) => {
            flat.push({
              type: "lesson",
              id: lesson.id,
              title: lesson.title,
              subtitle: lesson.subtitle,
              progress: lesson.progress || 0,
              xp: lesson.xp,
              locked: lesson.locked || false,
            });
          });
        });
        setLessonsData(flat);
      })
      .catch((err) => {
        console.error("Lessons API error:", err);
        setError("Failed to load lessons.");
      })
      .finally(() => setLoading(false));
  }, []);

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

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
          <Text>{error}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Animated.View
          entering={FadeInDown.duration(450).springify().damping(16)}
        >
          <Header title="Super Start: A2" colors={colors} styles={styles} />
        </Animated.View>

        <AnimatedFlatList
          data={lessonsData}
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
