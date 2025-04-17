import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import usePost from "../hook/usePost";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

export default function App() {








/*
  const { loading, error, reponse, postData } = usePost();
  useEffect(() => {
    const fn = async () => {
    
      const refresh_token = await AsyncStorage.getItem("refresh_token");


      const res = await postData({ refresh_token }, "/auth/refresh_token");


      const access_token = res.access_token;
      
      if (access_token) {
        await AsyncStorage.setItem("access_token", access_token);
        router.replace("/home");
      }
    };

    fn();
  }, []);
*/






  return (
    <View style={[styles.container, { paddingBottom: 10 }]}>
      <Text style={{ paddingBottom: 10 }}>
        Open up App.js to start working on your app!
      </Text>

      <TouchableOpacity
        style={{ paddingBottom: 10 }}
        onPress={() => {
          router.push("/signup");
        }}
      >
        <Text>SignUp</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          router.replace("/login");
        }}
      >
        <Text>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          router.replace("/driver");
        }}
      >
        <Text>Driver</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          router.replace("/user");
        }}
      >
        <Text>Map</Text>
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
