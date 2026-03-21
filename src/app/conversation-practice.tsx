import { ConversationPracticeScreen } from "@/features/speaking/screens/conversation-practice-screen";
import { useLocalSearchParams } from "expo-router";

export default function ConversationPractice() {
  const { topicId, jlptLevel, language, title } = useLocalSearchParams<{
    topicId?: string;
    jlptLevel?: string;
    language?: string;
    title: string;
  }>();

  return (
    <ConversationPracticeScreen
      topicId={topicId}
      jlptLevel={jlptLevel}
      language={language}
      title={title ?? ""}
    />
  );
}
