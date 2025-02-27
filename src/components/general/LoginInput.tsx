import { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import theme from "../../lib/theme";

const LoginInput = () => {
  const [username, setUsername] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.label}>Username</Text>
        <View style={[styles.inputContainer]}>
          <FontAwesome name="user-o" size={24} color="gray" />
          <TextInput
            style={[styles.input, {}]}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your Username"
            autoFocus={false}
          />
        </View>
      </View>
      <View style={styles.underline} />
    </View>
  );
};

export default LoginInput;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  label: {
    marginTop: 40,
    fontSize: 20,
    fontWeight: "bold",
  },
  inputContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 10,
    padding: 5,
  },
  input: {
    width: 400,
    color: "gray",
    padding: 5,
    fontSize: 20,
    
  },
  underline: {
    width: 430,
    backgroundColor: "gray",
    height: 1,
    marginTop: 5,
  },
});
