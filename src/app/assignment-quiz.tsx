import { useLocalSearchParams } from "expo-router";
import { QuizScreen } from "@/features/practice/screens/quiz-screen";

export default function AssignmentQuiz() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <QuizScreen id={id ?? ""} />;
}
