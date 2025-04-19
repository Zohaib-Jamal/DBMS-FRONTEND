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

          <Text className="text-white text-base font-semibold mb-1">
            {rideData.userName}
          </Text>
          <Text className="text-gray-300 text-sm mb-1">
            From: {rideData.departure}
          </Text>
          <Text className="text-gray-300 text-sm mb-1">
            To: {rideData.arrival}
          </Text>
          <Text className="text-[#FFBC07] text-sm font-bold mb-4">
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
              <Text className="text-white font-bold text-sm">
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

const Rating = ({ modalVisible, setModalVisible,  handleRating}) => {

 

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
        
      >
        <View
          style={{
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 10,
            alignItems: "center",
            width: 300,
          }}
            
        >
          <Text style={{ fontSize: 18, marginBottom: 15 }}>
            Rate Your Passenger
          </Text>
          <View style={{ flexDirection: "row", marginBottom: 15 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => handleRating(star)}>
                <Text style={{ fontSize: 30, color: "#FFBC07", paddingHorizontal:5 }}>⭐</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(false);
              router.replace("/driver");
            }}
            style={{
              backgroundColor: "#FFBC07",
              padding: 10,
              borderRadius: 5,
            }}
          >
            <Text style={{ color: "#fff" }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
