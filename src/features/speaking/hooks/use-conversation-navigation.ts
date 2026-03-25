import { useRouter } from "expo-router";

export function useConversationNavigation() {
  const router = useRouter();

  function handleConversationPress(conversationId: string) {
    router.push({
      pathname: "/conversation-detail",
      params: { conversationId },
    });
  }

  return { handleConversationPress };
}
