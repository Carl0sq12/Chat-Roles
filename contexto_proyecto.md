# Contexto Completo del Proyecto CV-CREATOR-APP


================================================
📄 ARCHIVO: .claude\settings.json
================================================

{
  "enabledPlugins": {
    "expo@claude-plugins-official": true
  }
}


================================================
📄 ARCHIVO: .env
================================================

EXPO_PUBLIC_GEMINI_API_KEY=AIzaSyC5a38JGOfMrBqzP8YACICsWOTZMN-wLWY
EXPO_PUBLIC_SUPABASE_URL=https://wrwluiyznbfqlbfcvxsy.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_FlqaboqTacB4MPyZPitMRA_S1aIixEI


EXPO_PUBLIC_APPWRITE_ENDPOINT=https://fra.cloud.appwrite.io/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=6a176c59002f6f6af4b0
EXPO_PUBLIC_APPWRITE_DATABASE_ID=6a176de200010bdf9ec8
EXPO_PUBLIC_APPWRITE_BUCKET_ID=6a1773ec00251acdc5cb
EXPO_PUBLIC_APPWRITE_ROOMS_COLLECTION=rooms
EXPO_PUBLIC_APPWRITE_MESSAGES_COLLECTION=messages
EXPO_PUBLIC_APPWRITE_PROFILES_COLLECTION=profiles

================================================
📄 ARCHIVO: .gitignore
================================================

# Learn more https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files

# dependencies
node_modules/

# Expo
.expo/
dist/
web-build/
expo-env.d.ts

# Native
.kotlin/
*.orig.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision

# Metro
.metro-health-check*

# debug
npm-debug.*
yarn-debug.*
yarn-error.*

# macOS
.DS_Store
*.pem

# local env files
.env*.local

# typescript
*.tsbuildinfo

app-example

# generated native folders
/ios
/android
.env



================================================
📄 ARCHIVO: AGENTS.md
================================================

# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.


================================================
📄 ARCHIVO: app\(adopter)\assistant.tsx
================================================



================================================
📄 ARCHIVO: app\(adopter)\chat\index.tsx
================================================

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


================================================
📄 ARCHIVO: app\(adopter)\chat\[roomId].tsx
================================================

import { useChat } from '@features/chat/presentation/hooks/useChat';
import { useAuthStore } from '@features/auth/presentation/store/authStore';
import { Message } from '@features/chat/domain/entities/Message';
import { E } from '@/constants/theme';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// ── Message bubble ────────────────────────────────────────────────────────────
function MessageBubble({ msg, isMine }: { msg: Message; isMine: boolean }) {
  const isTemp = msg.id.startsWith('temp-');
  const timeStr = format(msg.createdAt, 'HH:mm', { locale: es });

  return (
    <View style={[b.wrap, isMine ? b.wrapMine : b.wrapOther]}>
      {!isMine && (
        <View style={b.avatar}>
          <Text style={b.avatarText}>
            {(msg.authorUsername ?? '?').charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      <View style={[b.bubble, isMine ? b.bubbleMine : b.bubbleOther, isTemp && b.bubbleTemp]}>
        {!isMine && msg.authorUsername && (
          <Text style={b.username}>{msg.authorUsername}</Text>
        )}
        {msg.imageUrl ? (
          <Image source={{ uri: msg.imageUrl }} style={b.image} resizeMode="cover" />
        ) : null}
        {msg.content ? (
          <Text style={[b.text, isMine ? b.textMine : b.textOther]}>{msg.content}</Text>
        ) : null}
        <View style={b.footer}>
          <Text style={[b.time, isMine ? b.timeMine : b.timeOther]}>{timeStr}</Text>
          {isMine && (
            <Text style={b.status}>{isTemp ? '⏳' : '✓✓'}</Text>
          )}
        </View>
      </View>
    </View>
  );
}

const b = StyleSheet.create({
  wrap:      { flexDirection: 'row', marginHorizontal: 12, marginVertical: 3, gap: 8 },
  wrapMine:  { justifyContent: 'flex-end' },
  wrapOther: { justifyContent: 'flex-start' },

  avatar: {
    width: 30, height: 30, borderRadius: 10, alignSelf: 'flex-end',
    backgroundColor: E.primary, alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: { fontSize: 12, fontWeight: '800', color: '#fff' },

  bubble: {
    maxWidth: '75%', borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8,
    shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 1,
  },
  bubbleMine:  {
    backgroundColor: E.primary, borderBottomRightRadius: 4,
    shadowColor: E.primary,
  },
  bubbleOther: {
    backgroundColor: E.card, borderBottomLeftRadius: 4,
    borderWidth: 1, borderColor: E.border,
    shadowColor: '#000',
  },
  bubbleTemp: { opacity: 0.7 },

  username:  { fontSize: 10, color: E.primary, fontWeight: '700', marginBottom: 2, letterSpacing: 0.3 },
  text:      { fontSize: 14, lineHeight: 20 },
  textMine:  { color: '#fff' },
  textOther: { color: E.text },

  image: { width: 200, height: 150, borderRadius: 10, marginBottom: 4 },

  footer:   { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3, justifyContent: 'flex-end' },
  time:     { fontSize: 10 },
  timeMine: { color: 'rgba(255,255,255,0.7)' },
  timeOther:{ color: E.textMute },
  status:   { fontSize: 10, color: 'rgba(255,255,255,0.7)' },
});

// ── DateDivider ────────────────────────────────────────────────────────────────
function DateDivider({ date }: { date: string }) {
  return (
    <View style={dd.wrap}>
      <View style={dd.line} />
      <Text style={dd.text}>{date}</Text>
      <View style={dd.line} />
    </View>
  );
}
const dd = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', marginVertical: 10, marginHorizontal: 20, gap: 10 },
  line: { flex: 1, height: 1, backgroundColor: E.border },
  text: { fontSize: 11, color: E.textMute, fontWeight: '600' },
});

// ── Main ──────────────────────────────────────────────────────────────────────
export default function ChatRoomScreen() {
  const { roomId, name } = useLocalSearchParams<{ roomId: string; name: string }>();
  const router    = useRouter();
  const insets    = useSafeAreaInsets();
  const user      = useAuthStore((s) => s.user);
  const listRef   = useRef<FlatList>(null);
  const [text, setText] = useState('');

  const { messages, sendMessage, isLoading, isSending } = useChat(roomId);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    }
  }, [messages.length]);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage({ content: text.trim() });
    setText('');
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });
    if (!result.canceled && result.assets[0].uri) {
      sendMessage({ content: '', imageUrl: result.assets[0].uri });
    }
  };

  // Group messages with date dividers
  type ListItem = { type: 'date'; date: string } | { type: 'msg'; msg: Message };
  const listData: ListItem[] = [];
  let lastDate = '';
  for (const msg of messages) {
    const dateStr = format(msg.createdAt, "d 'de' MMMM", { locale: es });
    if (dateStr !== lastDate) {
      listData.push({ type: 'date', date: dateStr });
      lastDate = dateStr;
    }
    listData.push({ type: 'msg', msg });
  }

  const roomName = name ? decodeURIComponent(name) : 'Canal';

  return (
    <KeyboardAvoidingView
      style={[s.root, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn} activeOpacity={0.7}>
          <Text style={s.backText}>←</Text>
        </TouchableOpacity>
        <View style={s.headerAvatar}>
          <Text style={s.headerAvatarText}>{roomName.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={s.headerInfo}>
          <Text style={s.headerName}>#{roomName}</Text>
          <Text style={s.headerOnline}>● En línea</Text>
        </View>
      </View>

      {/* Messages */}
      {isLoading ? (
        <View style={s.center}>
          <ActivityIndicator color={E.primary} />
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={listData}
          keyExtractor={(item, i) =>
            item.type === 'date' ? `date-${i}` : item.msg.id
          }
          renderItem={({ item }) =>
            item.type === 'date' ? (
              <DateDivider date={item.date} />
            ) : (
              <MessageBubble
                msg={item.msg}
                isMine={item.msg.userId === user?.id}
              />
            )
          }
          contentContainerStyle={{ paddingVertical: 12, paddingBottom: 8 }}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({ animated: false })
          }
          ListEmptyComponent={
            <View style={s.empty}>
              <Text style={s.emptyEmoji}>💬</Text>
              <Text style={s.emptyText}>Sé el primero en escribir</Text>
            </View>
          }
        />
      )}

      {/* Input bar */}
      <View style={[s.inputBar, { paddingBottom: insets.bottom + 8 }]}>
        <TouchableOpacity onPress={handlePickImage} style={s.imgBtn} activeOpacity={0.7}>
          <Text style={s.imgBtnText}>📷</Text>
        </TouchableOpacity>

        <TextInput
          style={s.input}
          value={text}
          onChangeText={setText}
          placeholder="Escribe un mensaje..."
          placeholderTextColor={E.textMute}
          multiline
          maxLength={500}
          returnKeyType="default"
        />

        <TouchableOpacity
          style={[s.sendBtn, (!text.trim() || isSending) && s.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!text.trim() || isSending}
          activeOpacity={0.85}
        >
          {isSending
            ? <ActivityIndicator size="small" color="#fff" />
            : <Text style={s.sendBtnText}>↑</Text>
          }
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: E.bg },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingVertical: 10,
    backgroundColor: E.card, borderBottomWidth: 1, borderBottomColor: E.border,
  },
  backBtn: { padding: 4 },
  backText: { fontSize: 22, color: E.text, fontWeight: '700' },
  headerAvatar: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: E.primary, alignItems: 'center', justifyContent: 'center',
  },
  headerAvatarText: { fontSize: 14, fontWeight: '800', color: '#fff' },
  headerInfo: { flex: 1 },
  headerName:   { fontSize: 15, fontWeight: '700', color: E.text },
  headerOnline: { fontSize: 9, color: E.success, letterSpacing: 1.5 },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty:  { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyEmoji: { fontSize: 40 },
  emptyText:  { fontSize: 13, color: E.textMute },

  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 8,
    paddingHorizontal: 12, paddingTop: 10,
    backgroundColor: E.card, borderTopWidth: 1, borderTopColor: E.border,
  },
  imgBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: E.bg2, borderWidth: 1, borderColor: E.border,
    alignItems: 'center', justifyContent: 'center',
  },
  imgBtnText: { fontSize: 18 },
  input: {
    flex: 1, fontSize: 14, color: E.text,
    backgroundColor: E.bg2, borderRadius: 14,
    borderWidth: 1.5, borderColor: E.border,
    paddingHorizontal: 14, paddingVertical: 9,
    maxHeight: 100,
  },
  sendBtn: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: E.primary, alignItems: 'center', justifyContent: 'center',
    shadowColor: E.primary, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35, shadowRadius: 6, elevation: 4,
  },
  sendBtnDisabled: { opacity: 0.4 },
  sendBtnText: { fontSize: 16, color: '#fff', fontWeight: '800' },
});


================================================
📄 ARCHIVO: app\(adopter)\index.tsx
================================================

import { useAuth } from '@features/auth/presentation/hooks/useAuth';
import { useAuthStore } from '@features/auth/presentation/store/authStore';
import { usePets } from '@features/pets/presentation/hooks/usePets';
import { Pet, PetSpecies, PetSize } from '@features/pets/domain/entities/Pet';
import { E } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ── Filtros ──────────────────────────────────────────────────────────────────
type FilterKey = 'species' | 'size' | 'gender';

const SPECIES_OPTS: { value: PetSpecies | ''; label: string; emoji: string }[] = [
  { value: '',        label: 'Todos',   emoji: '🐾' },
  { value: 'perro',  label: 'Perros',  emoji: '🐶' },
  { value: 'gato',   label: 'Gatos',   emoji: '🐱' },
  { value: 'conejo', label: 'Conejos', emoji: '🐰' },
  { value: 'ave',    label: 'Aves',    emoji: '🦜' },
  { value: 'otro',   label: 'Otros',   emoji: '🐾' },
];

const SIZE_OPTS: { value: PetSize | ''; label: string }[] = [
  { value: '',         label: 'Cualquier tamaño' },
  { value: 'pequeño',  label: 'Pequeño' },
  { value: 'mediano',  label: 'Mediano' },
  { value: 'grande',   label: 'Grande' },
];

const GENDER_OPTS: { value: string; label: string; emoji: string }[] = [
  { value: '',        label: 'Ambos',   emoji: '⚥' },
  { value: 'macho',   label: 'Macho',   emoji: '♂' },
  { value: 'hembra',  label: 'Hembra',  emoji: '♀' },
];

// ── Badge helpers ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Pet['status'] }) {
  const map = {
    disponible:  { label: 'Disponible', color: E.success },
    en_proceso:  { label: 'En proceso', color: E.warning },
    adoptado:    { label: 'Adoptado',   color: E.textMute },
  };
  const s = map[status];
  return (
    <View style={[badge.wrap, { backgroundColor: s.color + '22', borderColor: s.color + '55' }]}>
      <Text style={[badge.text, { color: s.color }]}>{s.label}</Text>
    </View>
  );
}

const badge = StyleSheet.create({
  wrap: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1 },
  text: { fontSize: 10, fontWeight: '700' },
});

