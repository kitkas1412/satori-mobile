// Hook quản lý playback audio cho bài tập.
// Tạo player từ URL, theo dõi tiến trình qua sự kiện playbackStatusUpdate,
// và dọn dẹp player khi unmount để tránh rò rỉ bộ nhớ.

import { useEffect, useRef, useState } from "react";
import { createAudioPlayer } from "expo-audio";
import type { AudioPlayer } from "expo-audio";

interface UseAssignmentAudioReturn {
  isPlaying: boolean;
  progress: number; // 0–1, dùng trực tiếp cho ProgressBar
  currentTime: number; // giây
  duration: number; // giây
  toggle: () => void; // phát nếu đang dừng, dừng nếu đang phát
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

    return () => {
      subscription.remove();
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

  return {
    isPlaying,
    progress: duration > 0 ? currentTime / duration : 0,
    currentTime,
    duration,
    toggle,
  };
}
