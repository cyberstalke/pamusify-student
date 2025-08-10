import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TimeContext = createContext(null);

export const TimeProvider = ({ children }) => {
  const [totalTimeSpent, setTotalTimeSpent] = useState(0); // milliseconds
  const appState = useRef(AppState.currentState);
  const startTime = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    // Load saved time from storage
    const loadTime = async () => {
      try {
        const saved = await AsyncStorage.getItem("totalAppTime");
        if (saved) {
          setTotalTimeSpent(parseInt(saved, 10));
        }
      } catch (e) {
        console.error("Failed to load time", e);
      }
    };
    loadTime();

    // Start time tracking immediately if active
    if (appState.current === "active") {
      startTime.current = Date.now();
      startInterval();
    }

    // App state change handler
    const handleAppStateChange = (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        startTime.current = Date.now();
        startInterval();
      } else if (
        appState.current === "active" &&
        nextAppState.match(/inactive|background/)
      ) {
        stopInterval();
        if (startTime.current) {
          const elapsed = Date.now() - startTime.current;
          saveTime(elapsed);
          startTime.current = null;
        }
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => {
      subscription.remove();
      stopInterval();
    };
  }, []);

  const startInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (startTime.current) {
        const elapsed = Date.now() - startTime.current;
        setTotalTimeSpent((prev) => prev + 1000);
      }
    }, 1000);
  };

  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const saveTime = async (extra = 0) => {
    try {
      const newTotal = totalTimeSpent + extra;
      setTotalTimeSpent(newTotal);
      await AsyncStorage.setItem("totalAppTime", newTotal.toString());
    } catch (e) {
      console.error("Failed to save time", e);
    }
  };

  return (
    <TimeContext.Provider value={{ totalTimeSpent }}>
      {children}
    </TimeContext.Provider>
  );
};

export const useTime = () => {
  const context = useContext(TimeContext);
  if (!context) throw new Error("useTime must be used within TimeProvider");
  return context;
};
