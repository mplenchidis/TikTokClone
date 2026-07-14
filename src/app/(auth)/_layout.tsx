import { useAuthStore } from "@/stores/useAuthStore";
import { Stack, Redirect } from "expo-router"

export default function AuthLayout() {

    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (isAuthenticated) {
        <Redirect href={'/'} />
    }

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />

        </Stack>
    )
}