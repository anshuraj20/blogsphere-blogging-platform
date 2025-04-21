
/**
 * Utility for detecting offensive language (mock/AI-based)
 * In future iterations, replace word list with real AI model/API!
 */

// Example offensive words (add more as needed)
const OFFENSIVE_WORDS = [
  "idiot",
  "stupid",
  "dumb",
  "hate",
  "scam",
  "moron",
  "fool",
  "shit",
  "bullshit",
  "bastard",
  "asshole",
  "fuck",
  "fucking",
  "cunt",
  "bitch",
  "dick",
  "suck",
  "jerk"
];

/**
 * Returns true if text contains offensive language.
 * Simple implementation: scans for blacklisted words in a case-insensitive way.
 */
export function containsOffensiveLanguage(text: string): boolean {
  const lowerText = text.toLowerCase();
  return OFFENSIVE_WORDS.some((word) =>
    lowerText.includes(word)
  );
}

/**
 * Optionally, get a list of detected words.
 */
export function getOffensiveWords(text: string): string[] {
  const lowerText = text.toLowerCase();
  return OFFENSIVE_WORDS.filter((word) => lowerText.includes(word));
}
