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
EXPO_PUBLIC_SUPABASE_URL=https://hiqiwvvtwsizmzsxmdso.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_yovHR88YGverzcH9OOTpug_lqOIBjjC

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
📄 ARCHIVO: app\(app)\chat\[roomId].tsx
================================================

import { useAuthStore } from "@features/auth/presentation/store/authStore";
import { Message } from "@features/chat/domain/entities/Message";
import { useChat } from "@features/chat/presentation/hooks/useChat";
import { pickAndUploadImage } from "@shared/infrastructure/supabase/StorageService";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const E = {
  bg: '#080810', bg2: '#0d0d1a', card: '#10101e',
  violet: '#7c3aed',
  neon: '#a855f7', neonSoft: '#c084fc', cyan: '#22d3ee',
  text: '#e2e8f0', textDim: '#94a3b8', textMute: '#475569',
  border: 'rgba(124,58,237,0.22)',
};

const AVATAR_BG = ['#7c3aed', '#0e7490', '#be185d', '#15803d', '#92400e'];

function MsgAvatar({ name }: { name: string }) {
  const idx = (name ?? '?').charCodeAt(0) % AVATAR_BG.length;
  return (
    <View style={[s.avatar, { backgroundColor: AVATAR_BG[idx] }]}>
      <Text style={s.avatarText}>{(name ?? '?').charAt(0).toUpperCase()}</Text>
    </View>
  );
}

