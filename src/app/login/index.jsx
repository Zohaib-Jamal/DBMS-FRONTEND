import {
  SafeAreaView,
  Text,
  TextInput,
  View,
  Button,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import usePost from "../../hook/usePost";
import { router } from "expo-router";

const login = () => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const { response, error, loading, postData } = usePost();

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  useEffect(() => {
    setEmail("123@gmail.com");
    setPassword("12345678");
  }, []);

  const submit = async () => {
    try {
      const data = { email, password };
      if (!isEnabled) {
        console.log("user");
        const res = await postData(data, "/auth/user/login");
        if (res?.access_token) {
          router.replace("/user");
        } else {
          Alert.alert("Error", res ? res : "An Error Occured");
        }
      } else {
        const res = await postData(data, "/auth/driver/login/email");
        if (res?.access_token) {
          router.replace("/driver");
        } else {
          Alert.alert("Error", res ? res : "An Error Occured");
        }
      }
    } catch (err) {
      setError(err);
    } finally {
    }
  };

  return (
    <SafeAreaView
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        backgroundColor: "#1c1c1c",
      }}
    >
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View
          style={{
            backgroundColor: "#4a4a4a",
            height: 370,
            width: 300,
            borderRadius: 10,
            shadowColor: "#000",
            elevation: 20,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: 30,
              color: "white",
              fontWeight: "bold",
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            Login
          </Text>

          <TextInput
            style={{
              width: "90%",
              borderRadius: 10,
              backgroundColor: "#1a1a1a",
              color: "white",
              fontSize: 16,
              marginBottom: 20,
              paddingLeft: 20,
            }}
            placeholder="Email"
            placeholderTextColor="#4a4a4a"
            value={email}
            onChangeText={(e) => setEmail(e)}
          />

          <TextInput
            style={{
              width: "90%",
              borderRadius: 10,
              backgroundColor: "#1a1a1a",
              color: "white",
              fontSize: 16,
              marginBottom: 10,
              paddingLeft: 20,
            }}
            placeholder="Password"
            placeholderTextColor="#4a4a4a"
            value={password}
            onChangeText={(e) => setPassword(e)}
          />
          {/* Switch for User Type */}
          <View
            style={{
              flexDirection: "row", // Aligns switch and labels horizontally
              alignItems: "center", // Centers switch vertically
              marginBottom: 10, // Adds space below the switch
            }}
          >
            <Text style={{ color: "white", fontSize: 16, marginRight: 10 }}>
              Login A Driver
              {/* Display current user type */}
            </Text>

            <Switch
              trackColor={{ false: "#767577", true: "#FFBC07" }}
              thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
          {/* Login Button */}
          <TouchableOpacity
            style={{
              width: "89%",
              backgroundColor: "#4a4a4a",
              borderRadius: 10,
              alignItems: "center",
              borderColor: "white",
              borderWidth: 1,
              height: 50,
              justifyContent: "center",
            }}
            onPress={submit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFBC07" size="large" />
            ) : (
              <Text style={{ color: "white", fontSize: 18 }}>Login</Text>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View
            style={{
              width: "90%", // Divider width
              height: 1, // Divider height (thin line)
              backgroundColor: "white", // Divider color
              marginVertical: 20, // Adds spacing above and below the divider
            }}
          />

          {/* Don't have an account? Sign up */}
          <View
            style={{
              flexDirection: "row", // Makes the text and button line up horizontally
              alignItems: "center", // Aligns text vertically in the center
              marginTop: 0, // Adds space above
            }}
          >
            <Text style={{ color: "white", fontSize: 16 }}>
              Don't have an account?{" "}
            </Text>

            <TouchableOpacity onPress={() => router.push("/signup")}>
              <Text
                style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <StatusBar backgroundColor="#1c1c1c" style="dark" />
    </SafeAreaView>
  );
};

export default login;
