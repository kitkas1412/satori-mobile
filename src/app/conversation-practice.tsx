import { ConversationPracticeScreen } from "@/features/speaking/screens/conversation-practice-screen";
import { useLocalSearchParams } from "expo-router";

export default function ConversationPractice() {
  const { topicId, title } = useLocalSearchParams<{ topicId: string; title: string }>();

  return (
    <ConversationPracticeScreen
      topicId={topicId ?? ""}
      title={title ?? ""}
    />
  );
}
