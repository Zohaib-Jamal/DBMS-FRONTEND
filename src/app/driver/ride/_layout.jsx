import { Stack } from "expo-router";
import { RideProvider } from "../../../context/RideContext";

const Ridelayout = () => {
  return (
    <RideProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="started/index" options={{ headerShown: false }} />
      </Stack>
    </RideProvider>
  );
};

export default Ridelayout;
