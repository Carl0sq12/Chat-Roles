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
