import {
  validatePassword,
  getPasswordValidationStatus,
} from '@/features/authentication/utils/password-validation';

describe('validatePassword', () => {
  it('returns true when all 5 rules pass', () => {
    expect(validatePassword('Abcdef1!')).toBe(true);
  });

  it('returns false when missing uppercase letter', () => {
    expect(validatePassword('abcdef1!')).toBe(false);
  });

  it('returns false when missing lowercase letter', () => {
    expect(validatePassword('ABCDEF1!')).toBe(false);
  });

  it('returns false when missing a digit', () => {
    expect(validatePassword('Abcdefg!')).toBe(false);
  });

  it('returns false when missing a special character', () => {
    expect(validatePassword('Abcdef12')).toBe(false);
  });

  it('returns false when shorter than 8 characters', () => {
    expect(validatePassword('Ab1!')).toBe(false);
  });
});

describe('getPasswordValidationStatus', () => {
  it('returns 5 rules', () => {
    const status = getPasswordValidationStatus('Abcdef1!');
    expect(status).toHaveLength(5);
  });

  it('returns isValid: true for all rules with a strong password', () => {
    const status = getPasswordValidationStatus('Abcdef1!');
    expect(status.every((r) => r.isValid)).toBe(true);
  });

  it('marks the length rule false for a short password', () => {
    const status = getPasswordValidationStatus('Ab1!');
    expect(status[0].isValid).toBe(false);
  });

  it('marks the uppercase rule false when no uppercase letter', () => {
    const status = getPasswordValidationStatus('abcdefg1!');
    expect(status[1].isValid).toBe(false);
  });

  it('marks the lowercase rule false when no lowercase letter', () => {
    const status = getPasswordValidationStatus('ABCDEFG1!');
    expect(status[2].isValid).toBe(false);
  });

  it('marks the digit rule false when no digit', () => {
    const status = getPasswordValidationStatus('Abcdefgh!');
    expect(status[3].isValid).toBe(false);
  });

  it('marks the special character rule false when no special character', () => {
    const status = getPasswordValidationStatus('Abcdefg1');
    expect(status[4].isValid).toBe(false);
  });

  it('returns a label for every rule', () => {
    const status = getPasswordValidationStatus('Abcdef1!');
    status.forEach((rule) => {
      expect(typeof rule.label).toBe('string');
      expect(rule.label.length).toBeGreaterThan(0);
    });
  });
});
