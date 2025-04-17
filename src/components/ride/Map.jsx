import { StyleSheet, Text, View } from "react-native";
import React from "react";
import MapView, { PROVIDER_DEFAULT } from "react-native-maps";
import { useLocation } from "../../context/LocationContext";
import { calculateRegion } from "../../lib/map";

const Map = () => {
  const { userLocation, departureLocation } = useLocation();

  if (!userLocation?.latitude || !userLocation?.longitude) {
    return <Text>Loading map...</Text>; // or a spinner
  }

  const region = calculateRegion({
    userLatitude: userLocation.latitude,
    userLongitude: userLocation.longitude,
    destinationLatitude: departureLocation?.latitude,
    destinationLongitude: departureLocation?.longitude
  });

 
  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      style={{ width: "100%", height: "50%" }}
      tintColor="black"
      showsPointsOfInterest={false}
      mapType="standard"
      showsUserLocation={true}
      initialRegion={region}
      
    ></MapView>
  );
};

export default Map;

const styles = StyleSheet.create({});
