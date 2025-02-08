import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ScrollView, Text, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const [users, setUser] = useState([]);
  /*
  async function trigger() {
    const res = await fetch("http://localhost:3000/users");
    const data = await res.json();

    setUser(data);
  }
  const array = [users]; //

  //useEffect(trigger, array);
*/
  useEffect(() => {
    fetch("http://localhost:3000/users")
      .then((res) => {
        return res.json();
      })
      .then((req) => {
        setUser(req);
        console.log("res:", req);
      });
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <Text>Everything working fine</Text>
        <View>
          {users &&
            users.map((item, index) => <Text key={index}>{item.name}</Text>)}
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
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
