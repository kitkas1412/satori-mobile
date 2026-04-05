// Gọi API nộp bài viết dưới dạng ảnh (POST /learner/assignments/:id/submit-writing).
// Dùng multipart/form-data để upload nhiều ảnh cùng lúc.

import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { SubmitWritingResponse } from "./assignment.types";

export async function submitWritingApi(
  assignmentId: string,
  images: { uri: string; name: string }[],
): Promise<SubmitWritingResponse> {
  const form = new FormData();

  // Thêm từng ảnh vào FormData.
  // Cần cast "as unknown as Blob" vì React Native dùng object {uri, name, type}
  // thay vì Blob chuẩn của trình duyệt, nhưng axios vẫn xử lý được.
  for (const img of images) {
    form.append("images", {
      uri: img.uri,
      name: img.name,
      type: "application/json",
    } as unknown as Blob);
  }

  const response = await api.post<ApiResponse<SubmitWritingResponse>>(
    `/learner/assignments/${assignmentId}/submit-writing`,
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data.data;
}
