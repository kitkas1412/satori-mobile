export interface EmailValidationRule {
  label: string;
  isValid: (email: string) => boolean;
}

export const emailValidationRules: EmailValidationRule[] = [
  {
    label: "Định dạng email hợp lệ",
    isValid: (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  },
  {
    label: "Không chứa khoảng trắng",
    isValid: (email) => !/\s/.test(email),
  },
  {
    label: "Có tên miền hợp lệ",
    isValid: (email) => {
      const domainPart = email.split("@")[1];
      return domainPart
        ? /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/.test(
            domainPart,
          )
        : false;
    },
  },
];

/**
 * Validates email against all rules
 * @param email - Email string to validate
 * @returns true if all rules pass, false otherwise
 */
export const validateEmail = (email: string): boolean => {
  if (!email || !email.trim()) return false;
  return emailValidationRules.every((rule) => rule.isValid(email.trim()));
};

/**
 * Gets validation status for each rule
 * @param email - Email string to validate
 * @returns Array of objects with label and validation status
 */
export const getEmailValidationStatus = (email: string) => {
  return emailValidationRules.map((rule) => ({
    label: rule.label,
    isValid: rule.isValid(email),
  }));
};
