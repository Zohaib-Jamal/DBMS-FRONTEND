import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

export default function App() {
  return (
    <View style={[styles.container, { paddingBottom: 10 }]}>
      <Text  style={{ paddingBottom: 10 }}>Open up App.js to start working on your app!</Text>


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
          router.push("/login");
        }}
      >
        <Text>Login</Text>
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
