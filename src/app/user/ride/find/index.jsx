import React, { useEffect, useState, useRef } from "react";
import { View, Text, SafeAreaView, TouchableOpacity } from "react-native";
import io from "socket.io-client";
import Map from "../../../../components/ride/Map";
import { useUser } from "../../../../context/UserContext";
import { useLocation } from "../../../../context/LocationContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRide } from "../../../../context/RideContext";
import { BASE_URL } from "../../../../constants";
import { router } from "expo-router";

const baseurl = BASE_URL;

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (value) => (value * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance);
}

const find = () => {
  const { userData, setUserData } = useUser();
  const { setRideData, socket } = useRide();
  const { userLocation, destinationLocation } = useLocation();
  const [offers, setOffers] = useState([]);

  useEffect(() => {
    const fn = async () => {
      const accToken = await AsyncStorage.getItem("access_token");
      socket.current = io(baseurl, {
        query: { token: accToken },
        transports: ["websocket"],
      });

      socket.current.on("registered", (mess) => {
        console.log(mess);

        socket.current.emit("createRide", {
          userID: userData.UserID,
          pickup: userLocation.address,
          destination: destinationLocation.address,
          fare:
            haversine(
              userLocation.latitude,
              userLocation.longitude,
              destinationLocation.latitude,
              destinationLocation.longitude
            ) * 15,
        });

        socket.current.on("counterOffer", (mess) => {
          setOffers((prev) => [...prev, { ...mess, pending: false }]);
        });

        socket.current.on("rideAccepted", (mess) => {
          setRideData(mess);
          router.replace("/user/ride/find/started");
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
    >
      <Map />

      <View className="absolute top-5 left-5 right-5 space-y-3 z-10">
        {offers.length > 0 ? (
          offers.map((item, index) => (
            <OfferCard
              key={index}
              fare={item.fare}
              firstName={item.firstName}
              lastName={item.lastName}
              rating={item.rating}
              pending={item.pending}
              onAccept={() => {
                setOffers((prevOffers) =>
                  prevOffers.map((offer, i) =>
                    i === index ? { ...offer, pending: true } : offer
                  )
                );

                socket.current.emit("acceptRide", {
                  userID: item.userID,
                  departure: item.pickup,
                  arrival: item.destination,
                  fare: item.fare,
                  driverID: item.driverID,
                  longitude: destinationLocation.longitude,
                  latitude: destinationLocation.latitude,
                  driverName: `${item.firstName} ${item.lastName}`,
                  driverRating: item.rating,
                  userName: `${userData.firstname} ${userData.lastname}`,
                  userRating: userData.rating,
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

export default find;

const OfferCard = ({
  fare,
  firstName,
  lastName,
  rating,
  onAccept,
  pending,
}) => {
  return (
    <View
      className="bg-[#242A33] rounded-2xl p-4 w-full max-w-sm mx-auto mb-5"
      activeOpacity={1}
    >
      <Text className="text-[#FFBC07] text-lg font-semibold mb-1">
        Driver: {firstName} {lastName}
      </Text>
      <Text className="text-gray-300 text-sm mb-3">
        Rating: {rating === "null" || !rating ? "New Driver" : rating}
      </Text>

      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-white text-sm">Fare</Text>
        <Text className="bg-[#FFBC07] text-black px-2 py-1 rounded font-bold text-sm">
          Rs. {fare}
        </Text>
      </View>

      {pending ? (
        <Text className="text-yellow-400 text-center font-bold">Pending</Text>
      ) : (
        <TouchableOpacity
          onPress={onAccept}
          className="bg-[#FFBC07] rounded p-2 items-center"
        >
          <Text className="text-black font-bold text-sm">Accept</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
