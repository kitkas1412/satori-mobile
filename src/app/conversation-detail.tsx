import { ConversationDetailScreen } from "@/features/speaking/screens";
import { useLocalSearchParams } from "expo-router";

export default function ConversationDetail() {
  const { conversationId } = useLocalSearchParams<{ conversationId: string }>();
  return <ConversationDetailScreen conversationId={conversationId ?? ""} />;
}