// Componente separado para evitar re-renders del padre que cierren el teclado
function InputBar({
  onSend,
  onImagePick,
  isUploading,
}: {
  onSend: (text: string) => void;
  onImagePick: () => void;
  isUploading: boolean;
}) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <View style={s.inputBar}>
      <TouchableOpacity
        style={s.attachBtn}
        onPress={onImagePick}
        disabled={isUploading}
        activeOpacity={0.7}
      >
        {isUploading
          ? <ActivityIndicator size="small" color={E.violet} />
          : <Text style={s.attachIcon}>⊕</Text>
        }
      </TouchableOpacity>

      <TextInput
        style={s.input}
        value={input}
        onChangeText={setInput}
        placeholder="Mensaje cifrado..."
        placeholderTextColor={E.textMute}
        multiline
        maxLength={500}
        blurOnSubmit={false}
        returnKeyType="default"
      />

      <TouchableOpacity
        style={[s.sendBtn, !input.trim() && s.sendBtnOff]}
        onPress={handleSend}
        disabled={!input.trim()}
        activeOpacity={0.85}
      >
        <Text style={s.sendIcon}>↑</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function ChatScreen() {
  const { roomId }                           = useLocalSearchParams<{ roomId: string }>();
  const { messages, sendMessage, isLoading } = useChat(roomId);
  const user                                 = useAuthStore((s) => s.user);
  const [isUploading, setIsUploading]        = useState(false);
  const listRef                              = useRef<FlatList>(null);
  const prevLengthRef                        = useRef(0);

  useEffect(() => {
    if (messages.length > prevLengthRef.current) {
      prevLengthRef.current = messages.length;
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 50);
    }
  }, [messages.length]);

  const handleSend = useCallback((text: string) => {
    sendMessage({ content: text });
  }, [sendMessage]);

  const handleImagePick = useCallback(async () => {
    try {
      setIsUploading(true);
      const imageUrl = await pickAndUploadImage();
      if (imageUrl) sendMessage({ content: '', imageUrl });
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setIsUploading(false);
    }
  }, [sendMessage]);

  const renderMsg = useCallback(({ item }: { item: Message }) => {
    const isOwn = item.userId === user?.id;
    return (
      <View style={[s.msgRow, isOwn && s.msgRowOwn]}>
        {!isOwn && <MsgAvatar name={item.authorUsername ?? '?'} />}
        <View style={s.msgStack}>
          {!isOwn && <Text style={s.msgAuthor}>{item.authorUsername}</Text>}
          <View style={[s.bubble, isOwn ? s.bubbleOwn : s.bubbleOther]}>
            {item.imageUrl && (
              <Image source={{ uri: item.imageUrl }} style={s.msgImage} resizeMode="cover" />
            )}
            {!!item.content && (
              <Text style={[s.msgText, isOwn && s.msgTextOwn]}>{item.content}</Text>
            )}
          </View>
          <Text style={[s.msgTime, isOwn && s.msgTimeOwn]}>
            {item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  }, [user?.id]);

  if (isLoading) {
    return (
      <View style={s.loading}>
        <ActivityIndicator size="large" color={E.violet} />
        <Text style={s.loadingText}>// cargando mensajes...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={s.container}>
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={renderMsg}
        contentContainerStyle={s.messagesList}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="none"
      />
      <InputBar
        onSend={handleSend}
        onImagePick={handleImagePick}
        isUploading={isUploading}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: E.bg },
  loading:      { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: E.bg, gap: 12 },
  loadingText:  { color: E.violet, fontSize: 12, letterSpacing: 1 },
  messagesList: { paddingHorizontal: 14, paddingVertical: 14, gap: 10 },

  msgRow:    { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  msgRowOwn: { justifyContent: 'flex-end' },

  avatar: {
    width: 30, height: 30, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 2, flexShrink: 0,
  },
  avatarText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  msgStack:   { maxWidth: '75%', gap: 3 },
  msgAuthor:  { fontSize: 10, color: E.violet, letterSpacing: 1, paddingHorizontal: 4, marginBottom: 1 },

  bubble:      { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  bubbleOther: { backgroundColor: E.card, borderWidth: 1, borderColor: E.border, borderTopLeftRadius: 4 },
  bubbleOwn:   {
    backgroundColor: E.violet, borderTopRightRadius: 4,
    shadowColor: E.violet, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5, shadowRadius: 14, elevation: 6,
  },

  msgText:    { fontSize: 14, color: E.text, lineHeight: 20 },
  msgTextOwn: { color: '#fff' },
  msgImage:   { width: 200, height: 150, borderRadius: 10, marginBottom: 4 },
  msgTime:    { fontSize: 9, color: E.textMute, letterSpacing: 0.5, paddingHorizontal: 4, alignSelf: 'flex-start' },
  msgTimeOwn: { alignSelf: 'flex-end' },

  inputBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 12, paddingVertical: 10,
    backgroundColor: E.bg2,
    borderTopWidth: 1, borderTopColor: E.border,
    gap: 8,
  },
  attachBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: E.card, borderWidth: 1, borderColor: E.border,
    alignItems: 'center', justifyContent: 'center',
  },
  attachIcon: { fontSize: 20, color: E.violet },
  input: {
    flex: 1, backgroundColor: E.card,
    borderWidth: 1, borderColor: E.border,
    borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10,
    maxHeight: 100, fontSize: 14, color: E.text,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: E.violet,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: E.violet, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, shadowRadius: 12, elevation: 4,
  },
  sendBtnOff: { backgroundColor: 'rgba(124,58,237,0.2)', shadowOpacity: 0 },
  sendIcon:   { color: '#fff', fontSize: 18, fontWeight: '600' },
});


================================================
📄 ARCHIVO: app\(app)\index.tsx
================================================

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
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [roomName, setRoomName]         = useState('');
  const insets = useSafeAreaInsets();

  const handleCreate = () => {
    if (!roomName.trim() || isCreating) return;
    createRoom(roomName.trim(), {
      onSuccess: () => { setRoomName(''); setModalVisible(false); },
    });
  };

  const renderRoom = ({ item }: { item: Room }) => (
    <TouchableOpacity
      style={s.roomCard}
      onPress={() => router.push(`/chat/${item.id}`)}
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
        <View style={s.badge}>
          <Text style={s.badgeText}>{rooms.length}</Text>
        </View>
      </View>

      {/* ── List ── */}
      <FlatList
        data={rooms}
        keyExtractor={(r) => r.id}
        renderItem={renderRoom}
        contentContainerStyle={rooms.length === 0 ? { flex: 1 } : { padding: 16, gap: 10, paddingBottom: insets.bottom + 100 }}
        ListEmptyComponent={
          <View style={s.centered}>
            <Text style={s.emptyIcon}>◈</Text>
            <Text style={s.emptyTitle}>Sin canales</Text>
            <Text style={s.emptySub}>Crea uno para comenzar</Text>
          </View>
        }
      />

      {/* ── FAB ── */}
      <TouchableOpacity
        style={[s.fab, { bottom: insets.bottom + 28 }]}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.85}
      >
        <Text style={s.fabText}>+</Text>
      </TouchableOpacity>

      {/* ── Modal ── */}
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
  emptySub:    { fontSize: 12, color: E.textMute, letterSpacing: 0.5 },

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
    position: 'absolute', right: 20, bottom: 28,
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


================================================
📄 ARCHIVO: app\(app)\_layout.tsx
================================================

import { useAuth } from "@features/auth/presentation/hooks/useAuth";
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

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: E.bg },
        headerTintColor: E.text,
        headerShadowVisible: false,
        headerBackTitle: '',
        contentStyle: { backgroundColor: E.bg },
        // bottom border glow via headerBackground not easily done inline,
        // so we handle it per-screen header
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
            <TouchableOpacity
              onPress={logout}
              style={s.logoutBtn}
              activeOpacity={0.7}
            >
              <Text style={s.logoutText}>SALIR</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="chat/[roomId]"
        options={({ route }) => ({
          headerTitle: () => (
            <View style={s.chatHeaderTitle}>
              <View style={s.chatAvatar}>
                <Text style={s.chatAvatarText}>
                  {((route.params as any)?.roomId ?? 'C').charAt(0).toUpperCase()}
                </Text>
              </View>
              <View>
                <Text style={s.chatRoomName}>
                  {(route.params as any)?.roomId ?? 'canal'}
                </Text>
                <Text style={s.chatOnline}>● EN LÍNEA</Text>
              </View>
            </View>
          ),
        })}
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

  logoutBtn: {
    paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1, borderColor: E.border,
    backgroundColor: 'rgba(124,58,237,0.08)',
  },
  logoutText: { fontSize: 10, fontWeight: '600', color: E.textMute, letterSpacing: 1.5 },

  headerBorder: {
    height: 1,
    backgroundColor: E.violet,
    opacity: 0.2,
    marginHorizontal: 0,
  },

  chatHeaderTitle: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  chatAvatar: {
    width: 32, height: 32,
    backgroundColor: E.violet, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: E.violet, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, shadowRadius: 8, elevation: 4,
  },
  chatAvatarText: { fontSize: 14, color: '#fff', fontWeight: '800' },
  chatRoomName: { fontSize: 15, fontWeight: '700', color: '#fff', letterSpacing: -0.3 },
  chatOnline:   { fontSize: 9, color: E.cyan, letterSpacing: 1.5 },
});


