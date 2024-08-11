/**
 * Represents a product with its details.
 */
interface Product {
    /** Unique identifier for the product. */
    id: number;
    /** Name of the product. */
    name: string;
    /** Price of the product. */
    price: number;
    /** Indicates whether the product is in stock. */
    inStock: boolean;
    /** Additional details about the product. */
    description?: string;
    /** Categories the product belongs to. */
    categories: string[];
}

/**
 * Manages a collection of products.
 */
class ProductManager {
    /**
     * An array of products managed by the manager.
     *
     * @private
     */
    private products: Product[];

    /**
     * Creates a new instance of ProductManager.
     */
    public constructor() {
        this.products = [];
    }

    /**
     * Adds a product to the collection.
     *
     * @param product The product to add.
     */
    public addProduct(product: Product): void {
        this.products.push(product);
    }

    /**
     * Finds a product by its ID.
     *
     * @param id The ID of the product to find.
     * @returns The found product, or undefined if not found.
     */
    public findProductById(id: number): Product | undefined {
        return this.products.find(p => p.id === id);
    }

    /**
     * Calculates the total inventory value of all products.
     *
     * @returns The total inventory value.
     */
    public getTotalInventoryValue(): number {
        return this.products.reduce((total, product) => total + product.price * (product.inStock ? 1 : 0), 0);
    }

    /**
     * Gets all products in a specific category.
     *
     * @param category The category to filter by.
     * @returns An array of products in the specified category.
     */
    public getProductsByCategory(category: string): Product[] {
        return this.products.filter(product => product.categories.includes(category));
    }
}

// Example usage
const productManager = new ProductManager();
productManager.addProduct({
    id: 1,
    name: 'Laptop',
    price: 999,
    inStock: true,
    description: 'Powerful laptop for work and play',
    categories: ['Electronics', 'Computers']
});

// ... add more products
