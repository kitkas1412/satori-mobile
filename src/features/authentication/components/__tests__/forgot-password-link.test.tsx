import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ForgotPasswordLink } from '@/features/authentication/components/forgot-password-link';

describe('ForgotPasswordLink', () => {
  it('renders the link text', () => {
    render(<ForgotPasswordLink onPress={jest.fn()} />);
    expect(screen.getByText('Quên mật khẩu??')).toBeTruthy();
  });

  it('calls onPress when the link is tapped', () => {
    const onPress = jest.fn();
    render(<ForgotPasswordLink onPress={onPress} />);
    fireEvent.press(screen.getByText('Quên mật khẩu??'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress before it is tapped', () => {
    const onPress = jest.fn();
    render(<ForgotPasswordLink onPress={onPress} />);
    expect(onPress).not.toHaveBeenCalled();
  });
});