================================================
📄 ARCHIVO: app\(auth)\login.tsx
================================================

import { useAuth } from "@features/auth/presentation/hooks/useAuth";
import { Link } from "expo-router";
import { useState } from "react";
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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const E = {
  bg:        '#080810',
  bg2:       '#0d0d1a',
  card:      '#10101e',
  violet:    '#7c3aed',
  violetDk:  '#5b21b6',
  violetDim: 'rgba(124,58,237,0.12)',
  violetGlw: 'rgba(124,58,237,0.4)',
  neon:      '#a855f7',
  neonSoft:  '#c084fc',
  cyan:      '#22d3ee',
  text:      '#e2e8f0',
  textDim:   '#94a3b8',
  textMute:  '#475569',
  border:    'rgba(124,58,237,0.22)',
  borderAct: 'rgba(124,58,237,0.7)',
};

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

        {/* ── Logo ── */}
        <View style={s.logoWrap}>
          <View style={s.logoIcon}>
            <Text style={s.logoIconText}>◈</Text>
          </View>
          <View>
            <Text style={s.logoText}>ENIGMA<Text style={s.logoDot}>.</Text></Text>
            <Text style={s.logoTag}>ENCRYPTED MESSAGING</Text>
          </View>
        </View>

        {/* ── Hero ── */}
        <View style={s.hero}>
          <Text style={s.eyebrow}>// ACCESO SEGURO</Text>
          <Text style={s.titleLight}>Bienvenido</Text>
          <Text style={s.titleDark}>de <Text style={s.accent}>vuelta.</Text></Text>
          <Text style={s.subtitle}>Autenticación cifrada de extremo a extremo</Text>
        </View>

        {/* ── Card ── */}
        <View style={s.card}>
          {/* top glow line */}
          <View style={s.cardTopLine} />

          {error && (
            <View style={s.errorBox}>
              <Text style={s.errorText}>⚠ {error}</Text>
            </View>
          )}

          {/* Email */}
          <View style={s.fieldWrap}>
            <Text style={s.fieldLabel}>&gt; EMAIL</Text>
            <View style={[s.inputWrap, focused === 'email' && s.inputFocused]}>
              <Text style={s.inputIcon}>@</Text>
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
            <Text style={s.fieldLabel}>&gt; CONTRASEÑA</Text>
            <View style={[s.inputWrap, focused === 'password' && s.inputFocused]}>
              <Text style={s.inputIcon}>▣</Text>
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

          {/* Divider */}
          <View style={s.divider}>
            <View style={s.dividerLine} />
            <Text style={s.dividerText}>EXEC</Text>
            <View style={s.dividerLine} />
          </View>

          {/* Primary button */}
          <TouchableOpacity
            style={[s.btnPrimary, isLoading && s.btnDisabled]}
            onPress={() => login({ email, password })}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={s.btnPrimaryText}>INICIAR SESIÓN  →</Text>
            )}
          </TouchableOpacity>

          {/* Ghost button */}
          <TouchableOpacity style={s.btnGhost} activeOpacity={0.7}>
            <Link href="/(auth)/register">
              <Text style={s.btnGhostText}>
                SIN CUENTA — <Text style={s.btnGhostAccent}>REGISTRARSE</Text>
              </Text>
            </Link>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: E.bg },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 48, justifyContent: 'center' },

  logoWrap: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 44 },
  logoIcon: {
    width: 40, height: 40,
    backgroundColor: E.violet,
    borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: E.violet, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8, shadowRadius: 16, elevation: 8,
  },
  logoIconText: { fontSize: 18, color: '#fff' },
  logoText:  { fontSize: 20, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  logoDot:   { color: E.neon },
  logoTag:   { fontSize: 8, color: E.textMute, letterSpacing: 3, marginTop: 1 },

  hero:      { marginBottom: 28 },
  eyebrow:   { fontSize: 10, color: E.violet, letterSpacing: 2, marginBottom: 10 },
  titleLight:{ fontSize: 40, fontWeight: '400', color: E.textMute, letterSpacing: -1.5, lineHeight: 44 },
  titleDark: { fontSize: 40, fontWeight: '800', color: '#fff', letterSpacing: -1.5, lineHeight: 44, marginTop: -4 },
  accent:    { color: E.neon },
  subtitle:  { fontSize: 11, color: E.textMute, marginTop: 10, letterSpacing: 0.3, lineHeight: 18 },

  card: {
    backgroundColor: E.card,
    borderRadius: 24,
    borderWidth: 1, borderColor: E.border,
    padding: 24,
    overflow: 'hidden',
  },
  cardTopLine: {
    position: 'absolute', top: 0, left: 40, right: 40, height: 1,
    backgroundColor: E.neon, opacity: 0.4,
  },

  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderRadius: 10, padding: 12, marginBottom: 16,
    borderLeftWidth: 2, borderLeftColor: '#ef4444',
  },
  errorText: { color: '#f87171', fontSize: 12, letterSpacing: 0.3 },

  fieldWrap: { marginBottom: 16 },
  fieldLabel:{ fontSize: 9, color: E.violet, letterSpacing: 3, marginBottom: 8 },

  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12, borderWidth: 1, borderColor: E.border,
    paddingHorizontal: 14, paddingVertical: 13,
  },
  inputFocused: {
    borderColor: E.violet,
    ...Platform.select({
      ios: {
        shadowColor: E.violet,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        // Evitamos sombras/elevaciones dinámicas en Android para prevenir reflow de layout
      },
    }),
  },
  inputIcon: { fontSize: 14, color: E.textMute },
  input: { flex: 1, fontSize: 13, color: E.text, fontFamily: Platform.OS === 'ios' ? 'Menlo' : undefined },

  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: E.border },
  dividerText: { fontSize: 9, color: E.textMute, letterSpacing: 2 },

  btnPrimary: {
    backgroundColor: E.violet,
    borderRadius: 14, paddingVertical: 16,
    alignItems: 'center', marginBottom: 12,
    shadowColor: E.violet, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, shadowRadius: 20, elevation: 8,
  },
  btnDisabled:     { opacity: 0.5 },
  btnPrimaryText:  { color: '#fff', fontSize: 12, letterSpacing: 2, fontWeight: '600' },

  btnGhost: {
    borderRadius: 14, paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1, borderColor: E.border,
  },
  btnGhostText:   { fontSize: 11, color: E.textMute, letterSpacing: 1 },
  btnGhostAccent: { color: E.neonSoft },

  footer: { textAlign: 'center', marginTop: 32, fontSize: 9, color: E.textMute, letterSpacing: 3 },
});


