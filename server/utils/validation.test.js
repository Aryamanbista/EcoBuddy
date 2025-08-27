const { validatePassword } = require('./validation');

// Group tests for the password validation function
describe('validatePassword', () => {

  // Test Case 1: Positive Scenario with a valid password
  test('should return true for a valid password', () => {
    expect(validatePassword('Password123')).toBe(true);
  });

  // Test Case 2: Negative Scenario - password is too short
  test('should return false for a password shorter than 8 characters', () => {
    expect(validatePassword('Pass1')).toBe(false);
  });

  // Test Case 3: Negative Scenario - password missing an uppercase letter
  test('should return false for a password without an uppercase letter', () => {
    expect(validatePassword('password123')).toBe(false);
  });

  // Test Case 4: Negative Scenario - password missing a number
  test('should return false for a password without a number', () => {
    expect(validatePassword('PasswordAbc')).toBe(false);
  });
});