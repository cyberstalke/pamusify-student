import React, { useState, useCallback } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  FadeInDown,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  withRepeat,
  interpolate,
  Extrapolation,
  ZoomIn,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { getColors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import { useAuth } from "../context/AuthContext";

// ─── Animated input ─────────────────────────────────────────────────────────

function AnimatedField({
  label,
  value,
  onChangeText,
  secureTextEntry,
  colors,
  isDark,
}) {
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const floatAnim = useSharedValue(value ? 1 : 0);
  const borderAnim = useSharedValue(0);

  const labelStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          floatAnim.value,
          [0, 1],
          [0, -24],
          Extrapolation.CLAMP
        ),
      },
      {
        scale: interpolate(
          floatAnim.value,
          [0, 1],
          [1, 0.82],
          Extrapolation.CLAMP
        ),
      },
    ],
    color: withTiming(
      borderAnim.value ? "#00c7be" : isDark ? "#8f9195" : "#aaa",
      { duration: 180 }
    ),
  }));

  const wrapperStyle = useAnimatedStyle(() => ({
    borderColor: withTiming(focused ? "#00c7be" : isDark ? "#2a3a4a" : "#e0e0e0", {
      duration: 200,
    }),
    borderWidth: withTiming(focused ? 2 : 1, { duration: 200 }),
  }));

  const handleFocus = () => {
    setFocused(true);
    floatAnim.value = withTiming(1, { duration: 200 });
    borderAnim.value = 1;
  };

  const handleBlur = () => {
    setFocused(false);
    borderAnim.value = 0;
    if (!value) floatAnim.value = withTiming(0, { duration: 200 });
  };

  return (
    <Animated.View
      style={[
        styles.fieldWrapper,
        wrapperStyle,
        { backgroundColor: colors.cardSecondary },
      ]}
    >
      <Animated.Text style={[styles.floatingLabel, labelStyle]}>
        {label}
      </Animated.Text>
      <TextInput
        style={[styles.fieldInput, { color: colors.textPrimary }]}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        secureTextEntry={secureTextEntry && !showPass}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {secureTextEntry && (
        <Pressable onPress={() => setShowPass((p) => !p)} style={styles.eyeBtn}>
          <Ionicons
            name={showPass ? "eye-off-outline" : "eye-outline"}
            size={20}
            color={isDark ? "#8f9195" : "#aaa"}
          />
        </Pressable>
      )}
    </Animated.View>
  );
}

// ─── Decorative blob ────────────────────────────────────────────────────────

