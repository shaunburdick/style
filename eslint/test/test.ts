/**
 * TypeScript Code Pattern Examples
 *
 * This file demonstrates proper TypeScript patterns that should
 * be used when following this ESLint configuration.
 *
 * Each example shows the CORRECT way to write TypeScript code.
 */

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

// ✅ Use interfaces for object shapes
interface User {
    readonly id: number;
    readonly name: string;
    readonly email: string;
    readonly role?: 'admin' | 'user';
}

// ✅ Use type aliases for unions and complex types
type Status = 'pending' | 'approved' | 'rejected';
type EventHandler<T> = (event: T) => void;

// ✅ Use enums for related constants
enum ApiEndpoint {
    USERS = '/api/users',
    PRODUCTS = '/api/products',
    ORDERS = '/api/orders'
}

// ============================================================================
// FUNCTION PATTERNS
// ============================================================================

// ✅ Properly typed function parameters and returns
function formatUser(user: User): string {
    const role = user.role ?? 'user';
    return `${user.name} (${role})`;
}

// ✅ Generic functions with constraints
function processItems<T extends { id: number }>(items: T[]): T[] {
    return items.filter(item => item.id > 0);
}

// ✅ Async functions with proper return types
async function fetchUser(id: number): Promise<User | null> {
    try {
        const response = await fetch(`/api/users/${id}`);

        if (!response.ok) {
            return null;
        }

        return await response.json() as User;
    } catch {
        return null;
    }
}

// ============================================================================
// CLASS PATTERNS
// ============================================================================

/**
 * Well-structured TypeScript class
 */
class UserService {
    // ✅ Use readonly for properties that don't change
    private readonly baseUrl: string;
    private readonly timeout: number;

    public constructor(baseUrl: string, timeout = 5000) {
        this.baseUrl = baseUrl;
        this.timeout = timeout;
    }

    // ✅ Proper method typing
    public async getUser(id: number): Promise<User | null> {
        // Example of proper async method implementation
        return await fetchUser(id);
    }

    // ✅ Use type guards
    public isAdmin(user: User): user is User & { role: 'admin' } {
        return user.role === 'admin';
    }
}

// ============================================================================
// PROPER SWITCH STATEMENTS
// ============================================================================

export function handleStatus(status: Status): string {
    switch (status) {
        case 'pending': {
            // ✅ Use block scope for case statements
            const message = 'Request is being processed';
            return message;
        }
        case 'approved': {
            const message = 'Request has been approved';
            return message;
        }
        case 'rejected': {
            const message = 'Request was rejected';
            return message;
        }
        default:
            return 'Unknown status';
    }
}

// ============================================================================
// OBJECT PATTERNS
// ============================================================================

// ✅ Use const assertions for immutable data
const defaultConfig = {
    apiUrl: 'https://api.example.com',
    timeout: 5000,
    retries: 3
} as const;

// ✅ Proper object destructuring with types
export function processConfig(config: typeof defaultConfig = defaultConfig): string {
    const { apiUrl, timeout } = config;
    return `Connecting to ${apiUrl} with ${timeout}ms timeout`;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

// ✅ Create partial types for updates
type UserUpdate = Partial<Pick<User, 'name' | 'email'>>;

// ✅ Use utility types for transformations
type UserResponse = Omit<User, 'id'> & {
    userId: string;
    createdAt: Date;
};

// ============================================================================
// EXPORTS
// ============================================================================

export type { User, Status, EventHandler, UserUpdate, UserResponse };
export { UserService, ApiEndpoint, formatUser, processItems, fetchUser };
