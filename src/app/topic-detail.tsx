import { TopicDetailScreen } from "@/features/speaking/screens";
import { useLocalSearchParams } from "expo-router";

export default function TopicDetail() {
  const { topicId } = useLocalSearchParams<{ topicId: string }>();
  return <TopicDetailScreen topicId={topicId ?? ""} />;
}
