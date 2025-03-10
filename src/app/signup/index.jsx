import { SafeAreaView, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useUser } from "../../context/UserContext";
import usePost from "../../hook/usePost";

const Signup = () => {
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [cpass, setcPass] = useState("");
  const [dob, setDOB] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const { setUserData } = useUser();
  const { response, error, loading, postData } = usePost();

  const submit = async () => {
    try {
      if (pass !== cpass) {
        alert("Passwords do not match!");
        return;
      }
      const data = { firstName, lastName, email, pass, dob };
      await postData(data, '/signup')
      /*
      setLoading(true);
      setError(null);
      setResponse(null);
      
      const data = { firstName, lastName, email, pass, dob };
      setUserData(data)
      const res = await fetch("http://192.168.1.14:3000/signup/", {
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
    <SafeAreaView style={{ padding: 20 }}>
      <TextInput
        placeholder="Enter First Name"
        value={firstName}
        onChangeText={setfirstName}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Enter Last Name"
        value={lastName}
        onChangeText={setlastName}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Enter Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Enter Password"
        value={pass}
        onChangeText={setPass}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        secureTextEntry
      />
      <TextInput
        placeholder="Confirm Password"
        value={cpass}
        onChangeText={setcPass}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
        secureTextEntry
      />

      <TouchableOpacity onPress={() => setShowPicker(!showPicker)}>
        <Text>{dob.toDateString()}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={dob}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            if (selectedDate) setDOB(selectedDate);
            setShowPicker(false);
          }}
        />
      )}

      <TouchableOpacity
        style={{ padding: 10, backgroundColor: "blue", marginTop: 10 }}
        onPress={submit}
      >
        <Text style={{ color: "white", textAlign: "center" }}>
          {loading ? "Submitting..." : "Submit"}
        </Text>
      </TouchableOpacity>

      {response && <Text style={{ color: "green" }}>{response.message}</Text>}
      {error && <Text style={{ color: "red" }}>Error: {error.message}</Text>}
    </SafeAreaView>
  );
};

export default Signup;
