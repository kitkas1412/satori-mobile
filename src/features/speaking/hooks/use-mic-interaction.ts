// Hook xử lý tương tác với nút mic, hỗ trợ 2 chế độ ghi âm:
//
// - Chế độ GIỮ (Hold): Nhấn giữ nút > 300ms → nhả tay → dừng ghi âm và gửi ngay.
// - Chế độ CHẠM (Tap): Nhấn nhanh lần 1 → bắt đầu ghi âm; nhấn nhanh lần 2 → dừng và gửi.
//
// Chế độ Tap phù hợp cho câu trả lời dài, không cần giữ nút suốt thời gian nói.

import { useRef } from "react";
import type { TurnState } from "@/features/speaking/api";

interface UseMicInteractionParams {
  turnState: TurnState;
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<{ transcript: string; audioUri: string | null }>;
  sendMessage: (transcript: string, audioUri?: string | null) => Promise<void>;
}

export function useMicInteraction({
  turnState,
  isRecording,
  startRecording,
  stopRecording,
  sendMessage,
}: UseMicInteractionParams) {
  /** Thời điểm bắt đầu nhấn nút (dùng để tính thời gian nhấn giữ) */
  const pressStartTimeRef = useRef<number | null>(null);
  /** true khi người dùng đang ở chế độ Tap (đã nhấn lần 1 chưa nhả) */
  const isTapModeRef = useRef(false);

  /** Xử lý khi bắt đầu nhấn nút mic */
  async function handleMicPressIn() {
    // Chỉ cho phép khi đến lượt người dùng
    if (turnState !== "USER_TURN") return;
    pressStartTimeRef.current = Date.now();
    if (!isRecording) {
      await startRecording();
    }
  }

  /** Xử lý khi nhả nút mic — phân luồng theo thời gian nhấn */
  async function handleMicPressOut() {
    if (!isRecording) return;
    const elapsed = Date.now() - (pressStartTimeRef.current ?? 0);

    // Ngưỡng phân biệt tap (< 300ms) và hold (≥ 300ms)
    const TAP_THRESHOLD = 300;

    if (elapsed < TAP_THRESHOLD) {
      // --- Chế độ TAP ---
      if (isTapModeRef.current) {
        // Lần nhấn thứ 2: dừng ghi âm và gửi tin nhắn
        isTapModeRef.current = false;
        const { transcript, audioUri } = await stopRecording();
        await sendMessage(transcript, audioUri);
      } else {
        // Lần nhấn thứ 1: đánh dấu tap mode, tiếp tục ghi âm
        isTapModeRef.current = true;
      }
    } else {
      // --- Chế độ HOLD ---
      // Nhả tay sau khi giữ đủ lâu: dừng ghi âm và gửi ngay
      isTapModeRef.current = false;
      const { transcript, audioUri } = await stopRecording();
      await sendMessage(transcript, audioUri);
    }
  }

  /** Nút mic bị vô hiệu hoá khi chưa đến lượt người dùng */
  const micDisabled = turnState !== "USER_TURN";

  /** Nhãn hiển thị bên dưới nút mic tương ứng với trạng thái hiện tại */
  const micLabel =
    turnState === "LOADING"
      ? "AI đang trả lời..."
      : turnState === "AI_TURN"
        ? "Chờ AI..."
        : isRecording
          ? "Đang ghi âm..."
          : "Chạm để nói";

  return { handleMicPressIn, handleMicPressOut, micDisabled, micLabel };
}
