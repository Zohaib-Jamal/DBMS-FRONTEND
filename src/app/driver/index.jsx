import {
  SafeAreaView,
  Text,
  TextInput,
  View,
  Image,
  Button,
  TouchableOpacity,
  Switch,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Avatar } from "react-native-elements";
import { StatusBar } from "react-native";
import { useState, useEffect } from "react";
import usePost from "../../hook/usePost";
import { router } from "expo-router";
import useGet from "../../hook/useGet";
import { useDriver } from "../../context/DriverContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const Divider = ({
  width = "90%",
  height = 1,
  color = "gray",
  marginVertical = 20,
}) => {
  return (
    <View
      style={{
        width: width,
        height: height,
        backgroundColor: color,
        marginVertical: marginVertical,
      }}
    />
  );
};

const home = () => {
  const { driverData, setDriverData } = useDriver();
  const { getData } = useGet();

  useEffect(() => {
    const fn = async () => {
      const res = await getData("/driver/details");

      setDriverData(res.data);
    };

    fn();
  }, []);

  const [rides, setRides] = useState([]);
  const [vehicle, setVehicle] = useState(null);
  const [rideLoading, setRideLoading] = useState([]);
  const [vehicleLoading, setVehicleLoading] = useState(false);
  useEffect(() => {
    const fn = async () => {
      setRideLoading(true);
      setVehicleLoading(true);
      const res = await getData("/driver/history");
      if(res === "No record found!"){
        setRideLoading(false);
        setRides([])
        
      }else{
        const filtered = res.data.map(
          ({ ArrivalLocation, DepartureLocation, RideDate }) => ({
            ArrivalLocation,
            DepartureLocation,
            RideDate,
          })
        );
  
        setRides(filtered);
        setRideLoading(false);
      }

      

      const vehicleRes = await getData("/vehicle");
      console.log("veh", vehicleRes)
      if(vehicleRes === "No record found!"){
        setVehicleLoading(false);
        setVehicle(null)
        return
      }

      if (vehicleRes?.data) {
        setVehicle(vehicleRes.data);
      }
      setVehicleLoading(false);
    };

    fn();
  }, [driverData]);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("access_token");
    await AsyncStorage.removeItem("refresh_token");

    setDriverData(null);
    router.replace("/");
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#2D343C",
      }}
      className="px-5"
    >
      {!driverData || !driverData.firstName ? (
        <View className="flex-1 justify-center items-center ">
          <ActivityIndicator color="#FFBC07" size="large" />
        </View>
      ) : (
        <ScrollView>
          <View className="pt-5 flex-row justify-between items-center">
            <Text
              style={{
                

                color: "white",
                fontStyle: "bold",
              }}
             className="font-pbold text-2xl mt-5 pt-5"
            >
              Hello, {driverData.firstName}!
            </Text>
            <View className="pt-5">
              <TouchableOpacity onPress={handleLogout}>
                <FontAwesome name="sign-out" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",

              width: "100%",
              marginTop: 30,
              marginBottom: 30,
            }}
            className="justify-center items-center"
          >
            <TouchableOpacity
              style={{
                width: 150,
                backgroundColor: "#242A33",
                borderRadius: 10,
                alignItems: "center",
                borderColor: "#3B414D",
                height: 100,
                justifyContent: "center",

                shadowColor: "#000",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.4,
                shadowRadius: 6.5,
                elevation: 10,
              }}
              className="mr-2"
              onPress={() => {
                router.push("/driver/vehicle");
              }}
            >
              <FontAwesome name="car" size={40} color="#FFBC07" />
              <Text className="font-plight text-white pt-2">Add Vehicle</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: 150,
                backgroundColor: "#242A33",
                borderRadius: 10,
                alignItems: "center",
                borderColor: "#242A33",

                height: 100,
                justifyContent: "center",

                shadowColor: "#000",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.4,
                shadowRadius: 6.5,
                elevation: 10,
              }}
              className="ml-2"
              onPress={() => {
                if (vehicle) router.push("/driver/ride");
                else {
                  Alert.alert("No Vehicle", "Add vehicle to start ride");
                }
              }}
            >
              <MaterialCommunityIcons
                name="run-fast"
                size={40}
                color="#FFBC07"
              />
              <Text className="font-plight text-white pt-2">Start Ride</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              backgroundColor: "#242A33",

              borderRadius: 10,
              shadowColor: "#000",
              elevation: 20,

              shadowColor: "#000",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.4,
              shadowRadius: 6.5,
              elevation: 10,
            }}
            className="w-full p-5 mb-5"
          >
            <Text className="font-pbold text-lg text-white ">
              Your Vehicle:
            </Text>
            {!vehicleLoading ? (
              vehicle ? (
                <VehicleCard
                  plate={vehicle.PlateNo}
                  model={vehicle.Model}
                  type={vehicle.VehicleType}
                />
              ) : (
                <Text className="text-white font-plight text-sm text-center mt-10">
                  Add your vehicle!
                </Text>
              )
            ) : (
              <View className="flex-1 justify-center items-center ">
                <ActivityIndicator color="#FFBC07" size="large" />
              </View>
            )}
          </View>

          <StatusBar backgroundColor="#2D343C" style="dark" />

          <View
            style={{
              backgroundColor: "#242A33",

              borderRadius: 10,
              shadowColor: "#000",
              elevation: 20,

              shadowColor: "#000",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.4,
              shadowRadius: 6.5,
              elevation: 10,
            }}
            className="w-full p-5 h-full"
          >
            <Text className="font-pbold text-lg text-white ">
              Your Activity:
            </Text>
            {!rideLoading ? (
              rides.length > 0 ? (
                rides
                  .sort((a, b) => new Date(b.RideDate) - new Date(a.RideDate))
                  .map((item, index) => {
                    if (
                      item.ArrivalLocation !== "null" &&
                      item.DepartureLocation !== "null" &&
                      item.RideDate !== "null"
                    ) {
                      return (
                        <RecentCard
                          key={index}
                          from={item.ArrivalLocation}
                          to={item.DepartureLocation}
                          date={new Date(item.RideDate).toLocaleDateString()}
                        />
                      );
                    } else {
                      return null;
                    }
                  })
              ) : (
                <Text className="text-white font-plight text-sm text-center mt-10">
                  Complete a ride now to see it here!
                </Text>
              )
            ) : (
              <View className="flex-1 justify-center items-center ">
                <ActivityIndicator color="#FFBC07" size="large" />
              </View>
            )}
          </View>
        </ScrollView>
      )}
      <StatusBar backgroundColor="#2D343C" style="dark" />
    </SafeAreaView>
  );
};

export default home;

const RecentCard = ({ from, to, date }) => {
  return (
    <View className="flex flex-col">
      <Divider color="white" width="100%" />
      <View className="flex-row justify-between items-center">
        <Text className="font-psemibold text-sm text-white ">From: {from}</Text>
        <Text className="font-plight text-xs text-white ">Dated: {date}</Text>
      </View>
      <Text className="font-psemibold text-sm text-white mt-2">To: {to}</Text>
    </View>
  );
};

const VehicleCard = ({ model, plate, type }) => {
  return (
    <View className="flex flex-col mt-3">
      <View className="flex-row justify-between items-center">
        <Text className="font-psemibold text-sm text-white ">
          Model: {model}
        </Text>
        <Text className="font-psemibold text-sm text-white ">
          Plate No: {plate}
        </Text>
      </View>
      <Text className="font-psemibold text-sm text-white mt-2">
        Type: {type}
      </Text>
    </View>
  );
};
