import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#1d2a36' },
        headerTintColor: '#f3f6f8',
        contentStyle: { backgroundColor: '#1a212b' },
        animation: 'slide_from_right',
      }}
    />
  );
}
