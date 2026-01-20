import { IconSymbol } from "@/components/ui/icon-symbol";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function EmailScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  return (
    <ScrollView className="flex-1 bg-[#f6f7f9]">
      <View className="px-4 pt-4">
        <TouchableOpacity
          className="w-6 h-6 items-center justify-center"
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={24} color="#374155" />
        </TouchableOpacity>

        <Text className="mt-6 font-heading text-[17px] leading-[22px] text-black">
          Nhập địa chỉ email của bạn
        </Text>
        <Text className="mt-2 font-body text-[12px] text-black">
          Hãy sử dụng địa chỉ email đã được xác nhận với trung tâm
        </Text>

        <View className="mt-5 rounded-[8px] border border-[#00000061] px-[14px] py-[16.5px] flex-row items-center gap-[16px] bg-white">
          <IconSymbol name="envelope" size={24} color="#475569" />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="email@example.com"
            placeholderTextColor="rgba(0,0,0,0.6)"
            className="flex-1 font-body text-[16px] text-[#000000]"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      </View>

      <View className="absolute left-4 right-4 bottom-[42px]">
        <TouchableOpacity
          onPress={() => {
            /* TODO: submit email */
          }}
          className="rounded-[8px] bg-[#7b92ef] items-center justify-center px-[14px] py-[16.5px]"
          accessibilityRole="button"
          accessibilityLabel="Tiếp tục"
        >
          <Text className="font-heading text-[18px] text-[#f3f4f6]">
            Tiếp tục
          </Text>
        </TouchableOpacity>
      </View>

      {/* Home indicator spacing */}
      <View className="h-[34px]" />
    </ScrollView>
  );
}
