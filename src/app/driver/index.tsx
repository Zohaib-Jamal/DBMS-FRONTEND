import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";

const home = () => {
  return (
    <View>
      <Text>Hello Diver</Text>

      <TouchableOpacity
        onPress={() => {
          router.push("/driver/vehicle");
        }}
      >
        <Text>Add Vehicle</Text>
      </TouchableOpacity>
    </View>
  );
};

export default home;
