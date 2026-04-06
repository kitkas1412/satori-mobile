import { ConversationPracticeScreen } from "@/features/speaking/screens/conversation-practice-screen";
import { useLocalSearchParams } from "expo-router";

export default function ConversationPractice() {
  const { conversationId, jlptLevel, language, title } = useLocalSearchParams<{
    conversationId?: string;
    jlptLevel?: string;
    language?: string;
    title: string;
  }>();

  return (
    <ConversationPracticeScreen
      conversationId={conversationId}
      jlptLevel={jlptLevel}
      language={language}
      title={title ?? ""}
    />
  );
}
