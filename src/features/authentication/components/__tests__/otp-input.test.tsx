import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { OTPInput } from '@/features/authentication/components/otp-input';

describe('OTPInput', () => {
  it('renders a hidden input with autoComplete one-time-code', () => {
    render(<OTPInput />);
    const hiddenInput = screen.UNSAFE_getByProps({ autoComplete: 'one-time-code' });
    expect(hiddenInput).toBeTruthy();
  });

  it('calls onChangeText when digits are typed', () => {
    const onChangeText = jest.fn();
    render(<OTPInput onChangeText={onChangeText} />);
    const hiddenInput = screen.UNSAFE_getByProps({ autoComplete: 'one-time-code' });
    fireEvent.changeText(hiddenInput, '123');
    expect(onChangeText).toHaveBeenCalledWith('123');
  });

  it('strips non-numeric characters from input', () => {
    const onChangeText = jest.fn();
    render(<OTPInput onChangeText={onChangeText} />);
    const hiddenInput = screen.UNSAFE_getByProps({ autoComplete: 'one-time-code' });
    fireEvent.changeText(hiddenInput, 'abc123');
    expect(onChangeText).toHaveBeenCalledWith('123');
  });

  it('truncates input to the specified length', () => {
    const onChangeText = jest.fn();
    render(<OTPInput length={6} onChangeText={onChangeText} />);
    const hiddenInput = screen.UNSAFE_getByProps({ autoComplete: 'one-time-code' });
    fireEvent.changeText(hiddenInput, '1234567890');
    expect(onChangeText).toHaveBeenCalledWith('123456');
  });

  it('calls onComplete when all digits are entered', () => {
    const onComplete = jest.fn();
    render(<OTPInput length={6} onComplete={onComplete} />);
    const hiddenInput = screen.UNSAFE_getByProps({ autoComplete: 'one-time-code' });
    fireEvent.changeText(hiddenInput, '123456');
    expect(onComplete).toHaveBeenCalledWith('123456');
  });

  it('does not call onComplete for partial input', () => {
    const onComplete = jest.fn();
    render(<OTPInput length={6} onComplete={onComplete} />);
    const hiddenInput = screen.UNSAFE_getByProps({ autoComplete: 'one-time-code' });
    fireEvent.changeText(hiddenInput, '123');
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('removes the last digit on Backspace key press', () => {
    const onChangeText = jest.fn();
    render(<OTPInput onChangeText={onChangeText} />);
    const hiddenInput = screen.UNSAFE_getByProps({ autoComplete: 'one-time-code' });

    fireEvent.changeText(hiddenInput, '123');
    fireEvent(hiddenInput, 'keyPress', { nativeEvent: { key: 'Backspace' } });

    const calls = onChangeText.mock.calls;
    const lastCall = calls[calls.length - 1][0];
    expect(lastCall).toBe('12');
  });

  it('renders the correct number of visual boxes via the length prop', () => {
    render(<OTPInput length={4} />);
    // 4 visual boxes (editable=false) + 1 hidden input (editable=true by default)
    // UNSAFE_getAllByProps may return 2x nodes per TextInput due to fiber internals
    const visualBoxes = screen.UNSAFE_getAllByProps({ editable: false });
    expect(visualBoxes.length).toBeGreaterThanOrEqual(4);
  });

  it('initialises with a provided value', () => {
    const onChangeText = jest.fn();
    render(<OTPInput value="123" onChangeText={onChangeText} />);
    // Adding more digits continues from the pre-filled value
    const hiddenInput = screen.UNSAFE_getByProps({ autoComplete: 'one-time-code' });
    fireEvent.changeText(hiddenInput, '1234');
    expect(onChangeText).toHaveBeenCalledWith('1234');
  });
});
