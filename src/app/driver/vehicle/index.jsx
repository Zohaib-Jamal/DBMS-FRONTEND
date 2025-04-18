import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Switch,
  ScrollView,
  Alert,
} from "react-native";
import { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useDriver } from "../../../context/DriverContext";
import usePost from "../../../hook/usePost";
import { router } from "expo-router";

const Addvehicle = () => {
  const [Model, setModel] = useState("");
  const [VehicleType, setType] = useState("");
  const [PlateNo, setPlateNo] = useState("");

  const { response, error, postData } = usePost();

  const[loading, setLoading] = useState(false)

  const submitVehicle = async () => {
    try {
      setLoading(true)
      const data = {
        model: Model,
        vehicleType: VehicleType,
        plateNo: PlateNo,
      };

      const res = await postData(data, "/vehicle");
      if (res.message === "Vehicle Created") {
        Alert.alert("Success", "Vehicle Created");
        router.replace("/driver");
        return;
      }
      Alert.alert("Failed", "Vehicle Creation Failed!");
    } catch (err) {
      Alert.alert("Failed", "Vehicle Creation Failed!");
      console.log("Error:", err);
    }finally{
      setLoading(false)
    }
  };

  return (
    <SafeAreaView
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        backgroundColor: "#2D343C",
      }}
    >
      <View
        style={{
          backgroundColor: "#242A33",
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
          disabled={loading}
        >
          <Text style={{ color: "white", fontSize: 16 }}>Submit Vehicle</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Addvehicle;
