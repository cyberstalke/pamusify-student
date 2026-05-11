import { Platform, StyleSheet } from "react-native";

export const createLessonsStyles = (colors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.cardSecondary,
    },

    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    header: {
      paddingHorizontal: 18,
      paddingTop: 18,
      paddingBottom: 18,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
      backgroundColor: colors.cardSecondary,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 5,
    },

    headerLabel: {
      fontSize: 13,
      fontWeight: "800",
      color: colors.tabIconActive,
      marginBottom: 2,
    },

    headerTitle: {
      fontSize: 25,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    headerButton: {
      height: 46,
      minWidth: 64,
      paddingHorizontal: 14,
      borderRadius: 18,
      backgroundColor: colors.background,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 5,
    },

    streakText: {
      fontSize: 16,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    listContent: {
      paddingTop: 16,
      paddingHorizontal: 16,
      paddingBottom: 36,
    },

    unitCard: {
      borderRadius: 28,
      padding: 16,
      marginBottom: 18,
      backgroundColor: colors.cardSecondary,
      flexDirection: "row",
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.07,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 4,
    },

    unitCardLocked: {
      opacity: 0.62,
    },

    unitIcon: {
      width: 52,
      height: 52,
      borderRadius: 18,
      backgroundColor: colors.tabIconActive,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 13,
    },

    unitContent: {
      flex: 1,
    },

    unitTitle: {
      fontSize: 18,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    unitSubtitle: {
      marginTop: 3,
      fontSize: 13,
      fontWeight: "800",
      color: colors.tabIconActive,
    },

    unitDescription: {
      marginTop: 6,
      fontSize: 12,
      lineHeight: 17,
      fontWeight: "600",
      color: colors.textSecondary,
    },

    lessonLeft: {
      alignSelf: "flex-start",
      width: "92%",
    },

    lessonRight: {
      alignSelf: "flex-end",
      width: "92%",
    },

    lessonCard: {
      minHeight: 118,
      borderRadius: 30,
      padding: 15,
      marginBottom: 14,
      backgroundColor: colors.cardSecondary,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.08)",
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

    lessonCardLocked: {
      opacity: 0.7,
    },

    lessonTop: {
      flexDirection: "row",
      alignItems: "center",
    },

    lessonIcon: {
      width: 58,
      height: 58,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.tabIconActive,
      shadowColor: colors.tabIconActive,
      shadowOpacity: 0.35,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 4,
    },

    lessonIconLocked: {
      backgroundColor: colors.categoryIconBackground,
      shadowOpacity: 0,
      elevation: 0,
    },

    lessonInfo: {
      flex: 1,
      marginLeft: 14,
      minWidth: 0,
    },

    lessonTitle: {
      fontSize: 16,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    lessonSubtitle: {
      marginTop: 4,
      fontSize: 12,
      fontWeight: "700",
      color: colors.textSecondary,
    },

    lessonTextLocked: {
      color: colors.textSecondary,
    },

    lessonBottom: {
      marginTop: 14,
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },

    progressTrack: {
      flex: 1,
      height: 8,
      borderRadius: 999,
      overflow: "hidden",
      backgroundColor: colors.background,
    },

    progressFill: {
      height: "100%",
      borderRadius: 999,
      backgroundColor: colors.tabIconActive,
    },

    progressFillLocked: {
      backgroundColor: colors.textSecondary,
    },

    xpPill: {
      minWidth: 68,
      paddingVertical: 7,
      paddingHorizontal: 10,
      borderRadius: 999,
      backgroundColor: colors.background,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 4,
    },

    xpText: {
      fontSize: 12,
      fontWeight: "900",
      color: colors.textPrimary,
    },
  });
