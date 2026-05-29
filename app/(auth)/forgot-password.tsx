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