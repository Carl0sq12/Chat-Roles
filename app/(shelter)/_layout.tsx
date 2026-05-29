import { HapticTab } from '@/components/haptic-tab';
import { E } from '@/constants/theme';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Text, View } from 'react-native';

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={[s.item, focused && s.itemFocused]}>
      {focused && <View style={s.pill} />}
      <Text style={s.emoji}>{emoji}</Text>
      <Text style={[s.label, focused && s.labelFocused]}>{label}</Text>
    </View>
  );
}

export default function ShelterLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: s.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen name="index"     options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="🏥" label="Mis mascotas" focused={focused} /> }} />
      <Tabs.Screen name="requests"  options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="📋" label="Solicitudes"  focused={focused} /> }} />
      <Tabs.Screen name="chat/index" options={{ tabBarIcon: ({ focused }) => <TabIcon emoji="💬" label="Chat"        focused={focused} /> }} />
      <Tabs.Screen name="pet/new"   options={{ href: null }} />
      <Tabs.Screen name="pet/[id]"  options={{ href: null }} />
      <Tabs.Screen name="chat/[roomId]" options={{ href: null }} />
    </Tabs>
  );
}

const s = StyleSheet.create({
  tabBar: {
    backgroundColor: E.card, borderTopWidth: 1, borderTopColor: E.border,
    height: Platform.OS === 'ios' ? 84 : 64,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8, paddingTop: 8,
    elevation: 0, shadowOpacity: 0,
  },
  item:        { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16, gap: 2, minWidth: 60 },
  itemFocused: { backgroundColor: E.primaryDim },
  pill:        { position: 'absolute', top: -2, width: 20, height: 3, backgroundColor: E.primary, borderRadius: 2 },
  emoji:       { fontSize: 20 },
  label:       { fontSize: 9, fontWeight: '600', color: E.textMute, letterSpacing: 0.5 },
  labelFocused:{ color: E.primary },
});