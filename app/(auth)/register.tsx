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
  const [role, setRole]         = useState<'vendedor' | 'cliente'>('cliente');
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

          {/* Rol */}
          <View style={s.fieldWrap}>
            <Text style={s.fieldLabel}>&gt; ROL</Text>
            <View style={s.roleRow}>

              <TouchableOpacity
                style={[
                  s.roleBtn,
                  role === 'cliente' && s.roleBtnActive,
                  role === 'cliente' && s.roleBtnActiveCliente,
                ]}
                onPress={() => setRole('cliente')}
                activeOpacity={0.8}
              >
                <Text style={s.roleEmoji}>🛒</Text>
                <Text style={[s.roleBtnLabel, role === 'cliente' && s.roleBtnLabelActive]}>
                  CLIENTE
                </Text>
                <Text style={[s.roleBtnSub, role === 'cliente' && s.roleBtnSubActive]}>
                  Consulta productos
                </Text>
                {role === 'cliente' && <View style={s.roleCheck}><Text style={s.roleCheckText}>✓</Text></View>}
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  s.roleBtn,
                  role === 'vendedor' && s.roleBtnActive,
                  role === 'vendedor' && s.roleBtnActiveVendedor,
                ]}
                onPress={() => setRole('vendedor')}
                activeOpacity={0.8}
              >
                <Text style={s.roleEmoji}>🏪</Text>
                <Text style={[s.roleBtnLabel, role === 'vendedor' && s.roleBtnLabelActive]}>
                  VENDEDOR
                </Text>
                <Text style={[s.roleBtnSub, role === 'vendedor' && s.roleBtnSubActive]}>
                  Gestiona y responde
                </Text>
                {role === 'vendedor' && <View style={s.roleCheck}><Text style={s.roleCheckText}>✓</Text></View>}
              </TouchableOpacity>

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
            onPress={() => register({ email, password, username, role })}
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
      android: {},
    }),
  },
  inputIcon: { fontSize: 14, color: E.textMute },
  input: {
    flex: 1, fontSize: 13, color: E.text,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : undefined,
  },

  // ── Rol selector ──
  roleRow: { flexDirection: 'row', gap: 10 },

  roleBtn: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: E.border,
    backgroundColor: 'rgba(255,255,255,0.02)',
    alignItems: 'center',
    gap: 4,
    position: 'relative',
  },
  roleBtnActive: {
    borderWidth: 1.5,
  },
  roleBtnActiveCliente: {
    borderColor: E.violet,
    backgroundColor: 'rgba(124,58,237,0.10)',
    ...Platform.select({
      ios: {
        shadowColor: E.violet,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.35,
        shadowRadius: 12,
      },
      android: {},
    }),
  },
  roleBtnActiveVendedor: {
    borderColor: E.cyan,
    backgroundColor: 'rgba(34,211,238,0.08)',
    ...Platform.select({
      ios: {
        shadowColor: E.cyan,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {},
    }),
  },

  roleEmoji: { fontSize: 24, marginBottom: 2 },

  roleBtnLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: E.textMute,
  },
  roleBtnLabelActive: { color: E.text },

  roleBtnSub: {
    fontSize: 9,
    color: E.textMute,
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  roleBtnSubActive: { color: E.textDim },

  roleCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: E.violet,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleCheckText: { color: '#fff', fontSize: 9, fontWeight: '800' },

  // ── Divider ──
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
});
