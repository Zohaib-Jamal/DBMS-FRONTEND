import { StyleSheet, Text, View,ActivityIndicator } from "react-native";
import React from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useLocation } from "../../context/LocationContext";
import { calculateRegion } from "../../lib/map";


const darkMapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#2D343C" }],
  },
  {
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#B0B8C1" }], // light gray-blue for text contrast
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#1E242B" }], // darker shade of base
  },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#3A424C" }], // slightly lighter than base
  },
  {
    featureType: "poi",
    elementType: "geometry",
    stylers: [{ color: "#2A3138" }], // close to base but varied
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9BA6B2" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#232A30" }], // a muted green-gray
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#798089" }],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [{ color: "#383F48" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#B0B8C1" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#1E242B" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#313840" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#20262C" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6E7A88" }],
  },
];

const Map = () => {
  const { userLocation, destinationLocation } = useLocation();

  if (!userLocation?.latitude || !userLocation?.longitude) {
    return (
      <View className="flex-1 justify-center items-center ">
        <ActivityIndicator color="#FFBC07" size="large" />
      </View>
    ); 
  }

  const region = calculateRegion({
    userLatitude: userLocation.latitude,
    userLongitude: userLocation.longitude,
    destinationLatitude: destinationLocation?.latitude,
    destinationLongitude: destinationLocation?.longitude,
  });

  return (
    <MapView
      style={styles.map}
      showsUserLocation={true}
      initialRegion={region}
      customMapStyle={darkMapStyle}
    >
      {/* Marker for destination */}
      {destinationLocation?.latitude && destinationLocation?.longitude && (
        <Marker
          coordinate={{
            latitude: destinationLocation.latitude,
            longitude: destinationLocation.longitude,
          }}
          title="Destination"
        />
      )}

      {/* Polyline between user and destination */}
      {destinationLocation?.latitude && destinationLocation?.longitude && (
        <Polyline
          coordinates={[
            {
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            },
            {
              latitude: destinationLocation.latitude,
              longitude: destinationLocation.longitude,
            },
          ]}
          strokeColor="#FFBC07"
          strokeWidth={4}
        />
      )}
    </MapView>
  );
};

export default Map;

const styles = StyleSheet.create({
  map: {
    width: "100%",
    top: "-10%",
    height: "120%",
    borderRadius: 16,
    overflow: "hidden",
  },
});
