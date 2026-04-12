import { useRouter } from "expo-router";
import type { PracticeStatus } from "@/features/speaking/api";

export function useConversationNavigation() {
  const router = useRouter();

  function handleConversationPress(
    conversationId: string,
    practiceStatus: PracticeStatus,
  ) {
    if (practiceStatus === "COMPLETED") {
      router.push({
        pathname: "/conversation-feedback",
        params: { conversationId },
      });
    } else {
      router.push({
        pathname: "/conversation-detail",
        params: { conversationId },
      });
    }
  }

  return { handleConversationPress };
}
