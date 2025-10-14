/**
 * Shared constants and utilities for pattern examples
 *
 * This file contains common constants and simple utilities used
 * across the pattern example files.
 */

// ============================================================================
// COMMON CONSTANTS
// ============================================================================

export const STYLE_GUIDE = {
    // Naming conventions
    preferCamelCase: true,
    preferConstForImmutable: true,

    // Code organization
    oneClassPerFile: true,
    preferNamedExports: true,

    // Type safety
    avoidAnyType: true,
    preferReadonlyProps: true,

    // React patterns
    useFragments: true,
    noArrayIndexKeys: true,
    accessibilityRequired: true
} as const;// ============================================================================
// COMMON TYPES
// ============================================================================

export interface StyleConfig {
    readonly indentation: 'spaces' | 'tabs';
    readonly spaceCount: number;
    readonly semicolons: boolean;
    readonly trailingCommas: boolean;
}

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Example of proper function documentation and typing
 *
 * @param message - The message to log
 * @param level - The log level
 */
export function logMessage(message: string, level: LogLevel = 'info'): void {
    // ✅ In real code, use proper logging instead of console
    // This is just for demonstration
    if (level === 'error') {
        throw new Error(message);
    }
}

/**
 * Example of proper generic function
 *
 * @template T
 * @param items - Array to process
 * @param predicate - Filter function
 * @returns Filtered array
 */
export function filterItems<T>(items: T[], predicate: (item: T) => boolean): T[] {
    return items.filter(predicate);
}

export default STYLE_GUIDE;
