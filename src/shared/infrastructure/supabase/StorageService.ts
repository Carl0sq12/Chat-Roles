import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from './client';
import { decode } from 'base64-arraybuffer';

export async function pickAndUploadImage(): Promise<string | null> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Se necesita permiso para acceder a la galería');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],   // ✅ nueva API sin MediaTypeOptions
    allowsEditing: true,
    quality: 0.7,
    base64: true,             // pedimos base64 directo para evitar FileSystem
  });

  if (result.canceled || !result.assets || result.assets.length === 0) return null;

  const asset = result.assets[0];

  let base64: string;
  if (asset.base64) {
    // ✅ base64 viene directo del picker, no necesitamos FileSystem
    base64 = asset.base64;
  } else if (asset.uri) {
    // Fallback: leer desde disco con la API correcta de expo-file-system v19
    const fileContent = await FileSystem.readAsStringAsync(asset.uri, {
      encoding: 'base64',     // ✅ string literal en lugar de FileSystem.EncodingType.Base64
    });
    base64 = fileContent;
  } else {
    throw new Error('No se pudo obtener la imagen');
  }

  const ext = asset.uri?.split('.').pop()?.toLowerCase() ?? 'jpg';
  const fileName = `${Date.now()}.${ext}`;
  const filePath = `public/${fileName}`;

  const { error } = await supabase.storage
    .from('chat-images')
    .upload(filePath, decode(base64), {
      contentType: `image/${ext}`,
      upsert: false,
    });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage
    .from('chat-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}