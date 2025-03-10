import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { useState } from "react";
import { useUser } from "../../context/UserContext";
export default function App() {
  const [isUser, setIsUser] = useState(true);
  const { userData } = useUser();

  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const { setUserData } = useUser();

  const submit = async () => {
    try {
      if (pass !== cpass) {
        alert("Passwords do not match!");
        return;
      }

      setLoading(true);
      setError(null);
      setResponse(null);

      if (isUser) {
        const res = await fetch("http://192.168.1.14:3000/signup/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        });

        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.message || "Something went wrong!");
        }

        setResponse(result);
      } else {
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: 10 }]}>
      <TouchableOpacity
        style={{ paddingBottom: 10 }}
        onPress={() => {
          setIsUser(true);
        }}
      >
        <Text>Register as Passenger</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          router.push("/login");
        }}
      >
        <Text>Register as Rider</Text>
      </TouchableOpacity>
 
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