================================================
📄 ARCHIVO: app\(auth)\register.tsx
================================================

import { useAuth } from "@features/auth/presentation/hooks/useAuth";
import { Link } from "expo-router";
import { useState } from "react";
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
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const E = {
  bg: '#080810', bg2: '#0d0d1a', card: '#10101e',
  violet: '#7c3aed', violetDk: '#5b21b6',
  violetDim: 'rgba(124,58,237,0.12)', violetGlw: 'rgba(124,58,237,0.4)',
  neon: '#a855f7', neonSoft: '#c084fc', cyan: '#22d3ee',
  text: '#e2e8f0', textDim: '#94a3b8', textMute: '#475569',
  border: 'rgba(124,58,237,0.22)', borderAct: 'rgba(124,58,237,0.7)',
};

export default function RegisterScreen() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [focused, setFocused]   = useState<string | null>(null);
  const { register, isLoading, error } = useAuth();
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
        {/* ── Logo ── */}
        <View style={s.logoWrap}>
          <View style={s.logoIcon}>
            <Text style={s.logoIconText}>◈</Text>
          </View>
          <View>
            <Text style={s.logoText}>ENIGMA<Text style={s.logoDot}>.</Text></Text>
            <Text style={s.logoTag}>ENCRYPTED MESSAGING</Text>
          </View>
        </View>

        {/* ── Hero ── */}
        <View style={s.hero}>
          <Text style={s.eyebrow}>// NUEVA IDENTIDAD</Text>
          <Text style={s.titleLight}>Únete a</Text>
          <Text style={s.titleDark}><Text style={s.accent}>Enigma.</Text></Text>
          <Text style={s.subtitle}>Tu alias, tus reglas, tu privacidad</Text>
        </View>

        {/* ── Card ── */}
        <View style={s.card}>
          <View style={[s.cardTopLine, { backgroundColor: E.cyan }]} />

          {error && (
            <View style={s.errorBox}>
              <Text style={s.errorText}>⚠ {error}</Text>
            </View>
          )}

          {/* Alias */}
          <View style={s.fieldWrap}>
            <Text style={s.fieldLabel}>&gt; ALIAS</Text>
            <View style={[s.inputWrap, focused === 'username' && s.inputFocused]}>
              <Text style={s.inputIcon}>◈</Text>
              <TextInput
                style={s.input}
                value={username}
                onChangeText={setUsername}
                placeholder="sin espacios"
                placeholderTextColor={E.textMute}
                autoCapitalize="none"
                onFocus={() => setFocused('username')}
                onBlur={() => setFocused(null)}
              />
            </View>
          </View>

          {/* Email */}
          <View style={s.fieldWrap}>
            <Text style={s.fieldLabel}>&gt; EMAIL</Text>
            <View style={[s.inputWrap, focused === 'email' && s.inputFocused]}>
              <Text style={s.inputIcon}>@</Text>
              <TextInput
                style={s.input}
                value={email}
                onChangeText={setEmail}
                placeholder="correo@dominio.com"
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
            <Text style={s.fieldLabel}>&gt; CONTRASEÑA</Text>
            <View style={[s.inputWrap, focused === 'password' && s.inputFocused]}>
              <Text style={s.inputIcon}>▣</Text>
              <TextInput
                style={s.input}
                value={password}
                onChangeText={setPassword}
                placeholder="mín. 6 caracteres"
                placeholderTextColor={E.textMute}
                secureTextEntry
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused(null)}
              />
            </View>
          </View>

          {/* Divider */}
          <View style={s.divider}>
            <View style={s.dividerLine} />
            <Text style={s.dividerText}>EXEC</Text>
            <View style={s.dividerLine} />
          </View>

          <TouchableOpacity
            style={[s.btnPrimary, isLoading && s.btnDisabled]}
            onPress={() => register({ email, password, username })}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading
              ? <ActivityIndicator color="#fff" />
              : <Text style={s.btnPrimaryText}>CREAR CUENTA  →</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity style={s.btnGhost} activeOpacity={0.7}>
            <Link href="/(auth)/login">
              <Text style={s.btnGhostText}>
                YA TENGO CUENTA — <Text style={s.btnGhostAccent}>ENTRAR</Text>
              </Text>
            </Link>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root:   { flex: 1, backgroundColor: E.bg },
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingVertical: 48, justifyContent: 'center' },

  logoWrap: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 36 },
  logoIcon: {
    width: 40, height: 40, backgroundColor: E.violet, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: E.violet, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8, shadowRadius: 16, elevation: 8,
  },
  logoIconText: { fontSize: 18, color: '#fff' },
  logoText:  { fontSize: 20, fontWeight: '800', color: '#fff', letterSpacing: -0.5 },
  logoDot:   { color: E.neon },
  logoTag:   { fontSize: 8, color: E.textMute, letterSpacing: 3, marginTop: 1 },

  hero:       { marginBottom: 24 },
  eyebrow:    { fontSize: 10, color: E.cyan, letterSpacing: 2, marginBottom: 10 },
  titleLight: { fontSize: 40, fontWeight: '400', color: E.textMute, letterSpacing: -1.5, lineHeight: 44 },
  titleDark:  { fontSize: 40, fontWeight: '800', color: '#fff', letterSpacing: -1.5, lineHeight: 44, marginTop: -4 },
  accent:     { color: E.neon },
  subtitle:   { fontSize: 11, color: E.textMute, marginTop: 10, letterSpacing: 0.3, lineHeight: 18 },

  card: {
    backgroundColor: E.card, borderRadius: 24,
    borderWidth: 1, borderColor: E.border,
    padding: 24, overflow: 'hidden',
  },
  cardTopLine: {
    position: 'absolute', top: 0, left: 40, right: 40,
    height: 1, opacity: 0.4,
  },

  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderRadius: 10, padding: 12, marginBottom: 16,
    borderLeftWidth: 2, borderLeftColor: '#ef4444',
  },
  errorText: { color: '#f87171', fontSize: 12, letterSpacing: 0.3 },

  fieldWrap:  { marginBottom: 14 },
  fieldLabel: { fontSize: 9, color: E.violet, letterSpacing: 3, marginBottom: 8 },

  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 12, borderWidth: 1, borderColor: E.border,
    paddingHorizontal: 14, paddingVertical: 13,
  },
  inputFocused: {
    borderColor: E.violet,
    ...Platform.select({
      ios: {
        shadowColor: E.violet,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        // Evitamos sombras/elevaciones dinámicas en Android para prevenir reflow de layout
      },
    }),
  },
  inputIcon: { fontSize: 14, color: E.textMute },
  input: {
    flex: 1, fontSize: 13, color: E.text,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : undefined,
  },

  divider:     { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 14 },
  dividerLine: { flex: 1, height: 1, backgroundColor: E.border },
  dividerText: { fontSize: 9, color: E.textMute, letterSpacing: 2 },

  btnPrimary: {
    backgroundColor: E.violet, borderRadius: 14,
    paddingVertical: 16, alignItems: 'center', marginBottom: 12,
    shadowColor: E.violet, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6, shadowRadius: 20, elevation: 8,
  },
  btnDisabled:    { opacity: 0.5 },
  btnPrimaryText: { color: '#fff', fontSize: 12, letterSpacing: 2, fontWeight: '600' },

  btnGhost: {
    borderRadius: 14, paddingVertical: 14, alignItems: 'center',
    borderWidth: 1, borderColor: E.border,
  },
  btnGhostText:   { fontSize: 11, color: E.textMute, letterSpacing: 1 },
  btnGhostAccent: { color: E.neonSoft },

  footer: { textAlign: 'center', marginTop: 32, fontSize: 9, color: E.textMute, letterSpacing: 3 },
});


