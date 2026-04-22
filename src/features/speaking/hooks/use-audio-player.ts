// Tiện ích phát âm thanh cho tin nhắn của AI trong cuộc hội thoại.
// Ưu tiên phát file audio từ URL (chất lượng cao hơn), nếu không có thì
// dùng Text-to-Speech (TTS) tiếng Nhật làm phương án dự phòng.

import { createAudioPlayer } from "expo-audio";
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
  console.log("[audio] playAssistantMessage", {
    hasUrl: !!audioUrl,
    hasBase64: !!audioBase64,
    base64Len: audioBase64?.length ?? 0,
  });
  if (audioUrl) {
    return playAudioFromUrl(audioUrl).catch((err) => {
      console.warn("[audio] URL playback failed → TTS:", err);
      return speakText(content);
    });
  }
  if (audioBase64) {
    return playAudioFromBase64(audioBase64).catch((err) => {
      console.warn("[audio] base64 playback failed → TTS:", err);
      return speakText(content);
    });
  }
  console.log("[audio] no audio source, using TTS");
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
 * Reject khi player báo lỗi hoặc playbackState='failed', timeout 15s làm safety net.
 *
 * LƯU Ý: AudioStatus của expo-audio không có field `error` — lỗi native được
 * phản ánh qua `playbackState === 'failed'` thay vì `status.error`.
 */
async function playAudioFromUrl(url: string): Promise<void> {
  console.log("[audio] createAudioPlayer:", url.slice(0, 100));
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
      console.warn("[audio] timeout 15s — resolving without didJustFinish");
      cleanup();
      resolve();
    }, 15_000);

    const subscription = player.addListener(
      "playbackStatusUpdate",
      (status) => {
        console.log("[audio] status update:", JSON.stringify({
          isLoaded: status.isLoaded,
          playing: status.playing,
          didJustFinish: status.didJustFinish,
          isBuffering: status.isBuffering,
          playbackState: status.playbackState,
          timeControlStatus: status.timeControlStatus,
          duration: status.duration,
        }));
        if (status.didJustFinish) {
          cleanup();
          resolve();
        } else if (status.playbackState === "failed") {
          // expo-audio báo lỗi qua playbackState, không phải status.error
          cleanup();
          reject(new Error(`Player failed: playbackState=failed`));
        }
      },
    );
    player.play();
  });
}

/**
 * Ghi base64 audio ra file tạm rồi phát bằng playAudioFromUrl.
 * Xóa file tạm sau khi phát xong (kể cả khi lỗi) để tránh rò rỉ bộ nhớ.
 */
async function playAudioFromBase64(base64: string): Promise<void> {
  // expo-file-system v19: dùng class File thay vì writeAsStringAsync/cacheDirectory
  const file = new File(Paths.cache, `ai_audio_${Date.now()}.mp3`);
  console.log("[audio] writing base64 to file:", file.uri, "| length:", base64.length);
  try {
    file.write(base64, { encoding: "base64" });
    console.log("[audio] file written OK, starting player");
  } catch (writeErr) {
    console.error("[audio] file.write failed:", writeErr);
    throw writeErr;
  }
  try {
    await playAudioFromUrl(file.uri);
    console.log("[audio] base64 playback done");
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
