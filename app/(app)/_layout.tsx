import { useAuth } from "@features/auth/presentation/hooks/useAuth";
import { useAuthStore } from "@features/auth/presentation/store/authStore";
import { Stack } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const E = {
  bg:       '#080810',
  card:     '#10101e',
  violet:   '#7c3aed',
  neon:     '#a855f7',
  neonSoft: '#c084fc',
  cyan:     '#22d3ee',
  text:     '#e2e8f0',
  textMute: '#475569',
  border:   'rgba(124,58,237,0.22)',
};

export default function AppLayout() {
  const { logout } = useAuth();
  const user       = useAuthStore((s) => s.user);
  const isVendedor = user?.role === 'vendedor';

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: E.bg },
        headerTintColor: E.text,
        headerShadowVisible: false,
        headerBackTitle: '',
        contentStyle: { backgroundColor: E.bg },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: () => (
            <View style={s.headerTitle}>
              <View style={s.logoIcon}>
                <Text style={s.logoIconText}>◈</Text>
              </View>
              <View>
                <Text style={s.brand}>
                  ENIGMA<Text style={s.brandDot}>.</Text>
                </Text>
                <Text style={s.tagline}>ENCRYPTED MESSAGING</Text>
              </View>
            </View>
          ),
          headerRight: () => (
            <View style={s.headerRight}>
              {/* Badge de rol */}
              <View style={[
                s.roleBadge,
                isVendedor ? s.roleBadgeVendedor : s.roleBadgeCliente,
              ]}>
                <Text style={s.roleDot}>
                  {isVendedor ? '▲' : '●'}
                </Text>
                <Text style={[
                  s.roleBadgeText,
                  isVendedor ? s.roleBadgeTextVendedor : s.roleBadgeTextCliente,
                ]}>
                  {isVendedor ? 'VENDEDOR' : 'CLIENTE'}
                </Text>
              </View>

              {/* Botón salir */}
              <TouchableOpacity
                onPress={logout}
                style={s.logoutBtn}
                activeOpacity={0.7}
              >
                <Text style={s.logoutText}>SALIR</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <Stack.Screen
        name="chat/[roomId]"
        options={({ route }) => {
          const rawName    = (route.params as any)?.name;
          const roomId     = (route.params as any)?.roomId;
          const roomName   = rawName ?? (roomId ? `Canal (${roomId.substring(0, 8)})` : 'canal');
          const firstLetter = roomName.startsWith('Canal (') ? 'C' : roomName.charAt(0).toUpperCase();

          return {
            headerTitle: () => (
              <View style={s.chatHeaderTitle}>
                <View style={s.chatAvatar}>
                  <Text style={s.chatAvatarText}>{firstLetter}</Text>
                </View>
                <View>
                  <Text style={s.chatRoomName}>
                    {roomName.startsWith('Canal (') ? roomName : `# ${roomName}`}
                  </Text>
                  <Text style={s.chatOnline}>● EN LÍNEA</Text>
                </View>
              </View>
            ),
            // Badge de rol también visible en la pantalla de chat
            headerRight: () => (
              <View style={[
                s.roleBadgeSmall,
                isVendedor ? s.roleBadgeVendedor : s.roleBadgeCliente,
              ]}>
                <Text style={[
                  s.roleBadgeTextSmall,
                  isVendedor ? s.roleBadgeTextVendedor : s.roleBadgeTextCliente,
                ]}>
                  {isVendedor ? '▲ VEN' : '● CLI'}
                </Text>
              </View>
            ),
          };
        }}
      />
    </Stack>
  );
}

const s = StyleSheet.create({
  headerTitle: { flexDirection: 'row', alignItems: 'center', gap: 10 },

  logoIcon: {
    width: 32, height: 32,
    backgroundColor: E.violet, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: E.violet, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8, shadowRadius: 10, elevation: 6,
  },
  logoIconText: { fontSize: 14, color: '#fff' },

  brand:    { fontSize: 16, fontWeight: '800', color: '#fff', letterSpacing: -0.3 },
  brandDot: { color: E.neon },
  tagline:  { fontSize: 7, color: E.textMute, letterSpacing: 2.5, marginTop: 1 },

  // ── Header right ──
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  // Badge grande (pantalla index)
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  roleBadgeCliente: {
    backgroundColor: 'rgba(124,58,237,0.10)',
    borderColor: 'rgba(124,58,237,0.35)',
  },
  roleBadgeVendedor: {
    backgroundColor: 'rgba(34,211,238,0.08)',
    borderColor: 'rgba(34,211,238,0.30)',
  },
  roleDot: {
    fontSize: 7,
    color: E.textMute,
  },
  roleBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  roleBadgeTextCliente: {
    color: E.neonSoft,
  },
  roleBadgeTextVendedor: {
    color: E.cyan,
  },

  // Badge pequeño (pantalla chat)
  roleBadgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 7,
    borderWidth: 1,
    marginRight: 4,
  },
  roleBadgeTextSmall: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1.5,
  },

  logoutBtn: {
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1, borderColor: E.border,
    backgroundColor: 'rgba(124,58,237,0.08)',
  },
  logoutText: { fontSize: 10, fontWeight: '600', color: E.textMute, letterSpacing: 1.5 },

  // ── Chat header ──
  chatHeaderTitle: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  chatAvatar: {
    width: 32, height: 32,
    backgroundColor: E.violet, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: E.violet, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, shadowRadius: 8, elevation: 4,
  },
  chatAvatarText: { fontSize: 14, color: '#fff', fontWeight: '800' },
  chatRoomName:   { fontSize: 15, fontWeight: '700', color: '#fff', letterSpacing: -0.3 },
  chatOnline:     { fontSize: 9, color: E.cyan, letterSpacing: 1.5 },
});