================================================
📄 ARCHIVO: app\(auth)\_layout.tsx
================================================

import { Stack } from "expo-router";

export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}


================================================
📄 ARCHIVO: app\_layout.tsx
================================================

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '@shared/infrastructure/supabase/client';
import { useAuthStore } from '@features/auth/presentation/store/authStore';
import { SupabaseAuthRepository } from '@features/auth/infrastructure/repositories/SupabaseAuthRepository';
import { requestNotificationPermissions } from '@shared/infrastructure/notifications/NotificationService';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } }
});
const authRepo = new SupabaseAuthRepository();

function AuthGuard() {
  const { user, setUser } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false); // 👈 clave del fix

  useEffect(() => {
    async function restoreSession() {
      const user = await authRepo.getCurrentUser();
      setUser(user);
      setIsReady(true);
    }
    restoreSession(); // ✅ función async interna, no async directo en useEffect

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        async function syncUser() {
          if (session) {
            const user = await authRepo.getCurrentUser();
            setUser(user);
          } else {
            setUser(null);
          }
          setIsReady(true); // 👈 movido aquí: cubre ambos casos (con y sin sesión)
        }
        syncUser();
      }
    );
    requestNotificationPermissions(); 
    return () => subscription.unsubscribe(); // ✅ cleanup síncrono
  }, []);

  useEffect(() => {
    if (!isReady) return; // 👈 no navegar hasta estar montado

    const inAuth = segments[0] === '(auth)';
    if (!user && !inAuth) router.replace('/(auth)/login');
    if (user && inAuth) router.replace('/(app)');
  }, [user, segments, isReady]);

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
    "name": "chat-web-socket",
    "slug": "chat-web-socket",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "chatwebsocket",
    "userInterfaceStyle": "automatic",
    "newArchEnabled": true,
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "backgroundColor": "#E6F4FE",
        "foregroundImage": "./assets/images/android-icon-foreground.png",
        "backgroundImage": "./assets/images/android-icon-background.png",
        "monochromeImage": "./assets/images/android-icon-monochrome.png"
      },
      "edgeToEdgeEnabled": true,
      "predictiveBackGestureEnabled": false
    },
    "web": {
      "output": "static",
      "favicon": "./assets/images/favicon.png"
    },
    "plugins": [
      "expo-router",
      "expo-notifications",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff",
          "dark": {
            "backgroundColor": "#000000"
          }
        }
      ],
      "expo-secure-store"
    ],
    "experiments": {
      "typedRoutes": true
    }
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
  // ── Backgrounds
  bg:        '#080810',
  bg2:       '#0d0d1a',
  bg3:       '#12121f',
  card:      '#10101e',
  cardHover: '#14142a',

  // ── Brand
  violet:     '#7c3aed',
  violetDark: '#5b21b6',
  violetDim:  'rgba(124,58,237,0.12)',
  violetGlow: 'rgba(124,58,237,0.35)',
  neon:       '#a855f7',
  neonSoft:   '#c084fc',
  cyan:       '#22d3ee',
  cyanGlow:   'rgba(34,211,238,0.2)',

  // ── Text
  text:     '#e2e8f0',
  textDim:  '#94a3b8',
  textMute: '#475569',

  // ── Borders
  border:      'rgba(124,58,237,0.22)',
  borderHover: 'rgba(124,58,237,0.55)',

  // ── Gradients (use as array for LinearGradient)
  gradViolet: ['#7c3aed', '#5b21b6'] as const,
  gradCyan:   ['#0e7490', '#164e63'] as const,
  gradPink:   ['#be185d', '#831843'] as const,
  gradGreen:  ['#15803d', '#14532d'] as const,

  // ── Typography
  mono: 'SpaceMono-Regular',   // use expo's SpaceMono or load Share Tech Mono
  sans: 'System',

  // ── Spacing
  radius:   {
    sm: 10,
    md: 14,
    lg: 20,
    xl: 24,
    full: 100,
  },
} as const;


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
    "base64-arraybuffer": "^1.0.2",
    "expo": "~54.0.33",
    "expo-constants": "~18.0.13",
    "expo-file-system": "~19.0.22",
    "expo-font": "~14.0.11",
    "expo-haptics": "~15.0.8",
    "expo-image": "~3.0.11",
    "expo-image-picker": "~17.0.11",
    "expo-linking": "~8.0.11",
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
📄 ARCHIVO: src\features\auth\application\use-cases\LoginUseCase.ts
================================================

