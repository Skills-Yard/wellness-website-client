const CDN_DOMAIN = (process.env.NEXT_PUBLIC_CLOUDFLARE_CDN_DOMAIN ?? "").replace(
  /\/+$/,
  "",
);

/**
 * Resolve a raw storage key (e.g. "s3-key-123" / "avatars/abc.jpg") to a
 * full, loadable URL under NEXT_PUBLIC_CLOUDFLARE_CDN_DOMAIN.
 *
 * - already-absolute (`http(s)://…`) or root-relative (`/…`) values pass
 *   through untouched
 * - a bare key becomes `<CDN_DOMAIN>/<key>`
 * - returns `null` when there's nothing usable (no key, or a bare key
 *   with the CDN domain unset) so callers can fall back to a placeholder
 */
export const resolveCdnUrl = (key?: string | null): string | null => {
  if (!key) return null;
  if (/^(https?:)?\/\//.test(key) || key.startsWith("/")) return key;
  if (!CDN_DOMAIN) return null;
  return `${CDN_DOMAIN}/${key.replace(/^\/+/, "")}`;
};
