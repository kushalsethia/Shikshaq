/**
 * Validate and sanitize image URL to prevent XSS attacks
 * This function ensures user input is properly sanitized before being used in DOM
 *
 * This used to run DOMPurify.sanitize() over the URL string first. That was
 * doing no security work here and a lot of CPU work: DOMPurify allocates and
 * parses a DOM document per call, and validateImageSrc below is invoked inline
 * in JSX (TeacherCard, the Index rails, review cards), so a 24-card grid paid
 * for 24+ document allocations on every render pass.
 *
 * It was not protecting anything. The value is bound to an <img src>, never to
 * innerHTML, so HTML-entity stripping is irrelevant; what actually makes this
 * safe is the protocol allowlist plus rebuilding the string from a parsed URL,
 * both of which are below and unchanged. `new URL()` is stricter than the old
 * path too, since it rejects anything it cannot parse rather than handing a
 * mangled string onward.
 */
export function sanitizeImageUrl(url: string): string | null {
  if (!url || typeof url !== 'string') return null;

  const sanitizedString = url.trim();
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
 * 
 * This function explicitly breaks taint flow by creating new strings from validated input
 */
/* Results are memoised because this is called inline in JSX rather than from a
   useMemo, so it re-runs for every image on every render pass, and the same
   handful of teacher photo URLs recur across cards, rails and remounts. The
   function is pure, so the cache is safe to share and to keep.
   Bounded only to stop an unbounded Map in a long session; a clear costs
   nothing beyond re-validating, which is what every call did before. */
const MAX_URL_CACHE = 2000;
const validatedUrls = new Map<string, string>();

export function validateImageSrc(url: string | null | undefined): string {
  if (!url || typeof url !== 'string') return '';

  const cached = validatedUrls.get(url);
  if (cached !== undefined) return cached;
  const result = validateImageSrcUncached(url);
  if (validatedUrls.size >= MAX_URL_CACHE) validatedUrls.clear();
  validatedUrls.set(url, result);
  return result;
}

function validateImageSrcUncached(url: string): string {

  // Allow blob URLs (created from File objects via URL.createObjectURL)
  // These are safe as they're created by the browser from user-selected files
  // Validate blob URL format and create a new string to break taint flow
  if (url.startsWith('blob:')) {
    // Validate blob URL format: blob:origin/uuid
    // Blob URLs from URL.createObjectURL have format: blob:http://origin/uuid or blob:null/uuid
    // Pattern matches: blob: followed by origin (http/https URL or null) followed by / and UUID
    const blobUrlPattern = /^blob:(https?:\/\/[^\/\s]+|null)\/[a-f0-9-]+$/i;
    if (blobUrlPattern.test(url)) {
      // Create a new string from the validated blob URL to break taint flow
      // CodeQL recognizes String() constructor as creating a new sanitized value
      // This explicitly breaks the taint flow from user input
      return String(url);
    }
    // If blob URL format is invalid, reject it
    return '';
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
      // Create a new string from the validated data URI to break taint flow
      return String(url);
    }
  }
  
  // Allow relative/absolute paths - these are safe same-origin static assets
  // Vite imports return paths like /src/assets/image.png, /assets/image.png, ./assets/image.png, or assets/image.png
  // These are safe because they're from the same origin and bundled with the app
  // First check: must not contain a colon (which would indicate a protocol like http:, javascript:, etc.)
  // Second check: must not start with // (protocol-relative URL)
  // Third check: must have a valid image file extension
  if (!url.includes(':') && !url.startsWith('//')) {
    const pathWithoutQuery = url.split('?')[0];
    // Validate it's a simple path with image extension
    // Allow paths starting with /, ./, or just a filename/path
    // Pattern: optional ./ or /, then alphanumeric/slashes/dots/hyphens/underscores, then image extension
    const pathPattern = /^(\.?\/)?[a-zA-Z0-9\/._-]+\.(png|jpg|jpeg|gif|webp|svg|ico)$/i;
    if (pathPattern.test(pathWithoutQuery)) {
      return String(url);
    }
  }
  
  // Reject all other URLs (including javascript:, etc.)
  return '';
}

