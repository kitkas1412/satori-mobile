// Hook xác định section đầu tiên (có orderIndex nhỏ nhất) còn topic chưa được luyện tập.
// Dùng để highlight section cần học tiếp theo trên màn hình SpeakingScreen.

import { useCallback, useRef, useState } from "react";

/**
 * Theo dõi section đầu tiên chưa được luyện tập để hiển thị viền highlight.
 *
 * Cách hoạt động:
 * - Mỗi TopicSection sau khi load topics sẽ gọi `handleHasUnpracticed` nếu có topic chưa luyện
 * - Hook so sánh `orderIndex` để chỉ giữ lại section có thứ tự nhỏ nhất
 * - Dùng `useRef` để lưu orderIndex nhỏ nhất hiện tại mà không gây re-render thừa
 *   (chỉ re-render state khi thực sự tìm thấy section "nhỏ hơn")
 */
export function useFirstUnpracticedSection() {
  const [firstUnpracticedSectionId, setFirstUnpracticedSectionId] = useState<
    string | null
  >(null);

  // Dùng ref thay vì state để so sánh orderIndex mà không trigger re-render
  const firstUnpracticedOrderIndexRef = useRef<number>(Infinity);

  /**
   * Được gọi bởi TopicSection khi section đó có ít nhất một topic chưa luyện.
   * Chỉ cập nhật nếu section này có orderIndex nhỏ hơn section đã ghi nhận trước đó.
   *
   * @param sectionId - ID của section báo cáo
   * @param orderIndex - Thứ tự hiển thị của section trên màn hình
   */
  const handleHasUnpracticed = useCallback(
    (sectionId: string, orderIndex: number) => {
      if (orderIndex < firstUnpracticedOrderIndexRef.current) {
        firstUnpracticedOrderIndexRef.current = orderIndex;
        setFirstUnpracticedSectionId(sectionId);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    firstUnpracticedOrderIndexRef.current = Infinity;
    setFirstUnpracticedSectionId(null);
  }, []);

  return { firstUnpracticedSectionId, handleHasUnpracticed, reset };
}
