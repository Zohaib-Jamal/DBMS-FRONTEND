import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TextInput,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocation } from "../../../context/LocationContext";
import * as Location from "expo-location";
import Map from "../../../components/ride/Map";
import CustomButton from "../../../components/CustomButton";
import { router } from "expo-router";

const choose = () => {
  const {
    setUserLocation,
    setDestinationLocation,
    userLocation,
    destinationLocation,
  } = useLocation();

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
      });
    };

    reqLocation();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#2D343C",
      }}
      className=""
    >
      <Map />
      <View className="absolute top-5 left-5 right-5 space-y-3 z-10">
        <LocationSelector
          placeholder="Current Location"
          setSelected={(e) => setUserLocation(e)}
        />
        <LocationSelector
          placeholder="Destination"
          setSelected={(e) => setDestinationLocation(e)}
        />
      </View>

      <View className="absolute bottom-4 left-5 right-5 space-y-3 z-10">
        <CustomButton
          title="Find"
          handlePress={() => {
            router.push("/user/ride/find");
          }}
          containerStyles="w-full mt-7 text-white bg-secondary"
          textStyles="text-white text-lg"
          isLoading={false}
          disabled={!destinationLocation.address}
          containerStylesNonT={{ minHeight: 60 }}
          textStylesNonT={{ fontWeight: "700" }}
        />
      </View>
    </SafeAreaView>
  );
};

export default choose;

const styles = StyleSheet.create({});

const LocationSelector = ({ placeholder, setSelected }) => {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);
  //const [selected, setSelected] = useState("");

  const { userLocation } = useLocation();

  const allSuggestions = [
    ...(userLocation ? [{ ...userLocation, address: "Current Location" }] : []),
    ...suggestions,
  ];

  const handleInput = (text) => {
    setQuery(text);
    if (text.length > 0) {
      setFiltered(
        allSuggestions.filter((item) =>
          item.address.toLowerCase().includes(text.toLowerCase())
        )
      );
    } else {
      setFiltered([]);
    }
  };

  const handleSelect = (item) => {
    setQuery(item.address);
    setSelected(item);
    setFiltered([]);

    console.log("Selected Location:", item);
    // You can also call setDestinationLocation(item) here if this is the departure field
  };

  return (
    <View className="relative mb-5">
      <TextInput
        value={query}
        onChangeText={handleInput}
        placeholder={placeholder}
        placeholderTextColor="#ccc"
        className="bg-[#3A424C] text-white p-4 rounded-xl"
      />
      {filtered.length > 0 && (
        <View className="absolute top-16 left-0 right-0 bg-[#3A424C] rounded-xl max-h-40 z-20">
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.address}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleSelect(item)}
                className="p-4 border-b border-gray-600"
              >
                <Text className="text-white">{item.address}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
};

const suggestions = [
  
  { address: "New York", latitude: 40.7128, longitude: -74.006 },
  { address: "Los Angeles", latitude: 34.0522, longitude: -118.2437 },
  { address: "Chicago", latitude: 41.8781, longitude: -87.6298 },
  { address: "Houston", latitude: 29.7604, longitude: -95.3698 },
  { address: "Miami", latitude: 25.7617, longitude: -80.1918 },
  { address: "San Francisco", latitude: 37.7749, longitude: -122.4194 },
  { address: "Seattle", latitude: 47.6062, longitude: -122.3321 },
  { address: "Boston", latitude: 42.3601, longitude: -71.0589 },
  { address: "Fast NUCES", latitude: 31.4815212, longitude: 74.3030141 },
  { address: "Plot C 108, Punjab", latitude: 31.398076, longitude: 74.1827116 },
  { address: "Liberty Market", latitude: 31.5154, longitude: 74.3426 },
  { address: "Emporium Mall", latitude: 31.4504, longitude: 74.2729 },
  { address: "Badshahi Mosque", latitude: 31.5889, longitude: 74.3115 },
  { address: "Minar-e-Pakistan", latitude: 31.5922, longitude: 74.3091 },
  { address: "Lahore Fort", latitude: 31.5906, longitude: 74.3094 },
  { address: "MM Alam Road", latitude: 31.5204, longitude: 74.3577 },
  { address: "Gaddafi Stadium", latitude: 31.5146, longitude: 74.3407 },
  { address: "Shaukat Khanum Hospital", latitude: 31.4709, longitude: 74.4084 },
  { address: "DHA Phase 6", latitude: 31.4346, longitude: 74.4211 }
];
