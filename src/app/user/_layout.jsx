import { Stack, SplashScreen } from "expo-router";
import { LocationProvider } from "../../context/LocationContext";

const Userlayout = () => {
  return (
    <LocationProvider>
      <Stack>
        <Stack.Screen name="ride/index" options={{ headerShown: false }} />
        <Stack.Screen name="bus/index" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </LocationProvider>
  );
};

export default Userlayout;