// ── Pet Card ──────────────────────────────────────────────────────────────────
function PetCard({ pet, onPress }: { pet: Pet; onPress: () => void }) {
  return (
    <TouchableOpacity style={card.wrap} onPress={onPress} activeOpacity={0.88}>
      {/* Imagen */}
      <View style={card.imgWrap}>
        {pet.imageUrl ? (
          <Image source={{ uri: pet.imageUrl }} style={card.img} resizeMode="cover" />
        ) : (
          <View style={card.imgPlaceholder}>
            <Text style={card.imgEmoji}>
              {pet.species === 'perro' ? '🐶' : pet.species === 'gato' ? '🐱' : '🐾'}
            </Text>
          </View>
        )}
        <View style={card.imgOverlay} />
        <View style={card.speciesBadge}>
          <Text style={card.speciesText}>
            {pet.species === 'perro' ? '🐶' : pet.species === 'gato' ? '🐱' : pet.species === 'conejo' ? '🐰' : pet.species === 'ave' ? '🦜' : '🐾'}
          </Text>
        </View>
      </View>

      {/* Info */}
      <View style={card.info}>
        <View style={card.row}>
          <Text style={card.name} numberOfLines={1}>{pet.name}</Text>
          <StatusBadge status={pet.status} />
        </View>
        <Text style={card.meta}>
          {pet.breed ? `${pet.breed} · ` : ''}{pet.age ? `${pet.age} año${pet.age !== 1 ? 's' : ''}` : 'Edad desconocida'}
        </Text>
        <View style={card.tags}>
          <View style={card.tag}>
            <Text style={card.tagText}>{pet.gender === 'macho' ? '♂ Macho' : '♀ Hembra'}</Text>
          </View>
          <View style={card.tag}>
            <Text style={card.tagText}>{pet.size}</Text>
          </View>
          {pet.isVaccinated && (
            <View style={[card.tag, card.tagGreen]}>
              <Text style={[card.tagText, card.tagTextGreen]}>💉 Vacunado</Text>
            </View>
          )}
        </View>
        {pet.shelterName && (
          <Text style={card.shelter} numberOfLines={1}>🏥 {pet.shelterName}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const card = StyleSheet.create({
  wrap: {
    backgroundColor: E.card, borderRadius: E.radius.xl,
    borderWidth: 1, borderColor: E.border,
    marginHorizontal: 16, marginBottom: 14,
    shadowColor: E.primary, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
    overflow: 'hidden',
  },
  imgWrap: { height: 180, backgroundColor: E.bg2 },
  img: { width: '100%', height: '100%' },
  imgPlaceholder: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: E.primaryDim,
  },
  imgEmoji: { fontSize: 56 },
  imgOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
    backgroundColor: 'transparent',
  },
  speciesBadge: {
    position: 'absolute', top: 10, right: 10,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center', justifyContent: 'center',
  },
  speciesText: { fontSize: 18 },
  info: { padding: 14 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  name: { fontSize: 17, fontWeight: '800', color: E.text, flex: 1, marginRight: 8 },
  meta: { fontSize: 12, color: E.textDim, marginBottom: 8 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 8 },
  tag: {
    paddingHorizontal: 8, paddingVertical: 3,
    backgroundColor: E.bg2, borderRadius: 8,
    borderWidth: 1, borderColor: E.border,
  },
  tagText: { fontSize: 11, color: E.textDim, fontWeight: '600' },
  tagGreen: { backgroundColor: '#dcfce7', borderColor: '#86efac' },
  tagTextGreen: { color: '#16a34a' },
  shelter: { fontSize: 11, color: E.textMute },
});

// ── Main Screen ───────────────────────────────────────────────────────────────
export default function AdopterIndexScreen() {
  const insets              = useSafeAreaInsets();
  const router              = useRouter();
  const { logout }          = useAuth();
  const user                = useAuthStore((s) => s.user);

  const [species, setSpecies] = useState<PetSpecies | ''>('');
  const [size,    setSize]    = useState<PetSize | ''>('');
  const [gender,  setGender]  = useState('');

  const filters = {
    species: species || undefined,
    size:    size    || undefined,
    gender:  gender  || undefined,
    status:  'disponible',
  };

  const { pets, isLoading, error } = usePets(filters);

  const [refreshing, setRefreshing] = useState(false);
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>

      {/* ── Header ── */}
      <View style={s.header}>
        <View>
          <Text style={s.greeting}>Hola, {user?.username ?? 'adoptante'} 👋</Text>
          <Text style={s.subtitle}>Encuentra tu compañero ideal</Text>
        </View>
        <TouchableOpacity onPress={logout} style={s.logoutBtn} activeOpacity={0.7}>
          <Text style={s.logoutText}>SALIR</Text>
        </TouchableOpacity>
      </View>

      {/* ── Hero pill ── */}
      <View style={s.heroPill}>
        <Text style={s.heroPillText}>
          🐾 {pets.length} mascotas esperando un hogar
        </Text>
      </View>

      {/* ── Species filter ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.filterRow}
        style={s.filterScroll}
      >
        {SPECIES_OPTS.map((opt) => (
          <TouchableOpacity
            key={opt.value}
            style={[s.filterChip, species === opt.value && s.filterChipActive]}
            onPress={() => setSpecies(opt.value as PetSpecies | '')}
            activeOpacity={0.8}
          >
            <Text style={s.filterChipEmoji}>{opt.emoji}</Text>
            <Text style={[s.filterChipText, species === opt.value && s.filterChipTextActive]}>
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Secondary filters ── */}
      <View style={s.secondaryFilters}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterRow}>
          {SIZE_OPTS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[s.smallChip, size === opt.value && s.smallChipActive]}
              onPress={() => setSize(opt.value as PetSize | '')}
              activeOpacity={0.8}
            >
              <Text style={[s.smallChipText, size === opt.value && s.smallChipTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
          {GENDER_OPTS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[s.smallChip, gender === opt.value && s.smallChipActive]}
              onPress={() => setGender(opt.value)}
              activeOpacity={0.8}
            >
              <Text style={[s.smallChipText, gender === opt.value && s.smallChipTextActive]}>
                {opt.emoji} {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* ── List ── */}
      {isLoading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={E.primary} />
          <Text style={s.loadingText}>Buscando mascotas...</Text>
        </View>
      ) : error ? (
        <View style={s.center}>
          <Text style={s.errorEmoji}>😿</Text>
          <Text style={s.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PetCard
              pet={item}
              onPress={() => router.push(`/(adopter)/pet/${item.id}` as any)}
            />
          )}
          contentContainerStyle={{ paddingBottom: insets.bottom + 24, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={E.primary}
            />
          }
          ListEmptyComponent={
            <View style={s.empty}>
              <Text style={s.emptyEmoji}>🐾</Text>
              <Text style={s.emptyTitle}>Sin resultados</Text>
              <Text style={s.emptyText}>Prueba cambiando los filtros</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: E.bg },

  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
  },
  greeting:  { fontSize: 18, fontWeight: '800', color: E.text },
  subtitle:  { fontSize: 12, color: E.textDim, marginTop: 2 },
  logoutBtn: {
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 10, borderWidth: 1, borderColor: E.border,
    backgroundColor: E.bg2,
  },
  logoutText: { fontSize: 10, fontWeight: '700', color: E.textMute, letterSpacing: 1.5 },

  heroPill: {
    marginHorizontal: 20, marginBottom: 12,
    backgroundColor: E.primaryDim, borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderColor: E.border,
  },
  heroPillText: { fontSize: 13, color: E.primaryDark, fontWeight: '600' },

  filterScroll: { flexGrow: 0 },
  filterRow:    { paddingHorizontal: 16, gap: 8, paddingBottom: 2 },

  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 24, borderWidth: 1.5, borderColor: E.border,
    backgroundColor: E.card,
  },
  filterChipActive: {
    backgroundColor: E.primary, borderColor: E.primary,
  },
  filterChipEmoji: { fontSize: 15 },
  filterChipText: { fontSize: 12, fontWeight: '600', color: E.textDim },
  filterChipTextActive: { color: '#fff' },

  secondaryFilters: { marginTop: 8, marginBottom: 4 },

  smallChip: {
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 20, borderWidth: 1, borderColor: E.border,
    backgroundColor: E.bg2,
  },
  smallChipActive: { backgroundColor: E.primaryDim, borderColor: E.primary },
  smallChipText: { fontSize: 11, color: E.textDim, fontWeight: '600' },
  smallChipTextActive: { color: E.primaryDark },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  loadingText: { color: E.textDim, fontSize: 14 },
  errorEmoji: { fontSize: 48 },
  errorText:  { color: E.danger, fontSize: 14, textAlign: 'center', paddingHorizontal: 20 },

  empty: { alignItems: 'center', paddingTop: 60, gap: 8 },
  emptyEmoji: { fontSize: 52 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: E.text },
  emptyText:  { fontSize: 13, color: E.textDim },
});


================================================
📄 ARCHIVO: app\(adopter)\pet\[id].tsx
================================================

import { useRequests } from '@features/requests/presentation/hooks/useRequests';
import { E } from '@/constants/theme';
import { SupabasePetRepository } from '@features/pets/infrastructure/repositories/SupabasePetRepository';
import { Pet } from '@features/pets/domain/entities/Pet';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const petRepo = new SupabasePetRepository();

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <View style={chip.wrap}>
      <Text style={chip.label}>{label}</Text>
      <Text style={chip.value}>{value}</Text>
    </View>
  );
}
const chip = StyleSheet.create({
  wrap: {
    flex: 1, minWidth: '45%',
    backgroundColor: E.bg2, borderRadius: E.radius.md,
    borderWidth: 1, borderColor: E.border,
    padding: 12, gap: 3,
  },
  label: { fontSize: 10, color: E.textMute, fontWeight: '600', letterSpacing: 1 },
  value: { fontSize: 14, color: E.text, fontWeight: '700' },
});

export default function PetDetailScreen() {
  const { id }    = useLocalSearchParams<{ id: string }>();
  const router    = useRouter();
  const insets    = useSafeAreaInsets();

  const [pet, setPet]       = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage]     = useState('');
  const [sent, setSent]           = useState(false);

  const { sendRequest, isSending, sendError } = useRequests();

  useEffect(() => {
    if (!id) return;
    petRepo.getById(id)
      .then(setPet)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSendRequest = () => {
    if (!pet) return;
    sendRequest(
      { petId: pet.id, shelterId: pet.shelterId, message },
      {
        onSuccess: () => {
          setSent(true);
          setTimeout(() => setShowModal(false), 1800);
        },
      }
    );
  };

  if (loading) {
    return (
      <View style={s.center}>
        <ActivityIndicator size="large" color={E.primary} />
      </View>
    );
  }

  if (error || !pet) {
    return (
      <View style={s.center}>
        <Text style={s.errorEmoji}>😿</Text>
        <Text style={s.errorText}>{error ?? 'Mascota no encontrada'}</Text>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <Text style={s.backBtnText}>← Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const speciesEmoji =
    pet.species === 'perro'  ? '🐶' :
    pet.species === 'gato'   ? '🐱' :
    pet.species === 'conejo' ? '🐰' :
    pet.species === 'ave'    ? '🦜' : '🐾';

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>

      {/* Back button */}
      <TouchableOpacity
        style={[s.backFab, { top: insets.top + 12 }]}
        onPress={() => router.back()}
        activeOpacity={0.8}
      >
        <Text style={s.backFabText}>←</Text>
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>

        {/* Hero image */}
        <View style={s.imgWrap}>
          {pet.imageUrl ? (
            <Image source={{ uri: pet.imageUrl }} style={s.img} resizeMode="cover" />
          ) : (
            <View style={s.imgPlaceholder}>
              <Text style={s.imgEmoji}>{speciesEmoji}</Text>
            </View>
          )}
          <View style={s.imgGradient} />
        </View>

        {/* Content */}
        <View style={s.content}>
          {/* Name + status */}
          <View style={s.nameRow}>
            <Text style={s.name}>{pet.name}</Text>
            <View style={[
              s.statusBadge,
              pet.status === 'disponible' ? s.statusGreen :
              pet.status === 'en_proceso' ? s.statusYellow : s.statusGray,
            ]}>
              <Text style={s.statusDot}>●</Text>
              <Text style={s.statusText}>
                {pet.status === 'disponible' ? 'Disponible' :
                 pet.status === 'en_proceso' ? 'En proceso' : 'Adoptado'}
              </Text>
            </View>
          </View>

          {pet.breed && (
            <Text style={s.breed}>{speciesEmoji} {pet.breed}</Text>
          )}
          {pet.shelterName && (
            <Text style={s.shelterName}>🏥 {pet.shelterName}</Text>
          )}

          {/* Info grid */}
          <View style={s.grid}>
            <InfoChip label="EDAD" value={pet.age ? `${pet.age} año${pet.age !== 1 ? 's' : ''}` : 'Desconocida'} />
            <InfoChip label="GÉNERO" value={pet.gender === 'macho' ? '♂ Macho' : '♀ Hembra'} />
            <InfoChip label="TAMAÑO" value={pet.size.charAt(0).toUpperCase() + pet.size.slice(1)} />
            <InfoChip label="ESPECIE" value={pet.species.charAt(0).toUpperCase() + pet.species.slice(1)} />
          </View>

          {/* Health badges */}
          <View style={s.healthRow}>
            <View style={[s.healthBadge, pet.isVaccinated ? s.healthBadgeOn : s.healthBadgeOff]}>
              <Text style={s.healthBadgeText}>
                {pet.isVaccinated ? '✅' : '❌'} Vacunas
              </Text>
            </View>
            <View style={[s.healthBadge, pet.isSterilized ? s.healthBadgeOn : s.healthBadgeOff]}>
              <Text style={s.healthBadgeText}>
                {pet.isSterilized ? '✅' : '❌'} Esterilizado
              </Text>
            </View>
          </View>

          {/* Description */}
          {pet.description && (
            <View style={s.descCard}>
              <Text style={s.descTitle}>Sobre {pet.name}</Text>
              <Text style={s.descText}>{pet.description}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* CTA button */}
      {pet.status === 'disponible' && (
        <View style={[s.ctaBar, { paddingBottom: insets.bottom + 12 }]}>
          <TouchableOpacity
            style={s.ctaBtn}
            onPress={() => setShowModal(true)}
            activeOpacity={0.85}
          >
            <Text style={s.ctaBtnText}>🐾 Solicitar adopción</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Adoption Request Modal ── */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={m.overlay}>
          <View style={m.sheet}>
            <View style={m.handle} />

            {sent ? (
              <View style={m.successWrap}>
                <Text style={m.successEmoji}>🎉</Text>
                <Text style={m.successTitle}>¡Solicitud enviada!</Text>
                <Text style={m.successText}>
                  El refugio revisará tu solicitud y te contactará pronto.
                </Text>
              </View>
            ) : (
              <>
                <Text style={m.title}>Solicitar adopción</Text>
                <Text style={m.subtitle}>
                  Cuéntale al refugio por qué serías el hogar perfecto para <Text style={{ fontWeight: '800' }}>{pet.name}</Text>
                </Text>

                {sendError && (
                  <View style={m.errorBox}>
                    <Text style={m.errorText}>⚠ {sendError}</Text>
                  </View>
                )}

                <Text style={m.inputLabel}>MENSAJE (opcional)</Text>
                <TextInput
                  style={m.input}
                  value={message}
                  onChangeText={setMessage}
                  placeholder="Ej: Tengo un jardín grande, experiencia con perros..."
                  placeholderTextColor={E.textMute}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />

                <View style={m.btnRow}>
                  <TouchableOpacity
                    style={m.btnCancel}
                    onPress={() => setShowModal(false)}
                    activeOpacity={0.7}
                  >
                    <Text style={m.btnCancelText}>Cancelar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[m.btnSend, isSending && m.btnDisabled]}
                    onPress={handleSendRequest}
                    disabled={isSending}
                    activeOpacity={0.85}
                  >
                    {isSending
                      ? <ActivityIndicator color="#fff" />
                      : <Text style={m.btnSendText}>Enviar solicitud →</Text>
                    }
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: E.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: E.bg },

  backFab: {
    position: 'absolute', left: 16, zIndex: 10,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15, shadowRadius: 6, elevation: 4,
  },
  backFabText: { fontSize: 18, color: E.text, fontWeight: '700' },

  imgWrap: { height: 300, backgroundColor: E.bg2 },
  img: { width: '100%', height: '100%' },
  imgPlaceholder: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    backgroundColor: E.primaryDim,
  },
  imgEmoji: { fontSize: 80 },
  imgGradient: {
    position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
  },

  content: { padding: 20, gap: 16 },

  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  name:    { fontSize: 28, fontWeight: '800', color: E.text, flex: 1 },

  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, borderWidth: 1,
  },
  statusGreen:  { backgroundColor: '#dcfce7', borderColor: '#86efac' },
  statusYellow: { backgroundColor: '#fef9c3', borderColor: '#fde047' },
  statusGray:   { backgroundColor: E.bg2,     borderColor: E.border },
  statusDot:    { fontSize: 8 },
  statusText:   { fontSize: 11, fontWeight: '700', color: E.text },

  breed:       { fontSize: 14, color: E.textDim, marginTop: -8 },
  shelterName: { fontSize: 13, color: E.textMute },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },

  healthRow: { flexDirection: 'row', gap: 10 },
  healthBadge: {
    flex: 1, paddingVertical: 10, paddingHorizontal: 12,
    borderRadius: E.radius.md, borderWidth: 1, alignItems: 'center',
  },
  healthBadgeOn:  { backgroundColor: '#dcfce7', borderColor: '#86efac' },
  healthBadgeOff: { backgroundColor: E.bg2,     borderColor: E.border },
  healthBadgeText: { fontSize: 12, fontWeight: '700', color: E.text },

  descCard: {
    backgroundColor: E.card, borderRadius: E.radius.lg,
    borderWidth: 1, borderColor: E.border, padding: 16, gap: 8,
  },
  descTitle: { fontSize: 14, fontWeight: '800', color: E.text },
  descText:  { fontSize: 14, color: E.textDim, lineHeight: 22 },

  ctaBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: E.card, borderTopWidth: 1, borderTopColor: E.border,
    paddingHorizontal: 20, paddingTop: 12,
  },
  ctaBtn: {
    backgroundColor: E.primary, borderRadius: E.radius.md,
    paddingVertical: 16, alignItems: 'center',
    shadowColor: E.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 6,
  },
  ctaBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },

  errorEmoji: { fontSize: 48 },
  errorText:  { color: E.danger, fontSize: 14 },
  backBtn:    { marginTop: 8, padding: 12 },
  backBtnText: { color: E.primary, fontWeight: '700' },
});

