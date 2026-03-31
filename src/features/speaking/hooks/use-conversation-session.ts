// Hook trung tâm quản lý toàn bộ vòng đời của một session hội thoại với AI.
//
// Bao gồm: khởi tạo session, gửi tin nhắn, hoàn thành, và bỏ dở.
// Hỗ trợ cả 2 loại session: theo topic (guided) và tự do (free-talk).
//
// Luồng cơ bản:
//   initSession / initFreeTalkSession → sendMessage (nhiều lần) → completeSession
//   hoặc abandonSession (bỏ dở bất kỳ lúc nào)

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Alert } from "react-native";
import {
  abandonSessionApi,
  completeSessionApi,
  sendMessageApi,
  startFreeTalkSessionApi,
  startSessionApi,
} from "../api";
import { useConversationStore } from "@/stores";
import type { TurnState } from "../api";
import { playAssistantMessage, stopAssistantAudio } from "./use-audio-player";
import { speakingQueryKeys } from "./use-topics";

/** Hàm tiện ích tạo độ trễ (ms) để phát tin nhắn AI tuần tự, không bị đổ xuất hiện cùng lúc */
const delay = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export function useConversationSession() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [turnState, setTurnState] = useState<TurnState>("AI_TURN");
  const [isInitializing, setIsInitializing] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const cancelledRef = useRef(false);

  const {
    setSession,
    addMessages,
    removeMessage,
    setMissions,
    setFeedback,
    clearSession,
  } = useConversationStore();
  const sessionId = useConversationStore((s) => s.sessionId);

  /**
   * Hàm nội bộ dùng chung để khởi tạo session (cả guided và free-talk).
   * Nhận một hàm `starter` làm tham số để linh hoạt với từng loại API.
   *
   * Sau khi API trả về, phát tuần tự các tin nhắn mở đầu từ AI:
   * - Ẩn overlay loading trước khi bắt đầu phát (để người dùng thấy màn hình chat)
   * - Delay 600ms giữa mỗi tin nhắn để tạo cảm giác tự nhiên
   * - Await audio của từng tin nhắn trước khi hiển thị tin tiếp theo
   */
  const _startSession = useCallback(
    async (
      starter: () => Promise<import("../api").RoleplaySessionResponse>,
    ) => {
      cancelledRef.current = false;
      setIsInitializing(true);
      try {
        const session = await starter();
        setSession(session.id, [], session.missions);
        setTurnState("AI_TURN");
        // Tắt overlay trước khi phát audio để người dùng thấy tin nhắn xuất hiện
        setIsInitializing(false);
        for (const msg of session.messages) {
          if (cancelledRef.current) break;
          await delay(600); // Độ trễ tự nhiên giữa các tin nhắn
          if (cancelledRef.current) break;
          addMessages([msg]);
          if (msg.role === "ASSISTANT") {
            // Đợi audio phát xong trước khi hiển thị tin nhắn tiếp theo
            await playAssistantMessage(msg.content, msg.audioUrl).catch(
              () => {}, // Bỏ qua lỗi audio, không block luồng hội thoại
            );
          }
        }
        if (!cancelledRef.current) setTurnState("USER_TURN");
      } catch {
        Alert.alert("Lỗi", "Không thể bắt đầu buổi học. Vui lòng thử lại.");
        router.back();
      } finally {
        setIsInitializing(false);
      }
    },
    [router, setSession, addMessages],
  );

  /** Khởi tạo session hội thoại theo topic cụ thể */
  const initSession = useCallback(
    (topicId: string) => _startSession(() => startSessionApi(topicId)),
    [_startSession],
  );

  /** Khởi tạo session hội thoại tự do (free-talk) theo cấp độ JLPT */
  const initFreeTalkSession = useCallback(
    (jlptLevel: string, language: string) =>
      _startSession(() => startFreeTalkSessionApi({ jlptLevel, language })),
    [_startSession],
  );

  /**
   * Gửi tin nhắn của người dùng và xử lý phản hồi từ AI.
   *
   * Sử dụng Optimistic UI: hiển thị tin nhắn của người dùng ngay lập tức
   * (trước khi API trả về) để trải nghiệm mượt mà hơn.
   *
   * Thứ tự xử lý response:
   *   1. addMessages(userMessages) — thay thế tin nhắn optimistic bằng dữ liệu thật
   *   2. setMissions — cập nhật tiến độ nhiệm vụ
   *   3. Phát tuần tự từng tin nhắn AI kèm audio
   *
   * @param transcript - Văn bản chuyển đổi từ giọng nói của người dùng
   * @param audioUri - Đường dẫn file ghi âm gốc (nếu có, gửi để chấm điểm phát âm)
   */
  const sendMessage = useCallback(
    async (transcript: string, audioUri?: string | null) => {
      if (!sessionId) return;
      if (!transcript.trim()) {
        Alert.alert("Không nhận được giọng nói", "Vui lòng thử nói lại.");
        return;
      }

      cancelledRef.current = false;
      // Optimistic UI: hiển thị tin nhắn ngay trước khi API phản hồi
      const optimisticId = `optimistic-${Date.now()}`;
      const optimisticUserMessage = {
        id: optimisticId,
        sessionId: sessionId,
        role: "USER" as const,
        content: transcript,
        japaneseContent: null,
        translation: null,
        romaji: null,
        sequenceNumber: -1, // Chưa có số thứ tự thật từ server
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
          audioUri ?? undefined,
        );

        // Tách tin nhắn người dùng (có dữ liệu thật) và tin nhắn AI
        const userMessages = result.messages.filter(
          (m) => m.role !== "ASSISTANT",
        );
        const assistantMessages = result.messages.filter(
          (m) => m.role === "ASSISTANT",
        );

        // Thêm tin nhắn thật của người dùng (store tự xử lý trùng lặp với optimistic)
        addMessages(userMessages);
        setMissions(result.missions);
        setTurnState("AI_TURN");

        // Phát tuần tự từng tin nhắn AI
        for (const msg of assistantMessages) {
          if (cancelledRef.current) break;
          await delay(600); // Độ trễ tự nhiên trước mỗi tin nhắn
          if (cancelledRef.current) break;
          addMessages([msg]);
          await playAssistantMessage(msg.content, msg.audioUrl).catch(() => {});
        }
        if (!cancelledRef.current) setTurnState("USER_TURN");
      } catch {
        Alert.alert("Lỗi", "Không thể gửi tin nhắn. Vui lòng thử lại.");
        setTurnState("USER_TURN");
      }
    },
    [sessionId, addMessages, setMissions],
  );

  /**
   * Kết thúc session và lấy kết quả đánh giá từ AI.
   * Sau khi gọi, feedback sẽ được lưu vào store và màn hình sẽ hiển thị nút "Tiếp tục".
   */
  const completeSession = useCallback(async () => {
    if (!sessionId) return;
    setIsCompleting(true);
    try {
      const feedback = await completeSessionApi(sessionId);
      setFeedback(feedback);
      queryClient.invalidateQueries({ queryKey: ["speaking", "conversations"] });
      queryClient.invalidateQueries({ queryKey: speakingQueryKeys.topics });
    } catch {
      Alert.alert("Lỗi", "Không thể hoàn thành buổi học. Vui lòng thử lại.");
    } finally {
      setIsCompleting(false);
    }
  }, [sessionId, setFeedback]);

  /**
   * Bỏ dở session (người dùng thoát giữa chừng).
   * Gọi API theo dạng best-effort: nếu API lỗi vẫn xoá session local và về trang chính.
   * Không hiển thị lỗi vì đây là hành động người dùng chủ động thoát.
   */
  const abandonSession = useCallback(async () => {
    if (!sessionId) return;
    cancelledRef.current = true;
    stopAssistantAudio();
    try {
      await abandonSessionApi(sessionId);
    } catch {
      // Bỏ qua lỗi — abandon là best-effort, không cần báo lỗi cho người dùng
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
    initFreeTalkSession,
    sendMessage,
    completeSession,
    abandonSession,
  };
}
