// Tiện ích phát âm thanh cho tin nhắn của AI trong cuộc hội thoại.
// Ưu tiên phát file audio từ URL (chất lượng cao hơn), nếu không có thì
// dùng Text-to-Speech (TTS) tiếng Nhật làm phương án dự phòng.

import { createAudioPlayer, setAudioModeAsync } from "expo-audio";
import type { AudioPlayer } from "expo-audio";
import { File, Paths } from "expo-file-system";
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
  audioBase64?: string | null,
): Promise<void> {
  // Defensive: đảm bảo audio session ở chế độ playback (loa ngoài, full DSP).
  // Nếu còn dính `.playAndRecord` từ session ghi âm trước, audio sẽ phát qua
  // earpiece với volume rất nhỏ.
  await setAudioModeAsync({
    allowsRecording: false,
    playsInSilentMode: true,
  }).catch(() => {});

  if (audioUrl) {
    return playAudioFromUrl(audioUrl).catch(() => speakText(content));
  }
  if (audioBase64) {
    return playAudioFromBase64(audioBase64).catch(() => speakText(content));
  }
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
 * Reject khi playbackState='failed', timeout 15s làm safety net.
 *
 * LƯU Ý: AudioStatus của expo-audio không có field `error` — lỗi native được
 * phản ánh qua `playbackState === 'failed'` thay vì `status.error`.
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
    }, 15_000);

    const subscription = player.addListener(
      "playbackStatusUpdate",
      (status) => {
        if (status.didJustFinish) {
          cleanup();
          resolve();
        } else if (status.playbackState === "failed") {
          cleanup();
          reject(new Error("playbackState=failed"));
        }
      },
    );
    player.play();
  });
}

/**
 * Ghi base64 audio ra file tạm rồi phát bằng playAudioFromUrl.
 * Xóa file tạm sau khi phát xong (kể cả khi lỗi) để tránh rò rỉ bộ nhớ.
 *
 * expo-file-system v19: dùng class File/Paths thay vì writeAsStringAsync/cacheDirectory.
 */
async function playAudioFromBase64(base64: string): Promise<void> {
  const file = new File(Paths.cache, `ai_audio_${Date.now()}.mp3`);
  file.write(base64, { encoding: "base64" });
  try {
    await playAudioFromUrl(file.uri);
  } finally {
    try { file.delete(); } catch { /* ignore */ }
  }
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
