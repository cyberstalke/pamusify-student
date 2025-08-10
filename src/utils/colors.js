export const getColors = (mode = "dark") => {
  const isDark = mode === "dark";

  return {
    background: isDark ? "#0d1f31" : "#efefef",
    cardBackground: isDark ? "#00c7be" : "#00c7be",
    cardSecondary: isDark ? "#1e222a" : "#ffffff",
    textPrimary: isDark ? "#FFFFFF" : "#000000",
    textSecondary: isDark ? "#D4D6F9" : "#4A4A6A",
    tabBarBackground: isDark ? "#1e222a" : "#F0F2FA",
    tabIconActive: isDark ? "#409cfb" : "#ff9720",
    tabIconInactive: isDark ? "#8f9195" : "#8f9195",
    categoryIconBackground: isDark ? "#A0A9C8" : "#D3D8ED",
    purple: isDark ? "#8E97FD" : "#8E97FD",
    progressLine: isDark ? "#34383f" : "#e9e9ea",
  };
};
