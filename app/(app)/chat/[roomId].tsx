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
  red: '#ef4444',
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

// InputBar como componente separado para evitar que el padre re-renderice
// y cierre el teclado al escribir
function InputBar({
  onSend,
  onImagePick,
  isUploading,
  isSending,
  sendError,
}: {
  onSend: (text: string) => void;
  onImagePick: () => void;
  isUploading: boolean;
  isSending: boolean;
  sendError: string | null;
}) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput('');
  };

  const canSend = input.trim().length > 0 && !isSending;

  return (
    <View>
      {/* Error de envío */}
      {!!sendError && (
        <View style={s.sendErrorBar}>
          <Text style={s.sendErrorText}>⚠ {sendError}</Text>
        </View>
      )}

      <View style={s.inputBar}>
        {/* Botón adjuntar imagen */}
        <TouchableOpacity
          style={s.attachBtn}
          onPress={onImagePick}
          disabled={isUploading || isSending}
          activeOpacity={0.7}
        >
          {isUploading
            ? <ActivityIndicator size="small" color={E.violet} />
            : <Text style={s.attachIcon}>⊕</Text>
          }
        </TouchableOpacity>

        {/* Input de texto */}
        <TextInput
          style={s.input}
          value={input}
          onChangeText={setInput}
          placeholder="Escribe un mensaje..."
          placeholderTextColor={E.textMute}
          multiline
          maxLength={500}
          blurOnSubmit={false}
          returnKeyType="default"
          editable={!isSending}
        />

        {/* Botón enviar */}
        <TouchableOpacity
          style={[s.sendBtn, !canSend && s.sendBtnOff]}
          onPress={handleSend}
          disabled={!canSend}
          activeOpacity={0.85}
        >
          {isSending
            ? <ActivityIndicator size="small" color="#fff" />
            : <Text style={s.sendIcon}>↑</Text>
          }
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ChatScreen() {
  const { roomId }                                            = useLocalSearchParams<{ roomId: string }>();
  const { messages, sendMessage, isLoading, isSending, sendError } = useChat(roomId);
  const user                                                  = useAuthStore((s) => s.user);
  const isVendedor                                            = user?.role === 'vendedor';
  const [isUploading, setIsUploading]                        = useState(false);
  const listRef                                               = useRef<FlatList>(null);
  const prevLengthRef                                         = useRef(0);

  // Scroll al último mensaje cuando llegan nuevos
  useEffect(() => {
    if (messages.length > prevLengthRef.current) {
      prevLengthRef.current = messages.length;
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 80);
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
      Alert.alert('Error', e.message);
    } finally {
      setIsUploading(false);
    }
  }, [sendMessage]);

  const renderMsg = useCallback(({ item }: { item: Message }) => {
    const isOwn = item.userId === user?.id;

    // Badge de rol del autor (solo en mensajes ajenos)
    const authorRole = isOwn ? user?.role : undefined;

    return (
      <View style={[s.msgRow, isOwn && s.msgRowOwn]}>
        {!isOwn && <MsgAvatar name={item.authorUsername ?? '?'} />}

        <View style={s.msgStack}>
          {!isOwn && (
            <View style={s.msgAuthorRow}>
              <Text style={s.msgAuthor}>{item.authorUsername}</Text>
            </View>
          )}

          <View style={[s.bubble, isOwn ? s.bubbleOwn : s.bubbleOther]}>
            {item.imageUrl && (
              <Image
                source={{ uri: item.imageUrl }}
                style={s.msgImage}
                resizeMode="cover"
              />
            )}
            {!!item.content && (
              <Text style={[s.msgText, isOwn && s.msgTextOwn]}>
                {item.content}
              </Text>
            )}
            {/* Indicador de mensaje temporal (enviando) */}
            {item.id.startsWith('temp-') && (
              <Text style={s.msgSending}>enviando...</Text>
            )}
          </View>

          <Text style={[s.msgTime, isOwn && s.msgTimeOwn]}>
            {item.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  }, [user?.id, user?.role]);

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
      {/* Banner de rol en el chat */}
      <View style={[s.roleBanner, isVendedor ? s.roleBannerVendedor : s.roleBannerCliente]}>
        <Text style={[s.roleBannerText, isVendedor ? s.roleBannerTextVendedor : s.roleBannerTextCliente]}>
          {isVendedor
            ? '🏪 Modo Vendedor — puedes crear canales y responder consultas'
            : '🛒 Modo Cliente — pregunta lo que necesites sobre nuestros productos'}
        </Text>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        renderItem={renderMsg}
        contentContainerStyle={s.messagesList}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="none"
        // Scroll al fondo al montar si hay mensajes
        onLayout={() => {
          if (messages.length > 0) {
            listRef.current?.scrollToEnd({ animated: false });
          }
        }}
      />

      <InputBar
        onSend={handleSend}
        onImagePick={handleImagePick}
        isUploading={isUploading}
        isSending={isSending}
        sendError={sendError}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:    { flex: 1, backgroundColor: E.bg },
  loading:      { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: E.bg, gap: 12 },
  loadingText:  { color: E.violet, fontSize: 12, letterSpacing: 1 },

  // Banner de rol en la parte superior del chat
  roleBanner: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  roleBannerCliente: {
    backgroundColor: 'rgba(124,58,237,0.08)',
    borderBottomColor: 'rgba(124,58,237,0.20)',
  },
  roleBannerVendedor: {
    backgroundColor: 'rgba(34,211,238,0.06)',
    borderBottomColor: 'rgba(34,211,238,0.18)',
  },
  roleBannerText: {
    fontSize: 11,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  roleBannerTextCliente:  { color: E.neonSoft },
  roleBannerTextVendedor: { color: E.cyan },

  messagesList: { paddingHorizontal: 14, paddingVertical: 14, gap: 10 },

  msgRow:    { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  msgRowOwn: { justifyContent: 'flex-end' },

  avatar: {
    width: 30, height: 30, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 2, flexShrink: 0,
  },
  avatarText: { color: '#fff', fontSize: 12, fontWeight: '800' },

  msgStack:     { maxWidth: '75%', gap: 3 },
  msgAuthorRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 4, marginBottom: 1 },
  msgAuthor:    { fontSize: 10, color: E.violet, letterSpacing: 1 },

  bubble:      { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  bubbleOther: { backgroundColor: E.card, borderWidth: 1, borderColor: E.border, borderTopLeftRadius: 4 },
  bubbleOwn: {
    backgroundColor: E.violet, borderTopRightRadius: 4,
    shadowColor: E.violet, shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5, shadowRadius: 14, elevation: 6,
  },

  msgText:    { fontSize: 14, color: E.text, lineHeight: 20 },
  msgTextOwn: { color: '#fff' },
  msgImage:   { width: 200, height: 150, borderRadius: 10, marginBottom: 4 },
  msgSending: { fontSize: 9, color: 'rgba(255,255,255,0.5)', marginTop: 2, fontStyle: 'italic' },
  msgTime:    { fontSize: 9, color: E.textMute, letterSpacing: 0.5, paddingHorizontal: 4, alignSelf: 'flex-start' },
  msgTimeOwn: { alignSelf: 'flex-end' },

  // Error de envío
  sendErrorBar: {
    backgroundColor: 'rgba(239,68,68,0.12)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: 'rgba(239,68,68,0.25)',
  },
  sendErrorText: { color: '#f87171', fontSize: 11, textAlign: 'center' },

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
