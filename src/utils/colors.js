export const getColors = (mode = "dark") => {
  const isDark = mode === "dark";

  return {
    background: isDark ? "#0C0C3E" : "#FFFFFF",
    gradientStart: isDark ? "#1A1C56" : "#E0E4FF",
    gradientEnd: isDark ? "#0C0C3E" : "#F2F4FF",

    cardBackground: isDark ? "#5C78F0" : "#DCE3FF",
    cardSecondary: isDark ? "#A9B6FF" : "#667AFF",

    textPrimary: isDark ? "#FFFFFF" : "#000000",
    textSecondary: isDark ? "#D4D6F9" : "#4A4A6A",

    tabBarBackground: isDark ? "#14171F" : "#F0F2FA",
    tabIconActive: isDark ? "#B2BDFF" : "#374BCE",
    tabIconInactive: isDark ? "#6A6E9C" : "#A0A4C0",

    categoryIconBackground: isDark ? "#A0A9C8" : "#D3D8ED",

    accent: isDark ? "#B2BDFF" : "#5064FF",
    lockIcon: isDark ? "#D4D6F9" : "#8B8FB0",

    sleepCard1: isDark ? "#C3D4FF" : "#EBF0FF",
    sleepCard2: isDark ? "#D9C4FF" : "#F3E8FF",
  };
};
