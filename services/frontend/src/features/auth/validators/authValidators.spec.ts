import { loginSchema, registerSchema } from './authValidators';

describe('loginSchema', () => {
  it('should pass with valid credentials', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: 'password123' });
    expect(result.success).toBe(true);
  });

  it('should fail when email is empty', () => {
    const result = loginSchema.safeParse({ email: '', password: 'password123' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailError = result.error.issues.find(i => i.path[0] === 'email');
      expect(emailError?.message).toBe('AUTH_LOGIN:validationRequired');
    }
  });

  it('should fail when email format is invalid', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'password123' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailError = result.error.issues.find(i => i.path[0] === 'email');
      expect(emailError?.message).toBe('AUTH_LOGIN:validationEmailFormat');
    }
  });

  it('should fail when password is empty', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const passwordError = result.error.issues.find(i => i.path[0] === 'password');
      expect(passwordError?.message).toBe('AUTH_LOGIN:validationRequired');
    }
  });

  it('should fail when password is less than 8 characters', () => {
    const result = loginSchema.safeParse({ email: 'test@example.com', password: 'abc123' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const passwordError = result.error.issues.find(i => i.path[0] === 'password');
      expect(passwordError?.message).toBe('AUTH_LOGIN:validationPasswordMinLength');
    }
  });
});

describe('registerSchema', () => {
  const validData = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    confirmPassword: 'password123',
  };

  it('should pass with valid data', () => {
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail when name is empty', () => {
    const result = registerSchema.safeParse({ ...validData, name: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const nameError = result.error.issues.find(i => i.path[0] === 'name');
      expect(nameError?.message).toBe('AUTH_REGISTER:validationRequired');
    }
  });

  it('should fail when name is less than 2 characters', () => {
    const result = registerSchema.safeParse({ ...validData, name: 'A' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const nameError = result.error.issues.find(i => i.path[0] === 'name');
      expect(nameError?.message).toBe('AUTH_REGISTER:validationNameMinLength');
    }
  });

  it('should fail when email format is invalid', () => {
    const result = registerSchema.safeParse({ ...validData, email: 'invalid' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailError = result.error.issues.find(i => i.path[0] === 'email');
      expect(emailError?.message).toBe('AUTH_REGISTER:validationEmailFormat');
    }
  });

  it('should fail when password is less than 8 characters', () => {
    const result = registerSchema.safeParse({ ...validData, password: 'short', confirmPassword: 'short' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const passwordError = result.error.issues.find(i => i.path[0] === 'password');
      expect(passwordError?.message).toBe('AUTH_REGISTER:validationPasswordMinLength');
    }
  });

  it('should fail when passwords do not match', () => {
    const result = registerSchema.safeParse({ ...validData, confirmPassword: 'different123' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const matchError = result.error.issues.find(i => i.path[0] === 'confirmPassword');
      expect(matchError?.message).toBe('AUTH_REGISTER:validationPasswordMatch');
    }
  });

  it('should fail when confirmPassword is empty', () => {
    const result = registerSchema.safeParse({ ...validData, confirmPassword: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      const confirmError = result.error.issues.find(i => i.path[0] === 'confirmPassword');
      expect(confirmError).toBeDefined();
    }
  });
});
