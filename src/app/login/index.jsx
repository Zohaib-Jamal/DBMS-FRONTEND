import {
  SafeAreaView,
  Text,
  TextInput,
  View,
  Button,
  TouchableOpacity,
} from "react-native";
import { useState } from "react";
import usePost from "../../hook/usePost";
const login = () => {
  const [userName, setUsername] = useState();
  const [password, setPassword] = useState();
  const { response, error, loading, postData } = usePost();

  const submit = async () => {
    try {
      const data = { userName, password };
      await postData(data, "/login");
      /*
       setLoading(true);
      setError(null);
      setResponse(null);
      
      console.log(data)
      const res = await fetch("http://192.168.1.14:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Something went wrong!");
      }

      setResponse(result);
      */
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ paddingTop: 20 }}>
      <TextInput
        placeholder="Username"
        value={userName}
        onChangeText={(e) => setUsername(e)}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(e) => setPassword(e)}
      />

      <TouchableOpacity
        style={{ padding: 10, backgroundColor: "blue", marginTop: 10 }}
        onPress={submit}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          {loading ? "Hold On..." : "Login"}
        </Text>
      </TouchableOpacity>
      {response && <Text style={{ color: "green" }}>{response.message}</Text>}
      {error && <Text style={{ color: "red" }}>Error: {error.message}</Text>}
    </SafeAreaView>
  );
};

export default login;
