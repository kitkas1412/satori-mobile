import { useLocalSearchParams } from "expo-router";
import { QuizScreen } from "@/features/assignment/screens/quiz-screen";

export default function AssignmentQuiz() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <QuizScreen id={id ?? ""} />;
}
