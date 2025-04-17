import {
  SafeAreaView,
  Text,
  TextInput,
  View,
  Image,
  Button,
  TouchableOpacity,
  Switch,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Avatar } from "react-native-elements";

import { useState, useEffect } from "react";
import usePost from "../../hook/usePost";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";

const Divider = ({
  width = "90%",
  height = 1,
  color = "gray",
  marginVertical = 20,
}) => {
  return (
    <View
      style={{
        width: width, // Divider width
        height: height, // Divider height
        backgroundColor: color, // Divider color
        marginVertical: marginVertical, // Spacing above and below the divider
      }}
    />
  );
};

const home = () => {
  const navigation = useNavigation();
  const [name, setname] = useState();
  const initials = name ? name.slice(0, 2).toUpperCase() : "";

  useEffect(() => {
    setname("Zohaib");
  }, []);

  // Disable header for this screen
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView
      style={{
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        backgroundColor: "#1c1c1c",
      }}
    >
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View
          style={{
            backgroundColor: "#4a4a4a",
            height: 700,
            width: 350,
            borderRadius: 10,
            shadowColor: "#000",
            elevation: 20,
            alignItems: "center",
          }}
        >
          <Avatar
            rounded
            size={120}
            title={initials} // shows initials if no image
            containerStyle={{
              backgroundColor: "skyblue",
              marginTop: 35,
            }}
          />
          <Text
            style={{
              fontSize: 35,
              marginTop: 20,
              color: "white",
              fontStyle: "bold",
            }}
          >
            Hello, {name}!
          </Text>

          <Divider></Divider>
          <View
            style={{
              flexDirection: "row", // Align buttons in a row
              justifyContent: "space-evenly", // Adds space between buttons
              width: "100%", // Full width
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: "white",
                fontStyle: "bold",
              }}
            >
              Rating: 4.5
            </Text>

            <Text
              style={{
                fontSize: 20,
                color: "white",
                fontStyle: "bold",
              }}
            >
              Rides: 120
            </Text>
          </View>

          {/* Divider */}
          <Divider></Divider>

          <View
            style={{
              flexDirection: "row", // Align buttons in a row
              justifyContent: "space-evenly", // Adds space between buttons
              width: "100%", // Full width
              marginTop: 10,
              flexWrap: "wrap",
            }}
          >
            <TouchableOpacity
              style={{
                width: "35%",
                backgroundColor: "white",
                borderRadius: 10,
                alignItems: "center",
                borderColor: "black",
                borderWidth: 0,
                height: 100,
                justifyContent: "center",
                marginBottom: 30,
              }}
              onPress={() => router.push("/Addvehicle")}
            >
              <FontAwesome name="car" size={40} color="gray" />
              <FontAwesome name="plus" size={20} color="gray" />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: "35%",
                backgroundColor: "white",
                borderRadius: 10,
                alignItems: "center",
                borderColor: "white",
                borderWidth: 0,
                height: 100,
                justifyContent: "center",
                marginBottom: 30,
              }}
              onPress={() => console.log("Adding vehicle")}
            >
              <FontAwesome name="suitcase" size={40} color="gray" />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: "35%",
                backgroundColor: "white",
                borderRadius: 10,
                alignItems: "center",
                borderColor: "white",
                borderWidth: 0,
                height: 100,
                justifyContent: "center",
                marginBottom: 10,
              }}
              onPress={() => console.log("Adding vehicle")}
            >
              <FontAwesome name="suitcase" size={40} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: "35%",
                backgroundColor: "white",
                borderRadius: 10,
                alignItems: "center",
                borderColor: "white",
                borderWidth: 0,
                height: 100,
                justifyContent: "center",
                marginBottom: 10,
              }}
              onPress={() => console.log("Adding vehicle")}
            >
              <FontAwesome name="suitcase" size={40} color="gray" />
            </TouchableOpacity>
          </View>
          <Divider></Divider>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default home;
