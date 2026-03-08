import { ConversationPracticeScreen } from "@/features/speaking/screens/conversation-practice-screen";
import { useRouter } from "expo-router";

export default function ConversationPractice() {
  const router = useRouter();

  return (
    <ConversationPracticeScreen
      onClose={() => router.back()}
      onEndSession={() => router.back()}
    />
  );
}
