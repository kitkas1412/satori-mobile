import {
  getEmailValidationStatus,
  validateEmail,
} from "@/features/authentication/utils/email-validation";

describe("validateEmail", () => {
  it("returns false for empty string", () => {
    expect(validateEmail("")).toBe(false);
  });

  it("returns false for whitespace-only string", () => {
    expect(validateEmail("   ")).toBe(false);
  });

  it("returns true for valid email", () => {
    expect(validateEmail("learner1@test.satori.com")).toBe(true);
  });

  it("returns true for email with leading/trailing spaces (trimmed before validating)", () => {
    expect(validateEmail("  learner1@test.satori.com  ")).toBe(true);
  });

  it("returns false for email without @", () => {
    expect(validateEmail("learner1test.satori.com")).toBe(false);
  });

  it("returns false for email with space in the middle", () => {
    expect(validateEmail("learner1 @test.satori.com")).toBe(false);
  });

  it("returns false for email with invalid domain starting with -", () => {
    expect(validateEmail("learner1@-test.satori.com")).toBe(false);
  });

  it("returns false for email longer than 255 characters", () => {
    const longLocal = "a".repeat(250);
    const longEmail = `${longLocal}@b.com`; // 250 + 6 = 256 chars
    expect(longEmail.length).toBeGreaterThan(255);
    expect(validateEmail(longEmail)).toBe(false);
  });
});

describe("getEmailValidationStatus", () => {
  it("returns 4 rules", () => {
    const status = getEmailValidationStatus("learner1@test.satori.com");
    expect(status).toHaveLength(4);
  });

  it("returns isValid: true for all rules with a valid email", () => {
    const status = getEmailValidationStatus("learner1@test.satori.com");
    expect(status.every((r) => r.isValid)).toBe(true);
  });

  it("does NOT trim input — email with leading space fails the no-spaces rule", () => {
    const status = getEmailValidationStatus(" learner1@test.satori.com");
    const noSpacesRule = status[1]; // "Không chứa khoảng trắng"
    expect(noSpacesRule.isValid).toBe(false);
  });

  it("returns a label for every rule", () => {
    const status = getEmailValidationStatus("learner1@test.satori.com");
    status.forEach((rule) => {
      expect(typeof rule.label).toBe("string");
      expect(rule.label.length).toBeGreaterThan(0);
    });
  });

  it("marks the format rule invalid for an email without @", () => {
    const status = getEmailValidationStatus("learner1test.satori.com");
    expect(status[0].isValid).toBe(false);
  });

  it("marks the length rule invalid for an email over 255 characters", () => {
    const longEmail = "a".repeat(250) + "@b.com";
    const status = getEmailValidationStatus(longEmail);
    const lengthRule = status[3]; // "Không quá 255 ký tự"
    expect(lengthRule.isValid).toBe(false);
  });
});
