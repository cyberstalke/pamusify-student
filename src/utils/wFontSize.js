// utils/responsive.js
import { Dimensions, PixelRatio } from "react-native";

const { width, height } = Dimensions.get("window");

// Dizayn asosida tanlangan universal o'lcham
const guidelineBaseWidth = 360;
const guidelineBaseHeight = 640;

// Font o'lchamini moslashtiruvchi funksiya
export const vwFontSize = (size) => {
  const scaleWidth = width / guidelineBaseWidth;
  const scaleHeight = height / guidelineBaseHeight;
  const scale = Math.min(scaleWidth, scaleHeight);
  const newSize = size * scale;

  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Width uchun moslashtirish (masalan, padding, margin, radius va boshqalar)
export const vw = (size) => (width / guidelineBaseWidth) * size;

// Height uchun moslashtirish (agar kerak bo‘lsa)
export const vh = (size) => (height / guidelineBaseHeight) * size;