import { AuthError } from '../../../../shared/domain/errors/AppError';
import { User } from '../../domain/entities/User';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';

export class LoginUseCase {
    constructor(private readonly authRepo: IAuthRepository) {}

    async execute(email: string, password: string): Promise<User> {
        if (!email || !password) 
            throw new AuthError('Email y contraseña son requeridos');
        try {
            return await this.authRepo.login(email, password);
        } catch (error) {
            throw new AuthError('Credenciales inválidas', error);
        }
    }
};

================================================
📄 ARCHIVO: src\features\auth\application\use-cases\RegisterUseCase.ts
================================================

import { AuthError } from '../../../../shared/domain/errors/AppError';
import { User } from '../../domain/entities/User';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';

export class RegisterUseCase {
    constructor(private readonly authRepo: IAuthRepository) {}

    async execute(email: string, password: string, username: string): Promise<User> {
        if (!email || !password || !username) 
            throw new AuthError('Todos los campos son obligatorios');
        if (password.length < 6)
            throw new AuthError('La contraseña debe tener al menos 6 caracteres');
        if (username.includes(' '))
            throw new AuthError('El nombre de usuario no puede contener espacios');
        try {
            return await this.authRepo.register(email, password, username);
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Error al registrar usuario';
            throw new AuthError(message);
        }
    }
};

