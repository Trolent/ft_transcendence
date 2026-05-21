import type { TFunction } from 'i18next';

/**
 * Translate a backend error code (e.g. "INVALID_CREDENTIALS") to a
 * human-readable string in the current language.
 * Falls back to the raw code if no translation is found.
 */
export function tError(message: unknown, t: TFunction): string {
  if (typeof message !== 'string' || !message) return String(message ?? '');
  const key = `common:errors.${message}`;
  const translated = t(key, { defaultValue: '' });
  return translated || message;
}