const m = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: E.card, borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, paddingTop: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1, shadowRadius: 20, elevation: 10,
  },
  handle: {
    width: 40, height: 4, backgroundColor: E.border,
    borderRadius: 2, alignSelf: 'center', marginBottom: 20,
  },
  title:    { fontSize: 20, fontWeight: '800', color: E.text, marginBottom: 6 },
  subtitle: { fontSize: 13, color: E.textDim, lineHeight: 20, marginBottom: 16 },

  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderRadius: E.radius.sm, padding: 10, marginBottom: 12,
    borderLeftWidth: 3, borderLeftColor: E.danger,
  },
  errorText: { color: E.danger, fontSize: 12 },

  inputLabel: { fontSize: 11, color: E.textDim, letterSpacing: 1.5, fontWeight: '600', marginBottom: 6 },
  input: {
    backgroundColor: E.bg2, borderRadius: E.radius.md,
    borderWidth: 1.5, borderColor: E.border,
    paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 14, color: E.text, minHeight: 100, marginBottom: 20,
  },

  btnRow:    { flexDirection: 'row', gap: 10 },
  btnCancel: {
    flex: 1, paddingVertical: 15, borderRadius: E.radius.md,
    borderWidth: 1.5, borderColor: E.border, alignItems: 'center',
  },
  btnCancelText: { fontSize: 14, color: E.textDim, fontWeight: '600' },
  btnSend: {
    flex: 2, paddingVertical: 15, borderRadius: E.radius.md,
    backgroundColor: E.primary, alignItems: 'center',
    shadowColor: E.primary, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 5,
  },
  btnSendText:  { color: '#fff', fontSize: 14, fontWeight: '800' },
  btnDisabled:  { opacity: 0.5 },

  successWrap:  { alignItems: 'center', paddingVertical: 24, gap: 10 },
  successEmoji: { fontSize: 56 },
  successTitle: { fontSize: 22, fontWeight: '800', color: E.text },
  successText:  { fontSize: 13, color: E.textDim, textAlign: 'center', lineHeight: 20 },
});

================================================
📄 ARCHIVO: app\(adopter)\requests.tsx
================================================

import { useRequests } from '@features/requests/presentation/hooks/useRequests';
import { AdoptionRequest } from '@features/requests/domain/entities/Request';
import { E } from '@/constants/theme';
import { Image, ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

function StatusPill({ status }: { status: AdoptionRequest['status'] }) {
  const map = {
    pendiente: { label: 'Pendiente', bg: '#fef9c3', border: '#fde047', text: '#854d0e', dot: '⏳' },
    aprobada:  { label: 'Aprobada',  bg: '#dcfce7', border: '#86efac', text: '#166534', dot: '✅' },
    rechazada: { label: 'Rechazada', bg: '#fee2e2', border: '#fca5a5', text: '#991b1b', dot: '❌' },
  };
  const c = map[status];
  return (
    <View style={[pill.wrap, { backgroundColor: c.bg, borderColor: c.border }]}>
      <Text style={pill.dot}>{c.dot}</Text>
      <Text style={[pill.text, { color: c.text }]}>{c.label}</Text>
    </View>
  );
}

const pill = StyleSheet.create({
  wrap: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 10, borderWidth: 1,
  },
  dot:  { fontSize: 11 },
  text: { fontSize: 11, fontWeight: '700' },
});

function RequestCard({ item }: { item: AdoptionRequest }) {
  const router = useRouter();
  const ago = formatDistanceToNow(item.createdAt, { addSuffix: true, locale: es });

  return (
    <TouchableOpacity
      style={rc.wrap}
      onPress={() => router.push(`/(adopter)/pet/${item.petId}` as any)}
      activeOpacity={0.88}
    >
      {/* Pet image */}
      <View style={rc.imgWrap}>
        {item.petImage ? (
          <Image source={{ uri: item.petImage }} style={rc.img} resizeMode="cover" />
        ) : (
          <View style={rc.imgPlaceholder}>
            <Text style={rc.imgEmoji}>🐾</Text>
          </View>
        )}
      </View>

      {/* Info */}
      <View style={rc.info}>
        <View style={rc.topRow}>
          <Text style={rc.petName} numberOfLines={1}>{item.petName ?? 'Mascota'}</Text>
          <StatusPill status={item.status} />
        </View>
        {item.message && (
          <Text style={rc.message} numberOfLines={2}>{`"${item.message}"`}</Text>
        )}
        <Text style={rc.time}>{ago}</Text>
      </View>
    </TouchableOpacity>
  );
}

const rc = StyleSheet.create({
  wrap: {
    flexDirection: 'row', gap: 12,
    backgroundColor: E.card, borderRadius: E.radius.xl,
    borderWidth: 1, borderColor: E.border,
    padding: 14, marginHorizontal: 16, marginBottom: 12,
    shadowColor: E.primary, shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  imgWrap: { width: 72, height: 72, borderRadius: 16, overflow: 'hidden', backgroundColor: E.bg2 },
  img: { width: '100%', height: '100%' },
  imgPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: E.primaryDim },
  imgEmoji: { fontSize: 28 },
  info: { flex: 1, gap: 6 },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  petName: { fontSize: 15, fontWeight: '800', color: E.text, flex: 1, marginRight: 8 },
  message: { fontSize: 12, color: E.textDim, lineHeight: 17, fontStyle: 'italic' },
  time:    { fontSize: 11, color: E.textMute },
});

export default function RequestsScreen() {
  const insets = useSafeAreaInsets();
  const { myRequests, isLoading } = useRequests();

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>

      {/* Header */}
      <View style={s.header}>
        <Text style={s.title}>Mis solicitudes</Text>
        <Text style={s.subtitle}>{myRequests.length} solicitud{myRequests.length !== 1 ? 'es' : ''} enviada{myRequests.length !== 1 ? 's' : ''}</Text>
      </View>

      {isLoading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={E.primary} />
        </View>
      ) : (
        <FlatList
          data={myRequests}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RequestCard item={item} />}
          contentContainerStyle={{ paddingBottom: insets.bottom + 24, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={s.empty}>
              <Text style={s.emptyEmoji}>📋</Text>
              <Text style={s.emptyTitle}>Sin solicitudes aún</Text>
              <Text style={s.emptyText}>
                Explora las mascotas disponibles y envía tu primera solicitud de adopción.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: E.bg },
  header: { paddingHorizontal: 20, paddingVertical: 16 },
  title:    { fontSize: 24, fontWeight: '800', color: E.text },
  subtitle: { fontSize: 12, color: E.textDim, marginTop: 2 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { alignItems: 'center', paddingTop: 70, paddingHorizontal: 40, gap: 10 },
  emptyEmoji: { fontSize: 52 },
  emptyTitle: { fontSize: 18, fontWeight: '800', color: E.text },
  emptyText:  { fontSize: 13, color: E.textDim, textAlign: 'center', lineHeight: 20 },
});


================================================
📄 ARCHIVO: app\(adopter)\_layout.tsx
================================================

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


================================================
📄 ARCHIVO: app\(app)\_layout.tsx
================================================

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
  const isVendedor = (user?.role as any) === 'vendedor';

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


================================================
📄 ARCHIVO: app\(auth)\forgot-password.tsx
================================================

import { useAuth } from '@features/auth/presentation/hooks/useAuth';
import { E } from '@/constants/theme';
import { Link } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ForgotPasswordScreen() {
  const [email, setEmail]     = useState('');
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const { resetPassword }     = useAuth();
  const insets                = useSafeAreaInsets();

  const handleReset = async () => {
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (e: any) {
      setError(e.message ?? 'Error al enviar el correo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={s.logoWrap}>
          <View style={s.logoIcon}>
            <Text style={s.logoEmoji}>🐾</Text>
          </View>
          <View>
            <Text style={s.logoText}>Pet<Text style={s.logoAccent}>Adopt</Text></Text>
            <Text style={s.logoTag}>ADOPTA UN AMIGO HOY</Text>
          </View>
        </View>

        <View style={s.card}>
          <View style={s.cardTopLine} />

          {!sent ? (
            <>
              <Text style={s.title}>Recuperar contraseña</Text>
              <Text style={s.subtitle}>
                Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
              </Text>

              {error && (
                <View style={s.errorBox}>
                  <Text style={s.errorText}>⚠ {error}</Text>
                </View>
              )}

              <View style={s.fieldWrap}>
                <Text style={s.fieldLabel}>EMAIL</Text>
                <View style={s.inputWrap}>
                  <Text style={s.inputIcon}>✉</Text>
                  <TextInput
                    style={s.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="tu@email.com"
                    placeholderTextColor={E.textMute}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[s.btnPrimary, loading && s.btnDisabled]}
                onPress={handleReset}
                disabled={loading}
                activeOpacity={0.85}
              >
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={s.btnPrimaryText}>Enviar enlace →</Text>
                }
              </TouchableOpacity>
            </>
          ) : (
            // Estado: email enviado
            <View style={s.successWrap}>
              <Text style={s.successIcon}>📬</Text>
              <Text style={s.successTitle}>¡Correo enviado!</Text>
              <Text style={s.successText}>
                Revisa tu bandeja de entrada en{' '}
                <Text style={{ fontWeight: '700' }}>{email}</Text>{' '}
                y sigue las instrucciones para restablecer tu contraseña.
              </Text>
            </View>
          )}

          <View style={s.footerRow}>
            <Link href="/(auth)/login">
              <Text style={s.footerLink}>← Volver al inicio de sesión</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: E.bg },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 48, justifyContent: 'center' },

  logoWrap: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 32 },
  logoIcon: {
    width: 52, height: 52, backgroundColor: E.primary, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: E.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  logoEmoji:  { fontSize: 26 },
  logoText:   { fontSize: 22, fontWeight: '800', color: E.text, letterSpacing: -0.5 },
  logoAccent: { color: E.primary },
  logoTag:    { fontSize: 9, color: E.textMute, letterSpacing: 2.5, marginTop: 2 },

  card: {
    backgroundColor: E.card, borderRadius: E.radius.xl,
    borderWidth: 1, borderColor: E.border, padding: 24,
    shadowColor: E.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 20, elevation: 4,
  },
  cardTopLine: {
    position: 'absolute', top: 0, left: 40, right: 40,
    height: 3, backgroundColor: E.primary,
    borderBottomLeftRadius: 4, borderBottomRightRadius: 4,
  },

  title:    { fontSize: 22, fontWeight: '800', color: E.text, marginBottom: 8 },
  subtitle: { fontSize: 13, color: E.textDim, lineHeight: 20, marginBottom: 20 },

  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderRadius: E.radius.sm, padding: 12, marginBottom: 16,
    borderLeftWidth: 3, borderLeftColor: E.danger,
  },
  errorText: { color: E.danger, fontSize: 13 },

  fieldWrap:  { marginBottom: 16 },
  fieldLabel: { fontSize: 11, color: E.textDim, letterSpacing: 1.5, fontWeight: '600', marginBottom: 8 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: E.bg2, borderRadius: E.radius.md,
    borderWidth: 1.5, borderColor: E.border,
    paddingHorizontal: 14, paddingVertical: 13,
  },
  inputIcon: { fontSize: 16 },
  input:     { flex: 1, fontSize: 14, color: E.text },

  btnPrimary: {
    backgroundColor: E.primary, borderRadius: E.radius.md,
    paddingVertical: 16, alignItems: 'center', marginBottom: 16,
    shadowColor: E.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 6,
  },
  btnDisabled:    { opacity: 0.5 },
  btnPrimaryText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  successWrap:  { alignItems: 'center', paddingVertical: 20 },
  successIcon:  { fontSize: 52, marginBottom: 16 },
  successTitle: { fontSize: 20, fontWeight: '800', color: E.text, marginBottom: 10 },
  successText:  { fontSize: 13, color: E.textDim, textAlign: 'center', lineHeight: 20 },

  footerRow:  { alignItems: 'center', marginTop: 8 },
  footerLink: { fontSize: 13, color: E.primary, fontWeight: '600' },
});

================================================
📄 ARCHIVO: app\(auth)\login.tsx
================================================

