import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import theme from "../../lib/theme";
import { images } from "../../constants";
import Button from "../../components/general/Button";
import { Link, router } from "expo-router";

export default function Login() {
  const [username, setUsername] = useState("m");
  const [password, setPassword] = useState("zohaib");

  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.heading}>Don't have an account?</Text>
      </View>

      <TextInput
        style={styles.input}
        value={username}
        onChangeText={(t) => setUsername(t)}
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={(t) => setPassword(t)}
      />

      <View style={styles.promptContainer}>
        <Button
          title="Submit"
          onPress={() => router.push("/login")}
          themeType="dark"
        />
        <Text style={styles.spanText}>
          Already have an account?{" "}
          <Text style={styles.spanTextBlack} onPress={() => {}}>
            Log In
          </Text>
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
    paddingTop: 100,
  },
  input: {
    borderColor: "white",
    borderRadius: 4,
    borderWidth: 2,
    padding: 5,
    fontSize: 20,
  },
  textContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontFamily: theme.fonts.bold,
    fontSize: 40,
    color: "white",
  },
  subHeading: {
    fontFamily: theme.fonts.light,
    fontSize: 20,
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
