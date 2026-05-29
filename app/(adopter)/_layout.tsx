import { HapticTab } from '@/components/haptic-tab';
import { E } from '@/constants/theme';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Text, View } from 'react-native';

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={[styles.tabItem, focused && styles.tabItemFocused]}>
      {focused && <View style={styles.tabPill} />}
      <Text style={styles.tabEmoji}>{emoji}</Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelFocused]}>{label}</Text>
    </View>
  );
}

export default function AdopterLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explorar',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🐾" label="Explorar" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="requests"
        options={{
          title: 'Solicitudes',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="📋" label="Solicitudes" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat/index"
        options={{
          title: 'Chat',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="💬" label="Chat" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="assistant"
        options={{
          title: 'VetBot',
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🤖" label="VetBot" focused={focused} />
          ),
        }}
      />
      {/* Rutas sin tab */}
      <Tabs.Screen name="pet/[id]"    options={{ href: null }} />
      <Tabs.Screen name="chat/[roomId]" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: E.card,
    borderTopWidth: 1,
    borderTopColor: E.border,
    height: Platform.OS === 'ios' ? 84 : 64,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
    elevation: 0,
    shadowOpacity: 0,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 2,
    minWidth: 60,
  },
  tabItemFocused: {
    backgroundColor: E.primaryDim,
  },
  tabPill: {
    position: 'absolute',
    top: -2,
    width: 20,
    height: 3,
    backgroundColor: E.primary,
    borderRadius: 2,
  },
  tabEmoji: {
    fontSize: 20,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: E.textMute,
    letterSpacing: 0.5,
  },
  tabLabelFocused: {
    color: E.primary,
  },
});
