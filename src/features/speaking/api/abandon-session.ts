import { api } from "@/lib/axios";

export async function abandonSessionApi(sessionId: string): Promise<void> {
  await api.post(`/learner/roleplay/sessions/${sessionId}/abandon`);
}
