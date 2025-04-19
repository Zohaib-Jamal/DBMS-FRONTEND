import { Stack, SplashScreen } from "expo-router";
import { LocationProvider } from "../../context/LocationContext";
import { Platform } from "react-native";
import { UserProvider } from "../../context/UserContext";



const Userlayout = () => {
  return (
    <UserProvider>
      <LocationProvider>
        <Stack>
          <Stack.Screen name="ride" options={{ headerShown: false }} />
         

          <Stack.Screen name="bus" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
      </LocationProvider>
    </UserProvider>
  );
};

export default Userlayout;
