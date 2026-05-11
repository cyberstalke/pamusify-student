import React from "react";
import { ScrollView, View } from "react-native";
import LeaderboardItem from "./LeaderboardItem";

export default function LeaderboardList({ data, colors, styles }) {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContent}
    >
      <View style={styles.podiumCard}>
        {data.slice(0, 3).map((item, index) => (
          <LeaderboardItem
            key={item.id}
            item={item}
            index={index}
            colors={colors}
            styles={styles}
            isPodium
          />
        ))}
      </View>

      <View style={styles.listContainer}>
        {data.slice(3).map((item, index) => (
          <LeaderboardItem
            key={item.id}
            item={item}
            index={index + 3}
            colors={colors}
            styles={styles}
          />
        ))}
      </View>
    </ScrollView>
  );
}
