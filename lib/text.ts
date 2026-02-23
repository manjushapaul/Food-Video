/** Truncate text to at most `maxWords` words, appending ellipsis if truncated */
export function truncateWords(text: string | undefined | null, maxWords: number): string {
  if (!text || typeof text !== 'string') return '';
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text.trim();
  return words.slice(0, maxWords).join(' ') + '…';
}
