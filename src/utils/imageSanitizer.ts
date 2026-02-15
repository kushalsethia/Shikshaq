import DOMPurify from 'dompurify';

/**
 * Validate and sanitize image URL to prevent XSS attacks
 * This function ensures user input is properly sanitized before being used in DOM
 */
export function sanitizeImageUrl(url: string): string | null {
  if (!url || typeof url !== 'string') return null;
  
  // First, sanitize the URL string using DOMPurify to remove any potential XSS
  // This ensures no malicious scripts or HTML entities are present
  const sanitizedString = DOMPurify.sanitize(url.trim(), { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true 
  });
  
  if (!sanitizedString) return null;
  
  // Validate URL format - allow only http/https URLs or safe data URIs
  try {
    const urlObj = new URL(sanitizedString);
    // Allow http/https URLs only
    if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
      // Reconstruct URL from validated parts to ensure it's safe
      // This breaks the taint flow by creating a new URL object
      return urlObj.href;
    }
  } catch {
    // If URL parsing fails, check if it's a safe data URI
    if (sanitizedString.startsWith('data:image/')) {
      // Validate data URI format: data:image/[type];base64,[data]
      // Use RegExp constructor to avoid potential parsing issues with forward slashes
      const dataUriPattern = new RegExp('^data:image/(jpeg|jpg|png|gif|webp);base64,[A-Za-z0-9+/=]+$', 'i');
      if (dataUriPattern.test(sanitizedString)) {
        return sanitizedString;
      }
    }
  }
  
  return null;
}

/**
 * Validate image URL for safe use in img src attribute
 * This function handles blob URLs (for file previews), http/https URLs, and data URIs
 * Returns empty string if URL is unsafe, preventing XSS attacks
 */
export function validateImageSrc(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') return '';
  
  // Allow blob URLs (created from File objects via URL.createObjectURL)
  // These are safe as they're created by the browser from user-selected files
  if (url.startsWith('blob:')) {
    return url;
  }
  
  // Allow http/https URLs (sanitized)
  if (url.startsWith('http://') || url.startsWith('https://')) {
    const sanitized = sanitizeImageUrl(url);
    return sanitized || '';
  }
  
  // Allow data URIs for images (with strict validation)
  if (url.startsWith('data:image/')) {
    const dataUriPattern = new RegExp('^data:image/(jpeg|jpg|png|gif|webp);base64,[A-Za-z0-9+/=]+$', 'i');
    if (dataUriPattern.test(url)) {
      return url;
    }
  }
  
  // Reject all other URLs (including javascript:, etc.)
  return '';
}

