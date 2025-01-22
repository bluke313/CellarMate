import { Stack } from "expo-router"
import { colors } from "../assets/theme";

const RootLayout = () => {
    return (
    <Stack>
        <Stack.Screen name="index" options={{
            headerShown: false
        }} />
        <Stack.Screen name="entry/[id]" options={{
            headerStyle: {
                backgroundColor: colors.background,
            }
        }}/>
        <Stack.Screen name="newEntry" options={{
            headerStyle: {
                backgroundColor: colors.background,
            }
        }}/>
    </Stack>
    )
};

export default RootLayout;