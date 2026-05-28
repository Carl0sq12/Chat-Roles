import { useAuthStore } from "@features/auth/presentation/store/authStore";
import { GetMessagesUseCase } from "@features/chat/application/use-cases/GetMessagesUseCase";
import { SendMessageUseCase } from "@features/chat/application/use-cases/SendMessageUseCase";
import { SubscribeToRoomUseCase } from "@features/chat/application/use-cases/SubscribeToRoomUseCase";
import { Message } from "@features/chat/domain/entities/Message";
//import { SupabaseChatRepository } from "@features/chat/infrastructure/repositories/SupabaseChatRepository";
import { AppwriteChatRepository } from '@features/chat/infrastructure/repositories/AppwriteChatRepository';

import { showMessageNotification } from "@shared/infrastructure/notifications/NotificationService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

//const chatRepo           = new SupabaseChatRepository();
const chatRepo           = new AppwriteChatRepository();
const sendMessageUseCase = new SendMessageUseCase(chatRepo);
const getMessagesUseCase = new GetMessagesUseCase(chatRepo);
const subscribeUseCase   = new SubscribeToRoomUseCase(chatRepo);

export function useChat(roomId: string) {
  const user        = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const queryKey    = ['messages', roomId];

  // ── Fetch inicial de mensajes ──
  const { data: messages = [], isLoading } = useQuery({
    queryKey,
    queryFn:   () => getMessagesUseCase.execute(roomId),
    enabled:   !!user,
    staleTime: Infinity,
  });

  // ── Suscripción a mensajes nuevos en tiempo real ──
  useEffect(() => {
    if (!roomId) return;

    const unsubscribe = subscribeUseCase.execute(roomId, (newMsg) => {
      queryClient.setQueryData(queryKey, (old: Message[] = []) => {
        // Reemplaza el mensaje temporal si existe, sino agrega el real
        const hasTempOrReal = old.some(
          (m) => m.id === newMsg.id || (m.id.startsWith('temp-') && m.content === newMsg.content && m.userId === newMsg.userId)
        );
        if (hasTempOrReal) {
          // Reemplaza el temp por el mensaje real de Supabase
          return old.map((m) =>
            m.id.startsWith('temp-') && m.content === newMsg.content && m.userId === newMsg.userId
              ? newMsg
              : m.id === newMsg.id ? newMsg : m
          );
        }
        return [...old, newMsg];
      });

      // Notificación solo si el mensaje es de otro usuario
      if (newMsg.userId !== user?.id) {
        showMessageNotification(
          roomId,
          newMsg.authorUsername ?? 'Alguien',
          newMsg.content || '📷 Imagen',
        );
      }
    });

    return unsubscribe;
  }, [roomId]);

  // ── Envío de mensajes con optimistic update ──
  const sendMutation = useMutation({
    mutationFn: ({ content, imageUrl }: { content: string; imageUrl?: string }) => {
      if (!user) throw new Error('No hay usuario autenticado');
      return sendMessageUseCase.execute(roomId, user.id, content, imageUrl);
    },

    onMutate: async ({ content, imageUrl }) => {
      // Cancelar queries en vuelo para evitar sobreescribir el optimistic update
      await queryClient.cancelQueries({ queryKey });

      const tempMsg: Message = {
        id:             `temp-${Date.now()}`,
        roomId,
        userId:         user!.id,
        content,
        imageUrl,
        createdAt:      new Date(),
        authorUsername: user!.username,
      };

      queryClient.setQueryData(queryKey, (old: Message[] = []) => [...old, tempMsg]);
      return { tempMsg };
    },

    onSuccess: (realMsg, _vars, context) => {
      // Reemplaza el mensaje temporal por el confirmado de Supabase
      queryClient.setQueryData(queryKey, (old: Message[] = []) =>
        old.map((m) => (m.id === context?.tempMsg.id ? realMsg : m))
      );
    },

    onError: (_err, _vars, context) => {
      // Revertir el optimistic update si falla
      if (context?.tempMsg) {
        queryClient.setQueryData(queryKey, (old: Message[] = []) =>
          old.filter((m) => m.id !== context.tempMsg.id)
        );
      }
    },
  });

  return {
    messages,
    sendMessage: sendMutation.mutate,
    isLoading,
    isSending:   sendMutation.isPending,
    sendError:   sendMutation.error?.message ?? null,
  };
}