import { useRooms } from '@features/chat/presentation/hooks/useRooms';
import { Room } from '@features/chat/domain/entities/Message';
import { E } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

function RoomCard({ room, onPress }: { room: Room; onPress: () => void }) {
  const initial = room.name.charAt(0).toUpperCase();
  const ago     = formatDistanceToNow(room.createdAt, { addSuffix: true, locale: es });

  return (
    <TouchableOpacity style={rc.wrap} onPress={onPress} activeOpacity={0.85}>
      <View style={rc.avatar}>
        <Text style={rc.avatarText}>{initial}</Text>
      </View>
      <View style={rc.info}>
        <Text style={rc.name}>#{room.name}</Text>
        <Text style={rc.time}>{ago}</Text>
      </View>
      <Text style={rc.arrow}>›</Text>
    </TouchableOpacity>
  );
}

const rc = StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: E.card, borderRadius: E.radius.xl,
    borderWidth: 1, borderColor: E.border,
    padding: 14, marginHorizontal: 16, marginBottom: 10,
    shadowColor: E.primary, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  avatar: {
    width: 46, height: 46, borderRadius: 14,
    backgroundColor: E.primary, alignItems: 'center', justifyContent: 'center',
    shadowColor: E.primary, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 6, elevation: 3,
  },
  avatarText: { fontSize: 18, fontWeight: '800', color: '#fff' },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', color: E.text },
  time: { fontSize: 11, color: E.textMute, marginTop: 2 },
  arrow: { fontSize: 22, color: E.textMute },
});

export default function ChatRoomsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { rooms, isLoading, createRoom, isCreating } = useRooms();

  const [showModal, setShowModal] = useState(false);
  const [roomName, setRoomName]   = useState('');

  const handleCreate = () => {
    if (!roomName.trim()) return;
    createRoom(roomName.trim(), {
      onSuccess: (room: Room) => {
        setRoomName('');
        setShowModal(false);
        router.push(`/(adopter)/chat/${room.id}?name=${encodeURIComponent(room.name)}` as any);
      },
    });
  };

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>

      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.title}>Canales</Text>
          <Text style={s.subtitle}>{rooms.length} canal{rooms.length !== 1 ? 'es' : ''} activo{rooms.length !== 1 ? 's' : ''}</Text>
        </View>
        <TouchableOpacity style={s.fab} onPress={() => setShowModal(true)} activeOpacity={0.8}>
          <Text style={s.fabText}>+ Nuevo</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={E.primary} />
        </View>
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <RoomCard
              room={item}
              onPress={() =>
                router.push(`/(adopter)/chat/${item.id}?name=${encodeURIComponent(item.name)}` as any)
              }
            />
          )}
          contentContainerStyle={{ paddingBottom: insets.bottom + 24, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={s.empty}>
              <Text style={s.emptyEmoji}>💬</Text>
              <Text style={s.emptyTitle}>Sin canales aún</Text>
              <Text style={s.emptyText}>Crea el primer canal para chatear con refugios y adoptantes.</Text>
              <TouchableOpacity style={s.emptyBtn} onPress={() => setShowModal(true)} activeOpacity={0.85}>
                <Text style={s.emptyBtnText}>+ Crear canal</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      {/* Create room modal */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={m.overlay}>
          <View style={m.sheet}>
            <View style={m.handle} />
            <Text style={m.title}>Nuevo canal</Text>
            <Text style={m.subtitle}>Elige un nombre descriptivo para el canal.</Text>

            <Text style={m.inputLabel}>NOMBRE DEL CANAL</Text>
            <View style={m.inputWrap}>
              <Text style={m.inputPrefix}>#</Text>
              <TextInput
                style={m.input}
                value={roomName}
                onChangeText={setRoomName}
                placeholder="adopciones-quito"
                placeholderTextColor={E.textMute}
                autoCapitalize="none"
                autoFocus
              />
            </View>

            <View style={m.btnRow}>
              <TouchableOpacity style={m.btnCancel} onPress={() => setShowModal(false)} activeOpacity={0.7}>
                <Text style={m.btnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[m.btnCreate, (!roomName.trim() || isCreating) && m.btnDisabled]}
                onPress={handleCreate}
                disabled={!roomName.trim() || isCreating}
                activeOpacity={0.85}
              >
                {isCreating
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={m.btnCreateText}>Crear canal →</Text>
                }
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: E.bg },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 16,
  },
  title:    { fontSize: 24, fontWeight: '800', color: E.text },
  subtitle: { fontSize: 12, color: E.textDim, marginTop: 2 },
  fab: {
    backgroundColor: E.primary, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 8,
    shadowColor: E.primary, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 4,
  },
  fabText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { alignItems: 'center', paddingTop: 70, paddingHorizontal: 40, gap: 10 },
  emptyEmoji: { fontSize: 52 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: E.text },
  emptyText:  { fontSize: 13, color: E.textDim, textAlign: 'center', lineHeight: 20 },
  emptyBtn: {
    marginTop: 6, backgroundColor: E.primary,
    paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12,
  },
  emptyBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
});

const m = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: E.card, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, paddingTop: 16,
  },
  handle: {
    width: 40, height: 4, backgroundColor: E.border,
    borderRadius: 2, alignSelf: 'center', marginBottom: 20,
  },
  title:    { fontSize: 20, fontWeight: '800', color: E.text, marginBottom: 6 },
  subtitle: { fontSize: 13, color: E.textDim, marginBottom: 20 },
  inputLabel: { fontSize: 11, color: E.textDim, letterSpacing: 1.5, fontWeight: '600', marginBottom: 8 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: E.bg2, borderRadius: E.radius.md,
    borderWidth: 1.5, borderColor: E.border,
    paddingHorizontal: 14, paddingVertical: 13, marginBottom: 20,
  },
  inputPrefix: { fontSize: 18, color: E.textMute, marginRight: 6 },
  input: { flex: 1, fontSize: 14, color: E.text },
  btnRow:    { flexDirection: 'row', gap: 10 },
  btnCancel: {
    flex: 1, paddingVertical: 14, borderRadius: E.radius.md,
    borderWidth: 1.5, borderColor: E.border, alignItems: 'center',
  },
  btnCancelText: { fontSize: 14, color: E.textDim, fontWeight: '600' },
  btnCreate: {
    flex: 2, paddingVertical: 14, borderRadius: E.radius.md,
    backgroundColor: E.primary, alignItems: 'center',
    shadowColor: E.primary, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 5,
  },
  btnCreateText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  btnDisabled:   { opacity: 0.45 },
});
