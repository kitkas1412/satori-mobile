// Gọi API đánh giá bài viết bằng AI (POST /learner/assignments/writing/evaluate).
// Dùng multipart/form-data với 2 keys:
//   - "data": JSON file với Content-Type application/json chứa assignmentId và prompt
//   - "images": danh sách file ảnh bài làm

import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { EvaluateWritingResponse } from "./practice.types";

export async function evaluateWritingApi(
  assignmentId: string,
  prompt: string,
  images: { uri: string; name: string }[],
): Promise<EvaluateWritingResponse> {
  const form = new FormData();

  const dataPart = JSON.stringify({ assignmentId, prompt });
  form.append("data", {
    string: dataPart,
    type: "application/json",
    name: "data",
  } as unknown as Blob);

  // Key "images" — cùng pattern với submit-writing.ts
  for (const img of images) {
    form.append("images", {
      uri: img.uri,
      name: img.name,
      type: "application/json",
    } as unknown as Blob);
  }

  const response = await api.post<ApiResponse<EvaluateWritingResponse>>(
    "/learner/assignments/writing/evaluate",
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data.data;
}
