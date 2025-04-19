import { Stack, SplashScreen } from "expo-router";
import { Platform } from "react-native";

const Userlayout = () => {
  return (
      <Stack>
        <Stack.Screen name="home/index" options={{ headerShown: false }} />
        <Stack.Screen name="home/select/index" options={{ headerShown: false }} />
        <Stack.Screen name="home/select/book/index" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    
  );
};

export default Userlayout;
