import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import {
  abandonSessionApi,
  completeSessionApi,
  sendMessageApi,
  startSessionApi,
} from "../api";
import {
  useConversationStore,
} from "@/stores";
import type { TurnState } from "../api";
import { playAssistantMessage } from "./use-audio-player";

export function useConversationSession() {
  const router = useRouter();
  const [turnState, setTurnState] = useState<TurnState>("AI_TURN");
  const [isInitializing, setIsInitializing] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const { setSession, addMessages, removeMessage, setMissions, setFeedback, clearSession } =
    useConversationStore();
  const sessionId = useConversationStore((s) => s.sessionId);

  const initSession = useCallback(async (topicId: string) => {
    setIsInitializing(true);
    try {
      const session = await startSessionApi(topicId);
      setSession(session.id, session.messages, session.missions);
      const firstAssistantMessage = session.messages.find((m) => m.role === "ASSISTANT");
      setTurnState("AI_TURN");
      setIsInitializing(false);
      if (firstAssistantMessage) {
        await playAssistantMessage(firstAssistantMessage.content, firstAssistantMessage.audioUrl).catch(() => {});
      }
      setTurnState("USER_TURN");
    } catch {
      Alert.alert("Lỗi", "Không thể bắt đầu buổi học. Vui lòng thử lại.");
      router.back();
    } finally {
      setIsInitializing(false);
    }
  }, [router, setSession]);

  const sendMessage = useCallback(
    async (transcript: string, audioUri?: string | null) => {
      if (!sessionId) return;
      if (!transcript.trim()) {
        Alert.alert("Không nhận được giọng nói", "Vui lòng thử nói lại.");
        return;
      }
      const optimisticId = `optimistic-${Date.now()}`;
      const optimisticUserMessage = {
        id: optimisticId,
        sessionId: sessionId,
        role: "USER" as const,
        content: transcript,
        japaneseContent: null,
        translation: null,
        romaji: null,
        sequenceNumber: -1,
        audioUrl: null,
        userAudioUrl: audioUri ?? null,
        correction: null,
        vocabularyUsed: null,
        isHintRequest: false,
        createdAt: new Date().toISOString(),
        messageType: "TEXT",
        pronunciationScore: null,
      };
      addMessages([optimisticUserMessage]);
      setTurnState("LOADING");
      try {
        const result = await sendMessageApi(
          sessionId,
          transcript,
          audioUri ?? undefined
        );
        addMessages(result.messages);
        setMissions(result.missions);
        const assistantMessage = result.messages.find((m) => m.role === "ASSISTANT");
        setTurnState("AI_TURN");
        if (assistantMessage) {
          await playAssistantMessage(assistantMessage.content, assistantMessage.audioUrl).catch(() => {});
        }
        setTurnState("USER_TURN");
      } catch {
        Alert.alert("Lỗi", "Không thể gửi tin nhắn. Vui lòng thử lại.");
        setTurnState("USER_TURN");
      }
    },
    [sessionId, addMessages, setMissions]
  );

  const completeSession = useCallback(async () => {
    if (!sessionId) return;
    setIsCompleting(true);
    try {
      const feedback = await completeSessionApi(sessionId);
      setFeedback(feedback);
    } catch {
      Alert.alert("Lỗi", "Không thể hoàn thành buổi học. Vui lòng thử lại.");
    } finally {
      setIsCompleting(false);
    }
  }, [sessionId, setFeedback]);

  const abandonSession = useCallback(async () => {
    if (!sessionId) return;
    try {
      await abandonSessionApi(sessionId);
    } catch {
      // ignore — abandon on best-effort basis
    } finally {
      clearSession();
      router.replace("/(tabs)/speaking");
    }
  }, [sessionId, clearSession, router]);

  return {
    turnState,
    isInitializing,
    isCompleting,
    initSession,
    sendMessage,
    completeSession,
    abandonSession,
  };
}
