import { Stack, Redirect } from 'expo-router'
import { useAuthStore } from '@/stores/useAuthStore'

export default function ProtectedLayout() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);



    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
    )
}