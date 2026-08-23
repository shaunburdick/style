import { readFile } from 'node:fs/promises';

/**
 * Formats a greeting message.
 * @param {string} name - The name to greet.
 * @returns {string} The formatted greeting.
 */
export function greet(name) {
    return `Hello, ${name}!`;
}

/**
 * Reads settings from disk.
 * @param {string} path - Path to the settings file.
 * @returns {Promise<object>} Parsed settings object.
 */
export async function readSettings(path) {
    const raw = await readFile(path, 'utf8');
    return JSON.parse(raw);
}

/** Default retry behavior for outbound requests. */
export const defaults = {
    retries: 3,
    timeoutMs: 1200,
};

/**
 * Sums an array of numbers.
 * @param {number[]} values - Numbers to sum.
 * @returns {number} The total.
 */
export function sum(values) {
    return values.reduce((total, value) => total + value, 0);
}
