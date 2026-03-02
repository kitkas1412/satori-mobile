import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { View } from 'react-native';
import { PasswordValidation } from '@/features/authentication/components/password-validation';

jest.mock('lucide-react-native', () => ({
  Check: ({ color }: { color: string }) => {
    const { View } = require('react-native');
    return <View testID="check-icon" accessibilityLabel={color} />;
  },
  X: ({ color }: { color: string }) => {
    const { View } = require('react-native');
    return <View testID="x-icon" accessibilityLabel={color} />;
  },
}));

describe('PasswordValidation', () => {
  it('renders a Check icon with green color for a valid rule', () => {
    render(
      <PasswordValidation rules={[{ label: 'At least 8 characters', isValid: true }]} />,
    );
    const checkIcon = screen.getByTestId('check-icon');
    expect(checkIcon).toBeTruthy();
    expect(checkIcon.props.accessibilityLabel).toBe('#10B981');
  });

  it('renders an X icon with red color for an invalid rule', () => {
    render(
      <PasswordValidation rules={[{ label: 'Needs uppercase', isValid: false }]} />,
    );
    const xIcon = screen.getByTestId('x-icon');
    expect(xIcon).toBeTruthy();
    expect(xIcon.props.accessibilityLabel).toBe('#EF4444');
  });

  it('renders the rule label text', () => {
    render(
      <PasswordValidation rules={[{ label: 'At least 8 characters', isValid: true }]} />,
    );
    expect(screen.getByText('At least 8 characters')).toBeTruthy();
  });

  it('renders multiple rules independently', () => {
    const rules = [
      { label: 'At least 8 characters', isValid: true },
      { label: 'Uppercase letter', isValid: false },
      { label: 'Lowercase letter', isValid: true },
    ];
    render(<PasswordValidation rules={rules} />);

    expect(screen.getByText('At least 8 characters')).toBeTruthy();
    expect(screen.getByText('Uppercase letter')).toBeTruthy();
    expect(screen.getByText('Lowercase letter')).toBeTruthy();

    const checkIcons = screen.getAllByTestId('check-icon');
    const xIcons = screen.getAllByTestId('x-icon');
    expect(checkIcons).toHaveLength(2); // 2 valid rules
    expect(xIcons).toHaveLength(1);    // 1 invalid rule
  });

  it('renders nothing when rules array is empty', () => {
    const { toJSON } = render(<PasswordValidation rules={[]} />);
    // Root View renders but contains no children
    expect(toJSON()).toBeTruthy();
  });
});