function Blob({ style }) {
  return <Animated.View entering={FadeIn.duration(800)} style={style} />;
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function LoginScreen() {
  const scheme = useColorScheme();
  const colors = getColors(scheme);
  const isDark = scheme === "dark";
  const navigation = useNavigation();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const shakeX = useSharedValue(0);
  const btnScale = useSharedValue(1);

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: btnScale.value }],
  }));

  const triggerShake = () => {
    shakeX.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withRepeat(withTiming(10, { duration: 80 }), 4, true),
      withTiming(0, { duration: 50 })
    );
  };

  const handleLogin = useCallback(async () => {
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Please enter your username and password.");
      triggerShake();
      return;
    }
    setLoading(true);
    try {
      const success = await login(username.trim(), password);
      if (success) {
        navigation.reset({ index: 0, routes: [{ name: "tab" }] });
      } else {
        setError("Invalid credentials. Please try again.");
        triggerShake();
      }
    } finally {
      setLoading(false);
    }
  }, [username, password]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Background decorations */}
      <Blob
        style={[
          styles.blob,
          styles.blobTop,
          { backgroundColor: isDark ? "#00c7be22" : "#00c7be18" },
        ]}
      />
      <Blob
        style={[
          styles.blob,
          styles.blobBottom,
          { backgroundColor: isDark ? "#00c7be15" : "#00c7be10" },
        ]}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={20}
      >
        <View style={styles.inner}>
          {/* Logo badge */}
          <Animated.View entering={ZoomIn.delay(100).springify()} style={styles.logoBadge}>
            <Ionicons name="school" size={32} color="#fff" />
          </Animated.View>

          {/* Heading */}
          <Animated.Text
            entering={FadeInDown.delay(180).duration(500).springify()}
            style={[styles.title, { color: colors.textPrimary }]}
          >
            Welcome Back
          </Animated.Text>
          <Animated.Text
            entering={FadeInDown.delay(260).duration(500).springify()}
            style={[styles.subtitle, { color: colors.textSecondary }]}
          >
            Sign in to continue learning
          </Animated.Text>

          {/* Form card */}
          <Animated.View
            entering={FadeInDown.delay(340).duration(500).springify()}
            style={[
              styles.card,
              {
                backgroundColor: isDark ? "#111f2e" : "#ffffff",
                shadowColor: isDark ? "#000" : "#b0c8d8",
              },
            ]}
          >
            <Animated.View style={shakeStyle}>
              <AnimatedField
                label="Username"
                value={username}
                onChangeText={setUsername}
                colors={colors}
                isDark={isDark}
              />

              <AnimatedField
                label="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                colors={colors}
                isDark={isDark}
              />

              {error ? (
                <Animated.Text
                  entering={FadeInDown.duration(300)}
                  style={styles.errorText}
                >
                  {error}
                </Animated.Text>
              ) : null}
            </Animated.View>

            {/* Login button */}
            <Animated.View style={[styles.btnWrap, btnStyle]}>
              <Pressable
                onPressIn={() => {
                  btnScale.value = withSpring(0.96, { damping: 10 });
                }}
                onPressOut={() => {
                  btnScale.value = withSpring(1, { damping: 10 });
                }}
                onPress={handleLogin}
                disabled={loading}
                style={({ pressed }) => [
                  styles.btn,
                  pressed && { opacity: 0.9 },
                ]}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText}>Login</Text>
                )}
              </Pressable>
            </Animated.View>
          </Animated.View>

          {/* Footer hint */}
          <Animated.Text
            entering={FadeInDown.delay(500).duration(400)}
            style={[styles.hint, { color: colors.textSecondary }]}
          >
            Contact your teacher if you need access
          </Animated.Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  flex: { flex: 1 },

  blob: {
    position: "absolute",
    borderRadius: 999,
  },
  blobTop: {
    width: 260,
    height: 260,
    top: -80,
    right: -60,
  },
  blobBottom: {
    width: 200,
    height: 200,
    bottom: -60,
    left: -60,
  },

  inner: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },

  logoBadge: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: "#00c7be",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#00c7be",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },

  title: {
    fontSize: 28,
    fontFamily: fonts.semiBold,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    marginBottom: 28,
  },

  card: {
    borderRadius: 20,
    padding: 24,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 6,
  },

  // Floating label field
  fieldWrapper: {
    height: 58,
    borderRadius: 14,
    paddingHorizontal: 16,
    justifyContent: "center",
    marginBottom: 16,
    position: "relative",
  },
  floatingLabel: {
    position: "absolute",
    left: 16,
    fontSize: 15,
    fontFamily: fonts.regular,
    transformOrigin: "left center",
  },
  fieldInput: {
    fontSize: 15,
    fontFamily: fonts.regular,
    paddingTop: 14,
    height: 58,
  },
  eyeBtn: {
    position: "absolute",
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },

  errorText: {
    color: "#ff5a5a",
    fontSize: 13,
    fontFamily: fonts.regular,
    marginTop: -4,
    marginBottom: 8,
  },

  btnWrap: { marginTop: 8 },
  btn: {
    height: 54,
    borderRadius: 14,
    backgroundColor: "#00c7be",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00c7be",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: fonts.semiBold,
  },

  hint: {
    marginTop: 24,
    textAlign: "center",
    fontSize: 12,
    fontFamily: fonts.regular,
  },
});
