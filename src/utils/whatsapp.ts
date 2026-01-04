/**
 * Sanitizes a WhatsApp number for use in wa.me links
 * Removes all non-digit characters and ensures proper format with country code
 * 
 * @param number - The WhatsApp number (can be in various formats)
 * @param defaultNumber - Optional default number to use if input is invalid (default: '918240980312')
 * @returns Sanitized number ready for wa.me links (e.g., '919876543210')
 */
export function sanitizeWhatsAppNumber(
  number: string | null | undefined,
  defaultNumber: string = '918240980312'
): string {
  if (!number) return defaultNumber;
  
  // Remove all non-digit characters (spaces, dashes, +, etc.)
  const cleaned = number.replace(/\D/g, '');
  
  // If empty after cleaning, return default
  if (!cleaned) return defaultNumber;
  
  // If number starts with 0, remove it (common in Indian numbers)
  const withoutLeadingZero = cleaned.startsWith('0') ? cleaned.slice(1) : cleaned;
  
  // If number already starts with 91 and is 12 digits, it's properly formatted
  if (withoutLeadingZero.startsWith('91') && withoutLeadingZero.length === 12) {
    return withoutLeadingZero;
  }
  
  // If number is 12+ digits and doesn't start with 91, assume it's already formatted with country code
  if (withoutLeadingZero.length >= 12 && !withoutLeadingZero.startsWith('91')) {
    return withoutLeadingZero;
  }
  
  // If number is 11 digits and starts with 0, remove 0 and add 91
  if (withoutLeadingZero.length === 11 && withoutLeadingZero.startsWith('0')) {
    return `91${withoutLeadingZero.slice(1)}`;
  }
  
  // If number doesn't start with country code and is 10 digits, assume it's Indian (+91)
  if (withoutLeadingZero.length === 10) {
    return `91${withoutLeadingZero}`;
  }
  
  // If number is less than 10 digits, it's likely invalid - return default
  if (withoutLeadingZero.length < 10) {
    return defaultNumber;
  }
  
  // Return as-is for any other format (might be international number)
  return withoutLeadingZero;
}

/**
 * Generates a WhatsApp wa.me link from a phone number
 * 
 * @param number - The WhatsApp number (can be in various formats)
 * @param defaultNumber - Optional default number to use if input is invalid
 * @returns Complete WhatsApp link (e.g., 'https://wa.me/919876543210')
 */
export function getWhatsAppLink(
  number: string | null | undefined,
  defaultNumber: string = '918240980312'
): string {
  const sanitized = sanitizeWhatsAppNumber(number, defaultNumber);
  return `https://wa.me/${sanitized}`;
}

