import { ResetPasswordOTPScreen } from "@/features/authentication/screens";
import { useLocalSearchParams } from "expo-router";

export default function ResetPasswordOTP() {
  const { email } = useLocalSearchParams<{ email?: string }>();

  return <ResetPasswordOTPScreen email={email} />;
}
