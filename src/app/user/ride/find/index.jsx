import React, { useEffect } from "react";
import { View, Text, SafeAreaView } from "react-native";
import io from "socket.io-client";
import Map from "../../../../components/ride/Map";
import { useUser } from "../../../../context/UserContext";
import { useLocation } from "../../../../context/LocationContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const baseurl = "http://192.168.1.13:3000";

const find = () => {
  const { userData, setUserData } = useUser();
  const { userLocation, destinationLocation } = useLocation();
  useEffect(() => {
    const fn = async () => {
      const accToken = await AsyncStorage.getItem("access_token");
      const socket = io(baseurl, {
        query: { token: accToken },
        transports: ["websocket"],
      });

      socket.on("registered", (mess) => {
        console.log(mess);

        socket.emit("createRide", {
          userID: userData.UserID,
          pickup: userLocation.address,
          destination: destinationLocation.address,
          fare: 100,
        });
      });

      return () => {
        socket.disconnect();
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
    >
      <Map />

      <View className="absolute top-5 left-5 right-5 space-y-3 z-10">
        <DriverCard />
      </View>
    </SafeAreaView>
  );
};

export default find;

const DriverCard = () => {};
