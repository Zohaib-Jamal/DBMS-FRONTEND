import { Stack, SplashScreen } from "expo-router";
import { UserProvider } from "../context/UserContext";
const RootLayout = () => {
  return (
    <UserProvider>
      <Stack>
        <Stack.Screen name="login/index" options={{ headerShown: false }} />
        <Stack.Screen name="signup/index" options={{ headerShown: false }} />
      </Stack>
    </UserProvider>
  );
};

export default RootLayout;
