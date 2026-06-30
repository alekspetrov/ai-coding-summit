// Tiny class-name joiner. Drops falsy parts so conditional classes stay terse.
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
