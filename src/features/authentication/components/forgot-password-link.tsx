import { TextLink } from "@/components/ui/text-link";
import React from "react";

interface ForgotPasswordLinkProps {
  onPress: () => void;
}

export const ForgotPasswordLink: React.FC<ForgotPasswordLinkProps> = ({
  onPress,
}) => {
  return <TextLink text="Quên mật khẩu??" onPress={onPress} />;
};