import { useAuth } from '@features/auth/presentation/hooks/useAuth';
import { E } from '@/constants/theme';
import { Link } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [focused, setFocused]   = useState<string | null>(null);
  const { login, isLoading, error } = useAuth();
  const insets = useSafeAreaInsets();

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={s.logoWrap}>
          <View style={s.logoIcon}>
            <Text style={s.logoEmoji}>🐾</Text>
          </View>
          <View>
            <Text style={s.logoText}>
              Pet<Text style={s.logoAccent}>Adopt</Text>
            </Text>
            <Text style={s.logoTag}>ADOPTA UN AMIGO HOY</Text>
          </View>
        </View>

        {/* Hero */}
        <View style={s.hero}>
          <Text style={s.eyebrow}>BIENVENIDO DE VUELTA</Text>
          <Text style={s.title}>Inicia <Text style={s.titleAccent}>sesión</Text></Text>
          <Text style={s.subtitle}>
            Conecta con refugios y encuentra tu compañero ideal
          </Text>
        </View>

        {/* Card */}
        <View style={s.card}>
          <View style={s.cardTopLine} />

          {error && (
            <View style={s.errorBox}>
              <Text style={s.errorText}>⚠ {error}</Text>
            </View>
          )}

          {/* Email */}
          <View style={s.fieldWrap}>
            <Text style={s.fieldLabel}>EMAIL</Text>
            <View style={[s.inputWrap, focused === 'email' && s.inputFocused]}>
              <Text style={s.inputIcon}>✉</Text>
              <TextInput
                style={s.input}
                value={email}
                onChangeText={setEmail}
                placeholder="usuario@ejemplo.com"
                placeholderTextColor={E.textMute}
                autoCapitalize="none"
                keyboardType="email-address"
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused(null)}
              />
            </View>
          </View>

          {/* Password */}
          <View style={s.fieldWrap}>
            <Text style={s.fieldLabel}>CONTRASEÑA</Text>
            <View style={[s.inputWrap, focused === 'password' && s.inputFocused]}>
              <Text style={s.inputIcon}>🔒</Text>
              <TextInput
                style={s.input}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={E.textMute}
                secureTextEntry
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
              />
            </View>
          </View>

          {/* Forgot password */}
          <TouchableOpacity style={s.forgotWrap}>
            <Link href={'/(auth)/forgot-password' as any}>
              <Text style={s.forgotText}>¿Olvidaste tu contraseña?</Text>
            </Link>
          </TouchableOpacity>

          {/* Divider */}
          <View style={s.divider}>
            <View style={s.dividerLine} />
            <Text style={s.dividerText}>o</Text>
            <View style={s.dividerLine} />
          </View>

          {/* Botón principal */}
          <TouchableOpacity
            style={[s.btnPrimary, isLoading && s.btnDisabled]}
            onPress={() => login({ email, password })}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.btnPrimaryText}>Iniciar sesión →</Text>
            }
          </TouchableOpacity>

          {/* Ir a registro */}
          <View style={s.footerRow}>
            <Text style={s.footerText}>¿No tienes cuenta? </Text>
            <Link href="/(auth)/register">
              <Text style={s.footerLink}>Regístrate</Text>
            </Link>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: E.bg },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 48, justifyContent: 'center' },

  // Logo
  logoWrap: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 40 },
  logoIcon: {
    width: 52, height: 52,
    backgroundColor: E.primary, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: E.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  logoEmoji: { fontSize: 26 },
  logoText:  { fontSize: 22, fontWeight: '800', color: E.text, letterSpacing: -0.5 },
  logoAccent:{ color: E.primary },
  logoTag:   { fontSize: 9, color: E.textMute, letterSpacing: 2.5, marginTop: 2 },

  // Hero
  hero:     { marginBottom: 28 },
  eyebrow:  { fontSize: 10, color: E.primary, letterSpacing: 2.5, marginBottom: 8, fontWeight: '600' },
  title:    { fontSize: 36, fontWeight: '800', color: E.text, letterSpacing: -1, lineHeight: 42 },
  titleAccent: { color: E.primary },
  subtitle: { fontSize: 13, color: E.textDim, marginTop: 8, lineHeight: 20 },

  // Card
  card: {
    backgroundColor: E.card,
    borderRadius: E.radius.xl,
    borderWidth: 1, borderColor: E.border,
    padding: 24,
    shadowColor: E.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 20, elevation: 4,
  },
  cardTopLine: {
    position: 'absolute', top: 0, left: 40, right: 40,
    height: 3, backgroundColor: E.primary,
    borderBottomLeftRadius: 4, borderBottomRightRadius: 4,
  },

  // Error
  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderRadius: E.radius.sm, padding: 12, marginBottom: 16,
    borderLeftWidth: 3, borderLeftColor: E.danger,
  },
  errorText: { color: E.danger, fontSize: 13 },

  // Fields
  fieldWrap:  { marginBottom: 16 },
  fieldLabel: {
    fontSize: 11, color: E.textDim, letterSpacing: 1.5,
    fontWeight: '600', marginBottom: 8,
  },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: E.bg2,
    borderRadius: E.radius.md, borderWidth: 1.5, borderColor: E.border,
    paddingHorizontal: 14, paddingVertical: 13,
  },
  inputFocused: {
    borderColor: E.primary,
    backgroundColor: E.primaryDim,
  },
  inputIcon: { fontSize: 16 },
  input: { flex: 1, fontSize: 14, color: E.text },

  // Forgot
  forgotWrap: { alignItems: 'flex-end', marginTop: -4, marginBottom: 16 },
  forgotText: { fontSize: 12, color: E.primary, fontWeight: '600' },

  // Divider
  divider:     { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: E.border },
  dividerText: { fontSize: 12, color: E.textMute },

  // Botones
  btnPrimary: {
    backgroundColor: E.primary,
    borderRadius: E.radius.md, paddingVertical: 16,
    alignItems: 'center', marginBottom: 16,
    shadowColor: E.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 6,
  },
  btnDisabled:    { opacity: 0.5 },
  btnPrimaryText: { color: '#fff', fontSize: 15, fontWeight: '700', letterSpacing: 0.3 },

  // Footer
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontSize: 13, color: E.textDim },
  footerLink: { fontSize: 13, color: E.primary, fontWeight: '700' },
});

================================================
📄 ARCHIVO: app\(auth)\register.tsx
================================================

import { useAuth } from '@features/auth/presentation/hooks/useAuth';
import { E } from '@/constants/theme';
import { Link } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { UserRole } from '@features/auth/domain/entities/User';

export default function RegisterScreen() {
  const [step, setStep]           = useState<1 | 2>(1);
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [username, setUsername]   = useState('');
  const [role, setRole]           = useState<UserRole>('adoptante');
  const [shelterName, setShelterName]       = useState('');
  const [shelterAddress, setShelterAddress] = useState('');
  const [shelterPhone, setShelterPhone]     = useState('');
  const [focused, setFocused]     = useState<string | null>(null);
  const { register, isLoading, error } = useAuth();
  const insets = useSafeAreaInsets();

  const handleRegister = () => {
    if (password !== confirm) return;
    const extra = role === 'refugio' ? {
      shelter_name:    shelterName,
      shelter_address: shelterAddress,
      shelter_phone:   shelterPhone,
    } : undefined;
    register({ email, password, username, role, extra });
  };

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[s.scroll, { paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={s.logoWrap}>
          <View style={s.logoIcon}>
            <Text style={s.logoEmoji}>🐾</Text>
          </View>
          <View>
            <Text style={s.logoText}>
              Pet<Text style={s.logoAccent}>Adopt</Text>
            </Text>
            <Text style={s.logoTag}>ADOPTA UN AMIGO HOY</Text>
          </View>
        </View>

        {/* Hero */}
        <View style={s.hero}>
          <Text style={s.eyebrow}>CREAR CUENTA</Text>
          <Text style={s.title}>Únete a <Text style={s.titleAccent}>PetAdopt</Text></Text>
          <Text style={s.subtitle}>
            {step === 1
              ? 'Elige cómo quieres participar'
              : 'Completa tus datos para continuar'}
          </Text>
        </View>

        {/* Indicador de pasos */}
        <View style={s.stepsRow}>
          <View style={[s.stepDot, step >= 1 && s.stepDotActive]} />
          <View style={s.stepLine} />
          <View style={[s.stepDot, step >= 2 && s.stepDotActive]} />
        </View>

        {/* Card */}
        <View style={s.card}>
          <View style={s.cardTopLine} />

          {error && (
            <View style={s.errorBox}>
              <Text style={s.errorText}>⚠ {error}</Text>
            </View>
          )}

          {/* ── PASO 1: Elegir rol ── */}
          {step === 1 && (
            <>
              <Text style={s.sectionTitle}>¿Cómo quieres participar?</Text>

              <View style={s.roleRow}>
                {/* Adoptante */}
                <TouchableOpacity
                  style={[s.roleCard, role === 'adoptante' && s.roleCardActive]}
                  onPress={() => setRole('adoptante')}
                  activeOpacity={0.8}
                >
                  <Text style={s.roleEmoji}>🏠</Text>
                  <Text style={[s.roleTitle, role === 'adoptante' && s.roleTitleActive]}>
                    Adoptante
                  </Text>
                  <Text style={s.roleDesc}>Busca y adopta mascotas</Text>
                  {role === 'adoptante' && (
                    <View style={s.roleCheck}><Text style={s.roleCheckText}>✓</Text></View>
                  )}
                </TouchableOpacity>

                {/* Refugio */}
                <TouchableOpacity
                  style={[s.roleCard, role === 'refugio' && s.roleCardActiveRefugio]}
                  onPress={() => setRole('refugio')}
                  activeOpacity={0.8}
                >
                  <Text style={s.roleEmoji}>🏥</Text>
                  <Text style={[s.roleTitle, role === 'refugio' && s.roleTitleActive]}>
                    Refugio
                  </Text>
                  <Text style={s.roleDesc}>Publica mascotas en adopción</Text>
                  {role === 'refugio' && (
                    <View style={[s.roleCheck, s.roleCheckRefugio]}>
                      <Text style={s.roleCheckText}>✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={s.btnPrimary}
                onPress={() => setStep(2)}
                activeOpacity={0.85}
              >
                <Text style={s.btnPrimaryText}>Continuar →</Text>
              </TouchableOpacity>

              <View style={s.footerRow}>
                <Text style={s.footerText}>¿Ya tienes cuenta? </Text>
                <Link href="/(auth)/login">
                  <Text style={s.footerLink}>Inicia sesión</Text>
                </Link>
              </View>
            </>
          )}

          {/* ── PASO 2: Datos del usuario ── */}
          {step === 2 && (
            <>
              {/* Username */}
              <View style={s.fieldWrap}>
                <Text style={s.fieldLabel}>NOMBRE DE USUARIO</Text>
                <View style={[s.inputWrap, focused === 'username' && s.inputFocused]}>
                  <Text style={s.inputIcon}>👤</Text>
                  <TextInput
                    style={s.input}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Sin espacios"
                    placeholderTextColor={E.textMute}
                    autoCapitalize="none"
                    onFocus={() => setFocused('username')}
                    onBlur={() => setFocused(null)}
                  />
                </View>
              </View>

              {/* Email */}
              <View style={s.fieldWrap}>
                <Text style={s.fieldLabel}>EMAIL</Text>
                <View style={[s.inputWrap, focused === 'email' && s.inputFocused]}>
                  <Text style={s.inputIcon}>✉</Text>
                  <TextInput
                    style={s.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="correo@ejemplo.com"
                    placeholderTextColor={E.textMute}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                  />
                </View>
              </View>

              {/* Password */}
              <View style={s.fieldWrap}>
                <Text style={s.fieldLabel}>CONTRASEÑA</Text>
                <View style={[s.inputWrap, focused === 'password' && s.inputFocused]}>
                  <Text style={s.inputIcon}>🔒</Text>
                  <TextInput
                    style={s.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Mínimo 6 caracteres"
                    placeholderTextColor={E.textMute}
                    secureTextEntry
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                  />
                </View>
              </View>

              {/* Confirmar password */}
              <View style={s.fieldWrap}>
                <Text style={s.fieldLabel}>CONFIRMAR CONTRASEÑA</Text>
                <View style={[
                  s.inputWrap,
                  focused === 'confirm' && s.inputFocused,
                  confirm && password !== confirm && s.inputError,
                ]}>
                  <Text style={s.inputIcon}>🔒</Text>
                  <TextInput
                    style={s.input}
                    value={confirm}
                    onChangeText={setConfirm}
                    placeholder="Repite la contraseña"
                    placeholderTextColor={E.textMute}
                    secureTextEntry
                    onFocus={() => setFocused('confirm')}
                    onBlur={() => setFocused(null)}
                  />
                </View>
                {confirm && password !== confirm && (
                  <Text style={s.fieldError}>Las contraseñas no coinciden</Text>
                )}
              </View>

              {/* Campos extra para refugio */}
              {role === 'refugio' && (
                <>
                  <View style={s.refugioBanner}>
                    <Text style={s.refugioBannerText}>🏥 Datos del refugio</Text>
                  </View>

                  <View style={s.fieldWrap}>
                    <Text style={s.fieldLabel}>NOMBRE DEL REFUGIO</Text>
                    <View style={[s.inputWrap, focused === 'shelterName' && s.inputFocused]}>
                      <Text style={s.inputIcon}>🏥</Text>
                      <TextInput
                        style={s.input}
                        value={shelterName}
                        onChangeText={setShelterName}
                        placeholder="Nombre oficial del refugio"
                        placeholderTextColor={E.textMute}
                        onFocus={() => setFocused('shelterName')}
                        onBlur={() => setFocused(null)}
                      />
                    </View>
                  </View>

                  <View style={s.fieldWrap}>
                    <Text style={s.fieldLabel}>DIRECCIÓN</Text>
                    <View style={[s.inputWrap, focused === 'shelterAddress' && s.inputFocused]}>
                      <Text style={s.inputIcon}>📍</Text>
                      <TextInput
                        style={s.input}
                        value={shelterAddress}
                        onChangeText={setShelterAddress}
                        placeholder="Dirección completa"
                        placeholderTextColor={E.textMute}
                        onFocus={() => setFocused('shelterAddress')}
                        onBlur={() => setFocused(null)}
                      />
                    </View>
                  </View>

                  <View style={s.fieldWrap}>
                    <Text style={s.fieldLabel}>TELÉFONO</Text>
                    <View style={[s.inputWrap, focused === 'shelterPhone' && s.inputFocused]}>
                      <Text style={s.inputIcon}>📞</Text>
                      <TextInput
                        style={s.input}
                        value={shelterPhone}
                        onChangeText={setShelterPhone}
                        placeholder="Número de contacto"
                        placeholderTextColor={E.textMute}
                        keyboardType="phone-pad"
                        onFocus={() => setFocused('shelterPhone')}
                        onBlur={() => setFocused(null)}
                      />
                    </View>
                  </View>
                </>
              )}

              {/* Botones paso 2 */}
              <View style={s.btnRow}>
                <TouchableOpacity
                  style={s.btnBack}
                  onPress={() => setStep(1)}
                  activeOpacity={0.7}
                >
                  <Text style={s.btnBackText}>← Volver</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[s.btnPrimary, s.btnPrimaryFlex, isLoading && s.btnDisabled]}
                  onPress={handleRegister}
                  disabled={isLoading || password !== confirm}
                  activeOpacity={0.85}
                >
                  {isLoading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={s.btnPrimaryText}>Crear cuenta →</Text>
                  }
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: E.bg },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 40, justifyContent: 'center' },

  logoWrap: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 32 },
  logoIcon: {
    width: 52, height: 52, backgroundColor: E.primary, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: E.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 8,
  },
  logoEmoji:  { fontSize: 26 },
  logoText:   { fontSize: 22, fontWeight: '800', color: E.text, letterSpacing: -0.5 },
  logoAccent: { color: E.primary },
  logoTag:    { fontSize: 9, color: E.textMute, letterSpacing: 2.5, marginTop: 2 },

  hero:        { marginBottom: 20 },
  eyebrow:     { fontSize: 10, color: E.primary, letterSpacing: 2.5, marginBottom: 8, fontWeight: '600' },
  title:       { fontSize: 32, fontWeight: '800', color: E.text, letterSpacing: -1 },
  titleAccent: { color: E.primary },
  subtitle:    { fontSize: 13, color: E.textDim, marginTop: 6, lineHeight: 20 },

  // Steps indicator
  stepsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, paddingHorizontal: 60 },
  stepDot:  { width: 10, height: 10, borderRadius: 5, backgroundColor: E.border },
  stepDotActive: { backgroundColor: E.primary },
  stepLine: { flex: 1, height: 2, backgroundColor: E.border, marginHorizontal: 6 },

  card: {
    backgroundColor: E.card, borderRadius: E.radius.xl,
    borderWidth: 1, borderColor: E.border, padding: 24,
    shadowColor: E.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 20, elevation: 4,
  },
  cardTopLine: {
    position: 'absolute', top: 0, left: 40, right: 40,
    height: 3, backgroundColor: E.primary,
    borderBottomLeftRadius: 4, borderBottomRightRadius: 4,
  },

  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderRadius: E.radius.sm, padding: 12, marginBottom: 16,
    borderLeftWidth: 3, borderLeftColor: E.danger,
  },
  errorText: { color: E.danger, fontSize: 13 },

  sectionTitle: {
    fontSize: 15, fontWeight: '700', color: E.text,
    marginBottom: 16, textAlign: 'center',
  },

  // Role cards
  roleRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  roleCard: {
    flex: 1, padding: 16, borderRadius: E.radius.lg,
    borderWidth: 1.5, borderColor: E.border,
    backgroundColor: E.bg2, alignItems: 'center', gap: 6,
  },
  roleCardActive: {
    borderColor: E.primary, backgroundColor: E.primaryDim,
  },
  roleCardActiveRefugio: {
    borderColor: E.secondary, backgroundColor: 'rgba(14,165,233,0.08)',
  },
  roleEmoji:    { fontSize: 28 },
  roleTitle:    { fontSize: 13, fontWeight: '700', color: E.textDim, letterSpacing: 0.3 },
  roleTitleActive: { color: E.text },
  roleDesc:     { fontSize: 10, color: E.textMute, textAlign: 'center', lineHeight: 14 },
  roleCheck: {
    position: 'absolute', top: 8, right: 8,
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: E.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  roleCheckRefugio: { backgroundColor: E.secondary },
  roleCheckText: { color: '#fff', fontSize: 10, fontWeight: '800' },

  // Fields
  fieldWrap:  { marginBottom: 14 },
  fieldLabel: { fontSize: 11, color: E.textDim, letterSpacing: 1.5, fontWeight: '600', marginBottom: 8 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: E.bg2, borderRadius: E.radius.md,
    borderWidth: 1.5, borderColor: E.border,
    paddingHorizontal: 14, paddingVertical: 13,
  },
  inputFocused: { borderColor: E.primary, backgroundColor: E.primaryDim },
  inputError:   { borderColor: E.danger },
  inputIcon:    { fontSize: 16 },
  input:        { flex: 1, fontSize: 14, color: E.text },
  fieldError:   { fontSize: 11, color: E.danger, marginTop: 4 },

  // Refugio banner
  refugioBanner: {
    backgroundColor: 'rgba(14,165,233,0.08)',
    borderRadius: E.radius.sm, padding: 10,
    marginBottom: 14, borderLeftWidth: 3,
    borderLeftColor: E.secondary,
  },
  refugioBannerText: { fontSize: 13, color: E.secondary, fontWeight: '600' },

  // Botones
  btnRow:        { flexDirection: 'row', gap: 10, marginTop: 4 },
  btnPrimary: {
    backgroundColor: E.primary, borderRadius: E.radius.md,
    paddingVertical: 16, alignItems: 'center', marginBottom: 16,
    shadowColor: E.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 6,
  },
  btnPrimaryFlex: { flex: 1, marginBottom: 0 },
  btnDisabled:    { opacity: 0.5 },
  btnPrimaryText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  btnBack: {
    paddingHorizontal: 16, paddingVertical: 16,
    borderRadius: E.radius.md, borderWidth: 1.5,
    borderColor: E.border, alignItems: 'center', justifyContent: 'center',
  },
  btnBackText: { fontSize: 13, color: E.textDim, fontWeight: '600' },

  // Footer
  footerRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  footerText: { fontSize: 13, color: E.textDim },
  footerLink: { fontSize: 13, color: E.primary, fontWeight: '700' },
});

================================================
📄 ARCHIVO: app\(auth)\_layout.tsx
================================================

import { Stack } from "expo-router";

export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}


================================================
📄 ARCHIVO: app\(shelter)\_layout.tsx
================================================

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

================================================
📄 ARCHIVO: app\_layout.tsx
================================================

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@features/auth/presentation/store/authStore';
import { SupabaseAuthRepository } from '@features/auth/infrastructure/repositories/SupabaseAuthRepository';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});
const authRepo = new SupabaseAuthRepository();

