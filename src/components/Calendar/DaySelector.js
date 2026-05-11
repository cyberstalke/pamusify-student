import React, { useEffect, useMemo, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  useColorScheme,
  StyleSheet,
  Platform,
} from "react-native";
import moment from "moment";
import Animated, {
  FadeInDown,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { getColors } from "../../utils/colors";

const ITEM_WIDTH = 64;
const ITEM_GAP = 10;

export default function DaySelector({
  selectedDate,
  setSelectedDate,
  colors: propColors,
}) {
  const scheme = useColorScheme();
  const colors = propColors || getColors(scheme);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const flatListRef = useRef(null);

  const days = useMemo(() => {
    const startOfMonth = moment().startOf("month");
    const daysInMonth = moment().daysInMonth();

    return Array.from({ length: daysInMonth }, (_, index) => {
      const date = moment(startOfMonth).add(index, "days");

      return {
        label: date.format("ddd"),
        day: date.format("DD"),
        month: date.format("MMM"),
        dateKey: date.format("YYYY-MM-DD"),
        isToday: date.isSame(moment(), "day"),
      };
    });
  }, []);

  const activeIndex = useMemo(() => {
    const index = days.findIndex((day) => day.dateKey === selectedDate);
    return index >= 0 ? index : days.findIndex((day) => day.isToday);
  }, [days, selectedDate]);

  useEffect(() => {
    if (!flatListRef.current || activeIndex < 0) return;

    const timeout = setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: activeIndex,
        animated: true,
        viewPosition: 0.5,
      });
    }, 120);

    return () => clearTimeout(timeout);
  }, [activeIndex]);

  const handleScrollToIndexFailed = (info) => {
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({
        offset: info.averageItemLength * info.index,
        animated: true,
      });
    }, 120);
  };

  const renderItem = ({ item, index }) => {
    const isSelected = selectedDate === item.dateKey;
    const isActive = isSelected || (!selectedDate && item.isToday);

    return (
      <Animated.View
        entering={FadeInDown.delay(index * 18)
          .duration(320)
          .springify()
          .damping(18)}
        layout={Layout.springify().damping(18)}
      >
        <DayItem
          item={item}
          isActive={isActive}
          isToday={item.isToday}
          styles={styles}
          colors={colors}
          onPress={() => setSelectedDate(item.dateKey)}
        />
      </Animated.View>
    );
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.label}>Calendar</Text>
          <Text style={styles.title}>{moment().format("MMMM YYYY")}</Text>
        </View>

        <View style={styles.todayPill}>
          <Text style={styles.todayPillText}>Today</Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        horizontal
        data={days}
        keyExtractor={(item) => item.dateKey}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        onScrollToIndexFailed={handleScrollToIndexFailed}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH + ITEM_GAP,
          offset: (ITEM_WIDTH + ITEM_GAP) * index,
          index,
        })}
      />
    </View>
  );
}

function DayItem({ item, isActive, isToday, styles, colors, onPress }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={onPress}
        onPressIn={() => {
          scale.value = withTiming(0.94, { duration: 90 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1);
        }}
        style={[
          styles.dayCard,
          isActive && styles.dayCardActive,
          isToday && !isActive && styles.todayCard,
        ]}
      >
        <Text style={[styles.dayLabel, isActive && styles.dayTextActive]}>
          {item.label}
        </Text>

        <Text style={[styles.dayNumber, isActive && styles.dayTextActive]}>
          {item.day}
        </Text>

        {isToday && (
          <View style={[styles.todayDot, isActive && styles.todayDotActive]} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    wrapper: {
      paddingTop: 16,
      paddingBottom: 22,
      backgroundColor: colors.cardSecondary,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      ...Platform.select({
        android: {
          elevation: 5,
        },
      }),
    },

    headerRow: {
      paddingHorizontal: 18,
      marginBottom: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    label: {
      fontSize: 12,
      fontWeight: "800",
      color: colors.tabIconActive,
      marginBottom: 3,
    },

    title: {
      fontSize: 22,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    todayPill: {
      paddingVertical: 8,
      paddingHorizontal: 13,
      borderRadius: 999,
      backgroundColor: colors.background,
    },

    todayPillText: {
      fontSize: 12,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    listContent: {
      paddingHorizontal: 18,
      gap: ITEM_GAP,
    },

    dayCard: {
      width: ITEM_WIDTH,
      height: 86,
      borderRadius: 24,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "transparent",
    },

    dayCardActive: {
      backgroundColor: colors.tabIconActive,
      borderColor: colors.tabIconActive,
      shadowColor: colors.tabIconActive,
      shadowOpacity: 0.35,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      ...Platform.select({
        android: {
          elevation: 4,
        },
      }),
    },

    todayCard: {
      borderColor: colors.tabIconActive,
    },

    dayLabel: {
      fontSize: 12,
      fontWeight: "800",
      color: colors.textSecondary,
      textTransform: "uppercase",
    },

    dayNumber: {
      marginTop: 6,
      fontSize: 22,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    dayTextActive: {
      color: "#fff",
    },

    todayDot: {
      width: 6,
      height: 6,
      borderRadius: 3,
      marginTop: 7,
      backgroundColor: colors.tabIconActive,
    },

    todayDotActive: {
      backgroundColor: "#fff",
    },
  });
