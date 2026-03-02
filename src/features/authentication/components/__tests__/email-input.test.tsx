import { EmailInput } from "@/features/authentication/components/email-input";
import { fireEvent, render, screen } from "@testing-library/react-native";
import React from "react";

jest.mock("@expo/vector-icons", () => ({
  MaterialIcons: ({ name, color }: { name: string; color: string }) => {
    const { View } = require("react-native");
    return <View testID={`icon-${name}`} accessibilityLabel={color} />;
  },
}));

describe("EmailInput", () => {
  it("renders with the correct placeholder text", () => {
    render(<EmailInput value="" onChangeText={jest.fn()} onBlur={jest.fn()} />);
    expect(screen.getByPlaceholderText("Nhập email của bạn")).toBeTruthy();
  });

  it("calls onChangeText with the typed text", () => {
    const onChangeText = jest.fn();
    render(
      <EmailInput value="" onChangeText={onChangeText} onBlur={jest.fn()} />,
    );
    fireEvent.changeText(
      screen.getByPlaceholderText("Nhập email của bạn"),
      "learner1@test.satori.com",
    );
    expect(onChangeText).toHaveBeenCalledWith("learner1@test.satori.com");
  });

  it("calls onBlur when the input loses focus", () => {
    const onBlur = jest.fn();
    render(<EmailInput value="" onChangeText={jest.fn()} onBlur={onBlur} />);
    fireEvent(screen.getByPlaceholderText("Nhập email của bạn"), "blur");
    expect(onBlur).toHaveBeenCalled();
  });

  it("shows the default icon color when there is no error", () => {
    render(<EmailInput value="" onChangeText={jest.fn()} onBlur={jest.fn()} />);
    const icon = screen.getByTestId("icon-mail-outline");
    expect(icon.props.accessibilityLabel).toBe("rgba(0,0,0,0.6)");
  });

  it("shows error icon color when the error prop is a string", () => {
    render(
      <EmailInput
        value=""
        onChangeText={jest.fn()}
        onBlur={jest.fn()}
        error="Invalid email address"
      />,
    );
    const icon = screen.getByTestId("icon-mail-outline");
    expect(icon.props.accessibilityLabel).toBe("#ef4444");
  });

  it("renders the error message text when error is a string", () => {
    render(
      <EmailInput
        value=""
        onChangeText={jest.fn()}
        onBlur={jest.fn()}
        error="Invalid email address"
      />,
    );
    expect(screen.getByText("Invalid email address")).toBeTruthy();
  });

  it("shows error icon color when hasLoginError is true", () => {
    render(
      <EmailInput
        value=""
        onChangeText={jest.fn()}
        onBlur={jest.fn()}
        hasLoginError
      />,
    );
    const icon = screen.getByTestId("icon-mail-outline");
    expect(icon.props.accessibilityLabel).toBe("#ef4444");
  });
});
