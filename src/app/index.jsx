import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import usePost from "../hook/usePost";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../components/CustomButton";
import { images, svgs } from "../constants";
import Logo from "../../assets/svgs/logo";

export default function App() {
  const { loading, error, reponse, postData } = usePost();
  useEffect(() => {
    const fn = async () => {
      const refresh_token = await AsyncStorage.getItem("refresh_token");

      const res = await postData({ refresh_token }, "/auth/refresh_token");
      console.log("res", res)
      const access_token = res.access_token;
      
      if (access_token && res.role === "User") {
        await AsyncStorage.setItem("access_token", access_token);
        router.replace("/user");
      } else if (access_token && res.role === "Driver") {
        await AsyncStorage.setItem("access_token", access_token);
        router.replace("/driver");
      }
    };

    fn();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center ">
        <ActivityIndicator color="#FFBC07" size="large" />
      </View>
    );
  }

  return (
    <>
      <SafeAreaView className="bg-[#2D343C] h-full">
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <View className="w-full  items-center justify-center min-h-[85vh] px-4 ">
            <View className="w-full mb-5 mt-10 justify-center items-center">
              <Logo width={280} height={123} style={{ width: 50 }} />
            </View>

            <Image
              source={images.mainImage}
              className="max-w-[380px] w-52 h-[300px] mb-10 "
              resizeMode="contain"
            />

            <View className="relative mt-2">
              <Text className="text-3xl text-white font-bold text-center">
                Order your rides from{" "}
                <Text className="text-secondary">your phone</Text>
              </Text>

              <Image
                source={images.path}
                className="w-[135px] h-[15px] absolute -bottom-4 -right-0"
                resizeMode="contain"
              />
            </View>

            <View className="mt-5 -scroll-mb-10 w-72">
              <CustomButton
                title="Explore"
                handlePress={() => {
                  router.push("/login");
                }}
                containerStyles="w-full mt-7 text-white bg-secondary"
                textStyles="text-white text-xl"
                isLoading={false}
              />
            </View>
          </View>
          <View className="absolute bottom-0 w-full h-1/2  -z-10">
            <Image
              source={images.mainBg}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        </ScrollView>

        <StatusBar backgroundColor="#2D343C" style="dark" />
      </SafeAreaView>

      {/*}
    <View style={[styles.container, { paddingBottom: 10 }]}>
      <Text style={{ paddingBottom: 10 }}>
        Open up App.js to start working on your app!
      </Text>

      <TouchableOpacity
        style={{ paddingBottom: 10 }}
        onPress={() => {
          router.push("/signup");
        }}
      >
        <Text>SignUp</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          router.replace("/login");
        }}
      >
        <Text>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          router.replace("/driver");
        }}
      >
        <Text>Driver</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          router.replace("/user");
        }}
      >
        <Text>Map</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>*/}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