================================================
📄 ARCHIVO: src\features\auth\domain\entities\User.ts
================================================

export interface User {
    id:         string;
    email:      string;
    username:   string;
    avatarUrl:  string;
}

================================================
📄 ARCHIVO: src\features\auth\domain\repositories\IAuthRepository.ts
================================================

import { User } from '../entities/User';

export interface IAuthRepository {
    login(email: string, password: string): Promise<User>;
    register(email: string, password: string, username: string): Promise<User>;
    logout(): Promise<void>;
    getCurrentUser(): Promise<User | null>;
}

================================================
📄 ARCHIVO: src\features\auth\infrastructure\repositories\SupabaseAuthRepository.ts
================================================

import { supabase } from "../../../../shared/infrastructure/supabase/client";
import { User } from "../../domain/entities/User";
import { IAuthRepository } from "../../domain/repositories/IAuthRepository";

export class SupabaseAuthRepository implements IAuthRepository {
  async login(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error || !data.user) throw error;

    const { data: profile } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", data.user.id)
      .single();

    return {
      id: data.user.id,
      email: data.user.email!,
      username: profile?.username ?? "",
      avatarUrl: profile?.avatar_url ?? undefined,
    };
  }

  async register(
    email: string,
    password: string,
    username: string,
  ): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }, // 👈 el trigger lo lee de raw_user_meta_data
      },
    });
    if (error) throw error;
    if (!data.user) throw new Error("No se pudo crear el usuario");
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({ id: data.user.id, username });
    if (profileError) throw new Error(profileError.message);
    return { id: data.user.id, email: data.user.email!, username };
  }

  async logout(): Promise<void> {
    await supabase.auth.signOut();
  }

  async getCurrentUser(): Promise<User | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, avatar_url")
      .eq("id", user.id)
      .single();
    return {
      id: user.id,
      email: user.email!,
      username: profile?.username ?? "",
      avatarUrl: profile?.avatar_url ?? undefined,
    };
  }
}


================================================
📄 ARCHIVO: src\features\auth\presentation\hooks\useAuth.ts
================================================

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { LoginUseCase } from "../../application/use-cases/LoginUseCase";
import { RegisterUseCase } from "../../application/use-cases/RegisterUseCase";
import { SupabaseAuthRepository } from "../../infrastructure/repositories/SupabaseAuthRepository";
import { useAuthStore } from "../store/authStore";

type RegisterDto = { email: string; password: string; username: string };

const authRepo = new SupabaseAuthRepository();
const loginUseCase = new LoginUseCase(authRepo);
const registerUseCase = new RegisterUseCase(authRepo);

