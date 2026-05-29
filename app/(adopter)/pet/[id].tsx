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