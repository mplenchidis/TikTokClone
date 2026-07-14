import { Stack, Redirect } from 'expo-router'
import { useAuthStore } from '@/stores/useAuthStore'

export default function ProtectedLayout() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (!isAuthenticated) {
        <Redirect href={'/login'} />
    }

    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
    )
}