// src/shared/infrastructure/notifications/NotificationService.ts

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return false;

    if (Platform.OS === 'android') {
      try {
        await Notifications.setNotificationChannelAsync('chat-messages', {
          name: 'Mensajes de chat',
          importance: Notifications.AndroidImportance.HIGH,
          sound: 'default',
          vibrationPattern: [0, 250, 250, 250],
        });
      } catch (e) {
        // Expo Go Android no soporta canales — silenciar sin crashear
        console.warn('Canal de notificaciones no disponible:', e);
      }
    }
    return true;
  } catch (e) {
    console.warn('Notificaciones no disponibles:', e);
    return false;
  }
}

export async function showMessageNotification(
  roomName: string,
  authorUsername: string,
  content: string,
): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `💬 ${roomName}`,
        body: `${authorUsername}: ${content}`,
        sound: 'default',
        data: { roomName },
      },
      trigger: null,
    });
  } catch (e) {
    console.warn('No se pudo mostrar notificación:', e);
  }
}