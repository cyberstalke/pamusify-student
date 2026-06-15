import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  Platform,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Audio } from "expo-av";
import Animated, {
  FadeInDown,
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { getColors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import { contentApi } from "../api/content";

export default function ListeningScreen() {
  const scheme = useColorScheme();
  const colors = getColors(scheme);
  const styles = useMemo(() => createStyles(colors), [colors]);
  const isDark = scheme === "dark";
  const navigation = useNavigation();
  const route = useRoute();

  const [tracks, setTracks] = useState([]);
  const [loadingTracks, setLoadingTracks] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);
  const [completed, setCompleted] = useState([]);

  useEffect(() => {
    const lessonId = route.params?.lessonId;
    if (!lessonId) {
      setLoadingTracks(false);
      setLoadError("No lesson selected.");
      return;
    }
    contentApi.listening(lessonId)
      .then((res) => {
        const data = res?.data || res;
        setTracks(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Listening API error:", err);
        setLoadError("Failed to load listening content.");
      })
      .finally(() => setLoadingTracks(false));
  }, []);

  const soundRef = useRef(null);
  const pulseAnim = useSharedValue(1);
  const track = tracks[trackIndex];
  const progress = duration > 0 ? position / duration : 0;

  useEffect(() => {
    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  useEffect(() => {
    loadTrack();
  }, [trackIndex]);

  useEffect(() => {
    if (playing) {
      pulseAnim.value = withRepeat(
        withSequence(withTiming(1.12, { duration: 700 }), withTiming(1, { duration: 700 })),
        -1, true
      );
    } else {
      pulseAnim.value = withTiming(1, { duration: 200 });
    }
  }, [playing]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  const loadTrack = async () => {
    try {
      if (soundRef.current) {
        await soundRef.current.stopAsync();
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      setPlaying(false);
      setPosition(0);

      await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
      const source = track.audio_url ? { uri: track.audio_url } : track.source;
      const { sound } = await Audio.Sound.createAsync(source, { shouldPlay: false }, onPlaybackStatus);
      soundRef.current = sound;
    } catch (e) {
      console.warn("Audio load error:", e);
    }
  };

  const onPlaybackStatus = (status) => {
    if (!status.isLoaded) return;
    setPosition(status.positionMillis || 0);
    setDuration(status.durationMillis || 1);
    if (status.didJustFinish) {
      setPlaying(false);
      setPosition(0);
      if (!completed.includes(track.id)) setCompleted((c) => [...c, track.id]);
    }
  };

  const togglePlay = async () => {
    if (!soundRef.current) return;
    if (playing) {
      await soundRef.current.pauseAsync();
      setPlaying(false);
    } else {
      await soundRef.current.playAsync();
      setPlaying(true);
    }
  };

  const handleSeek = async (ratio) => {
    if (!soundRef.current) return;
    const ms = Math.floor(ratio * duration);
    await soundRef.current.setPositionAsync(ms);
  };

  const formatTime = (ms) => {
    const total = Math.floor(ms / 1000);
    const m = Math.floor(total / 60);
    const s = total % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (loadingTracks) {
    return (
      <SafeAreaView style={[styles.safe, { paddingTop: Platform.OS === "android" ? 40 : 0, justifyContent: "center", alignItems: "center" }]}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <ActivityIndicator size="large" color="#00c7be" />
      </SafeAreaView>
    );
  }

  if (loadError || tracks.length === 0) {
    return (
      <SafeAreaView style={[styles.safe, { paddingTop: Platform.OS === "android" ? 40 : 0, justifyContent: "center", alignItems: "center" }]}>
        <StatusBar style={isDark ? "light" : "dark"} />
        <Text style={{ fontSize: 16, color: colors.textSecondary, textAlign: "center", paddingHorizontal: 24 }}>
          {loadError || "No listening content available for this lesson."}
        </Text>
        <TouchableOpacity style={{ marginTop: 20 }} onPress={() => navigation.goBack()} activeOpacity={0.85}>
          <Text style={{ fontSize: 15, color: "#00c7be", fontFamily: fonts.semiBold }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { paddingTop: Platform.OS === "android" ? 40 : 0 }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <MaterialCommunityIcons name="arrow-left" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerLabel}>Listening</Text>
        </View>
        <View style={{ width: 44 }} />
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>

        {/* Track selector */}
        <Animated.View entering={FadeInDown.duration(380).springify().damping(16)} style={styles.trackList}>
          {tracks.map((t, i) => (
            <TouchableOpacity
              key={t.id}
              activeOpacity={0.85}
              onPress={() => setTrackIndex(i)}
              style={[styles.trackTab, i === trackIndex && styles.trackTabActive]}
            >
              <View style={styles.trackTabLeft}>
                {completed.includes(t.id) && (
                  <Ionicons name="checkmark-circle" size={16} color="#16a34a" style={{ marginRight: 6 }} />
                )}
                <Text style={[styles.trackTabText, i === trackIndex && styles.trackTabTextActive]}>
                  {t.title}
                </Text>
              </View>
              <View style={styles.levelChip}>
                <Text style={styles.levelChipText}>{t.level}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>

        {/* Player card */}
        <Animated.View
          key={trackIndex}
          entering={FadeInDown.delay(80).duration(400).springify().damping(16)}
          style={styles.playerCard}
        >
          {/* Artwork + pulse */}
          <View style={styles.artworkWrap}>
            <Animated.View style={[styles.artworkPulse, pulseStyle, { backgroundColor: "#00c7be18" }]} />
            <View style={styles.artwork}>
              <MaterialCommunityIcons name="headphones" size={40} color="#fff" />
            </View>
          </View>

          <Text style={styles.trackTitle}>{track.title}</Text>
          <Text style={styles.trackDesc}>{track.description}</Text>

          {/* Seek bar */}
          <View style={styles.seekRow}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.seekTrack}
              onPress={(e) => {
                const ratio = e.nativeEvent.locationX / e.nativeEvent.target;
                handleSeek(ratio);
              }}
            >
              <View style={styles.seekBg} />
              <View style={[styles.seekFill, { width: `${progress * 100}%` }]} />
              <View style={[styles.seekThumb, { left: `${progress * 100}%` }]} />
            </TouchableOpacity>
            <Text style={styles.timeText}>{track.duration}</Text>
          </View>

          {/* Controls */}
          <View style={styles.controls}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleSeek(Math.max(0, (position - 10000) / duration))}
              style={styles.controlBtn}
            >
              <MaterialCommunityIcons name="rewind-10" size={30} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.9} onPress={togglePlay} style={styles.playBtn}>
              <Ionicons name={playing ? "pause" : "play"} size={32} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleSeek(Math.min(1, (position + 10000) / duration))}
              style={styles.controlBtn}
            >
              <MaterialCommunityIcons name="fast-forward-10" size={30} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Transcript toggle */}
        <Animated.View entering={FadeInDown.delay(200).duration(380)}>
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setShowTranscript((v) => !v)}
            style={styles.transcriptToggle}
          >
            <View style={styles.transcriptToggleLeft}>
              <Ionicons name="document-text-outline" size={20} color={colors.tabIconActive} />
              <Text style={styles.transcriptToggleText}>Transcript</Text>
            </View>
            <Ionicons
              name={showTranscript ? "chevron-up" : "chevron-down"}
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          {showTranscript && (
            <Animated.View entering={FadeInDown.duration(300)} style={styles.transcriptBox}>
              {track.transcript.map((line, i) => (
                <View key={i} style={styles.transcriptLine}>
                  <Text style={styles.transcriptTime}>{line.time}</Text>
                  <Text style={styles.transcriptText}>{line.text}</Text>
                </View>
              ))}
            </Animated.View>
          )}
        </Animated.View>

        {/* Comprehension questions */}
        <Animated.View entering={FadeInDown.delay(280).duration(380)} style={styles.questionsBox}>
          <Text style={styles.questionsTitle}>Listen and answer</Text>
          {track.questions.map((q, i) => (
            <View key={i} style={styles.questionRow}>
              <View style={styles.questionNumBadge}>
                <Text style={styles.questionNumText}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.questionText}>{q.q}</Text>
                <View style={styles.answerReveal}>
                  <Text style={styles.answerText}>{q.a}</Text>
                </View>
              </View>
            </View>
          ))}
        </Animated.View>

      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors) =>
  StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: "row", alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 18, paddingVertical: 14,
    },
    backButton: {
      width: 44, height: 44, borderRadius: 14,
      backgroundColor: colors.cardSecondary,
      alignItems: "center", justifyContent: "center",
    },
    headerCenter: { flex: 1, alignItems: "center" },
    headerLabel: { fontSize: 16, fontFamily: fonts.semiBold, color: colors.textPrimary },
    body: { paddingHorizontal: 18, paddingBottom: 40 },
    // Track tabs
    trackList: { gap: 10, marginBottom: 16 },
    trackTab: {
      flexDirection: "row", alignItems: "center", justifyContent: "space-between",
      padding: 14, borderRadius: 18,
      backgroundColor: colors.cardSecondary, borderWidth: 1.5, borderColor: "transparent",
    },
    trackTabActive: { borderColor: "#00c7be" },
    trackTabLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
    trackTabText: { fontSize: 14, fontFamily: fonts.semiBold, color: colors.textSecondary },
    trackTabTextActive: { color: colors.textPrimary },
    levelChip: {
      paddingHorizontal: 10, paddingVertical: 4,
      borderRadius: 99, backgroundColor: "#00c7be22",
    },
    levelChipText: { fontSize: 11, fontFamily: fonts.semiBold, color: "#00c7be" },
    // Player
    playerCard: {
      borderRadius: 28, padding: 24,
      backgroundColor: colors.cardSecondary,
      alignItems: "center", marginBottom: 16,
    },
    artworkWrap: { alignItems: "center", justifyContent: "center", marginBottom: 20 },
    artworkPulse: {
      position: "absolute",
      width: 100, height: 100, borderRadius: 50,
    },
    artwork: {
      width: 80, height: 80, borderRadius: 24,
      backgroundColor: "#00c7be",
      alignItems: "center", justifyContent: "center",
      shadowColor: "#00c7be", shadowOpacity: 0.45,
      shadowRadius: 14, shadowOffset: { width: 0, height: 6 },
      elevation: 8,
    },
    trackTitle: {
      fontSize: 20, fontFamily: fonts.semiBold,
      color: colors.textPrimary, marginBottom: 6, textAlign: "center",
    },
    trackDesc: {
      fontSize: 13, fontFamily: fonts.regular,
      color: colors.textSecondary, textAlign: "center",
      lineHeight: 20, marginBottom: 24, paddingHorizontal: 10,
    },
    seekRow: {
      flexDirection: "row", alignItems: "center",
      width: "100%", gap: 10, marginBottom: 20,
    },
    timeText: { fontSize: 12, fontFamily: fonts.regular, color: colors.textSecondary, width: 36, textAlign: "center" },
    seekTrack: { flex: 1, height: 32, justifyContent: "center" },
    seekBg: { position: "absolute", left: 0, right: 0, height: 4, borderRadius: 2, backgroundColor: colors.progressLine },
    seekFill: { position: "absolute", left: 0, height: 4, borderRadius: 2, backgroundColor: "#00c7be" },
    seekThumb: {
      position: "absolute",
      width: 14, height: 14, borderRadius: 7,
      backgroundColor: "#00c7be", top: -5, marginLeft: -7,
    },
    controls: { flexDirection: "row", alignItems: "center", gap: 28 },
    controlBtn: {
      width: 48, height: 48, borderRadius: 14,
      backgroundColor: colors.background,
      alignItems: "center", justifyContent: "center",
    },
    playBtn: {
      width: 64, height: 64, borderRadius: 20,
      backgroundColor: "#00c7be",
      alignItems: "center", justifyContent: "center",
      shadowColor: "#00c7be", shadowOpacity: 0.4, shadowRadius: 12, shadowOffset: { width: 0, height: 6 },
      elevation: 8,
    },
    // Transcript
    transcriptToggle: {
      flexDirection: "row", alignItems: "center", justifyContent: "space-between",
      padding: 16, borderRadius: 18,
      backgroundColor: colors.cardSecondary, marginBottom: 12,
    },
    transcriptToggleLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
    transcriptToggleText: { fontSize: 15, fontFamily: fonts.semiBold, color: colors.textPrimary },
    transcriptBox: {
      borderRadius: 18, padding: 16,
      backgroundColor: colors.cardSecondary, marginBottom: 12,
    },
    transcriptLine: {
      flexDirection: "row", gap: 12, marginBottom: 12,
    },
    transcriptTime: {
      fontSize: 12, fontFamily: fonts.semiBold,
      color: "#00c7be", width: 36, paddingTop: 1,
    },
    transcriptText: {
      flex: 1, fontSize: 14, fontFamily: fonts.regular,
      color: colors.textPrimary, lineHeight: 22,
    },
    // Questions
    questionsBox: {
      borderRadius: 24, padding: 20,
      backgroundColor: colors.cardSecondary,
    },
    questionsTitle: {
      fontSize: 16, fontFamily: fonts.semiBold,
      color: colors.textPrimary, marginBottom: 16,
    },
    questionRow: {
      flexDirection: "row", gap: 12,
      marginBottom: 16, paddingBottom: 16,
      borderBottomWidth: 1, borderBottomColor: colors.progressLine,
    },
    questionNumBadge: {
      width: 30, height: 30, borderRadius: 10,
      backgroundColor: "#00c7be22",
      alignItems: "center", justifyContent: "center",
      marginTop: 2,
    },
    questionNumText: { fontSize: 13, fontFamily: fonts.semiBold, color: "#00c7be" },
    questionText: {
      fontSize: 14, fontFamily: fonts.semiBold,
      color: colors.textPrimary, marginBottom: 8, lineHeight: 20,
    },
    answerReveal: {
      paddingHorizontal: 12, paddingVertical: 6,
      borderRadius: 10, backgroundColor: "#00c7be15",
      alignSelf: "flex-start",
    },
    answerText: { fontSize: 13, fontFamily: fonts.semiBold, color: "#00c7be" },
  });
