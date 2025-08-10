import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import moment from "moment";

const screenWidth = Dimensions.get("window").width;
const ITEM_WIDTH = 60; // har bir kun width

export default function DaySelector({ selectedDate, setSelectedDate, colors }) {
  const startOfMonth = moment().startOf("month");
  const daysInMonth = moment().daysInMonth();

  const days = [];
  for (let i = 0; i < daysInMonth; i++) {
    const date = moment(startOfMonth).add(i, "days");
    days.push({
      label: date.format("ddd"),
      day: date.format("DD"),
      dateKey: date.format("YYYY-MM-DD"),
      isToday: date.isSame(moment(), "day"),
    });
  }

  const flatListRef = useRef(null);

  // Active kun indexini topamiz
  const activeIndex = days.findIndex((day) => day.dateKey === selectedDate);

  // Komponent yuklanganda yoki selectedDate o'zgarganda active kun markazga keladi
  useEffect(() => {
    if (flatListRef.current && activeIndex >= 0) {
      flatListRef.current.scrollToIndex({
        index: activeIndex,
        animated: true,
        viewPosition: 0.5, // markazda ko'rsatadi
      });
    }
  }, [activeIndex]);

  const renderItem = ({ item, index }) => {
    const isActive = item.isToday || selectedDate === item.dateKey;

    return (
      <TouchableOpacity
        onPress={() => setSelectedDate(item.dateKey)}
        style={{
          width: ITEM_WIDTH,
          height: 80,
          borderRadius: 12,
          backgroundColor: isActive ? colors.purple : colors.cardSecondary,
          alignItems: "center",
          justifyContent: "center",
          marginHorizontal: 5,
          borderWidth: isActive ? 2 : 1,
          borderColor: isActive ? colors.purple : colors.progressLine,
          shadowColor: isActive ? colors.purple : "#000",
          shadowOpacity: isActive ? 0.4 : 0,
          shadowRadius: 5,
          shadowOffset: { width: 0, height: 2 },
        }}
      >
        <Text
          style={{
            color: isActive ? "white" : colors.textSecondary,
            fontSize: 14,
            fontWeight: "600",
            marginBottom: 4,
          }}
        >
          {item.label}
        </Text>
        <Text
          style={{
            color: isActive ? "white" : colors.textPrimary,
            fontSize: 20,
            fontWeight: "700",
          }}
        >
          {item.day}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ paddingVertical: 10 }}>
      <FlatList
        ref={flatListRef}
        horizontal
        data={days}
        keyExtractor={(item) => item.dateKey}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, index) => ({
          length: ITEM_WIDTH + 10, // width + marginHorizontal*2
          offset: (ITEM_WIDTH + 10) * index,
          index,
        })}
        initialScrollIndex={activeIndex}
      />
    </View>
  );
}
