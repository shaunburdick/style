/**
 * Represents a product with its details.
 */
function Product (id, name, price, inStock, description, categories) {
    return {
        id,
        name,
        price,
        inStock,
        description,
        categories,
    };
}

/**
 * Manages a collection of products.
 */
class ProductManager {
    constructor() {
        this.products = [];
    }

    addProduct(product) {
        this.products.push(product);
    }

    findProductById(id) {
        return this.products.find(p => p.id === id);
    }

    getTotalInventoryValue() {
        return this.products.reduce((total, product) => total + product.price * product.inStock, 0);
    }

    getProductsByCategory(category) {
        return this.products.filter(product => product.categories.includes(category));
    }
}

// Example usage
const productManager = new ProductManager();
productManager.addProduct(new Product(
    1,
    'Laptop',
    999,
    true,
    'Powerful laptop for work and play',
    ['Electronics', 'Computers']
));

// ... add more products
