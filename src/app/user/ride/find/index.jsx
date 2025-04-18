import React, { useEffect } from "react";
import { View, Text,SafeAreaView } from "react-native";
import io from "socket.io-client";
import Map from "../../../../components/ride/Map";


const baseurl = "http://192.168.1.13:3000";

const find = () => {
  useEffect(() => {
    const socket = io(baseurl);

    socket.on("welcome", (message) => {
      console.log(message);
    });

    socket.emit("message", "Hello from the client!");

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#2D343C",
      }}
    
    >
      <Map />
    </SafeAreaView>
  );
};

export default find;
