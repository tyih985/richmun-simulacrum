// Use these types locally to standardize how the field should be used

/** Represents a string containing Markdown content */
export type MarkdownType = string;

/**
 * Represents the number of milliseconds since January 1, 1970, 00:00:00 UTC (the epoch)
 * This is the same format used by JavaScript's Date.now() and new Date().getTime()
 */
export type DateTimeStamp = EpochTimeStamp;
