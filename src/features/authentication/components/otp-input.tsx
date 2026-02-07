import React, { useEffect, useRef, useState } from "react";
import { TextInput, View } from "react-native";

interface OTPInputProps {
  length?: number;
  onComplete?: (otp: string) => void;
  value?: string;
  onChangeText?: (otp: string) => void;
  autoFocus?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  onComplete,
  value = "",
  onChangeText,
  autoFocus = false,
}) => {
  const [otp, setOtp] = useState<string[]>(
    value.split("").concat(Array(length - value.length).fill("")),
  );
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (autoFocus) {
      inputRefs.current[0]?.focus();
    }
  }, [autoFocus]);

  const handleChange = (text: string, index: number) => {
    // Only allow numbers
    if (text && !/^\d+$/.test(text)) return;

    const newOtp = [...otp];
    newOtp[index] = text.slice(-1); // Only take the last character
    setOtp(newOtp);

    const otpString = newOtp.join("");
    onChangeText?.(otpString);

    // Auto focus next input
    if (text && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Call onComplete when all digits are filled
    if (otpString.length === length) {
      onComplete?.(otpString);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace to focus previous input
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="flex-row gap-[12px] justify-center">
      {Array.from({ length }).map((_, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref;
          }}
          className="w-12 h-14 bg-white border-[1.85px] border-[#E5E7EB] rounded-lg text-center text-lg font-heading"
          value={otp[index]}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
          autoComplete="one-time-code"
        />
      ))}
    </View>
  );
};
