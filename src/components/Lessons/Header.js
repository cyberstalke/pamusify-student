import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  useColorScheme,
  Platform,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { getColors } from "../../utils/colors";
import { useNavigation } from "@react-navigation/native";

const Header = ({ title, streak = 7 }) => {
  const scheme = useColorScheme();
  const colors = getColors(scheme);
  const navigation = useNavigation();

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: colors.cardSecondary,
        },
      ]}
    >
      <View style={styles.container}>
        {/* LEFT */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.goBack()}
          style={[
            styles.backButton,
            {
              backgroundColor: colors.background,
            },
          ]}
        >
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        {/* CENTER */}
        <View style={styles.centerContent}>
          <Text
            numberOfLines={1}
            style={[styles.title, { color: colors.textPrimary }]}
          >
            {title}
          </Text>

          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Continue learning
          </Text>
        </View>

        {/* RIGHT */}
        <TouchableOpacity
          activeOpacity={0.85}
          style={[
            styles.streakContainer,
            {
              backgroundColor: colors.background,
            },
          ]}
        >
          <MaterialCommunityIcons name="fire" size={18} color="#FF9F0A" />

          <Text style={[styles.streakText, { color: colors.textPrimary }]}>
            {streak}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 10,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    ...Platform.select({
      android: {
        elevation: 5,
      },
    }),
  },

  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 18,
  },

  backButton: {
    width: 46,
    height: 46,
    borderRadius: 16,

    alignItems: "center",
    justifyContent: "center",
  },

  centerContent: {
    flex: 1,
    alignItems: "center",
    marginHorizontal: 12,
  },

  title: {
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 0.3,
  },

  subtitle: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "700",
  },

  streakContainer: {
    minWidth: 58,
    height: 46,
    borderRadius: 16,

    paddingHorizontal: 12,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },

  streakText: {
    fontSize: 15,
    fontWeight: "900",
  },
});

export default Header;
