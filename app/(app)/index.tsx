import { useAuthStore } from "@features/auth/presentation/store/authStore";
import { Room } from "@features/chat/domain/entities/Message";
import { useRooms } from "@features/chat/presentation/hooks/useRooms";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const E = {
  bg: '#080810', bg2: '#0d0d1a', card: '#10101e',
  violet: '#7c3aed', violetDk: '#5b21b6',
  violetDim: 'rgba(124,58,237,0.12)', violetGlw: 'rgba(124,58,237,0.4)',
  neon: '#a855f7', neonSoft: '#c084fc', cyan: '#22d3ee',
  text: '#e2e8f0', textDim: '#94a3b8', textMute: '#475569',
  border: 'rgba(124,58,237,0.22)',
};

const AVATAR_COLORS = [
  { bg: ['#7c3aed', '#4f1d96'], shadow: 'rgba(124,58,237,0.5)' },
  { bg: ['#0e7490', '#164e63'], shadow: 'rgba(14,116,144,0.4)' },
  { bg: ['#be185d', '#831843'], shadow: 'rgba(190,24,93,0.4)' },
  { bg: ['#15803d', '#14532d'], shadow: 'rgba(21,128,61,0.4)' },
  { bg: ['#92400e', '#78350f'], shadow: 'rgba(146,64,14,0.4)' },
];

function RoomAvatar({ name }: { name: string }) {
  const idx    = name.charCodeAt(0) % AVATAR_COLORS.length;
  const colors = AVATAR_COLORS[idx];
  const letter = name.charAt(0).toUpperCase();
  return (
    <View style={[s.avatar, {
      backgroundColor: colors.bg[0],
      shadowColor: colors.shadow,
    }]}>
      <Text style={s.avatarText}>{letter}</Text>
    </View>
  );
}