export function useAuth() {
  const { user, setUser } = useAuthStore();
  const router = useRouter();

  // useMutation de TanStack Query maneja isLoading y error automáticamente
  const loginMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      loginUseCase.execute(email, password),
    onSuccess: (user) => {
      setUser(user);
      router.replace("/(app)");
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ email, password, username }: RegisterDto) =>
      registerUseCase.execute(email, password, username),
    onSuccess: (user) => {
      setUser(user);
      router.replace("/(app)");
    },
  });

  const logout = async () => {
    try {
      await authRepo.logout();
    } finally {
      setUser(null);
      router.replace("/(auth)/login");
    }
  };

  return {
    user,
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoading: loginMutation.isPending || registerMutation.isPending,
    error:
      loginMutation.error?.message ?? registerMutation.error?.message ?? null,
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
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
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
import { SupabaseChatRepository } from "@features/chat/infrastructure/repositories/SupabaseChatRepository";
import { showMessageNotification } from "@shared/infrastructure/notifications/NotificationService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

const chatRepo = new SupabaseChatRepository();
const sendMessageUseCase = new SendMessageUseCase(chatRepo);
const getMessagesUseCase = new GetMessagesUseCase(chatRepo);
const subscribeUseCase = new SubscribeToRoomUseCase(chatRepo);

export function useChat(roomId: string) {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages", roomId],
    queryFn: () => getMessagesUseCase.execute(roomId),
    enabled: !!user,
    staleTime: Infinity,
  });

  useEffect(() => {
    const unsubscribe = subscribeUseCase.execute(roomId, (newMsg) => {
      queryClient.setQueryData(["messages", roomId], (old: Message[] = []) => {
        const exists = old.some((m) => m.id === newMsg.id);
        return exists ? old : [...old, newMsg];
      });

      if (newMsg.userId !== user?.id) {
        showMessageNotification(
          roomId,
          newMsg.authorUsername ?? "Alguien",
          newMsg.content,
        );
      }
    });

    return unsubscribe;
  }, [roomId]);

  const sendMutation = useMutation({
    mutationFn: ({ content, imageUrl }: { content: string; imageUrl?: string }) =>
      sendMessageUseCase.execute(roomId, user!.id, content, imageUrl),

    onMutate: async ({ content, imageUrl }) => {
      const tempMsg: Message = {
        id: `temp-${Date.now()}`,
        roomId,
        userId: user!.id,
        content,
        imageUrl,
        createdAt: new Date(),
        authorUsername: user!.username,
      };
      queryClient.setQueryData(["messages", roomId], (old: Message[] = []) => [
        ...old,
        tempMsg,
      ]);
      return { tempMsg };
    },

    onSuccess: (realMsg, _vars, context) => {
      queryClient.setQueryData(["messages", roomId], (old: Message[] = []) =>
        old.map((m) => (m.id === context?.tempMsg.id ? realMsg : m)),
      );
    },

    onError: (_err, _vars, context) => {
      if (context?.tempMsg) {
        queryClient.setQueryData(["messages", roomId], (old: Message[] = []) =>
          old.filter((m) => m.id !== context.tempMsg.id),
        );
      }
    },
  });

  return {
    messages,
    sendMessage: sendMutation.mutate,
    isLoading,
    isSending: sendMutation.isPending,
  };
}


================================================
📄 ARCHIVO: src\features\chat\presentation\hooks\useRooms.ts
================================================

import { useAuthStore } from "@features/auth/presentation/store/authStore";
import { CreateRoomUseCase } from "@features/chat/application/use-cases/CreateRoomUseCase";
import { Room } from "@features/chat/domain/entities/Message";
import { SupabaseChatRepository } from "@features/chat/infrastructure/repositories/SupabaseChatRepository";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const chatRepo = new SupabaseChatRepository();
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

export class ChatError extends AppError {
    constructor(message: string, cause?: unknown) {
        super('CHAT_ERROR', message, cause);
    }
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
import { supabase } from './client';
import { decode } from 'base64-arraybuffer';

export async function pickAndUploadImage(): Promise<string | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Se necesita permiso para acceder a la galería');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],   // ✅ nueva API sin MediaTypeOptions
    allowsEditing: true,
    quality: 0.7,
    base64: true,             // pedimos base64 directo para evitar FileSystem
  });

  if (result.canceled || !result.assets || result.assets.length === 0) return null;

  const asset = result.assets[0];

  let base64: string;
  if (asset.base64) {
    // ✅ base64 viene directo del picker, no necesitamos FileSystem
    base64 = asset.base64;
  } else if (asset.uri) {
    // Fallback: leer desde disco con la API correcta de expo-file-system v19
    const fileContent = await FileSystem.readAsStringAsync(asset.uri, {
      encoding: 'base64',     // ✅ string literal en lugar de FileSystem.EncodingType.Base64
    });
    base64 = fileContent;
  } else {
    throw new Error('No se pudo obtener la imagen');
  }

  const ext = asset.uri?.split('.').pop()?.toLowerCase() ?? 'jpg';
  const fileName = `${Date.now()}.${ext}`;
  const filePath = `public/${fileName}`;

  const { error } = await supabase.storage
    .from('chat-images')
    .upload(filePath, decode(base64), {
      contentType: `image/${ext}`,
      upsert: false,
    });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage
    .from('chat-images')
    .getPublicUrl(filePath);

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
    "ignoreDeprecations": "6.0"
  },
  "include": [
    "**/*.ts",
    "**/*.tsx",
    ".expo/types/**/*.ts",
    "expo-env.d.ts",
    "env.d.ts"
  ]
}
