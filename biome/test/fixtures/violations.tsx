// Intentional React/a11y violations. DO NOT FIX.
// Used by test/smoke.test.mjs to prove React override rules actually fire.

type GalleryProps = {
    items: string[];
};

export function Gallery({ items }: GalleryProps) {
    return (
        <div onClick={() => {}}>
            {items.map((item, index) => (
                <img src={item} key={index} />
            ))}
            <button>Go</button>
            <input autoFocus />
            <a href="https://example.com" target="_blank">
                Example
            </a>
        </div>
    );
}
