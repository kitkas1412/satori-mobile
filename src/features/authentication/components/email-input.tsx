import { BaseInput } from "@/components/ui/base-input";
import { MaterialIcons } from "@expo/vector-icons";
import React, { forwardRef } from "react";
import { ReturnKeyTypeOptions, TextInput } from "react-native";

interface EmailInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  error?: string;
  hasLoginError?: boolean;
  autoFocus?: boolean;
  onSubmitEditing?: () => void;
  returnKeyType?: ReturnKeyTypeOptions;
}

export const EmailInput = forwardRef<TextInput, EmailInputProps>(
  (
    {
      value,
      onChangeText,
      onBlur,
      error,
      hasLoginError,
      autoFocus = false,
      onSubmitEditing,
      returnKeyType,
    },
    ref,
  ) => {
    const hasError = Boolean(error || hasLoginError);
    const displayError = error || (hasLoginError ? true : undefined);

    return (
      <BaseInput
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        placeholder="Nhập email của bạn"
        error={displayError}
        leftIcon={
          <MaterialIcons
            name="mail-outline"
            size={24}
            color={hasError ? "hsl(0, 84%, 60%)" : "hsla(0, 0%, 0%, 0.6)"}
          />
        }
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus={autoFocus}
        onSubmitEditing={onSubmitEditing}
        returnKeyType={returnKeyType}
      />
    );
  },
);

EmailInput.displayName = "EmailInput";
