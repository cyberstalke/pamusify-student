import { StyleSheet } from "react-native";

export const createLeaderboardStyles = (colors) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },

    androidRoot: {
      paddingTop: 34,
    },

    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },

    header: {
      paddingHorizontal: 18,
      paddingTop: 18,
      paddingBottom: 18,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      backgroundColor: colors.cardSecondary,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
      elevation: 5,
    },

    headerTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
      gap: 12,
    },

    eyebrow: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.tabIconActive,
      letterSpacing: 0.4,
    },

    title: {
      fontSize: 28,
      fontWeight: "900",
      color: colors.textPrimary,
      marginTop: 2,
    },

    levelSelector: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderRadius: 18,
      backgroundColor: colors.background,
      maxWidth: 165,
    },

    levelText: {
      fontSize: 13,
      fontWeight: "800",
      color: colors.textPrimary,
    },

    periodSelector: {
      flexDirection: "row",
      padding: 5,
      borderRadius: 20,
      backgroundColor: colors.background,
    },

    periodButton: {
      flex: 1,
      paddingVertical: 11,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
    },

    activePeriodButton: {
      backgroundColor: colors.tabIconActive,
      shadowColor: colors.tabIconActive,
      shadowOpacity: 0.35,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 4,
    },

    periodText: {
      fontSize: 13,
      fontWeight: "800",
      color: colors.textSecondary,
    },

    activePeriodText: {
      color: "#fff",
    },

    content: {
      flex: 1,
    },

    listContent: {
      paddingHorizontal: 16,
      paddingTop: 18,
      paddingBottom: 110,
    },

    podiumCard: {
      padding: 12,
      borderRadius: 28,
      backgroundColor: colors.cardSecondary,
      marginBottom: 16,
    },

    listContainer: {
      gap: 10,
    },

    itemContainer: {
      minHeight: 72,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderRadius: 24,
      paddingVertical: 12,
      paddingHorizontal: 13,
      backgroundColor: colors.cardSecondary,
      marginBottom: 10,
    },

    podiumItem: {
      backgroundColor: colors.background,
    },

    topOneItem: {
      borderWidth: 1,
      borderColor: colors.tabIconActive,
    },

    itemLeft: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      minWidth: 0,
    },

    rankBadge: {
      width: 38,
      height: 38,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background,
    },

    rankBadgeGold: {
      backgroundColor: colors.tabIconActive,
    },

    rankText: {
      fontSize: 13,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    rankTextGold: {
      color: "#fff",
    },

    avatarContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      overflow: "hidden",
      alignItems: "center",
      justifyContent: "center",
      marginLeft: 12,
      backgroundColor: colors.background,
    },

    avatarGold: {
      borderWidth: 2,
      borderColor: colors.tabIconActive,
    },

    avatar: {
      width: "100%",
      height: "100%",
    },

    nameBox: {
      flex: 1,
      marginLeft: 12,
      minWidth: 0,
    },

    nameText: {
      fontSize: 16,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    subtitleText: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.textSecondary,
      marginTop: 2,
    },

    scorePill: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 11,
      borderRadius: 999,
      backgroundColor: colors.background,
      marginLeft: 8,
    },

    scoreText: {
      fontSize: 14,
      fontWeight: "900",
      color: colors.textPrimary,
      marginLeft: 5,
    },

    footer: {
      position: "absolute",
      left: 14,
      right: 14,
      bottom: 14,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 10,
      paddingHorizontal: 8,
      borderRadius: 28,
      backgroundColor: colors.tabBarBackground,
      shadowColor: "#000",
      shadowOpacity: 0.14,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 10 },
      elevation: 8,
    },

    footerButton: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 7,
      borderRadius: 20,
    },

    footerButtonActive: {
      backgroundColor: colors.background,
    },

    footerText: {
      fontSize: 11,
      fontWeight: "800",
      color: colors.tabIconInactive,
      marginTop: 4,
    },

    footerTextActive: {
      color: colors.tabIconActive,
    },
  });
