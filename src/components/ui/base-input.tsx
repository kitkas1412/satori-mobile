import React, { forwardRef, ReactNode } from "react";
import {
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export interface BaseInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string | boolean;
  label?: string;
  leftIcon?: ReactNode;
  rightAccessory?: ReactNode;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  autoFocus?: boolean;
  editable?: boolean;
  onSubmitEditing?: () => void;
  returnKeyType?: ReturnKeyTypeOptions;
  containerClassName?: string;
  inputClassName?: string;
}

export const BaseInput = forwardRef<TextInput, BaseInputProps>(
  (
    {
      value,
      onChangeText,
      onBlur,
      placeholder,
      error,
      label,
      leftIcon,
      rightAccessory,
      secureTextEntry = false,
      keyboardType = "default",
      autoCapitalize = "none",
      autoCorrect = false,
      autoFocus = false,
      editable = true,
      onSubmitEditing,
      returnKeyType,
      containerClassName = "",
      inputClassName = "",
    },
    ref,
  ) => {
    const hasError = Boolean(error);
    const errorMessage = typeof error === "string" ? error : undefined;

    return (
      <>
        {label && (
          <Text className="mt-6 font-heading text-lg text-black"></Text>
        )}

        <TouchableOpacity
          activeOpacity={1}
          onPress={() => (ref as any)?.current?.focus()}
          className={`${label ? "mt-2" : "mt-5"} rounded-[8px] border ${hasError ? "border-error-default" : "border-[rgba(0,0,0,0.38)]"} px-[14px] py-[16.5px] flex-row items-center gap-[16px] bg-white ${containerClassName}`}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          {leftIcon && <View className="flex-shrink-0">{leftIcon}</View>}

          <TextInput
            ref={ref}
            value={value}
            onChangeText={onChangeText}
            onBlur={onBlur}
            placeholder={placeholder}
            placeholderTextColor="rgba(0,0,0,0.6)"
            className={`flex-1 font-body text-base text-typography-black ${inputClassName}`}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            autoFocus={autoFocus}
            editable={editable}
            onSubmitEditing={onSubmitEditing}
            returnKeyType={returnKeyType}
          />

          {rightAccessory && (
            <View className="flex-shrink-0">{rightAccessory}</View>
          )}
        </TouchableOpacity>

        {errorMessage && (
          <Text className="mt-1 ml-1 font-body text-xs text-error-default">
            {errorMessage}
          </Text>
        )}
      </>
    );
  },
);

BaseInput.displayName = "BaseInput";
