import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";
const index = () => {
    
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TouchableOpacity
        onPress={() => {
          router.replace("/user/ride");
        }}
      >
        <Text>Map</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          router.replace("/user/bus");
        }}
      >
        <Text>Bus</Text>
      </TouchableOpacity>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
