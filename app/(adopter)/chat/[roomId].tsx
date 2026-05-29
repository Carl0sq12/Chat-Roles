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
