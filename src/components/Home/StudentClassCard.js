import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  useColorScheme,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { getColors } from "../../utils/colors";
import { fonts } from "../../utils/fonts";
import { vwFontSize } from "../../utils/wFontSize";

const StudentClassCard = ({ item }) => {
  const schem = useColorScheme();
  const colors = getColors(schem);
  const navigation = useNavigation();

  const renderStudentAvatars = (students = []) => {
    if (!students || students.length === 0) {
      return null;
    }

    const studentsToShow = students.slice(0, 2);
    const remainingStudents = students.length - studentsToShow.length;

    return (
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {studentsToShow.map((image, index) => (
          <Image
            key={index}
            source={image}
            style={{
              width: 43,
              height: 43,
              borderRadius: 50,
              marginLeft: index > 0 ? -15 : 0,
              borderWidth: 2,
              borderColor: colors.cardSecondary,
            }}
          />
        ))}
        {remainingStudents > 0 && (
          <View
            style={{
              width: 43,
              height: 43,
              borderRadius: 50,
              backgroundColor: "#00c7be",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: -15,
              borderWidth: 2,
              borderColor: colors.cardSecondary,
            }}
          >
            <Text style={{ fontWeight: "bold", color: "white" }}>
              {`+${remainingStudents}`}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("MyCourse", { courseId: item.id });
      }}
      style={{
        ...styles.classCard,
        backgroundColor: "#00c7be",
      }}
    >
      <View>
        <Text style={{ ...styles.h1, color: "white" }}>{item.name}</Text>
        <Text style={{ ...styles.levelText, color: "white" }}>
          Level: {item.level}
        </Text>
      </View>
      {renderStudentAvatars(item.students)}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontFamily: fonts.semiBold,
    fontSize: vwFontSize(20),
    color: "white",
  },
  levelText: {
    fontFamily: fonts.regular,
    fontSize: vwFontSize(14),
    marginTop: 2,
    opacity: 0.8,
  },
  classCard: {
    padding: 20,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    marginTop: 15,
    // iOS Shadow properties
    shadowColor: "#00c7be",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5.46,
    // Android Shadow property
    elevation: 9,
  },
});

export default StudentClassCard;
