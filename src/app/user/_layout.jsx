import { Stack, SplashScreen } from "expo-router";
import { LocationProvider } from "../../context/LocationContext";
import { Platform } from "react-native";
import { UserProvider } from "../../context/UserContext";

const Userlayout = () => {
  return (
    <UserProvider>
    <LocationProvider>
      <Stack>
        {Platform.OS === "android" && (
          <Stack.Screen name="ride/index" options={{ headerShown: false }} />
        )}

        <Stack.Screen name="bus/index" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </LocationProvider>
    </UserProvider>
  );
};

export default Userlayout;
