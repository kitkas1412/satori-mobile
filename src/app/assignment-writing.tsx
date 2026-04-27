import { useLocalSearchParams } from "expo-router";
import { WritingScreen } from "@/features/assignment/screens";

export default function AssignmentWriting() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <WritingScreen id={id ?? ""} />;
}
