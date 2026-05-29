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