function AuthGuard() {
  const { user, setUser } = useAuthStore();
  const segments  = useSegments();
  const router    = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function restoreSession() {
      try {
        const user = await authRepo.getCurrentUser();
        setUser(user);
      } catch {
        setUser(null);
      } finally {
        setIsReady(true);
      }
    }
    restoreSession();
  }, [setUser]);

  useEffect(() => {
    if (!isReady) return;
    const inAuth    = (segments[0] as string) === '(auth)';
    const inAdopter = (segments[0] as string) === '(adopter)';
    const inShelter = (segments[0] as string) === '(shelter)';

    if (!user && !inAuth) {
      router.replace('/(auth)/login' as any);
    } else if (user && inAuth) {
      router.replace((user.role === 'refugio' ? '/(shelter)' : '/(adopter)') as any);
    } else if (user && user.role === 'refugio' && inAdopter) {
      router.replace('/(shelter)' as any);
    } else if (user && user.role === 'adoptante' && inShelter) {
      router.replace('/(adopter)' as any);
    }
  }, [user, segments, isReady, router]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGuard />
    </QueryClientProvider>
  );
}

================================================
📄 ARCHIVO: app.json
================================================

{
  "expo": {
    "name": "PetAdopt",
    "slug": "petadopt",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "petadopt",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": { "supportsTablet": true },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundColor": "#F97316"
      },
      "edgeToEdgeEnabled": true
    },
    "web": { "output": "static", "favicon": "./assets/images/favicon.png" },
    "plugins": [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#FFF7F0"
        }
      ],
      "expo-secure-store",
      "expo-image-picker",
      "expo-location"
    ],
    "experiments": { "typedRoutes": true }
  }
}

================================================
📄 ARCHIVO: CLAUDE.md
================================================

@AGENTS.md


================================================
📄 ARCHIVO: components\external-link.tsx
================================================

import { Href, Link } from 'expo-router';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import { type ComponentProps } from 'react';

type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: Href & string };

export function ExternalLink({ href, ...rest }: Props) {
  return (
    <Link
      target="_blank"
      {...rest}
      href={href}
      onPress={async (event) => {
        if (process.env.EXPO_OS !== 'web') {
          // Prevent the default behavior of linking to the default browser on native.
          event.preventDefault();
          // Open the link in an in-app browser.
          await openBrowserAsync(href, {
            presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
          });
        }
      }}
    />
  );
}


================================================
📄 ARCHIVO: components\haptic-tab.tsx
================================================

import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}


================================================
📄 ARCHIVO: components\hello-wave.tsx
================================================

import Animated from 'react-native-reanimated';

export function HelloWave() {
  return (
    <Animated.Text
      style={{
        fontSize: 28,
        lineHeight: 32,
        marginTop: -6,
        animationName: {
          '50%': { transform: [{ rotate: '25deg' }] },
        },
        animationIterationCount: 4,
        animationDuration: '300ms',
      }}>
      👋
    </Animated.Text>
  );
}


================================================
📄 ARCHIVO: components\parallax-scroll-view.tsx
================================================

import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';

const HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerBackgroundColor: { dark: string; light: string };
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerBackgroundColor,
}: Props) {
  const backgroundColor = useThemeColor({}, 'background');
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollOffset(scrollRef);
  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
        },
      ],
    };
  });

  return (
    <Animated.ScrollView
      ref={scrollRef}
      style={{ backgroundColor, flex: 1 }}
      scrollEventThrottle={16}>
      <Animated.View
        style={[
          styles.header,
          { backgroundColor: headerBackgroundColor[colorScheme] },
          headerAnimatedStyle,
        ]}>
        {headerImage}
      </Animated.View>
      <ThemedView style={styles.content}>{children}</ThemedView>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: 'hidden',
  },
});


================================================
📄 ARCHIVO: components\themed-text.tsx
================================================

import { StyleSheet, Text, type TextProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: '#0a7ea4',
  },
});


================================================
📄 ARCHIVO: components\themed-view.tsx
================================================

import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/use-theme-color';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}


================================================
📄 ARCHIVO: components\ui\collapsible.tsx
================================================

import { PropsWithChildren, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function Collapsible({ children, title }: PropsWithChildren & { title: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const theme = useColorScheme() ?? 'light';

  return (
    <ThemedView>
      <TouchableOpacity
        style={styles.heading}
        onPress={() => setIsOpen((value) => !value)}
        activeOpacity={0.8}>
        <IconSymbol
          name="chevron.right"
          size={18}
          weight="medium"
          color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
          style={{ transform: [{ rotate: isOpen ? '90deg' : '0deg' }] }}
        />

        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </TouchableOpacity>
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  content: {
    marginTop: 6,
    marginLeft: 24,
  },
});


================================================
📄 ARCHIVO: components\ui\icon-symbol.ios.tsx
================================================

import { SymbolView, SymbolViewProps, SymbolWeight } from 'expo-symbols';
import { StyleProp, ViewStyle } from 'react-native';

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
  weight = 'regular',
}: {
  name: SymbolViewProps['name'];
  size?: number;
  color: string;
  style?: StyleProp<ViewStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <SymbolView
      weight={weight}
      tintColor={color}
      resizeMode="scaleAspectFit"
      name={name}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
    />
  );
}


================================================
📄 ARCHIVO: components\ui\icon-symbol.tsx
================================================

// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { SymbolWeight, SymbolViewProps } from 'expo-symbols';
import { ComponentProps } from 'react';
import { OpaqueColorValue, type StyleProp, type TextStyle } from 'react-native';

type IconMapping = Record<SymbolViewProps['name'], ComponentProps<typeof MaterialIcons>['name']>;
type IconSymbolName = keyof typeof MAPPING;

/**
 * Add your SF Symbols to Material Icons mappings here.
 * - see Material Icons in the [Icons Directory](https://icons.expo.fyi).
 * - see SF Symbols in the [SF Symbols](https://developer.apple.com/sf-symbols/) app.
 */
const MAPPING = {
  'house.fill': 'home',
  'paperplane.fill': 'send',
  'chevron.left.forwardslash.chevron.right': 'code',
  'chevron.right': 'chevron-right',
} as IconMapping;

/**
 * An icon component that uses native SF Symbols on iOS, and Material Icons on Android and web.
 * This ensures a consistent look across platforms, and optimal resource usage.
 * Icon `name`s are based on SF Symbols and require manual mapping to Material Icons.
 */
export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={style} />;
}


================================================
📄 ARCHIVO: constants\theme.ts
================================================

export const E = {
  bg:           '#FFF7F0',
  bg2:          '#FEF3E8',
  card:         '#FFFFFF',
  primary:      '#F97316',
  primaryDark:  '#EA580C',
  primaryLight: '#FED7AA',
  primaryDim:   'rgba(249,115,22,0.12)',
  primaryGlow:  'rgba(249,115,22,0.35)',
  secondary:    '#0EA5E9',
  success:      '#22C55E',
  danger:       '#EF4444',
  warning:      '#F59E0B',
  text:         '#1C1C1E',
  textDim:      '#6B7280',
  textMute:     '#9CA3AF',
  border:       'rgba(249,115,22,0.22)',
  borderHover:  'rgba(249,115,22,0.55)',
  gradPrimary:  ['#F97316', '#EA580C'] as const,
  gradBlue:     ['#0EA5E9', '#0284C7'] as const,
  radius: { sm: 10, md: 14, lg: 20, xl: 24, full: 100 },
} as const;

export const Colors = {
  light: {
    text: '#1C1C1E', background: '#FFF7F0',
    tint: '#F97316', icon: '#9CA3AF',
    tabIconDefault: '#9CA3AF', tabIconSelected: '#F97316',
  },
  dark: {
    text: '#ECEDEE', background: '#151718',
    tint: '#F97316', icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6', tabIconSelected: '#F97316',
  },
};

================================================
📄 ARCHIVO: env.d.ts
================================================

declare const process: {
    env: {
        readonly EXPO_PUBLIC_SUPABASE_URL: string;
        readonly EXPO_PUBLIC_SUPABASE_ANON_KEY: string;
        readonly [key: string]: string | undefined;
    };
};

================================================
📄 ARCHIVO: eslint.config.js
================================================

// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
]);


================================================
📄 ARCHIVO: expo-env.d.ts
================================================

/// <reference types="expo/types" />

// NOTE: This file should not be edited and should be in your git ignore

================================================
📄 ARCHIVO: hooks\use-color-scheme.ts
================================================

export { useColorScheme } from 'react-native';


================================================
📄 ARCHIVO: hooks\use-color-scheme.web.ts
================================================

import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return colorScheme;
  }

  return 'light';
}


================================================
📄 ARCHIVO: hooks\use-theme-color.ts
================================================

/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}


================================================
📄 ARCHIVO: package.json
================================================

{
  "name": "chat-web-socket",
  "main": "expo-router/entry",
  "version": "1.0.0",
  "scripts": {
    "start": "expo start",
    "reset-project": "node ./scripts/reset-project.js",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web",
    "lint": "expo lint"
  },
  "dependencies": {
    "@expo/vector-icons": "^15.0.3",
    "@react-navigation/bottom-tabs": "^7.4.0",
    "@react-navigation/elements": "^2.6.3",
    "@react-navigation/native": "^7.1.8",
    "@supabase/supabase-js": "^2.106.1",
    "@tanstack/react-query": "^5.100.13",
    "appwrite": "^25.2.0",
    "base64-arraybuffer": "^1.0.2",
    "date-fns": "^4.3.0",
    "expo": "~54.0.33",
    "expo-constants": "~18.0.13",
    "expo-file-system": "~19.0.22",
    "expo-font": "~14.0.11",
    "expo-haptics": "~15.0.8",
    "expo-image": "~3.0.11",
    "expo-image-picker": "~17.0.11",
    "expo-linking": "~8.0.11",
    "expo-location": "~19.0.8",
    "expo-notifications": "~0.32.17",
    "expo-router": "~6.0.23",
    "expo-secure-store": "~15.0.8",
    "expo-splash-screen": "~31.0.13",
    "expo-status-bar": "~3.0.9",
    "expo-symbols": "~1.0.8",
    "expo-system-ui": "~6.0.9",
    "expo-web-browser": "~15.0.10",
    "react": "19.1.0",
    "react-dom": "19.1.0",
    "react-native": "0.81.5",
    "react-native-gesture-handler": "~2.28.0",
    "react-native-reanimated": "~4.1.1",
    "react-native-safe-area-context": "~5.6.0",
    "react-native-screens": "~4.16.0",
    "react-native-web": "~0.21.0",
    "react-native-webview": "13.15.0",
    "react-native-worklets": "0.5.1",
    "zustand": "^5.0.13"
  },
  "devDependencies": {
    "@types/react": "~19.1.0",
    "eslint": "^9.25.0",
    "eslint-config-expo": "~10.0.0",
    "typescript": "~5.9.2"
  },
  "private": true
}


