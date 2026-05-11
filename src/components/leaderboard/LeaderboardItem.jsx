import React from "react";
import { Image, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function LeaderboardItem({
  item,
  index,
  colors,
  styles,
  isPodium = false,
}) {
  const isTopOne = index === 0;

  return (
    <View
      style={[
        styles.itemContainer,
        isPodium && styles.podiumItem,
        isTopOne && styles.topOneItem,
      ]}
    >
      <View style={styles.itemLeft}>
        <View style={[styles.rankBadge, isTopOne && styles.rankBadgeGold]}>
          <Text style={[styles.rankText, isTopOne && styles.rankTextGold]}>
            #{item.rank}
          </Text>
        </View>

        <View style={[styles.avatarContainer, isTopOne && styles.avatarGold]}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
          ) : (
            <MaterialCommunityIcons
              name="account-circle"
              size={42}
              color={colors.textSecondary}
            />
          )}
        </View>

        <View style={styles.nameBox}>
          <Text numberOfLines={1} style={styles.nameText}>
            {item.name}
          </Text>
          <Text style={styles.subtitleText}>
            {isTopOne ? "Champion" : "Active learner"}
          </Text>
        </View>
      </View>

      <View style={styles.scorePill}>
        <MaterialCommunityIcons
          name="diamond-stone"
          size={17}
          color={colors.tabIconActive}
        />
        <Text style={styles.scoreText}>{item.score}</Text>
      </View>
    </View>
  );
}
