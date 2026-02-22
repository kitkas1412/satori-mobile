import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { PasswordInput } from '@/features/authentication/components/password-input';

jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: ({ name, color }: { name: string; color: string }) => {
    const { View } = require('react-native');
    return <View testID={`icon-${name}`} accessibilityLabel={color} />;
  },
}));

describe('PasswordInput', () => {
  it('renders with the default placeholder text', () => {
    render(<PasswordInput value="" onChangeText={jest.fn()} />);
    expect(screen.getByPlaceholderText('Nhập mật khẩu của bạn')).toBeTruthy();
  });

  it('renders with a custom placeholder', () => {
    render(
      <PasswordInput
        value=""
        onChangeText={jest.fn()}
        placeholder="Enter password here"
      />,
    );
    expect(screen.getByPlaceholderText('Enter password here')).toBeTruthy();
  });

  it('renders the label when the label prop is provided', () => {
    render(<PasswordInput value="" onChangeText={jest.fn()} label="Password" />);
    expect(screen.getByText('Password')).toBeTruthy();
  });

  it('hides password text by default (secureTextEntry: true)', () => {
    render(<PasswordInput value="" onChangeText={jest.fn()} />);
    const input = screen.UNSAFE_getByProps({ secureTextEntry: true });
    expect(input).toBeTruthy();
  });

  it('reveals password when the eye icon is pressed', () => {
    render(<PasswordInput value="" onChangeText={jest.fn()} />);
    const eyeOffIcon = screen.getByTestId('icon-visibility-off');
    fireEvent.press(eyeOffIcon);
    const input = screen.UNSAFE_getByProps({ secureTextEntry: false });
    expect(input).toBeTruthy();
  });

  it('hides password again when the eye icon is pressed a second time', () => {
    render(<PasswordInput value="" onChangeText={jest.fn()} />);

    // First press: show password
    fireEvent.press(screen.getByTestId('icon-visibility-off'));
    expect(screen.UNSAFE_getByProps({ secureTextEntry: false })).toBeTruthy();

    // Second press: hide password again
    fireEvent.press(screen.getByTestId('icon-visibility'));
    expect(screen.UNSAFE_getByProps({ secureTextEntry: true })).toBeTruthy();
  });

  it('shows the default lock icon color when there is no error', () => {
    render(<PasswordInput value="" onChangeText={jest.fn()} />);
    const icon = screen.getByTestId('icon-lock-outline');
    expect(icon.props.accessibilityLabel).toBe('rgba(0,0,0,0.6)');
  });

  it('shows the error lock icon color when error is true', () => {
    render(<PasswordInput value="" onChangeText={jest.fn()} error={true} />);
    const icon = screen.getByTestId('icon-lock-outline');
    expect(icon.props.accessibilityLabel).toBe('#ef4444');
  });

  it('calls onChangeText with the typed text', () => {
    const onChangeText = jest.fn();
    render(<PasswordInput value="" onChangeText={onChangeText} />);
    fireEvent.changeText(
      screen.getByPlaceholderText('Nhập mật khẩu của bạn'),
      'mypassword',
    );
    expect(onChangeText).toHaveBeenCalledWith('mypassword');
  });
});
