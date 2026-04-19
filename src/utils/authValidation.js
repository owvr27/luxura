export function validateEmail(value) {
  if (!value.trim()) {
    return 'required';
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(value.trim())) {
    return 'invalidEmail';
  }

  return '';
}

export function validatePassword(value) {
  if (!value.trim()) {
    return 'required';
  }

  if (value.trim().length < 6) {
    return 'passwordShort';
  }

  return '';
}

export function validateFullName(value) {
  if (!value.trim()) {
    return 'required';
  }

  if (value.trim().length < 2) {
    return 'nameShort';
  }

  return '';
}

export function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword.trim()) {
    return 'required';
  }

  if (password !== confirmPassword) {
    return 'passwordMismatch';
  }

  return '';
}
