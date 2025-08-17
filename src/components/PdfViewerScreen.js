import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  useColorScheme,
  SafeAreaView,
} from "react-native";
import { WebView } from "react-native-webview";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { getColors } from "../utils/colors";

const PdfViewerScreen = ({ route, navigation }) => {
  const { title, fileSource } = route.params;
  const schem = useColorScheme();
  const colors = getColors(schem);
  const isDark = schem === "dark";
  const [loading, setLoading] = useState(true);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cardSecondary }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={{ ...styles.header, backgroundColor: colors.cardSecondary }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={24}
              color={colors.textPrimary}
            />
          </TouchableOpacity>
          <Text
            style={{ ...styles.headerTitle, color: colors.textPrimary }}
            numberOfLines={1}
          >
            {String(title) || "PDF Viewer"}
          </Text>
          <View style={{ width: 34 }} />
        </View>

        {loading && (
          <View style={styles.loaderOverlay}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={{ marginTop: 10 }}>Loading PDF...</Text>
          </View>
        )}

        <WebView
          source={fileSource}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          style={{
            flex: 1,
            backgroundColor: colors.background,
          }}
          useWebKit
        />
      </View>
    </SafeAreaView>
  );
};

export default PdfViewerScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingBottom: 15,
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
  },
  backButton: { padding: 5 },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
  },
  loaderOverlay: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});
