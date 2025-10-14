/**
 * JavaScript/ES6 Code Pattern Examples
 *
 * This file demonstrates proper JavaScript and ES6 patterns that should
 * be used when following this ESLint configuration.
 *
 * Each example shows the CORRECT way to write code.
 */

// ============================================================================
// MODERN JAVASCRIPT PATTERNS
// ============================================================================

// ✅ Use const for values that never change
const API_URL = 'https://api.example.com';
const MAX_RETRIES = 3;

// ✅ Use let for values that do change (examples)
// let currentUser = null;  // Would be used in real code
// let isLoading = false;   // Would be used in real code

// ✅ Use template literals instead of string concatenation
function createMessage(name, action) {
    return `User ${name} performed action: ${action}`;
}

// ✅ Use destructuring assignment
export function processUser({ name, email, role = 'user' }) {
    const { host } = new URL(API_URL);
    return { name, email, role, host };
}

// ✅ Use arrow functions for callbacks
export function demonstrateArrayMethods() {
    const numbers = [1, 2, 3, 4, 5];
    const doubled = numbers.map(n => n * 2);
    const evens = numbers.filter(n => n % 2 === 0);
    return { doubled, evens };
}

// ============================================================================
// FUNCTION PATTERNS
// ============================================================================

/**
 * Proper JSDoc documentation
 *
 * @param {Array<string>} items - Array of items to process
 * @param {number} limit - Maximum number of items
 * @returns {Array<string>} Processed items
 */
function processItems(items, limit) {
    return items
        .slice(0, limit)
        .map(item => item.trim())
        .filter(Boolean);
}

// ✅ Use async/await for promises
export async function fetchData(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        // ✅ In real code, use proper logging
        throw new Error(`Fetch failed: ${error.message}`);
    }
}// ============================================================================
// OBJECT AND ARRAY PATTERNS
// ============================================================================

// ✅ Use object shorthand
function createConfig(timeout, debug) {
    return {
        timeout,
        debug,
        retries: MAX_RETRIES,
        url: API_URL
    };
}

// ✅ Use spread operator for copying
export function updateSettings(currentSettings, newSettings) {
    return {
        ...currentSettings,
        ...newSettings,
        updatedAt: Date.now()
    };
}

// ============================================================================
// CLASS PATTERNS (Only one class per file)
// ============================================================================

/**
 * Example of a well-structured class
 */
class ApiClient {
    /**
     * Create an API client
     *
     * @param {object} options - Configuration options
     */
    constructor(options = {}) {
        // ✅ Use object spread and defaults
        this.config = { timeout: 5000, ...options };
        this.cache = new Map();
    }

    /**
     * Fetch data from API
     *
     * @param {string} endpoint - API endpoint
     * @returns {Promise<object>} API response
     */
    async get(endpoint) {
        const url = `${this.config.baseUrl}${endpoint}`;

        // ✅ Proper error handling
        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            // ✅ In real code, use proper error handling
            throw new Error(`API request failed: ${error.message}`);
        }
    }
}

// ============================================================================
// EXPORT PATTERNS
// ============================================================================

// ✅ Named exports for specific items
export { ApiClient, processItems, createMessage };

// ✅ Default export for main functionality
export default {
    ApiClient,
    processItems,
    createConfig,
    API_URL,
    processUser,
    demonstrateArrayMethods,
    fetchData,
    updateSettings
};
