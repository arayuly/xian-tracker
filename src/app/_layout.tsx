import { colors, fonts } from '@/constants/xian';
import { Tabs } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ColorValue, Text } from 'react-native';

function Glyph({ char, color }: { char: string; color: ColorValue }) {
  return <Text style={{ fontSize: 22, color, fontFamily: fonts.serif }}>{char}</Text>;
}

export default function RootLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.seal,
          tabBarInactiveTintColor: colors.inkSoft,
          tabBarStyle: { backgroundColor: colors.paper, borderTopColor: colors.line },
          tabBarLabelStyle: { fontFamily: fonts.serif, fontSize: 12 },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{ title: 'Путь', tabBarIcon: ({ color }) => <Glyph char="道" color={color} /> }}
        />
        <Tabs.Screen
          name="cultivators"
          options={{ title: 'Культиваторы', tabBarIcon: ({ color }) => <Glyph char="宗" color={color} /> }}
        />
        <Tabs.Screen
          name="profile"
          options={{ title: 'Профиль', tabBarIcon: ({ color }) => <Glyph char="我" color={color} /> }}
        />
      </Tabs>
      <StatusBar style="dark" />
    </>
  );
}