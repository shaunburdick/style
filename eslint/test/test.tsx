/**
 * React/JSX Code Pattern Examples
 *
 * This file demonstrates proper React and JSX patterns that should
 * be used when following this ESLint configuration.
 *
 * Each example shows the CORRECT way to write React code.
 */

import React, { useCallback, useMemo, useState } from 'react';

// ============================================================================
// COMPONENT PROPS PATTERNS
// ============================================================================

// ✅ Properly typed component props
interface ButtonProps {
    readonly children: React.ReactNode;
    readonly onClick: (event: React.MouseEvent) => void;
    readonly disabled?: boolean;
    readonly variant?: 'primary' | 'secondary';
}

interface UserCardProps {
    readonly user: {
        readonly id: number;
        readonly name: string;
        readonly avatar: string;
    };
    readonly onEdit: (userId: number) => void;
}

// ============================================================================
// FUNCTIONAL COMPONENT PATTERNS
// ============================================================================

// ✅ Simple functional component with proper props
function Button({ children, onClick, disabled = false, variant = 'primary' }: ButtonProps) {
    return (
        <button
            type="button"
            className={`btn btn-${variant}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}

// ✅ Component with proper event handling (no .bind in JSX)
export function UserCard({ user, onEdit }: UserCardProps) {
    const handleEdit = useCallback(() => {
        onEdit(user.id);
    }, [onEdit, user.id]);

    return (
        <div className="user-card">
            {/* ✅ Proper alt text for accessibility */}
            <img
                src={user.avatar}
                alt={`Avatar for ${user.name}`}
            />
            <h3>{user.name}</h3>
            <Button onClick={handleEdit}>
                Edit User
            </Button>
        </div>
    );
}

// ============================================================================
// LIST RENDERING PATTERNS
// ============================================================================

interface ProductListProps {
    readonly products: {
        readonly id: string;
        readonly name: string;
        readonly price: number;
    }[];
}

// ✅ Proper key usage (not array index)
export function ProductList({ products }: ProductListProps) {
    return (
        <ul>
            {products.map(product => (
                <li key={product.id}>
                    <span>{product.name}</span>
                    <span>${product.price}</span>
                </li>
            ))}
        </ul>
    );
}

// ============================================================================
// FORM PATTERNS
// ============================================================================

// ✅ Accessible form with proper labels
function ContactForm() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = useCallback((event: React.FormEvent) => {
        event.preventDefault();
        // ✅ Handle form submission properly
        // In real code: await submitForm({ email, message });
        return { email, message };
    }, [email, message]);

    return (
        <form onSubmit={handleSubmit}>
            <div>
                {/* ✅ Label properly associated with input */}
                <label htmlFor="email-input">
                    Email Address
                </label>
                <input
                    id="email-input"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="message-input">
                    Message
                </label>
                <textarea
                    id="message-input"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    required
                />
            </div>

            <button type="submit">
                Send Message
            </button>
        </form>
    );
}

// ============================================================================
// PERFORMANCE PATTERNS
// ============================================================================

interface ExpensiveComponentProps {
    readonly data: number[];
    readonly multiplier: number;
}

// ✅ Use useMemo for expensive calculations
export function ExpensiveComponent({ data, multiplier }: ExpensiveComponentProps) {
    const processedData = useMemo(() => {
        return data.map(value => value * multiplier);
    }, [data, multiplier]);

    return (
        <div>
            {processedData.map((value) => (
                <span key={`processed-${value}`}>
                    {value}
                </span>
            ))}
        </div>
    );
}

// ============================================================================
// FRAGMENT PATTERNS
// ============================================================================

// ✅ Use React fragments instead of unnecessary divs
export function FragmentExample() {
    return (
        <>
            <h1>Title</h1>
            <p>Some content here</p>
        </>
    );
}

// ============================================================================
// CONDITIONAL RENDERING PATTERNS
// ============================================================================

interface ConditionalProps {
    readonly isLoading: boolean;
    readonly error?: string;
    readonly data?: string[];
}

// ✅ Clean conditional rendering
export function ConditionalComponent({ isLoading, error, data }: ConditionalProps) {
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    if (!data?.length) {
        return <div>No data available</div>;
    }

    return (
        <ul>
            {data.map((item) => (
                <li key={item}>{item}</li>
            ))}
        </ul>
    );
}

// ============================================================================
// SELF-CLOSING COMPONENTS
// ============================================================================

// ✅ Use self-closing tags when there are no children
export function SelfClosingExample() {
    return (
        <div>
            <img src="/logo.png" alt="Company logo" />
            <input type="text" placeholder="Enter text" />
            <br />
            <hr />
        </div>
    );
}

export default ContactForm;
