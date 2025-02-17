import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import theme from "../../lib/theme";
import AntDesign from "@expo/vector-icons/AntDesign";

const Button = ({
  title = "Button",
  onPress,
  themeType = "light",
  disable,
}) => {
  const isDarkTheme = themeType === "dark";

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: isDarkTheme ? "#000" : "#fff" },
      ]}
      onPress={onPress}
      disabled={disable}
    >
      <Text
        style={[styles.buttonText, { color: isDarkTheme ? "#fff" : "#000" }]}
      >
        {title}
      </Text>
      <AntDesign
        name="login"
        size={24}
        color={isDarkTheme ? "white" : "black"}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginHorizontal: 20,
    marginVertical: 10,
    width: "100%",
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  buttonText: {
    fontSize: 20,
    fontFamily: theme.fonts.regular,
  },
});

export default Button;
