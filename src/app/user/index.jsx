import {
  SafeAreaView,
  Text,
  TextInput,
  View,
  Image,
  Button,
  TouchableOpacity,
  Switch,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Avatar } from "react-native-elements";
import { StatusBar } from "react-native";
import { useState, useEffect } from "react";
import usePost from "../../hook/usePost";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";
import useGet from "../../hook/useGet";
import { useUser } from "../../context/UserContext";


const Divider = ({
  width = "90%",
  height = 1,
  color = "gray",
  marginVertical = 20,
}) => {
  return (
    <View
      style={{
        width: width,
        height: height,
        backgroundColor: color,
        marginVertical: marginVertical,
      }}
    />
  );
};

const home = () => {
  const navigation = useNavigation();
  const [name, setname] = useState();
  const [data, setData] = useState(null);
  const { userData, setUserData } = useUser();

  const [rides, setRides] = useState(null);

  const { getData } = useGet();

  useEffect(() => {
    const fn = async () => {
      const res = await getData("/user/data");
      console.log(res);
      setUserData(res.data);
    };

    fn();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#2D343C",
      }}
      className="px-5"
    >
      {!userData || !userData.firstname? (
        <View className="flex-1 justify-center items-center ">
          <ActivityIndicator color="#FFBC07" size="large" />
        </View>
      ) : (
        <ScrollView>
          <View className="pt-5">
            <Text
              style={{
                fontSize: 35,

                color: "white",
                fontStyle: "bold",
              }}
              className="font-pbold text-lg pt-14"
            >
              Hello, {userData.firstname}!
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",

              width: "100%",
              marginTop: 30,
              marginBottom: 30,
            }}
            className="justify-center items-center"
          >
            <TouchableOpacity
              style={{
                width: 150,
                backgroundColor: "#242A33",
                borderRadius: 10,
                alignItems: "center",
                borderColor: "#3B414D",
                height: 100,
                justifyContent: "center",

                shadowColor: "#000",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.4,
                shadowRadius: 6.5,
                elevation: 10,
              }}
              className="mr-2"
              onPress={() => router.push("/user/ride")}
            >
              <FontAwesome name="car" size={40} color="#FFBC07" />
              <Text className="font-plight text-white pt-2">Intra City</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: 150,
                backgroundColor: "#242A33",
                borderRadius: 10,
                alignItems: "center",
                borderColor: "#242A33",

                height: 100,
                justifyContent: "center",

                shadowColor: "#000",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.4,
                shadowRadius: 6.5,
                elevation: 10,
              }}
              className="ml-2"
              onPress={() => router.push("/user/bus")}
            >
              <FontAwesome name="bus" size={40} color="#FFBC07" />
              <Text className="font-plight text-white pt-2">Inter City</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              backgroundColor: "#242A33",

              borderRadius: 10,
              shadowColor: "#000",
              elevation: 20,

              shadowColor: "#000",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.4,
              shadowRadius: 6.5,
              elevation: 10,
            }}
            className="w-full p-5 h-full"
          >
            <Text className="font-pbold text-lg text-white ">
              Your Activity:
            </Text>
            {rides ? (
              rides.map(() => {
                <RecentCard
                  from={rides.from}
                  to={rides.to}
                  date={rides.dated}
                />;
              })
            ) : (
              <Text className="text-white font-plight text-sm text-center mt-10">
                Book a ride now to see it here!
              </Text>
            )}
          </View>
        </ScrollView>
      )}
      <StatusBar backgroundColor="#2D343C" style="dark" />
    </SafeAreaView>
  );
};

export default home;

const RecentCard = ({ from, to, date }) => {
  return (
    <View className="flex flex-col">
      <Divider color="white" width="100%" />
      <View className="flex-row justify-between items-center">
        <Text className="font-psemibold text-base text-white ">
          From: {from}
        </Text>
        <Text className="font-psemibold text-base text-white ">To: {to}</Text>
      </View>
      <Text className="font-plight text-sm text-white ">Dated: {date}</Text>
    </View>
  );
};
