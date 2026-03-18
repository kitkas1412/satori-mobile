import { useEffect, useRef } from "react";

export function useQuizTimer(isReady: boolean) {
  const startedAtRef = useRef<number>(0);

  useEffect(() => {
    if (isReady && startedAtRef.current === 0) {
      startedAtRef.current = Date.now();
    }
  }, [isReady]);

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
