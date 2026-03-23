// Hook đo tổng thời gian làm bài trắc nghiệm kể từ khi dữ liệu sẵn sàng.

import { useEffect, useRef } from "react";

export function useQuizTimer(isReady: boolean) {
  const startedAtRef = useRef<number>(0);

  // Ghi nhận thời điểm bắt đầu khi dữ liệu bài tập vừa được tải xong.
  // Kiểm tra startedAtRef.current === 0 để chỉ ghi nhận một lần duy nhất,
  // tránh reset timer nếu component re-render sau khi isReady đã là true.
  useEffect(() => {
    if (isReady && startedAtRef.current === 0) {
      startedAtRef.current = Date.now();
    }
  }, [isReady]);

  // Tính tổng thời gian làm bài và thời gian trung bình mỗi câu.
  // Dùng Math.max(1, ...) để đảm bảo timeSpentSeconds luôn >= 1 giây.
  function getTimeStats(total: number) {
    const timeSpentSeconds = Math.max(
      1,
      Math.round((Date.now() - startedAtRef.current) / 1000),
    );
    const timePerQuestion = Math.round(timeSpentSeconds / total);
    return { timeSpentSeconds, timePerQuestion };
  }

  return { getTimeStats };
}
