/**
 * Formats a duration in minutes to a string in the format "XX min"
 * @param minutes The duration in minutes
 * @returns A string in the format "XX min"
 */
export function formatDuration(minutes: number): string {
  return `${Math.round(minutes)} min`;
}

/**
 * Parses a duration string in the format "XX min" to a number of minutes
 * @param duration A string in the format "XX min"
 * @returns The duration in minutes, or 0 if the string is invalid
 */
export function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)\s*min$/);
  return match ? parseInt(match[1], 10) : 0;
}
