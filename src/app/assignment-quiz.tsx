import { useLocalSearchParams } from "expo-router";
import { QuizScreen } from "@/features/assignment/screens";

export default function AssignmentQuiz() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <QuizScreen id={id ?? ""} />;
}
