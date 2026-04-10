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
    return playAudioFromUrl(audioUrl);
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
 * Lắng nghe sự kiện "playbackStatusUpdate" để biết khi nào audio kết thúc,
 * sau đó dọn dẹp listener và player để tránh rò rỉ bộ nhớ.
 */
async function playAudioFromUrl(url: string): Promise<void> {
  const player = createAudioPlayer(url);
  _currentPlayer = player;
  return new Promise<void>((resolve) => {
    const subscription = player.addListener(
      "playbackStatusUpdate",
      (status) => {
        if (status.didJustFinish) {
          // Dọn dẹp sau khi phát xong
          subscription.remove();
          player.remove();
          if (_currentPlayer === player) _currentPlayer = null;
          resolve();
        }
      },
    );
    player.play();
  });
}

/**
 * Đọc văn bản bằng TTS tiếng Nhật và đợi đến khi đọc xong.
 * Resolve trong cả 3 trường hợp: đọc xong, bị dừng, hoặc lỗi —
 * để đảm bảo luồng hội thoại không bị treo.
 */
async function speakText(text: string): Promise<void> {
  return new Promise<void>((resolve) => {
    // Timeout dự phòng: nếu TTS engine không gọi bất kỳ callback nào sau 15s,
    // tự động resolve để tránh treo luồng hội thoại vĩnh viễn.
    const timeout = setTimeout(resolve, 3_000);
    const done = () => {
      clearTimeout(timeout);
      resolve();
    };
    Speech.speak(text, {
      language: "ja-JP",
      onDone: resolve,
      onStopped: resolve,
      onError: () => done(), // Không throw lỗi, chỉ bỏ qua và tiếp tục
    });
  });
}
