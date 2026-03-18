import { useState } from "react";

export function useQuizNavigation(total: number) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === total - 1;

  function handleBack() {
    if (!isFirst) setCurrentIndex((i) => i - 1);
  }

  function handleNext() {
    if (currentIndex < total - 1) setCurrentIndex((i) => i + 1);
  }

  return { currentIndex, isFirst, isLast, handleBack, handleNext };
}
