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
import FontAwesome from "@expo/vector-icons/FontAwesome";
import LoginInput from "../../components/general/LoginInput";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitBtn = async () => {
    try {
      setLoading(true);
      const data = {
        username: username,
        password: password,
      };
      console.log(data);

      const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.status === 404) throw new Error("Unknown req");
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.heading}>Have an account?</Text>
      </View>

      <View
        style={{
          height: "80%",
          width: "40%",
          backgroundColor: "white",
          borderRadius: "5%",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            marginTop: "50px",
            fontSize: "50px",
            fontFamily: theme.fonts.bold,
          }}
        >
          Login
        </Text>

        <LoginInput />
        <View>
          <View>
            <Text
              style={{
                marginTop: "40px",
                //marginLeft: "40px",
                fontSize: "20px",
                fontStyle: "Bold",
              }}
            >
              Password
            </Text>
            <View
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                flexDirection: "row",
                marginTop: "10px",
                //marginLeft: "50px",
              }}
            >
              <FontAwesome name="user-o" size={24} color={"gray"} />
              <TextInput
                style={[
                  styles.input,
                  {
                    marginLeft: "10px",
                    outline: "none",
                    width: "400px",
                    color: "gray",
                  },
                ]}
                value={username}
                onChangeText={(t) => setUsername(t)}
                placeholder="Enter your Password"
                autoFocus={false}
              />
            </View>
          </View>
        </View>
      </View>

      <TextInput
        style={styles.input}
        value={password}
        onChangeText={(t) => setPassword(t)}
        placeholder="Password"
      />

      <View style={styles.promptContainer}>
        <Button
          title="Submit"
          onPress={submitBtn}
          themeType="dark"
          disable={loading}
        />
        <Text style={styles.spanText}>
          Don't have an account?{" "}
          <Text
            style={styles.spanTextBlack}
            onPress={() => {
              router.replace("/signup");
            }}
          >
            Sign Up
          </Text>
        </Text>
      </View>

      <StatusBar backgroundColor="#161622" style="light" />
      {error ? <Text>Error Occured</Text> : ""}
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
