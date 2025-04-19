import { Stack } from "expo-router";
import { LocationProvider } from "../../context/LocationContext";
import { DriverProvider } from "../../context/DriverContext";

const Userlayout = () => {
  return (
    <DriverProvider>
      <LocationProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="vehicle/index" options={{ headerShown: false }} />
          <Stack.Screen name="ride" options={{ headerShown: false }} />
        </Stack>
      </LocationProvider>
    </DriverProvider>
  );
};

export default Userlayout;
