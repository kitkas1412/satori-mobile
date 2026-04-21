// Tiện ích phát âm thanh cho tin nhắn của AI trong cuộc hội thoại.
// Ưu tiên phát file audio từ URL (chất lượng cao hơn), nếu không có thì
// dùng Text-to-Speech (TTS) tiếng Nhật làm phương án dự phòng.

import { createAudioPlayer } from "expo-audio";
import type { AudioPlayer } from "expo-audio";
import * as Speech from "expo-speech";

/** Instance player hiện tại đang phát — dùng để dừng từ bên ngoài khi cần */
let _currentPlayer: AudioPlayer | null = null;

/**
 * Phát tin nhắn của AI dưới dạng âm thanh.
 * Trả về Promise để caller có thể await và phát tuần tự nhiều tin nhắn.
 *
 * @param content - Nội dung văn bản (dùng khi không có audioUrl)
 * @param audioUrl - URL file audio do AI tạo ra (nếu có sẽ được ưu tiên)
 */
export async function playAssistantMessage(
  content: string,
  audioUrl?: string | null,
): Promise<void> {
  if (audioUrl) {
    // Ưu tiên phát audio từ URL vì chất lượng tốt hơn TTS
    // Nếu URL lỗi, fallback sang TTS để không bỏ qua lượt nói của AI
    return playAudioFromUrl(audioUrl).catch(() => speakText(content));
  }
  // Fallback: đọc văn bản bằng TTS tiếng Nhật
  return speakText(content);
}

/**
 * Dừng audio đang phát ngay lập tức (cả TTS lẫn URL audio).
 * Gọi khi người dùng thoát khỏi màn hình hội thoại giữa chừng.
 */
export function stopAssistantAudio(): void {
  Speech.stop();
  if (_currentPlayer) {
    _currentPlayer.remove();
    _currentPlayer = null;
  }
}

/**
 * Phát file audio từ URL và đợi đến khi phát xong.
 * Reject ngay khi player báo lỗi (fail fast), timeout 5s làm safety net.
 */
async function playAudioFromUrl(url: string): Promise<void> {
  const player = createAudioPlayer(url);
  _currentPlayer = player;
  return new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      clearTimeout(timeoutId);
      subscription.remove();
      player.remove();
      if (_currentPlayer === player) _currentPlayer = null;
    };

    const timeoutId = setTimeout(() => {
      cleanup();
      resolve(); // Safety net: không block luồng nếu không có sự kiện nào
    }, 5_000);

    const subscription = player.addListener(
      "playbackStatusUpdate",
      (status) => {
        if (status.didJustFinish) {
          cleanup();
          resolve();
        } else if (status.error) {
          cleanup();
          reject(new Error(status.error));
        }
      },
    );
    player.play();
  });
}

/**
 * Đọc văn bản bằng TTS tiếng Nhật và đợi đến khi đọc xong.
 * Chia thành từng câu theo ký tự kết thúc câu (。！？) và chèn ngắt 250ms
 * giữa các câu để âm thanh tự nhiên hơn, dễ theo hơn.
 */
async function speakText(text: string): Promise<void> {
  const sentences = text.split(/(?<=[。！？\n])/).map((s) => s.trim()).filter(Boolean);
  const chunks = sentences.length > 0 ? sentences : [text];

  for (let i = 0; i < chunks.length; i++) {
    await new Promise<void>((resolve) => {
      Speech.speak(chunks[i], {
        language: "ja-JP",
        rate: 0.9,
        onDone: resolve,
        onStopped: resolve,
        onError: () => resolve(),
      });
    });
    if (i < chunks.length - 1) {
      await new Promise<void>((resolve) => setTimeout(resolve, 250));
    }
  }
}
