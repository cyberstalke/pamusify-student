import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  useColorScheme,
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
    <View style={{ flex: 1 }}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <View style={{ ...styles.header, backgroundColor: colors.background }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
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
        style={{ flex: 1 }}
        useWebKit
      />
    </View>
  );
};

export default PdfViewerScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 15,
    paddingBottom: 15,
    backgroundColor: "#eee",
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
