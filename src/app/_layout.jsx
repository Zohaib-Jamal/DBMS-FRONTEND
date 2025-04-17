import { Stack, SplashScreen } from "expo-router";
import { UserProvider } from "../context/UserContext";
import { LocationProvider } from "../context/LocationContext";
const RootLayout = () => {
  return (
    <UserProvider>
      <LocationProvider>
        <Stack>
          <Stack.Screen name="login/index" options={{ headerShown: false }} />
          <Stack.Screen name="signup/index" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack>
      </LocationProvider>
    </UserProvider>
  );
};

export default RootLayout;
