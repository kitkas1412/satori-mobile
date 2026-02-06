import { MaterialIcons } from "@expo/vector-icons";
import React, { forwardRef } from "react";
import { Text, TextInput, TouchableOpacity } from "react-native";

interface EmailInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  error?: string;
  hasLoginError?: boolean;
  autoFocus?: boolean;
}

export const EmailInput = forwardRef<TextInput, EmailInputProps>(
  (
    { value, onChangeText, onBlur, error, hasLoginError, autoFocus = false },
    ref,
  ) => {
    const hasError = Boolean(error || hasLoginError);

    return (
      <>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => (ref as any)?.current?.focus()}
          className={`mt-5 rounded-[8px] border ${hasError ? "border-red-500" : "border-[rgba(0,0,0,0.38)]"} px-[14px] py-[16.5px] flex-row items-center gap-[16px] bg-white`}
        >
          <MaterialIcons
            name="mail-outline"
            size={24}
            color={hasError ? "#ef4444" : "rgba(0,0,0,0.6)"}
          />
          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            onBlur={onBlur}
            placeholder="Nhập email của bạn"
            placeholderTextColor="rgba(0,0,0,0.6)"
            className="flex-1 font-body text-[16px] text-typography-black"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus={autoFocus}
          />
        </TouchableOpacity>

        {error ? (
          <Text className="mt-1 ml-1 font-body text-[12px] text-error-default">
            {error}
          </Text>
        ) : null}
      </>
    );
  },
);

EmailInput.displayName = "EmailInput";
