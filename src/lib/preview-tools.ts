/* Test-deployment-only tooling, switched by environment rather than by code.
 *
 * Both deployments build from the same branch — see CLAUDE.md. What separates
 * them is VITE_PREVIEW_TOOLS, which is set only in the kanitest Vercel
 * project. That has to be a build-time constant, not a runtime check, so the
 * live build can prove the tooling is gone rather than merely inert:
 * `import.meta.env.VITE_PREVIEW_TOOLS` is inlined by Vite, the comparison
 * folds to `false`, and everything guarded by it is dropped by tree-shaking.
 *
 *   grep -r PreviewTools dist/assets/*.js   -> nothing, on a live build
 *
 * ⚠ Anything VITE_-prefixed ships to every visitor as plain text. This flag is
 * fine to publish; a password would not be. Preview accounts signed in from
 * the browser therefore have public credentials by construction, so they must
 * be powerless throwaways. Admin is deliberately NOT one of them: it reaches
 * real teachers' applications, emails and phone numbers, so it asks for a
 * normal sign-in instead of carrying an embedded credential.
 */

/** True only in a build made with VITE_PREVIEW_TOOLS=true (the test site). */
export const PREVIEW_TOOLS =
  import.meta.env.VITE_PREVIEW_TOOLS === 'true';

/** The roles the preview toggle can put you in. */
export type PreviewRole = 'signed-out' | 'student' | 'teacher' | 'admin';
