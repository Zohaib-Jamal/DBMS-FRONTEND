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
import { useNavigation } from "@react-navigation/native";
const Addvehicle = () => {
  const [Model, setModel] = useState("");
  const [VehicleType, setType] = useState("");
  const [PlateNo, setPlateNo] = useState("");

  const { response, error, loading, postData } = usePost();
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);
  const submitVehicle = async () => {
    try {
      const data = {
        model: Model,
        type: VehicleType,
        plate: PlateNo,
      };

      const res = await postData(data, "/vehicle/add");
      if (res?.success) {
        router.replace("/driver"); // or navigate somewhere else
      }
    } catch (err) {
      console.log("Error:", err);
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
      <View
        style={{
          backgroundColor: "#4a4a4a",
          padding: 20,
          width: "90%",
          borderRadius: 10,
          shadowColor: "#000",
          elevation: 20,
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 22,
            marginBottom: 20,
            alignSelf: "center",
            fontFamily: "sans-serif",
          }}
        >
          Add Vehicle Details
        </Text>

        {/* Vehicle Model */}
        <TextInput
          style={{
            backgroundColor: "white",
            marginBottom: 15,
            padding: 10,
            borderRadius: 5,
          }}
          placeholder="Vehicle Model"
          placeholderTextColor="gray"
          value={Model}
          onChangeText={setModel}
        />

        {/* Vehicle Type */}
        <TextInput
          style={{
            backgroundColor: "white",
            marginBottom: 15,
            padding: 10,
            borderRadius: 5,
          }}
          placeholder="Vehicle Type"
          placeholderTextColor="gray"
          value={VehicleType}
          onChangeText={setType}
        />

        {/* Plate Number */}
        <TextInput
          style={{
            backgroundColor: "white",
            marginBottom: 20,
            padding: 10,
            borderRadius: 5,
          }}
          placeholder="Plate Number"
          placeholderTextColor="gray"
          value={PlateNo}
          onChangeText={setPlateNo}
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={{
            backgroundColor: "#1c1c1c",
            padding: 15,
            borderRadius: 10,
            alignItems: "center",
            borderColor: "white",
            borderWidth: 1,
          }}
          onPress={submitVehicle}
        >
          <Text style={{ color: "white", fontSize: 16 }}>Submit Vehicle</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Addvehicle;
