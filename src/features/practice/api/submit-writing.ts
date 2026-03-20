import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { SubmitWritingResponse } from "./practice.types";

export async function submitWritingApi(
  assignmentId: string,
  images: { uri: string; name: string }[],
): Promise<SubmitWritingResponse> {
  const form = new FormData();

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
