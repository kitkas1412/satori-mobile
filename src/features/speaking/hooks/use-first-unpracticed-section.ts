// Hook xác định section đầu tiên (có orderIndex nhỏ nhất) còn topic chưa được luyện tập,
// đồng thời theo dõi tới khi mọi section trong tập kỳ vọng đã báo cáo xong.
// Dùng để highlight section cần học tiếp theo và để screen biết khi nào sẵn sàng tắt overlay.

import { useCallback, useRef, useState } from "react";

/**
 * Theo dõi section đầu tiên chưa được luyện tập + trạng thái "đã resolve" của tập section kỳ vọng.
 *
 * Cách hoạt động:
 * - Mỗi TopicSection sau khi load topics gọi `handleSectionResolved` (dù còn unpracticed hay không)
 * - Hook so sánh `orderIndex` để chỉ giữ lại section có thứ tự nhỏ nhất còn unpracticed
 * - Hook tích lũy danh sách sectionIds đã báo cáo; khi bao phủ trọn `expectedSectionIds`,
 *   `isResolved` chuyển true (và sticky cho đến khi `reset()`)
 * - Dùng `useRef` cho phần so sánh để tránh re-render thừa
 *
 * @param expectedSectionIds Danh sách sectionId cần đợi resolve (thường là sections trang đầu)
 */
export function useFirstUnpracticedSection(expectedSectionIds: string[]) {
  const [firstUnpracticedSectionId, setFirstUnpracticedSectionId] = useState<
    string | null
  >(null);
  const [isResolved, setIsResolved] = useState(false);

  // Dùng ref thay vì state để so sánh orderIndex mà không trigger re-render
  const firstUnpracticedOrderIndexRef = useRef<number>(Infinity);
  // Tập sectionIds đã báo cáo resolved trong phiên hiện tại
  const resolvedIdsRef = useRef<Set<string>>(new Set());

  /**
   * Được gọi bởi TopicSection sau khi conversations của nó đã loaded,
   * dù section còn unpracticed hay đã COMPLETED hết.
   *
   * @param sectionId - ID của section báo cáo
   * @param orderIndex - Thứ tự hiển thị của section trên màn hình
   * @param hasUnpracticed - Section còn ít nhất một topic chưa COMPLETED?
   */
  const handleSectionResolved = useCallback(
    (sectionId: string, orderIndex: number, hasUnpracticed: boolean) => {
      if (
        hasUnpracticed &&
        orderIndex < firstUnpracticedOrderIndexRef.current
      ) {
        firstUnpracticedOrderIndexRef.current = orderIndex;
        setFirstUnpracticedSectionId(sectionId);
      }

      if (!resolvedIdsRef.current.has(sectionId)) {
        resolvedIdsRef.current.add(sectionId);
        if (
          expectedSectionIds.length > 0 &&
          expectedSectionIds.every((id) => resolvedIdsRef.current.has(id))
        ) {
          setIsResolved(true);
        }
      }
    },
    [expectedSectionIds],
  );

  const reset = useCallback(() => {
    firstUnpracticedOrderIndexRef.current = Infinity;
    resolvedIdsRef.current = new Set();
    setFirstUnpracticedSectionId(null);
    setIsResolved(false);
  }, []);

  return {
    firstUnpracticedSectionId,
    isResolved,
    handleSectionResolved,
    reset,
  };
}
