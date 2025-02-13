import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../lib/theme";
import { images } from "../constants";
import Button from "../components/general/Button";
import { router } from "expo-router";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoCircle}>
        <Image source={images.logo} style={styles.logo} />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.heading}>Find a best</Text>
        <Text style={styles.subHeading}>Taxi Ride</Text>
      </View>
      <View style={styles.promptContainer}>
        <Button
          title="Login"
          onPress={() => alert("Pressed")}
          themeType="dark"
        />
        <Text style={styles.spanText}>
          Don't have an account?{" "}
          <Text style={styles.spanTextBlack}>Sign Up</Text>
        </Text>
      </View>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  textContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontFamily: theme.fonts.regular,
    fontSize: 40,
    color: "white",
  },
  subHeading: {
    fontFamily: theme.fonts.bold,
    fontSize: 40,
    color: "white",
  },
  logo: {
    width: 200,
    height: 200,
  },
  logoCircle: {
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
    marginBottom: 50,
  },
  promptContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  spanText: {
    marginTop: 10,
    fontFamily: theme.fonts.medium,
    fontSize: 15,
    color: "white",
  },
  spanTextBlack: {
    color: "black",
    fontWeight: "bold",
  },
});
