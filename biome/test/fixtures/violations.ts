// Intentional TypeScript-layer violations. DO NOT FIX.
// Used by test/smoke.test.mjs to prove TS override rules actually fire.

type Point = {
    x: number;
    y: number;
};

async function fetchSession(): Promise<string> {
    return 'token';
}

export class Session {
    token: string = '';

    build(): string {
        fetchSession();
        return this.token!;
    }
}

const config: any = {};

const origin: Point = { x: 0, y: 0 };

function label(name: string | undefined): string {
    return `Hi ${(name || 'stranger')!}`;
}

try {
    JSON.parse('{}');
} catch (error) {}

export { config, origin, label };
