import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  useColorScheme,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import { attendanceApi } from "../api/attendance";
import { getColors } from "../utils/colors";

export default function ScanScreen() {
  const scheme = useColorScheme();
  const colors = getColors(scheme);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isDark = scheme === "dark";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleScan = () => {
    const trimmed = code.trim();
    if (!trimmed) {
      setError("Please enter a QR code.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    attendanceApi.scanQR(trimmed)
      .then((res) => {
        setResult(res?.data || res);
      })
      .catch((err) => {
        console.error("ScanQR error:", err);
        setError(err?.message || "Failed to scan QR code. Please try again.");
      })
      .finally(() => setLoading(false));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerLabel}>Attendance</Text>
          <Text style={styles.headerTitle}>QR Scan</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons
              name="qrcode-scan"
              size={56}
              color={colors.tabIconActive}
            />
          </View>

          <Text style={styles.hint}>Enter the QR code from your teacher</Text>

          <TextInput
            style={styles.input}
            placeholder="Paste or type QR code here..."
            placeholderTextColor={colors.textSecondary}
            value={code}
            onChangeText={(text) => {
              setCode(text);
              setError(null);
              setResult(null);
            }}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.button}
            onPress={handleScan}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </View>

        {result && (
          <View style={[styles.resultCard, styles.successCard]}>
            <MaterialCommunityIcons
              name="check-circle-outline"
              size={28}
              color="#22c55e"
            />
            <View style={styles.resultContent}>
              <Text style={styles.resultTitle}>Attendance Recorded</Text>
              {result.detail && (
                <Text style={styles.resultText}>{result.detail}</Text>
              )}
              {result.status && (
                <Text style={styles.resultText}>Status: {result.status}</Text>
              )}
              {result.date && (
                <Text style={styles.resultText}>Date: {result.date}</Text>
              )}
            </View>
          </View>
        )}

        {error && (
          <View style={[styles.resultCard, styles.errorCard]}>
            <MaterialCommunityIcons
              name="alert-circle-outline"
              size={28}
              color="#ef4444"
            />
            <View style={styles.resultContent}>
              <Text style={[styles.resultTitle, { color: "#ef4444" }]}>Error</Text>
              <Text style={styles.resultText}>{error}</Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: Platform.OS === "android" ? 38 : 0,
    },

    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingHorizontal: 18,
    },

    header: {
      paddingTop: 16,
      paddingBottom: 20,
    },

    headerLabel: {
      fontSize: 13,
      fontWeight: "900",
      color: colors.tabIconActive,
      marginBottom: 3,
    },

    headerTitle: {
      fontSize: 29,
      fontWeight: "900",
      color: colors.textPrimary,
    },

    card: {
      borderRadius: 32,
      padding: 22,
      backgroundColor: colors.cardSecondary,
      shadowColor: "#000",
      shadowOpacity: 0.08,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
      ...Platform.select({ android: { elevation: 5 } }),
    },

    iconWrap: {
      alignSelf: "center",
      width: 96,
      height: 96,
      borderRadius: 32,
      backgroundColor: colors.background,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 18,
    },

    hint: {
      textAlign: "center",
      fontSize: 14,
      fontWeight: "700",
      color: colors.textSecondary,
      marginBottom: 18,
    },

    input: {
      height: 52,
      borderRadius: 18,
      backgroundColor: colors.background,
      paddingHorizontal: 16,
      fontSize: 15,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: 14,
    },

    button: {
      height: 52,
      borderRadius: 18,
      backgroundColor: colors.tabIconActive,
      alignItems: "center",
      justifyContent: "center",
    },

    buttonText: {
      fontSize: 16,
      fontWeight: "900",
      color: "#fff",
    },

    resultCard: {
      marginTop: 16,
      borderRadius: 24,
      padding: 16,
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
    },

    successCard: {
      backgroundColor: "#f0fdf4",
    },

    errorCard: {
      backgroundColor: "#fef2f2",
    },

    resultContent: {
      flex: 1,
    },

    resultTitle: {
      fontSize: 15,
      fontWeight: "900",
      color: "#22c55e",
      marginBottom: 4,
    },

    resultText: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.textSecondary,
      marginTop: 2,
    },
  });
