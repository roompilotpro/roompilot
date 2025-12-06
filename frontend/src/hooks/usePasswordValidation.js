import { useMemo } from 'react'

/**
 * Hook for validating password strength and requirements
 *
 * @param {string} password - The password to validate
 * @param {string} [confirmPassword] - Optional confirm password for matching
 * @returns {Object} Password validation state
 */
export function usePasswordValidation(password = '', confirmPassword = '') {
  const validation = useMemo(() => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^a-zA-Z0-9]/.test(password),
      match: confirmPassword ? password === confirmPassword && password.length > 0 : true,
    }

    // Calculate strength (0-4)
    let strength = 0
    if (requirements.length) strength++
    if (requirements.uppercase && requirements.lowercase) strength++
    if (requirements.number) strength++
    if (requirements.special) strength++

    // Determine strength level
    let strengthLevel = 'none'
    let strengthLabel = ''

    if (password.length === 0) {
      strengthLevel = 'none'
      strengthLabel = 'Use 8+ characters with mix of letters, numbers & symbols'
    } else if (strength <= 1) {
      strengthLevel = 'weak'
      strengthLabel = 'Weak password'
    } else if (strength <= 2) {
      strengthLevel = 'fair'
      strengthLabel = 'Fair password'
    } else if (strength === 3) {
      strengthLevel = 'good'
      strengthLabel = 'Good password'
    } else {
      strengthLevel = 'strong'
      strengthLabel = 'Strong password'
    }

    // Check if all requirements are met (for forms that need all)
    const allRequirementsMet = Object.values(requirements).every(Boolean)

    // Check if basic requirements are met (length + one of each char type)
    const basicRequirementsMet =
      requirements.length && requirements.uppercase && requirements.lowercase && requirements.number

    return {
      requirements,
      strength,
      strengthLevel,
      strengthLabel,
      allRequirementsMet,
      basicRequirementsMet,
      isValid: basicRequirementsMet && requirements.match,
    }
  }, [password, confirmPassword])

  return validation
}

export default usePasswordValidation
