import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';
import { supabase } from './client';

export async function pickAndUploadPetImage(): Promise<string | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted')
    throw new Error('Se necesita permiso para acceder a la galería');

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.8,
    base64: true,
  });

  if (result.canceled || !result.assets?.length) return null;

  const asset = result.assets[0];
  let base64: string;

  if (asset.base64) {
    base64 = asset.base64;
  } else if (asset.uri) {
    base64 = await FileSystem.readAsStringAsync(asset.uri, { encoding: 'base64' });
  } else {
    throw new Error('No se pudo obtener la imagen');
  }

  const ext = asset.uri?.split('.').pop()?.toLowerCase() ?? 'jpg';
  const fileName = `pet-${Date.now()}.${ext}`;
  const filePath = `pets/${fileName}`;

  const { error } = await supabase.storage
    .from('pet-images')
    .upload(filePath, decode(base64), {
      contentType: `image/${ext}`,
      upsert: false,
    });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from('pet-images').getPublicUrl(filePath);
  return data.publicUrl;
}