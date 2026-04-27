/**
 * Custom Hook for Form Handling
 * Manages form state, validation, and submission
 */

import { useState, useCallback } from 'react';
import { Validator, Sanitizer } from '../utils/validation';
import { logger } from '../utils/logger';

export const useForm = (initialValues = {}, onSubmit = null, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const validateField = useCallback((name, value) => {
    const rule = validationRules[name];
    if (!rule) return null;

    if (rule.required) {
      const validation = Validator.required(value, name);
      if (!validation.valid) return validation.message;
    }

    if (rule.pattern) {
      const validation = Validator.validate(value, rule.pattern);
      if (!validation.valid) return validation.message;
    }

    if (rule.custom) {
      const validation = rule.custom(value);
      if (!validation.valid) return validation.message;
    }

    return null;
  }, [validationRules]);

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? checked : Sanitizer.sanitizeInput(value);

    setValues((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  }, [errors]);

  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, value);
    if (error) {
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  }, [validateField]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      setSubmitError(null);

      // Validate all fields
      const newErrors = {};
      Object.keys(values).forEach((name) => {
        const error = validateField(name, values[name]);
        if (error) newErrors[name] = error;
      });

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setIsSubmitting(false);
        logger.warn('Form validation failed', newErrors, 'useForm');
        return;
      }

      try {
        if (onSubmit) {
          await onSubmit(values);
          logger.info('Form submitted successfully', null, 'useForm');
        }
      } catch (error) {
        setSubmitError(error.message || 'Submission failed');
        logger.error('Form submission failed', error, 'useForm');
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validationRules, onSubmit, validateField]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setSubmitError(null);
  }, [initialValues]);

  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    submitError,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue,
    setFieldError,
    setValues,
  };
};

export default useForm;
