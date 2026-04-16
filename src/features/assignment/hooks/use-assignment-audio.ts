// Hook quản lý playback audio cho bài tập.
// Tạo player từ URL, theo dõi tiến trình qua sự kiện playbackStatusUpdate,
// và dọn dẹp player khi unmount để tránh rò rỉ bộ nhớ.

import { useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { createAudioPlayer } from "expo-audio";
import type { AudioPlayer } from "expo-audio";

interface UseAssignmentAudioReturn {
  isPlaying: boolean;
  progress: number; // 0–1, dùng trực tiếp cho ProgressBar
  currentTime: number; // giây
  duration: number; // giây
  toggle: () => void; // phát nếu đang dừng, dừng nếu đang phát
  stop: () => void; // dừng và về đầu
}

export function useAssignmentAudio(
  audioUrl: string | null,
): UseAssignmentAudioReturn {
  const playerRef = useRef<AudioPlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!audioUrl) return;

    const player = createAudioPlayer(audioUrl);
    playerRef.current = player;

    const subscription = player.addListener("playbackStatusUpdate", (status) => {
      setCurrentTime(status.currentTime ?? 0);
      setDuration(status.duration ?? 0);
      setIsPlaying(status.playing ?? false);
      if (status.didJustFinish) {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    });

    // Pause khi app vào background, resume khi trở lại foreground.
    // Dùng ref để đọc trạng thái tức thời bên trong callback (state update là async).
    const wasPlayingRef = { current: false };
    const appStateSubscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "background" || nextState === "inactive") {
        wasPlayingRef.current = playerRef.current?.playing ?? false;
        if (wasPlayingRef.current) playerRef.current?.pause();
      } else if (nextState === "active") {
        if (wasPlayingRef.current) playerRef.current?.play();
      }
    });

    return () => {
      subscription.remove();
      appStateSubscription.remove();
      playerRef.current?.pause();
      player.remove();
      playerRef.current = null;
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
    };
  }, [audioUrl]);

  function toggle() {
    const player = playerRef.current;
    if (!player) return;
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  }

  function stop() {
    const player = playerRef.current;
    if (!player) return;
    player.pause();
    player.seekTo(0);
  }

  return {
    isPlaying,
    progress: duration > 0 ? currentTime / duration : 0,
    currentTime,
    duration,
    toggle,
    stop,
  };
}
