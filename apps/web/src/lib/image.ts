const LOCALHOST_NAMES = new Set(['localhost', '127.0.0.1']);

export function shouldBypassImageOptimization(src: string | null | undefined): boolean {
  if (!src || src.startsWith('/')) {
    return false;
  }

  try {
    const parsedUrl = new URL(src);
    return LOCALHOST_NAMES.has(parsedUrl.hostname);
  } catch {
    return false;
  }
}
