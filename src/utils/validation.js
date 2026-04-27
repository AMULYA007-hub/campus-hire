/**
 * Input Validation and Sanitization Utilities
 * Comprehensive validation for forms and data
 */

export const ValidationRules = {
  // Email validation
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },

  // Password validation (min 8 chars, 1 uppercase, 1 number, 1 special char)
  strongPassword: {
    pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    message: 'Password must have 8+ chars, 1 uppercase, 1 number, 1 special char',
  },

  // Moderate password (min 6 chars)
  password: {
    pattern: /^.{6,}$/,
    message: 'Password must be at least 6 characters',
  },

  // Phone number (basic format)
  phone: {
    pattern: /^[\d\s\-\+\(\)]{10,}$/,
    message: 'Please enter a valid phone number',
  },

  // URL validation
  url: {
    pattern: /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
    message: 'Please enter a valid URL',
  },

  // Numbers only
  number: {
    pattern: /^\d+$/,
    message: 'Only numbers are allowed',
  },

  // Alphanumeric only
  alphanumeric: {
    pattern: /^[a-zA-Z0-9]+$/,
    message: 'Only letters and numbers are allowed',
  },

  // Name validation
  name: {
    pattern: /^[a-zA-Z\s]{2,}$/,
    message: 'Name should contain only letters and spaces (min 2 characters)',
  },

  // Company name
  company: {
    pattern: /^[a-zA-Z0-9\s\.\-&]{2,}$/,
    message: 'Invalid company name',
  },
};

/**
 * Validator Class
 */
export class Validator {
  static validate(value, rule) {
    if (!rule.pattern) return { valid: true };
    return {
      valid: rule.pattern.test(value),
      message: rule.message,
    };
  }

  static email(email) {
    return this.validate(email, ValidationRules.email);
  }

  static password(password, strong = false) {
    const rule = strong ? ValidationRules.strongPassword : ValidationRules.password;
    return this.validate(password, rule);
  }

  static phone(phone) {
    return this.validate(phone, ValidationRules.phone);
  }

  static url(url) {
    return this.validate(url, ValidationRules.url);
  }

  static required(value, fieldName = 'This field') {
    if (!value || value.toString().trim() === '') {
      return { valid: false, message: `${fieldName} is required` };
    }
    return { valid: true };
  }

  static minLength(value, min, fieldName = 'This field') {
    if (value.length < min) {
      return { valid: false, message: `${fieldName} must be at least ${min} characters` };
    }
    return { valid: true };
  }

  static maxLength(value, max, fieldName = 'This field') {
    if (value.length > max) {
      return { valid: false, message: `${fieldName} must not exceed ${max} characters` };
    }
    return { valid: true };
  }

  static match(value1, value2, fieldName = 'Fields') {
    if (value1 !== value2) {
      return { valid: false, message: `${fieldName} do not match` };
    }
    return { valid: true };
  }

  static customRule(value, testFn, message) {
    if (!testFn(value)) {
      return { valid: false, message };
    }
    return { valid: true };
  }
}

/**
 * Sanitizer Class - Remove malicious content
 */
export class Sanitizer {
  static stripHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  static trimWhitespace(text) {
    return text.trim().replace(/\s+/g, ' ');
  }

  static sanitizeInput(input) {
    return this.stripHTML(this.trimWhitespace(input));
  }

  static sanitizeObject(obj) {
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        sanitized[key] = this.sanitizeInput(value);
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeObject(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  static escapeHTML(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }
}

/**
 * Form Validator - Validates entire forms
 */
export class FormValidator {
  constructor(schema) {
    this.schema = schema;
    this.errors = {};
  }

  validate(data) {
    this.errors = {};

    for (const [field, rules] of Object.entries(this.schema)) {
      const value = data[field];

      for (const rule of rules) {
        if (!rule.validate(value)) {
          this.errors[field] = rule.message;
          break;
        }
      }
    }

    return Object.keys(this.errors).length === 0;
  }

  getErrors() {
    return this.errors;
  }

  getFieldError(field) {
    return this.errors[field] || null;
  }

  hasError(field) {
    return !!this.errors[field];
  }
}

export default { Validator, Sanitizer, FormValidator, ValidationRules };
