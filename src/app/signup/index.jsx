import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useUser } from "../../context/UserContext";
import usePost from "../../hook/usePost";
import { router } from "expo-router";

const Signup = () => {
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cpass, setcPass] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [cnic, setCnic] = useState("");
  const [dob, setDOB] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const { setUserData } = useUser();
  const { response, error, loading, postData } = usePost();
  useEffect(() => {
    setfirstName("Zohaib");
    setlastName("jamal");
    setEmail("123@gmail.com");
    setPassword("12345678");
    setPhoneNumber("12345678");
  }, []);

  const submit = async () => {
    try {
      /*
      if (pass !== cpass) {
        alert("Passwords do not match!");
        return;
      }*/
      const phoneNumber = "0123-1234567";

      const data = { firstName, lastName, email, password, dob, phoneNumber };
      await postData(data, "/auth/user/signup");
      router.push("/user/bus")
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
      <ScrollView
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 100,
        }}
        keyboardShouldPersistTaps="handled"
      >
        {/*<View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >*/}

        <View
          style={{
            backgroundColor: "#4a4a4a",
            //height: 7,
            width: 300,
            borderRadius: 10,
            shadowColor: "#000",
            elevation: 20,
            alignItems: "center",
            paddingTop: 5,
            paddingBottom: 25,
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
            SignUp
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
            placeholder="Enter First Name"
            value={firstName}
            placeholderTextColor="#4a4a4a"
            onChangeText={(e) => setfirstName(e)}
          />

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
            placeholder="Enter Last Name"
            value={lastName}
            placeholderTextColor="#4a4a4a"
            onChangeText={(e) => setlastName(e)}
          />

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
            placeholder="Enter Email"
            value={email}
            placeholderTextColor="#4a4a4a"
            onChangeText={(e) => setEmail(e)}
          />

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
            placeholder="Enter PhoneNo"
            value={phoneNumber}
            placeholderTextColor="#4a4a4a"
            onChangeText={(e) => setPhoneNumber(e)}
          />

          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            style={{
              width: "90%",
              borderRadius: 10,
              backgroundColor: "#1a1a1a",
              paddingLeft: 20,
              justifyContent: "center",
              height: 50, // approximate height of TextInput
              marginBottom: 20,
            }}
          >
            <Text
              style={{
                color: dob ? "white" : "#4a4a4a", // show placeholder color if empty
                fontSize: 16,
              }}
            >
              {dob ? dob.toDateString() : "Select Date of Birth"}
            </Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={dob || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowPicker(false);
                if (selectedDate) setDOB(selectedDate);
              }}
            />
          )}

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
            placeholder="Enter Password"
            value={password}
            placeholderTextColor="#4a4a4a"
            onChangeText={(e) => setPassword(e)}
            secureTextEntry
          />

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
            placeholder="Confirm Password"
            value={cpass}
            placeholderTextColor="#4a4a4a"
            onChangeText={(e) => setcPass(e)}
            secureTextEntry
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
              Sign up as Driver {/* Display current user type */}
            </Text>

            <Switch
              trackColor={{ false: "#767577", true: "#767577" }}
              thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
              onValueChange={toggleSwitch}
              value={isEnabled}
              backgroundColor = "4a4a4a"
            />
          </View>

          {isEnabled && (
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
              placeholder="Enter CNIC"
              value={cnic}
              placeholderTextColor="#4a4a4a"
              onChangeText={(e) => setCnic(e)}
              secureTextEntry
            />
          )}
          {/* Login Button */}
          <TouchableOpacity
            style={{
              width: "89%",
              backgroundColor: "#4a4a4a", // Blue button color
              borderRadius: 10,
              alignItems: "center", // Centers the text inside the button
              borderColor: "white",
              borderWidth: 1,
              height: 40,
              justifyContent: "center",
            }}
            onPress={submit}
          >
            <Text style={{ color: "white", fontSize: 18 }}>Sign Up</Text>
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
              Already have an account?{" "}
            </Text>

            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text
                style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
              >
                Log In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Signup;
