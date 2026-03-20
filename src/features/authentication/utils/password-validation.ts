export interface ValidationRule {
  label: string;
  isValid: (password: string) => boolean;
}

export const passwordValidationRules: ValidationRule[] = [
  {
    label: "Mật khẩu trên 8 ký tự",
    isValid: (password) => password.length >= 8,
  },
  {
    label: "Chữ cái viết hoa",
    isValid: (password) => /[A-Z]/.test(password),
  },
  {
    label: "Chữ cái thường",
    isValid: (password) => /[a-z]/.test(password),
  },
  {
    label: "Chữ số",
    isValid: (password) => /[0-9]/.test(password),
  },
  {
    label: "Ký tự đặc biệt (!@#$,...)",
    isValid: (password) => /[!@#$%^&*(),.?":{}|<>]/.test(password),
  },
];

/**
 * Validates password against all rules
 * @param password - Password string to validate
 * @returns true if all rules pass, false otherwise
 */
export const validatePassword = (password: string): boolean => {
  return passwordValidationRules.every((rule) => rule.isValid(password));
};

/**
 * Gets validation status for each rule
 * @param password - Password string to validate
 * @returns Array of objects with label and validation status
 */
export const getPasswordValidationStatus = (password: string) => {
  return passwordValidationRules.map((rule) => ({
    label: rule.label,
    isValid: rule.isValid(password),
  }));
};
