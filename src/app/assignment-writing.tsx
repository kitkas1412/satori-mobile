import { useLocalSearchParams } from "expo-router";
import { WritingScreen } from "@/features/practice/screens/writing-screen";

export default function AssignmentWriting() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <WritingScreen id={id ?? ""} />;
}
