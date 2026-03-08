import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { RoleplayMessage } from "./speaking.types";

export async function sendMessageApi(
  sessionId: string,
  content: string,
  audioUri?: string
): Promise<RoleplayMessage[]> {
  const formData = new FormData();

  const messagePart = JSON.stringify({ content, hintRequest: false });
  formData.append("message", {
    string: messagePart,
    type: "application/json",
    name: "message",
  } as unknown as Blob);

  if (audioUri) {
    const filename = audioUri.split("/").pop() ?? "recording.wav";
    const ext = filename.split(".").pop()?.toLowerCase();
    const mimeType =
      ext === "caf" ? "audio/x-caf" :
      ext === "wav" ? "audio/wav" :
      "audio/m4a";
    formData.append("audio", {
      uri: audioUri,
      type: mimeType,
      name: filename,
    } as unknown as Blob);
  }

  const response = await api.post<ApiResponse<RoleplayMessage[]>>(
    `/learner/roleplay/sessions/${sessionId}/messages`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  const data = response.data.data;
  return Array.isArray(data) ? data : [data];
}
