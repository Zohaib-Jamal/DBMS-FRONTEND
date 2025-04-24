import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Easing,
  Alert,
  Modal,
} from "react-native";
import Map from "../../../../components/ride/Map";
import { BASE_URL } from "../../../../constants";
import { useRide } from "../../../../context/RideContext";
import { router } from "expo-router";
import { useLocation } from "../../../../context/LocationContext";
import usePost from "../../../../hook/usePost"
import AntDesign from "@expo/vector-icons/AntDesign";

const baseurl = BASE_URL;



const find = () => {
  const { rideData, socket } = useRide();
  const { setDestinationLocation } = useLocation();
  const [modalVisible, setModalVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [expanded, setExpanded] = useState(false);





  const {postData} = usePost()
  const handleRating = async (rating) => {

    const res =  await postData({rating, rideID:rideData.rideID}, "/ride/rating/user")

    router.replace("/driver")
    
  };






  useEffect(() => {
    setDestinationLocation({
      address: rideData.arrival,
      longitude: rideData.longitude,
      latitude: rideData.latitude,
    });

    socket.current.on("rideCompleted", (msg) => {
      setModalVisible(true);
      //router.replace("/driver");
    });

    socket.current.on("rideCancelled", (msg) => {
      Alert.alert("Cancelled", "Ride cancelled by user.")
      router.replace("/driver");
    });
  }, []);

  const toggleSheet = () => {
    Animated.timing(slideAnim, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
    setExpanded(!expanded);
  };

  const heightInterpolate = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [80, 220],
  });

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#2D343C",
      }}
    >
      <Map />
      <Rating modalVisible={modalVisible} setModalVisible={setModalVisible} handleRating={handleRating}/>

      {rideData && (
        <Animated.View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: "#1C1F26",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            padding: 16,
            height: heightInterpolate,
            zIndex: 10,
          }}
        >
          <TouchableOpacity onPress={toggleSheet}>
            <View className="items-center mb-2">
              <View className="bg-gray-500 h-1.5 w-12 rounded-full" />
            </View>
          </TouchableOpacity>

          <Text className="text-white text-base font-psemibold mb-1">
            {rideData.userName}
          </Text>
          <Text className="text-gray-300 text-sm mb-1 font-pregular">
            From: {rideData.departure}
          </Text>
          <Text className="text-gray-300 text-sm mb-1 font-pregular">
            To: {rideData.arrival}
          </Text>
          <Text className="text-[#FFBC07] text-sm font-pbold mb-4 ">
            Fare: Rs. {rideData.fare}
          </Text>

          {expanded && (
            <TouchableOpacity
              onPress={() => {
                socket.current.emit("completeRide", {
                  userID: rideData.userID,
                  driverID: rideData.driverID,
                });
              }}
              className="bg-secondary p-2 rounded-xl items-center"
            >
              <Text className="text-white font-pbold text-sm">
                Complete Ride
              </Text>
            </TouchableOpacity>
          )}
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

export default find;

const Rating = ({ modalVisible, setModalVisible, handleRating }) => {
  const [rating, setRating] = useState(0);
  return (
    <Modal
      visible={modalVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={() => setModalVisible(false)}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        //className="bg-[#1c1c1c]"
      >
        <View
          style={{
            // backgroundColor: "#fff",
            padding: 20,
            borderRadius: 10,
            alignItems: "center",
            width: 300,
          }}
          className="bg-[#1c1c1c]"
        >
          <Text
            className="text-white font-pmedium"
            style={{ fontSize: 18, marginBottom: 15 }}
          >
            Rate Your Driver
          </Text>
          <View style={{ flexDirection: "row", marginBottom: 17 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                onPress={() => {
                  setRating(star);
                }}
              >
                <View className="px-2">
                  <AntDesign
                    name="star"
                    size={30}
                    color={star <= rating ? "#FFBC07" : "white"}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={() => {
              handleRating(rating);
            }}
            style={{
              backgroundColor: "#FFBC07",
              padding: 10,
              borderRadius: 5,
            }}
          >
            <Text style={{ color: "#fff" }}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
