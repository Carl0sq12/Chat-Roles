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