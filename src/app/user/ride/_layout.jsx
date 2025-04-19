import { Stack } from "expo-router";
import { RideProvider } from "../../../context/RideContext";

const Ridelayout = () => {
  return (
    <RideProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="find/index" options={{ headerShown: false }} />
        <Stack.Screen name="find/started/index" options={{ headerShown: false }} />
      </Stack>
    </RideProvider>
  );
};

export default Ridelayout;