================================================
📄 ARCHIVO: README.md
================================================

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.


================================================
📄 ARCHIVO: scripts\reset-project.js
================================================

#!/usr/bin/env node

/**
 * This script is used to reset the project to a blank state.
 * It deletes or moves the /app, /components, /hooks, /scripts, and /constants directories to /app-example based on user input and creates a new /app directory with an index.tsx and _layout.tsx file.
 * You can remove the `reset-project` script from package.json and safely delete this file after running it.
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const root = process.cwd();
const oldDirs = ["app", "components", "hooks", "constants", "scripts"];
const exampleDir = "app-example";
const newAppDir = "app";
const exampleDirPath = path.join(root, exampleDir);

const indexContent = `import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
`;

const layoutContent = `import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const moveDirectories = async (userInput) => {
  try {
    if (userInput === "y") {
      // Create the app-example directory
      await fs.promises.mkdir(exampleDirPath, { recursive: true });
      console.log(`📁 /${exampleDir} directory created.`);
    }

    // Move old directories to new app-example directory or delete them
    for (const dir of oldDirs) {
      const oldDirPath = path.join(root, dir);
      if (fs.existsSync(oldDirPath)) {
        if (userInput === "y") {
          const newDirPath = path.join(root, exampleDir, dir);
          await fs.promises.rename(oldDirPath, newDirPath);
          console.log(`➡️ /${dir} moved to /${exampleDir}/${dir}.`);
        } else {
          await fs.promises.rm(oldDirPath, { recursive: true, force: true });
          console.log(`❌ /${dir} deleted.`);
        }
      } else {
        console.log(`➡️ /${dir} does not exist, skipping.`);
      }
    }

    // Create new /app directory
    const newAppDirPath = path.join(root, newAppDir);
    await fs.promises.mkdir(newAppDirPath, { recursive: true });
    console.log("\n📁 New /app directory created.");

    // Create index.tsx
    const indexPath = path.join(newAppDirPath, "index.tsx");
    await fs.promises.writeFile(indexPath, indexContent);
    console.log("📄 app/index.tsx created.");

    // Create _layout.tsx
    const layoutPath = path.join(newAppDirPath, "_layout.tsx");
    await fs.promises.writeFile(layoutPath, layoutContent);
    console.log("📄 app/_layout.tsx created.");

    console.log("\n✅ Project reset complete. Next steps:");
    console.log(
      `1. Run \`npx expo start\` to start a development server.\n2. Edit app/index.tsx to edit the main screen.${
        userInput === "y"
          ? `\n3. Delete the /${exampleDir} directory when you're done referencing it.`
          : ""
      }`
    );
  } catch (error) {
    console.error(`❌ Error during script execution: ${error.message}`);
  }
};

rl.question(
  "Do you want to move existing files to /app-example instead of deleting them? (Y/n): ",
  (answer) => {
    const userInput = answer.trim().toLowerCase() || "y";
    if (userInput === "y" || userInput === "n") {
      moveDirectories(userInput).finally(() => rl.close());
    } else {
      console.log("❌ Invalid input. Please enter 'Y' or 'N'.");
      rl.close();
    }
  }
);


================================================
📄 ARCHIVO: src\features\assistant\presentation\hooks\useAssistant.ts
================================================

import { GeminiMessage, sendGeminiMessage } from '@shared/infrastructure/gemini/client';
import { useState } from 'react';

export interface ChatMessage {
  id:        string;
  role:      'user' | 'bot';
  text:      string;
  createdAt: Date;
}

export function useAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id:        'welcome',
      role:      'bot',
      text:      '¡Hola! Soy VetBot 🐾 Tu asistente de PetAdopt. ¿En qué puedo ayudarte hoy? Puedo orientarte sobre salud, cuidados y alimentación de mascotas.',
      createdAt: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`, role: 'user', text, createdAt: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    setError(null);

    try {
      const history: GeminiMessage[] = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({
          role:  m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }],
        }));

      const response = await sendGeminiMessage(history, text);
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`, role: 'bot', text: response, createdAt: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e: any) {
      setError(e.message ?? 'Error al contactar el asistente');
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => setMessages([{
    id: 'welcome', role: 'bot',
    text: '¡Hola! Soy VetBot 🐾 ¿En qué puedo ayudarte?',
    createdAt: new Date(),
  }]);

  return { messages, sendMessage, isLoading, error, clearChat };
}

================================================
📄 ARCHIVO: src\features\auth\application\use-cases\LoginUseCase.ts
================================================

import { AuthError } from '../../../../shared/domain/errors/AppError';
import { User } from '../../domain/entities/User';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
//Valida reglas antes de llamar al repositorio.//logica se encuentra aquí-FR
export class LoginUseCase {
    constructor(private readonly authRepo: IAuthRepository) {}

    async execute(email: string, password: string): Promise<User> {  //Regla del negocio
        if (!email || !password) 
            throw new AuthError('Email y contraseña son requeridos');
        try {
            return await this.authRepo.login(email, password); //Llama a la interfaz para realizar el login
        } catch (error) {
            throw new AuthError('Credenciales inválidas', error);
        }
    }
};

================================================
📄 ARCHIVO: src\features\auth\application\use-cases\RegisterUseCase.ts
================================================

import { AuthError } from '@shared/domain/errors/AppError';
import { User, UserRole } from '../../domain/entities/User';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';

export class RegisterUseCase {
  constructor(private readonly authRepo: IAuthRepository) {}

  async execute(
    email: string,
    password: string,
    username: string,
    role: UserRole,
    extra?: Record<string, any>
  ): Promise<User> {
    if (!email || !password || !username)
      throw new AuthError('Todos los campos son obligatorios');
    if (password.length < 6)
      throw new AuthError('La contraseña debe tener al menos 6 caracteres');
    if (!['refugio', 'adoptante'].includes(role))
      throw new AuthError('Rol inválido');
    try {
      return await this.authRepo.register(email, password, username, role, extra);
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Error al registrar';
      throw new AuthError(msg);
    }
  }
}

================================================
📄 ARCHIVO: src\features\auth\domain\entities\User.ts
================================================

export type UserRole = 'refugio' | 'adoptante';

export interface User {
  id:             string;
  email:          string;
  username:       string;
  avatarUrl?:     string;
  role:           UserRole;
  shelterName?:   string;
  shelterAddress?:string;
  shelterPhone?:  string;
  latitude?:      number;
  longitude?:     number;
}

================================================
📄 ARCHIVO: src\features\auth\domain\repositories\IAuthRepository.ts
================================================

import { User, UserRole } from '../entities/User';

export interface IAuthRepository {
  login(email: string, password: string): Promise<User>;
  loginWithGoogle(): Promise<User>;
  register(
    email: string,
    password: string,
    username: string,
    role: UserRole,
    extra?: Record<string, any>
  ): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  resetPassword(email: string): Promise<void>;
}

================================================
📄 ARCHIVO: src\features\auth\infrastructure\repositories\SupabaseAuthRepository.ts
================================================

import { supabase } from '@shared/infrastructure/supabase/client';
import { User, UserRole } from '../../domain/entities/User';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';

export class SupabaseAuthRepository implements IAuthRepository {

  async login(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.user) throw new Error(error?.message ?? 'Error al iniciar sesión');
    return this._fetchProfile(data.user.id, data.user.email!);
  }

  async loginWithGoogle(): Promise<User> {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) throw new Error(error.message);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('No se pudo obtener el usuario');
    return this._fetchProfile(user.id, user.email!);
  }

  async register(
    email: string,
    password: string,
    username: string,
    role: UserRole,
    extra?: Record<string, any>
  ): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { username, role, display_name: username } },
    });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('No se pudo crear el usuario');

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({ id: data.user.id, username, role, ...extra }, { onConflict: 'id' });
    if (profileError) throw new Error(profileError.message);

    return { id: data.user.id, email: data.user.email!, username, role, ...extra };
  }

  async logout(): Promise<void> {
    await supabase.auth.signOut();
  }

  async resetPassword(email: string): Promise<void> {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://TU_SITIO.vercel.app/reset-password',
    });
    if (error) throw new Error(error.message);
  }

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    return this._fetchProfile(user.id, user.email!);
  }

  private async _fetchProfile(userId: string, email: string): Promise<User> {
    const { data: p } = await supabase
      .from('profiles').select('*').eq('id', userId).single();
    return {
      id:             userId,
      email,
      username:       p?.username ?? '',
      avatarUrl:      p?.avatar_url ?? undefined,
      role:           (p?.role ?? 'adoptante') as UserRole,
      shelterName:    p?.shelter_name ?? undefined,
      shelterAddress: p?.shelter_address ?? undefined,
      shelterPhone:   p?.shelter_phone ?? undefined,
      latitude:       p?.latitude ?? undefined,
      longitude:      p?.longitude ?? undefined,
    };
  }
}

================================================
📄 ARCHIVO: src\features\auth\presentation\hooks\useAuth.ts
================================================

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { LoginUseCase } from '../../application/use-cases/LoginUseCase';
import { RegisterUseCase } from '../../application/use-cases/RegisterUseCase';
import { SupabaseAuthRepository } from '../../infrastructure/repositories/SupabaseAuthRepository';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../../domain/entities/User';

type RegisterDto = {
  email: string; password: string; username: string;
  role: UserRole; extra?: Record<string, any>;
};

const authRepo        = new SupabaseAuthRepository();
const loginUseCase    = new LoginUseCase(authRepo);
const registerUseCase = new RegisterUseCase(authRepo);

export function useAuth() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginUseCase.execute(email, password),
    onSuccess: (user) => {
      setUser(user);
      router.replace((user.role === 'refugio' ? '/(shelter)' : '/(adopter)') as any);
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ email, password, username, role, extra }: RegisterDto) =>
      registerUseCase.execute(email, password, username, role, extra),
    onSuccess: (user) => {
      setUser(user);
      router.replace((user.role === 'refugio' ? '/(shelter)' : '/(adopter)') as any);
    },
  });

  const logout = async () => {
    try { await authRepo.logout(); }
    finally { setUser(null); router.replace('/(auth)/login' as any); }
  };

  const resetPassword = async (email: string) => {
    await authRepo.resetPassword(email);
  };

  return {
    user,
    login:         loginMutation.mutate,
    register:      registerMutation.mutate,
    logout,
    resetPassword,
    isLoading:     loginMutation.isPending || registerMutation.isPending,
    error:         loginMutation.error?.message ?? registerMutation.error?.message ?? null,
  };
}

================================================
📄 ARCHIVO: src\features\auth\presentation\store\authStore.ts
================================================

import { create } from 'zustand';
import { User } from '../../domain/entities/User';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  isRefugio:   () => boolean;
  isAdoptante: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  isRefugio:   () => get().user?.role === 'refugio',
  isAdoptante: () => get().user?.role === 'adoptante',
}));

================================================
📄 ARCHIVO: src\features\chat\application\use-cases\CreateRoomUseCase.ts
================================================

import { ChatError } from '../../../../shared/domain/errors/AppError';
import { Room } from '../../domain/entities/Message';
import { IChatRepository } from '../../domain/repositories/IChatRepository';

export class CreateRoomUseCase {
    constructor(private readonly chatRepo: IChatRepository) {}

    async execute(name: string, userId: string): Promise<Room> {
        if (!name.trim()) throw new ChatError('El nombre de la sala es requerido');
        return this.chatRepo.createRoom(name.trim(), userId);
    }
}

================================================
📄 ARCHIVO: src\features\chat\application\use-cases\GetMessagesUseCase.ts
================================================

import { Message } from '../../domain/entities/Message';
import { IChatRepository } from '../../domain/repositories/IChatRepository';

export class GetMessagesUseCase {
    constructor(private readonly chatRepo: IChatRepository) {}

    execute(roomId: string): Promise<Message[]> {
        return this.chatRepo.getMessages(roomId)
    }
}

================================================
📄 ARCHIVO: src\features\chat\application\use-cases\SendMessageUseCase.ts
================================================

import { ChatError } from '../../../../shared/domain/errors/AppError';
import { Message } from '../../domain/entities/Message';
import { IChatRepository } from '../../domain/repositories/IChatRepository';

export class SendMessageUseCase {
    constructor(private readonly chatRepo: IChatRepository) {}

    async execute(
        roomId: string,
        userId: string,
        content: string,
        imageUrl?: string,
    ): Promise<Message> {
        const trimmed = content.trim();

        // ✅ Válido si hay texto O imagen
        if (!trimmed && !imageUrl)
            throw new ChatError('El mensaje no puede estar vacío');
        if (trimmed.length > 500)
            throw new ChatError('El mensaje no puede tener más de 500 caracteres');

        return this.chatRepo.sendMessage(roomId, userId, trimmed, imageUrl);
    }
}

================================================
📄 ARCHIVO: src\features\chat\application\use-cases\SubscribeToRoomUseCase.ts
================================================

import { Message } from '../../domain/entities/Message'
import { IChatRepository } from '../../domain/repositories/IChatRepository'

export class SubscribeToRoomUseCase {
    constructor(private readonly chatRepo: IChatRepository) {}

    execute(roomId: string, onMessage: (msg: Message) => void): () => void {
        return this.chatRepo.subscribeToRoom(roomId, onMessage);
    }
}

================================================
📄 ARCHIVO: src\features\chat\domain\entities\Message.ts
================================================

export interface Message {
    id: string;
    roomId: string;
    userId: string;
    content: string;
    createdAt: Date;      // era createAt
    authorUsername?: string;
    imageUrl?: string; 
}

export interface Room {
    id: string;
    name: string;
    createdBy: string;
    createdAt: Date;      // era createAt
}

================================================
📄 ARCHIVO: src\features\chat\domain\entities\Room.ts
================================================



================================================
📄 ARCHIVO: src\features\chat\domain\repositories\IChatRepository.ts
================================================

import { Message, Room } from '../entities/Message';

export interface IChatRepository {
    getRooms(): Promise<Room[]>;
    createRoom(name: string, userId: string): Promise<Room>;
    getMessages(roomId: string): Promise<Message[]>;
    sendMessage(
        roomId: string,
        userId: string,
        content: string,
        imageUrl?: string,
    ): Promise<Message>;
    // Devuelve la función unsubscribeFromKeyboardEvents, compatible con el return de useEffect
    subscribeToRoom(
        roomId: string,
        onMessage: (msg: Message) => void,
    ): () => void;
}


================================================
📄 ARCHIVO: src\features\chat\infrastructure\repositories\AppwriteChatRepository.ts
================================================

import { databases, appwriteClient } from '@shared/infrastructure/appwrite/client';
import { ID, Query } from 'appwrite';
import { Message, Room } from '@features/chat/domain/entities/Message';
import { IChatRepository } from '@features/chat/domain/repositories/IChatRepository';

const DB_ID        = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const ROOMS_COL    = process.env.EXPO_PUBLIC_APPWRITE_ROOMS_COLLECTION!;
const MSGS_COL     = process.env.EXPO_PUBLIC_APPWRITE_MESSAGES_COLLECTION!;
const PROFILES_COL = process.env.EXPO_PUBLIC_APPWRITE_PROFILES_COLLECTION!;

export class AppwriteChatRepository implements IChatRepository {

  async getRooms(): Promise<Room[]> {
    const res = await databases.listDocuments(DB_ID, ROOMS_COL, [
      Query.orderDesc('$createdAt'),
    ]);
    return res.documents.map(this.mapRoom);
  }

  async createRoom(name: string, userId: string): Promise<Room> {
    const doc = await databases.createDocument(DB_ID, ROOMS_COL, ID.unique(), {
      name,
      createdBy: userId,
    });
    return this.mapRoom(doc);
  }

  async getMessages(roomId: string): Promise<Message[]> {
    const res = await databases.listDocuments(DB_ID, MSGS_COL, [
      Query.equal('roomId', roomId),
      Query.orderAsc('$createdAt'),
      Query.limit(50),
    ]);
    return res.documents.map(this.mapMessage);
  }

  async sendMessage(
    roomId: string,
    userId: string,
    content: string,
    imageUrl?: string,
  ): Promise<Message> {
    let authorUsername = '';
    try {
      const profileResult = await databases.listDocuments(DB_ID, PROFILES_COL, [
        Query.equal('userId', userId),
      ]);
      authorUsername = profileResult.documents[0]?.username ?? '';
    } catch {
      // Si falla el mensaje igual se envía
    }

    const doc = await databases.createDocument(DB_ID, MSGS_COL, ID.unique(), {
      roomId,
      userId,
      content,
      imageUrl:       imageUrl ?? null,
      authorUsername,
    });
    return this.mapMessage(doc);
  }

  subscribeToRoom(roomId: string, onMessage: (msg: Message) => void): () => void {
    const channel = `databases.${DB_ID}.collections.${MSGS_COL}.documents`;

    const unsubscribe = appwriteClient.subscribe(channel, (response: any) => {
      const isCreate = response.events?.some((e: string) => e.includes('.create'));
      if (!isCreate) return;

      const doc = response.payload;
      if (doc.roomId !== roomId) return;

      onMessage(this.mapMessage(doc));
    });

    return unsubscribe;
  }

  private mapRoom = (doc: any): Room => ({
    id:        doc.$id,
    name:      doc.name,
    createdBy: doc.createdBy,
    createdAt: new Date(doc.$createdAt),
  });

  private mapMessage = (doc: any): Message => ({
    id:             doc.$id,
    roomId:         doc.roomId,
    userId:         doc.userId,
    content:        doc.content,
    createdAt:      new Date(doc.$createdAt),
    authorUsername: doc.authorUsername ?? undefined,
    imageUrl:       doc.imageUrl ?? undefined,
  });
}

================================================
📄 ARCHIVO: src\features\chat\infrastructure\repositories\SupabaseChatRepository.ts
================================================

import { supabase } from "@shared/infrastructure/supabase/client";
import { Message, Room } from "@features/chat/domain/entities/Message";
import { IChatRepository } from "@features/chat/domain/repositories/IChatRepository";

export class SupabaseChatRepository implements IChatRepository {

  async getRooms(): Promise<Room[]> {
    const { data, error } = await supabase
      .from('rooms').select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(this.mapRoom);
  }

  async createRoom(name: string, userId: string): Promise<Room> {
    const { data, error } = await supabase
      .from('rooms').insert({ name, created_by: userId })
      .select().single();
    if (error) throw error;
    return this.mapRoom(data);
  }

  async getMessages(roomId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      // ✅ Fix 1: agregar image_url al select
      .select('id, room_id, user_id, content, created_at, image_url, profiles(username)')
      .eq('room_id', roomId)
      .order('created_at', { ascending: true })
      .limit(50);
    if (error) throw error;
    return (data ?? []).map(this.mapMessage);
  }

  // ✅ Fix 2: agregar imageUrl como parámetro e incluirlo en el insert
  async sendMessage(
    roomId: string,
    userId: string,
    content: string,
    imageUrl?: string,
  ): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert({ room_id: roomId, user_id: userId, content, image_url: imageUrl })
      .select('id, room_id, user_id, content, created_at, image_url, profiles(username)')
      .single();
    if (error) throw error;
    return this.mapMessage(data);
  }

  subscribeToRoom(roomId: string, onMessage: (msg: Message) => void): () => void {
    const channel = supabase
      .channel(`room:${roomId}`)
      .on('postgres_changes', {
          event: 'INSERT', schema: 'public',
          table: 'messages', filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          const { data: profile } = await supabase
            .from('profiles').select('username')
            .eq('id', payload.new.user_id).single();
          onMessage({
            id:             payload.new.id,
            roomId:         payload.new.room_id,
            userId:         payload.new.user_id,
            content:        payload.new.content,
            createdAt:      new Date(payload.new.created_at),
            authorUsername: profile?.username,
            imageUrl:       payload.new.image_url ?? undefined, // ✅ Fix 3: incluir imageUrl del payload
          });
        }
      ).subscribe();

    return () => { supabase.removeChannel(channel); };
  }

  private mapRoom = (raw: any): Room => ({
    id: raw.id, name: raw.name,
    createdBy: raw.created_by, createdAt: new Date(raw.created_at),
  });

  private mapMessage = (raw: any): Message => ({
    id: raw.id, roomId: raw.room_id, userId: raw.user_id,
    content: raw.content, createdAt: new Date(raw.created_at),
    authorUsername: raw.profiles?.username,
    imageUrl: raw.image_url ?? undefined,
  });
}

================================================
📄 ARCHIVO: src\features\chat\presentation\hooks\useChat.ts
================================================

import { useAuthStore } from "@features/auth/presentation/store/authStore";
import { GetMessagesUseCase } from "@features/chat/application/use-cases/GetMessagesUseCase";
import { SendMessageUseCase } from "@features/chat/application/use-cases/SendMessageUseCase";
import { SubscribeToRoomUseCase } from "@features/chat/application/use-cases/SubscribeToRoomUseCase";
import { Message } from "@features/chat/domain/entities/Message";
//import { SupabaseChatRepository } from "@features/chat/infrastructure/repositories/SupabaseChatRepository";
import { AppwriteChatRepository } from '@features/chat/infrastructure/repositories/AppwriteChatRepository';

import { showMessageNotification } from "@shared/infrastructure/notifications/NotificationService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

//const chatRepo           = new SupabaseChatRepository();
const chatRepo           = new AppwriteChatRepository();
const sendMessageUseCase = new SendMessageUseCase(chatRepo);
const getMessagesUseCase = new GetMessagesUseCase(chatRepo);
const subscribeUseCase   = new SubscribeToRoomUseCase(chatRepo);

export function useChat(roomId: string) {
  const user        = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const queryKey    = ['messages', roomId];

  // ── Fetch inicial de mensajes ──
  const { data: messages = [], isLoading } = useQuery({
    queryKey,
    queryFn:   () => getMessagesUseCase.execute(roomId),
    enabled:   !!user,
    staleTime: Infinity,
  });

  // ── Suscripción a mensajes nuevos en tiempo real ──
  useEffect(() => {
    if (!roomId) return;

    const unsubscribe = subscribeUseCase.execute(roomId, (newMsg) => {
      queryClient.setQueryData(queryKey, (old: Message[] = []) => {
        // Reemplaza el mensaje temporal si existe, sino agrega el real
        const hasTempOrReal = old.some(
          (m) => m.id === newMsg.id || (m.id.startsWith('temp-') && m.content === newMsg.content && m.userId === newMsg.userId)
        );
        if (hasTempOrReal) {
          // Reemplaza el temp por el mensaje real de Supabase
          return old.map((m) =>
            m.id.startsWith('temp-') && m.content === newMsg.content && m.userId === newMsg.userId
              ? newMsg
              : m.id === newMsg.id ? newMsg : m
          );
        }
        return [...old, newMsg];
      });

      // Notificación solo si el mensaje es de otro usuario
      if (newMsg.userId !== user?.id) {
        showMessageNotification(
          roomId,
          newMsg.authorUsername ?? 'Alguien',
          newMsg.content || '📷 Imagen',
        );
      }
    });

    return unsubscribe;
  }, [roomId]);

  // ── Envío de mensajes con optimistic update ──
  const sendMutation = useMutation({
    mutationFn: ({ content, imageUrl }: { content: string; imageUrl?: string }) => {
      if (!user) throw new Error('No hay usuario autenticado');
      return sendMessageUseCase.execute(roomId, user.id, content, imageUrl);
    },

    onMutate: async ({ content, imageUrl }) => {
      // Cancelar queries en vuelo para evitar sobreescribir el optimistic update
      await queryClient.cancelQueries({ queryKey });

      const tempMsg: Message = {
        id:             `temp-${Date.now()}`,
        roomId,
        userId:         user!.id,
        content,
        imageUrl,
        createdAt:      new Date(),
        authorUsername: user!.username,
      };

      queryClient.setQueryData(queryKey, (old: Message[] = []) => [...old, tempMsg]);
      return { tempMsg };
    },

    onSuccess: (realMsg, _vars, context) => {
      // Reemplaza el mensaje temporal por el confirmado de Supabase
      queryClient.setQueryData(queryKey, (old: Message[] = []) =>
        old.map((m) => (m.id === context?.tempMsg.id ? realMsg : m))
      );
    },

    onError: (_err, _vars, context) => {
      // Revertir el optimistic update si falla
      if (context?.tempMsg) {
        queryClient.setQueryData(queryKey, (old: Message[] = []) =>
          old.filter((m) => m.id !== context.tempMsg.id)
        );
      }
    },
  });

  return {
    messages,
    sendMessage: sendMutation.mutate,
    isLoading,
    isSending:   sendMutation.isPending,
    sendError:   sendMutation.error?.message ?? null,
  };
}

================================================
📄 ARCHIVO: src\features\chat\presentation\hooks\useRooms.ts
================================================

import { useAuthStore } from "@features/auth/presentation/store/authStore";
import { CreateRoomUseCase } from "@features/chat/application/use-cases/CreateRoomUseCase";
import { Room } from "@features/chat/domain/entities/Message";
//import { SupabaseChatRepository } from "@features/chat/infrastructure/repositories/SupabaseChatRepository";
import { AppwriteChatRepository } from '@features/chat/infrastructure/repositories/AppwriteChatRepository';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

//const chatRepo = new SupabaseChatRepository();
const chatRepo = new AppwriteChatRepository();
const createRoomUseCase = new CreateRoomUseCase(chatRepo);

export function useRooms() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  // useQuery obtiene la lista de salas y la cachea bajo la clave ['rooms']
  const {
    data: rooms = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["rooms"],
    queryFn: () => chatRepo.getRooms(),
    enabled: !!user, // Solo fetchar si hay usuario autenticado
  });

  // useMutation para crear una sala nueva
  const createMutation = useMutation({
    mutationFn: (name: string) => createRoomUseCase.execute(name, user!.id),
    onSuccess: (newRoom) => {
      // Actualizar el cache 
      queryClient.setQueryData(["rooms"], (old: Room[]) => [
        newRoom,
        ...(old ?? []),
      ]);
    },
  });

  return {
    rooms,
    isLoading,
    error: error?.message ?? null,
    createRoom: createMutation.mutate,
    isCreating: createMutation.isPending,
    createError: createMutation.error?.message ?? null,
  };
}


================================================
📄 ARCHIVO: src\features\pets\application\use-cases\CreatePetUseCase.ts
================================================

import { PetError } from '@shared/domain/errors/AppError';
import { Pet } from '../../domain/entities/Pet';
import { IPetRepository } from '../../domain/repositories/IPetRepository';

export class CreatePetUseCase {
  constructor(private readonly repo: IPetRepository) {}
  async execute(data: Omit<Pet, 'id' | 'createdAt'>): Promise<Pet> {
    if (!data.name) throw new PetError('El nombre es obligatorio');
    if (!data.shelterId) throw new PetError('El refugio es obligatorio');
    return this.repo.create(data);
  }
}

================================================
📄 ARCHIVO: src\features\pets\application\use-cases\DeletePetUseCase.ts
================================================

import { IPetRepository } from '../../domain/repositories/IPetRepository';

export class DeletePetUseCase {
  constructor(private readonly repo: IPetRepository) {}
  execute(id: string): Promise<void> {
    return this.repo.delete(id);
  }
}

================================================
📄 ARCHIVO: src\features\pets\application\use-cases\GetPetsUseCase.ts
================================================

import { Pet } from '../../domain/entities/Pet';
import { IPetRepository, PetFilters } from '../../domain/repositories/IPetRepository';

export class GetPetsUseCase {
  constructor(private readonly repo: IPetRepository) {}
  execute(filters?: PetFilters): Promise<Pet[]> {
    return this.repo.getAll(filters);
  }
}

================================================
📄 ARCHIVO: src\features\pets\application\use-cases\UpdatePetUseCase.ts
================================================

import { Pet } from '../../domain/entities/Pet';
import { IPetRepository } from '../../domain/repositories/IPetRepository';

export class UpdatePetUseCase {
  constructor(private readonly repo: IPetRepository) {}
  execute(id: string, data: Partial<Pet>): Promise<Pet> {
    return this.repo.update(id, data);
  }
}

================================================
📄 ARCHIVO: src\features\pets\domain\entities\Pet.ts
================================================

export type PetSpecies  = 'perro' | 'gato' | 'conejo' | 'ave' | 'otro';
export type PetGender   = 'macho' | 'hembra';
export type PetSize     = 'pequeño' | 'mediano' | 'grande';
export type PetStatus   = 'disponible' | 'en_proceso' | 'adoptado';

export interface Pet {
  id:          string;
  shelterId:   string;
  shelterName?: string;
  name:        string;
  species:     PetSpecies;
  breed?:      string;
  age?:        number;
  gender:      PetGender;
  size:        PetSize;
  description?: string;
  imageUrl?:   string;
  isVaccinated: boolean;
  isSterilized: boolean;
  status:      PetStatus;
  createdAt:   Date;
}

================================================
📄 ARCHIVO: src\features\pets\domain\repositories\IPetRepository.ts
================================================

import { Pet } from '../entities/Pet';

export interface PetFilters {
  species?: string;
  size?:    string;
  gender?:  string;
  status?:  string;
}

export interface IPetRepository {
  getAll(filters?: PetFilters): Promise<Pet[]>;
  getById(id: string): Promise<Pet>;
  getByShelter(shelterId: string): Promise<Pet[]>;
  create(pet: Omit<Pet, 'id' | 'createdAt'>): Promise<Pet>;
  update(id: string, data: Partial<Pet>): Promise<Pet>;
  delete(id: string): Promise<void>;
}

================================================
📄 ARCHIVO: src\features\pets\infrastructure\repositories\SupabasePetRepository.ts
================================================

import { supabase } from '@shared/infrastructure/supabase/client';
import { Pet } from '../../domain/entities/Pet';
import { IPetRepository, PetFilters } from '../../domain/repositories/IPetRepository';

export class SupabasePetRepository implements IPetRepository {

  async getAll(filters?: PetFilters): Promise<Pet[]> {
    let query = supabase
      .from('pets')
      .select('*, profiles(username)')
      .order('created_at', { ascending: false });

    if (filters?.species) query = query.eq('species', filters.species);
    if (filters?.size)    query = query.eq('size', filters.size);
    if (filters?.gender)  query = query.eq('gender', filters.gender);
    if (filters?.status)  query = query.eq('status', filters.status);
    else query = query.eq('status', 'disponible');

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data ?? []).map(this._map);
  }

  async getById(id: string): Promise<Pet> {
    const { data, error } = await supabase
      .from('pets').select('*, profiles(username)')
      .eq('id', id).single();
    if (error) throw new Error(error.message);
    return this._map(data);
  }

  async getByShelter(shelterId: string): Promise<Pet[]> {
    const { data, error } = await supabase
      .from('pets').select('*')
      .eq('shelter_id', shelterId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(this._map);
  }

  async create(pet: Omit<Pet, 'id' | 'createdAt'>): Promise<Pet> {
    const { data, error } = await supabase
      .from('pets')
      .insert({
        shelter_id:    pet.shelterId,
        name:          pet.name,
        species:       pet.species,
        breed:         pet.breed,
        age:           pet.age,
        gender:        pet.gender,
        size:          pet.size,
        description:   pet.description,
        image_url:     pet.imageUrl,
        is_vaccinated: pet.isVaccinated,
        is_sterilized: pet.isSterilized,
        status:        pet.status ?? 'disponible',
      })
      .select().single();
    if (error) throw new Error(error.message);
    return this._map(data);
  }

  async update(id: string, pet: Partial<Pet>): Promise<Pet> {
    const { data, error } = await supabase
      .from('pets')
      .update({
        name:          pet.name,
        species:       pet.species,
        breed:         pet.breed,
        age:           pet.age,
        gender:        pet.gender,
        size:          pet.size,
        description:   pet.description,
        image_url:     pet.imageUrl,
        is_vaccinated: pet.isVaccinated,
        is_sterilized: pet.isSterilized,
        status:        pet.status,
      })
      .eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return this._map(data);
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('pets').delete().eq('id', id);
    if (error) throw new Error(error.message);
  }

  private _map = (raw: any): Pet => ({
    id:           raw.id,
    shelterId:    raw.shelter_id,
    shelterName:  raw.profiles?.username ?? undefined,
    name:         raw.name,
    species:      raw.species,
    breed:        raw.breed ?? undefined,
    age:          raw.age ?? undefined,
    gender:       raw.gender,
    size:         raw.size,
    description:  raw.description ?? undefined,
    imageUrl:     raw.image_url ?? undefined,
    isVaccinated: raw.is_vaccinated ?? false,
    isSterilized: raw.is_sterilized ?? false,
    status:       raw.status,
    createdAt:    new Date(raw.created_at),
  });
}

================================================
📄 ARCHIVO: src\features\pets\presentation\hooks\usePets.ts
================================================

import { useAuthStore } from '@features/auth/presentation/store/authStore';
import { CreatePetUseCase } from '../../application/use-cases/CreatePetUseCase';
import { DeletePetUseCase } from '../../application/use-cases/DeletePetUseCase';
import { GetPetsUseCase } from '../../application/use-cases/GetPetsUseCase';
import { UpdatePetUseCase } from '../../application/use-cases/UpdatePetUseCase';
import { Pet, PetStatus } from '../../domain/entities/Pet';
import { PetFilters } from '../../domain/repositories/IPetRepository';
import { SupabasePetRepository } from '../../infrastructure/repositories/SupabasePetRepository';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const repo           = new SupabasePetRepository();
const getPetsUseCase = new GetPetsUseCase(repo);
const createUseCase  = new CreatePetUseCase(repo);
const updateUseCase  = new UpdatePetUseCase(repo);
const deleteUseCase  = new DeletePetUseCase(repo);

export function usePets(filters?: PetFilters) {
  const queryClient = useQueryClient();
  const user        = useAuthStore((s) => s.user);
  const queryKey    = ['pets', filters];

  const { data: pets = [], isLoading, error } = useQuery({
    queryKey,
    queryFn: () => getPetsUseCase.execute(filters),
    enabled: !!user,
  });

  const shelterQuery = useQuery({
    queryKey: ['pets', 'shelter', user?.id],
    queryFn:  () => repo.getByShelter(user!.id),
    enabled:  !!user && user.role === 'refugio',
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<Pet, 'id' | 'createdAt'>) => createUseCase.execute(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pets'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Pet> }) =>
      updateUseCase.execute(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pets'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteUseCase.execute(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pets'] }),
  });

  return {
    pets,
    shelterPets:   shelterQuery.data ?? [],
    isLoading,
    error:         error?.message ?? null,
    createPet:     createMutation.mutate,
    updatePet:     updateMutation.mutate,
    deletePet:     deleteMutation.mutate,
    isCreating:    createMutation.isPending,
    isUpdating:    updateMutation.isPending,
    createError:   createMutation.error?.message ?? null,
  };
}

================================================
📄 ARCHIVO: src\features\requests\domain\entities\Request.ts
================================================

export type RequestStatus = 'pendiente' | 'aprobada' | 'rechazada';

export interface AdoptionRequest {
  id:          string;
  petId:       string;
  petName?:    string;
  petImage?:   string;
  adopterId:   string;
  adopterName?: string;
  shelterId:   string;
  message?:    string;
  status:      RequestStatus;
  createdAt:   Date;
}

================================================
📄 ARCHIVO: src\features\requests\domain\repositories\IRequestRepository.ts
================================================

import { AdoptionRequest } from '../entities/Request';

export interface IRequestRepository {
  getByAdopter(adopterId: string): Promise<AdoptionRequest[]>;
  getByShelter(shelterId: string): Promise<AdoptionRequest[]>;
  create(petId: string, adopterId: string, shelterId: string, message?: string): Promise<AdoptionRequest>;
  updateStatus(id: string, status: 'aprobada' | 'rechazada'): Promise<AdoptionRequest>;
}

================================================
📄 ARCHIVO: src\features\requests\infrastructure\repositories\SupabaseRequestRepository.ts
================================================

import { supabase } from '@shared/infrastructure/supabase/client';
import { AdoptionRequest } from '../../domain/entities/Request';
import { IRequestRepository } from '../../domain/repositories/IRequestRepository';

export class SupabaseRequestRepository implements IRequestRepository {

  async getByAdopter(adopterId: string): Promise<AdoptionRequest[]> {
    const { data, error } = await supabase
      .from('adoption_requests')
      .select('*, pets(name, image_url)')
      .eq('adopter_id', adopterId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(this._map);
  }

  async getByShelter(shelterId: string): Promise<AdoptionRequest[]> {
    const { data, error } = await supabase
      .from('adoption_requests')
      .select('*, pets(name, image_url), profiles(username)')
      .eq('shelter_id', shelterId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(this._map);
  }

  async create(
    petId: string,
    adopterId: string,
    shelterId: string,
    message?: string
  ): Promise<AdoptionRequest> {
    const { data, error } = await supabase
      .from('adoption_requests')
      .insert({ pet_id: petId, adopter_id: adopterId, shelter_id: shelterId, message })
      .select().single();
    if (error) throw new Error(error.message);
    return this._map(data);
  }

  async updateStatus(
    id: string,
    status: 'aprobada' | 'rechazada'
  ): Promise<AdoptionRequest> {
    const { data, error } = await supabase
      .from('adoption_requests')
      .update({ status })
      .eq('id', id).select().single();
    if (error) throw new Error(error.message);
    return this._map(data);
  }

  private _map = (raw: any): AdoptionRequest => ({
    id:          raw.id,
    petId:       raw.pet_id,
    petName:     raw.pets?.name ?? undefined,
    petImage:    raw.pets?.image_url ?? undefined,
    adopterId:   raw.adopter_id,
    adopterName: raw.profiles?.username ?? undefined,
    shelterId:   raw.shelter_id,
    message:     raw.message ?? undefined,
    status:      raw.status,
    createdAt:   new Date(raw.created_at),
  });
} 

================================================
📄 ARCHIVO: src\features\requests\presentation\hooks\useRequests.ts
================================================

import { useAuthStore } from '@features/auth/presentation/store/authStore';
import { SupabaseRequestRepository } from '../../infrastructure/repositories/SupabaseRequestRepository';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const repo = new SupabaseRequestRepository();

export function useRequests() {
  const user        = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const adopterQuery = useQuery({
    queryKey: ['requests', 'adopter', user?.id],
    queryFn:  () => repo.getByAdopter(user!.id),
    enabled:  !!user && user.role === 'adoptante',
  });

  const shelterQuery = useQuery({
    queryKey: ['requests', 'shelter', user?.id],
    queryFn:  () => repo.getByShelter(user!.id),
    enabled:  !!user && user.role === 'refugio',
  });

  const createMutation = useMutation({
    mutationFn: ({
      petId, shelterId, message,
    }: { petId: string; shelterId: string; message?: string }) =>
      repo.create(petId, user!.id, shelterId, message),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['requests', 'adopter', user?.id] }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'aprobada' | 'rechazada' }) =>
      repo.updateStatus(id, status),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['requests', 'shelter', user?.id] }),
  });

  return {
    myRequests:     adopterQuery.data ?? [],
    shelterRequests: shelterQuery.data ?? [],
    isLoading:      adopterQuery.isLoading || shelterQuery.isLoading,
    sendRequest:    createMutation.mutate,
    updateStatus:   updateStatusMutation.mutate,
    isSending:      createMutation.isPending,
    sendError:      createMutation.error?.message ?? null,
  };
}

================================================
📄 ARCHIVO: src\shared\domain\errors\AppError.ts
================================================

export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly cause?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class AuthError extends AppError {
  constructor(message: string, cause?: unknown) {
    super('AUTH_ERROR', message, cause);
  }
}

export class PetError extends AppError {
  constructor(message: string, cause?: unknown) {
    super('PET_ERROR', message, cause);
  }
}

export class RequestError extends AppError {
  constructor(message: string, cause?: unknown) {
    super('REQUEST_ERROR', message, cause);
  }
}

export class AssistantError extends AppError {
  constructor(message: string, cause?: unknown) {
    super('ASSISTANT_ERROR', message, cause);
  }
}

export class ChatError extends AppError {
  constructor(message: string, cause?: unknown) {
    super('CHAT_ERROR', message, cause);
  }
}

================================================
📄 ARCHIVO: src\shared\infrastructure\appwrite\client.ts
================================================

import { Client, Account, Databases, Storage } from 'appwrite';
import { Platform } from 'react-native';

// Fix: Appwrite Realtime usa localStorage pero React Native no lo tiene
if (Platform.OS !== 'web') {
  const _storage: Record<string, string> = {};
  (global as any).localStorage = {
    getItem:    (key: string) => _storage[key] ?? null,
    setItem:    (key: string, value: string) => { _storage[key] = value; },
    removeItem: (key: string) => { delete _storage[key]; },
    clear:      () => { Object.keys(_storage).forEach(k => delete _storage[k]); },
  };
}

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

export const account        = new Account(client);
export const databases      = new Databases(client);
export const appwriteClient = client;
export const storage        = new Storage(client);

================================================
📄 ARCHIVO: src\shared\infrastructure\gemini\client.ts
================================================

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export async function sendGeminiMessage(
  history: GeminiMessage[],
  userMessage: string,
): Promise<string> {
  const messages: GeminiMessage[] = [
    ...history,
    { role: 'user', parts: [{ text: userMessage }] },
  ];

  const response = await fetch(
    `${GEMINI_URL}?key=${process.env.EXPO_PUBLIC_GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: messages,
        systemInstruction: {
          parts: [{
            text: `Eres VetBot, el asistente virtual de PetAdopt. 
Ayudas con dudas sobre salud, cuidados, alimentación y comportamiento de mascotas. 
Responde siempre en español, de forma amable y clara. 
Si la pregunta es de emergencia médica, recomienda ir al veterinario inmediatamente.
No respondas temas que no estén relacionados con mascotas o adopción.`,
          }],
        },
      }),
    }
  );

  if (!response.ok) throw new Error('Error al contactar el asistente');
  const data: any = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Sin respuesta';
}

================================================
📄 ARCHIVO: src\shared\infrastructure\notifications\NotificationService.ts
================================================

// src/shared/infrastructure/notifications/NotificationService.ts

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return false;

    if (Platform.OS === 'android') {
      try {
        await Notifications.setNotificationChannelAsync('chat-messages', {
          name: 'Mensajes de chat',
          importance: Notifications.AndroidImportance.HIGH,
          sound: 'default',
          vibrationPattern: [0, 250, 250, 250],
        });
      } catch (e) {
        // Expo Go Android no soporta canales — silenciar sin crashear
        console.warn('Canal de notificaciones no disponible:', e);
      }
    }
    return true;
  } catch (e) {
    console.warn('Notificaciones no disponibles:', e);
    return false;
  }
}

export async function showMessageNotification(
  roomName: string,
  authorUsername: string,
  content: string,
): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `💬 ${roomName}`,
        body: `${authorUsername}: ${content}`,
        sound: 'default',
        data: { roomName },
      },
      trigger: null,
    });
  } catch (e) {
    console.warn('No se pudo mostrar notificación:', e);
  }
}

================================================
📄 ARCHIVO: src\shared\infrastructure\supabase\client.ts
================================================

import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

// Supbase espera métodos getItem/setItem/removeItem pero expo-secure-store 
// expone getItemAsync/setItemAsynbc/removeItemAsync - este adaptador los mejora
const SecureStoreAdapter = {
    getItem: (key: string) =>
        SecureStore.getItemAsync(key),
    setItem: (key: string, value: string) =>
        SecureStore.setItemAsync(key, value),
    removeItem: (key: string) =>
        SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(
    process.env.EXPO_PUBLIC_SUPABASE_URL!,
    process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
    {
        auth: {
            storage: SecureStoreAdapter,
            autoRefreshToken: true,
            persistSession: true,
        },
    }
);

================================================
📄 ARCHIVO: src\shared\infrastructure\supabase\StorageService.ts
================================================

import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import { supabase } from './client';

export async function pickAndUploadPetImage(): Promise<string | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted')
    throw new Error('Se necesita permiso para acceder a la galería');

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
    base64: true,
  });

  if (result.canceled || !result.assets?.length) return null;

  const asset = result.assets[0];
  let base64: string;

  if (asset.base64) {
    base64 = asset.base64;
  } else if (asset.uri) {
    base64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: 'base64' });
  } else {
    throw new Error('No se pudo obtener la imagen');
  }

  const ext = asset.uri?.split('.').pop()?.toLowerCase() ?? 'jpg';
  const fileName = `pet-${Date.now()}.${ext}`;
  const filePath = `pets/${fileName}`;

  const { error } = await supabase.storage
    .from('pet-images')
    .upload(filePath, decode(base64), {
      contentType: `image/${ext}`,
      upsert: false,
    });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from('pet-images').getPublicUrl(filePath);
  return data.publicUrl;
}

================================================
📄 ARCHIVO: tsconfig.json
================================================

{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./*"],
      "@features/*": ["src/features/*"],
      "@shared/*": ["src/shared/*"]
    },
    "baseUrl": ".",
    "lib": ["ESNext"],
    "ignoreDeprecations": "5.0"
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts",
    "env.d.ts"
  ]
}