export default function RoomsScreen() {
  const { rooms, isLoading, createRoom, isCreating, createError } = useRooms();
  const router      = useRouter();
  const insets      = useSafeAreaInsets();
  const isVendedor  = useAuthStore((s) => s.user?.role === 'vendedor');

  const [modalVisible, setModalVisible] = useState(false);
  const [roomName, setRoomName]         = useState('');

  const handleCreate = () => {
    if (!roomName.trim() || isCreating) return;
    createRoom(roomName.trim(), {
      onSuccess: () => { setRoomName(''); setModalVisible(false); },
    });
  };

  const renderRoom = ({ item }: { item: Room }) => (
    <TouchableOpacity
      style={s.roomCard}
      onPress={() => router.push(`/chat/${item.id}?name=${encodeURIComponent(item.name)}`)}
      activeOpacity={0.75}
    >
      {/* left accent bar */}
      <View style={s.roomAccent} />

      <RoomAvatar name={item.name} />

      <View style={s.roomInfo}>
        <Text style={s.roomName}># {item.name}</Text>
        <Text style={s.roomDate}>
          {item.createdAt.toLocaleDateString('es-ES', { month: 'short', day: 'numeric', year: 'numeric' })}
        </Text>
      </View>

      <View style={s.roomRight}>
        <Text style={s.roomChevron}>›</Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={s.centered}>
        <ActivityIndicator size="large" color={E.violet} />
        <Text style={s.loadingText}>// cargando canales...</Text>
      </View>
    );
  }

  return (
    <View style={s.container}>

      {/* ── Subheader ── */}
      <View style={s.subheader}>
        <View>
          <Text style={s.subheaderLabel}>CANALES ACTIVOS</Text>
          <Text style={s.subheaderSub}>// {rooms.length} disponibles</Text>
        </View>
        <View style={s.subheaderRight}>
          {/* Indicador de rol en subheader */}
          <View style={[s.roleTag, isVendedor ? s.roleTagVendedor : s.roleTagCliente]}>
            <Text style={[s.roleTagText, isVendedor ? s.roleTagTextVendedor : s.roleTagTextCliente]}>
              {isVendedor ? '🏪 Vendedor' : '🛒 Cliente'}
            </Text>
          </View>
          <View style={s.badge}>
            <Text style={s.badgeText}>{rooms.length}</Text>
          </View>
        </View>
      </View>

      {/* ── List ── */}
      <FlatList
        data={rooms}
        keyExtractor={(r) => r.id}
        renderItem={renderRoom}
        contentContainerStyle={
          rooms.length === 0
            ? { flex: 1 }
            : { padding: 16, gap: 10, paddingBottom: insets.bottom + 100 }
        }
        ListEmptyComponent={
          <View style={s.centered}>
            <Text style={s.emptyIcon}>◈</Text>
            <Text style={s.emptyTitle}>
              {isVendedor ? 'Sin canales' : 'Sin canales disponibles'}
            </Text>
            <Text style={s.emptySub}>
              {isVendedor
                ? 'Crea uno para comenzar'
                : 'Espera a que un vendedor cree un canal'}
            </Text>
          </View>
        }
      />

      {/* ── FAB — solo visible para vendedores ── */}
      {isVendedor && (
        <TouchableOpacity
          style={[s.fab, { bottom: insets.bottom + 28 }]}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.85}
        >
          <Text style={s.fabText}>+</Text>
        </TouchableOpacity>
      )}

      {/* ── Modal — solo accesible para vendedores ── */}
      {isVendedor && (
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={s.overlay}>
            <TouchableOpacity style={{ flex: 1 }} onPress={() => setModalVisible(false)} />
            <View style={[s.dialog, { paddingBottom: insets.bottom + 28 }]}>
              {/* top glow */}
              <View style={s.dialogTopLine} />

              <Text style={s.dialogEyebrow}>// NUEVO CANAL</Text>
              <Text style={s.dialogTitle}>
                Nombra tu<Text style={{ color: E.neon }}> canal.</Text>
              </Text>

              {createError && (
                <View style={s.errorBox}>
                  <Text style={s.errorText}>⚠ {createError}</Text>
                </View>
              )}

              <View style={s.dialogFieldLabel_wrap}>
                <Text style={s.dialogFieldLabel}>&gt; NOMBRE</Text>
              </View>

              <TextInput
                style={s.dialogInput}
                placeholder="ej. general, dev-team, ops..."
                placeholderTextColor={E.textMute}
                value={roomName}
                onChangeText={setRoomName}
                autoFocus
                maxLength={50}
              />

              <View style={s.dialogActions}>
                <TouchableOpacity
                  style={s.dialogCancel}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={s.dialogCancelText}>CANCELAR</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.dialogCreate, isCreating && { opacity: 0.5 }]}
                  onPress={handleCreate}
                  disabled={isCreating}
                >
                  {isCreating
                    ? <ActivityIndicator color="#fff" size="small" />
                    : <Text style={s.dialogCreateText}>CREAR  →</Text>
                  }
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: E.bg },

  subheader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingVertical: 14,
    backgroundColor: E.bg2,
    borderBottomWidth: 1, borderBottomColor: E.border,
  },
  subheaderLabel: { fontSize: 10, fontWeight: '600', color: E.textMute, letterSpacing: 2.5 },
  subheaderSub:   { fontSize: 10, color: E.violet, marginTop: 2, letterSpacing: 1 },

  subheaderRight: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
  },

  // Indicador de rol en subheader
  roleTag: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 8, borderWidth: 1,
  },
  roleTagCliente: {
    backgroundColor: 'rgba(124,58,237,0.10)',
    borderColor: 'rgba(124,58,237,0.30)',
  },
  roleTagVendedor: {
    backgroundColor: 'rgba(34,211,238,0.08)',
    borderColor: 'rgba(34,211,238,0.28)',
  },
  roleTagText: {
    fontSize: 9, fontWeight: '700', letterSpacing: 1,
  },
  roleTagTextCliente:  { color: E.neonSoft },
  roleTagTextVendedor: { color: E.cyan },

  badge: {
    backgroundColor: E.violet, paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 100,
    shadowColor: E.violet, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, shadowRadius: 10, elevation: 4,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },

  centered:    { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
  loadingText: { color: E.violet, fontSize: 12, letterSpacing: 1, marginTop: 12 },
  emptyIcon:   { fontSize: 40, color: E.border, marginBottom: 8 },
  emptyTitle:  { fontSize: 18, fontWeight: '700', color: E.textDim, letterSpacing: -0.3 },
  emptySub:    { fontSize: 12, color: E.textMute, letterSpacing: 0.5, textAlign: 'center', paddingHorizontal: 32 },

  roomCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: E.card,
    borderRadius: 20, borderWidth: 1, borderColor: E.border,
    paddingVertical: 14, paddingRight: 16, paddingLeft: 0,
    gap: 14, overflow: 'hidden',
  },
  roomAccent: {
    width: 3, alignSelf: 'stretch',
    backgroundColor: E.violet, opacity: 0.5,
    borderTopRightRadius: 2, borderBottomRightRadius: 2,
    marginRight: 11,
  },
  avatar: {
    width: 46, height: 46, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center',
    shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.7, shadowRadius: 12, elevation: 4,
    flexShrink: 0,
  },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  roomInfo:   { flex: 1, minWidth: 0 },
  roomName:   { fontSize: 15, fontWeight: '700', color: E.text, letterSpacing: -0.2 },
  roomDate:   { fontSize: 11, color: E.textMute, marginTop: 2 },
  roomRight:  { flexShrink: 0 },
  roomChevron:{ fontSize: 22, color: E.border },

  fab: {
    position: 'absolute', right: 20,
    width: 56, height: 56, borderRadius: 18,
    backgroundColor: E.violet,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: E.violet, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8, shadowRadius: 24, elevation: 10,
  },
  fabText: { color: '#fff', fontSize: 28, lineHeight: 32 },

  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  dialog: {
    backgroundColor: E.card,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    borderWidth: 1, borderBottomWidth: 0, borderColor: E.border,
    padding: 28, overflow: 'hidden',
  },
  dialogTopLine: {
    position: 'absolute', top: 0, left: 60, right: 60,
    height: 1, backgroundColor: E.neon, opacity: 0.5,
  },
  dialogEyebrow: { fontSize: 10, color: E.violet, letterSpacing: 2, marginBottom: 8 },
  dialogTitle: {
    fontSize: 32, fontWeight: '800', color: '#fff',
    letterSpacing: -1, marginBottom: 20,
  },

  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: 10,
    padding: 12, marginBottom: 14,
    borderLeftWidth: 2, borderLeftColor: '#ef4444',
  },
  errorText: { color: '#f87171', fontSize: 12 },

  dialogFieldLabel_wrap: { marginBottom: 8 },
  dialogFieldLabel: { fontSize: 9, color: E.violet, letterSpacing: 3 },

  dialogInput: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1, borderColor: E.border, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 14,
    fontSize: 14, color: E.text, marginBottom: 20,
    fontFamily: 'System',
  },

  dialogActions: { flexDirection: 'row', gap: 10 },
  dialogCancel: {
    flex: 1, paddingVertical: 14, borderRadius: 14,
    borderWidth: 1, borderColor: E.border,
    alignItems: 'center',
  },
  dialogCancelText: { color: E.textMute, fontSize: 11, letterSpacing: 1.5 },
  dialogCreate: {
    flex: 1, paddingVertical: 14, borderRadius: 14,
    backgroundColor: E.violet, alignItems: 'center',
    shadowColor: E.violet, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, shadowRadius: 16, elevation: 6,
  },
  dialogCreateText: { color: '#fff', fontSize: 12, letterSpacing: 2, fontWeight: '600' },
});
