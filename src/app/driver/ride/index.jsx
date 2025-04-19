import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "../../../context/LocationContext";
import * as Location from "expo-location";
import Map from "../../../components/ride/Map";
import io from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDriver } from "../../../context/DriverContext";
import { useRide } from "../../../context/RideContext";
import {router} from "expo-router"
import { BASE_URL } from "../../../constants";

const baseurl = BASE_URL;

const choose = () => {
  const { setUserLocation } = useLocation();
 const { setRideData,socket } = useRide();
  const [requests, setRequests] = useState([]);
  const { driverData } = useDriver();

  const [hasPermissions, setHasPermissions] = useState(false);


  useEffect(() => {
    const reqLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status != "granted") {
        setHasPermissions(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync();

      const address = await Location.reverseGeocodeAsync({
        latitude: location.coords?.latitude,
        longitude: location.coords?.longitude,
      });

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: `${address[0].name}, ${address[0].region}`,
      });
    };

    reqLocation();

    //socket

    const fn = async () => {
    
      const accToken = await AsyncStorage.getItem("access_token");
      
      socket.current = io(baseurl, {
        query: { token: accToken },
        transports: ["websocket"],
      });

      socket.current.on("registered", (mess) => {
        console.log(mess);
        socket.current.on("newRideRequest", (mess) => {
          console.log("ride", mess);
          setRequests((prev) => [...prev, mess]);
        });

        socket.current.on("rideAccepted", (mess) => {
          
          setRideData(mess);
          router.replace("/driver/ride/started");
        });
      });

      return () => {
        socket.current.disconnect();
      };
    };
    fn();
  }, []);


  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#2D343C",
      }}
      className=""
    >
      <Map />

      <View className="absolute top-5 left-5 right-5 space-y-3 z-10">
        {requests.length > 0 ? (
          requests.map((item, index) => (
            <RequestCard
              key={index}
              destination={item.destination}
              fare={item.fare}
              pickup={item.pickup}
              status={item.status}
              onFareSubmit={(customFare) => {
                socket.current.emit("availableDriver", {
                  userID: item.userID,
                  pickup: item.pickup,
                  destination: item.destination,
                  fare: customFare,
                  driverID: driverData.DriverId,
                  rating: driverData.rating,
                  firstName: driverData.firstName,
                  lastName: driverData.lastName,
                });
              }}
            />
          ))
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-white text-xl">Searching...</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default choose;

const RequestCard = ({ destination, fare, pickup, status, onFareSubmit }) => {
  const [customFare, setCustomFare] = useState("");

  const handleSubmitFare = () => {
    if (onFareSubmit && customFare) {
      onFareSubmit(Number(customFare));
      setCustomFare("");
    }
  };

  return (
    <TouchableOpacity
      className="bg-[#242A33] rounded-2xl p-4 w-full max-w-sm mx-auto mb-5"
      activeOpacity={1}
    >
      <Text className="text-[#FFBC07] text-lg font-semibold mb-1">
        {destination}
      </Text>
      <Text className="text-gray-300 text-sm mb-3">Pickup: {pickup}</Text>

      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-white text-sm">Status: {status}</Text>
        <Text className="bg-[#FFBC07] text-black px-2 py-1 rounded font-bold text-sm">
          Rs. {fare}
        </Text>
      </View>

      {/* Rider Fare Input */}
      <TextInput
        placeholder="Enter your fare"
        placeholderTextColor="#888"
        value={customFare}
        onChangeText={setCustomFare}
        keyboardType="numeric"
        className="bg-white text-black px-3 py-2 rounded mb-2"
      />

      <TouchableOpacity
        onPress={handleSubmitFare}
        className="bg-[#FFBC07] rounded p-2 items-center"
      >
        <Text className="text-black font-bold text-sm">Submit Fare</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};
