import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useLocation } from "../../../context/LocationContext";
import * as Location from "expo-location";
import Map from "../../../components/ride/Map";
import GoogleTextInput from "../../../components/ride/GoogleTextInput";

const choose = () => {
  const { setUserLocation, setDepartureLocation } = useLocation();

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

      console.log({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        address: `${address[0].name}, ${address[0].region}`,
      })
    };


    reqLocation()
  }, []);
  return (
    <View style={{ flex: 1 }}>
      <GoogleTextInput />
      <Map/>
      <Text>Choose</Text>
    </View>
  );
};

export default choose;

const styles = StyleSheet.create({});
