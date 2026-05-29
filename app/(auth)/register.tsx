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