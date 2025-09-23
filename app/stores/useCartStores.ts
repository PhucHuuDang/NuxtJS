import { defineStore } from "pinia";

export interface CartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
}

export interface Cart {
  id: number;
  products: CartProduct[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

// mock cart initial
export const cart: Cart = {
  id: 1,
  products: [
    {
      id: 168,
      title: "Charger SXT RWD",
      price: 32999.99,
      quantity: 3,
      total: 98999.97,
      discountPercentage: 13.39,
      discountedTotal: 85743.87,
      thumbnail:
        "https://cdn.dummyjson.com/products/images/vehicle/Charger%20SXT%20RWD/thumbnail.png",
    },
    {
      id: 78,
      title: "Apple MacBook Pro 14 Inch Space Grey",
      price: 1999.99,
      quantity: 2,
      total: 3999.98,
      discountPercentage: 18.52,
      discountedTotal: 3259.18,
      thumbnail:
        "https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/thumbnail.png",
    },
    {
      id: 183,
      title: "Green Oval Earring",
      price: 24.99,
      quantity: 5,
      total: 124.95,
      discountPercentage: 6.28,
      discountedTotal: 117.1,
      thumbnail:
        "https://cdn.dummyjson.com/products/images/womens-jewellery/Green%20Oval%20Earring/thumbnail.png",
    },
    {
      id: 100,
      title: "Apple Airpods",
      price: 129.99,
      quantity: 5,
      total: 649.95,
      discountPercentage: 12.84,
      discountedTotal: 566.5,
      thumbnail:
        "https://cdn.dummyjson.com/products/images/mobile-accessories/Apple%20Airpods/thumbnail.png",
    },
  ],
  total: 103774.85,
  discountedTotal: 89686.65,
  userId: 33,
  totalProducts: 4,
  totalQuantity: 15,
};

function recalculateCart(baseCart: Cart, products: CartProduct[]): Cart {
  const total = products.reduce((acc, p) => acc + p.total, 0);
  const discountedTotal = products.reduce(
    (acc, p) => acc + p.discountedTotal,
    0
  );
  const totalProducts = products.length;
  const totalQuantity = products.reduce((acc, p) => acc + p.quantity, 0);

  return {
    ...baseCart,
    products,
    total,
    discountedTotal,
    totalProducts,
    totalQuantity,
  };
}

export const useCartStore = defineStore("cart", {
  state: () => ({
    cart: cart as Cart | null,
  }),

  getters: {
    getCart: (state) => state.cart,
  },

  actions: {
    updateCart(cart: Cart) {
      this.cart = cart;
    },

    removeCart() {
      this.cart = null;
    },

    removeProduct(productId: number) {
      if (!this.cart) return;

      const updatedProducts = this.cart.products.filter(
        (product) => product.id !== productId
      );

      this.cart = recalculateCart(this.cart, updatedProducts);
    },

    addProduct(product: CartProduct) {
      const existingProduct = this.cart?.products.find(
        (p) => p.id === product.id
      );

      if (existingProduct) {
        this.updateProduct(product.id, existingProduct.quantity + 1);
      } else {
        this.cart?.products.push(product);
      }
    },
    updateProduct(productId: number, quantity: number) {
      if (!this.cart) return;

      // quantity <= 0 => xoá luôn
      if (quantity <= 0) {
        this.removeProduct(productId);
        return;
      }

      const updatedProducts = this.cart.products.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            quantity,
            total: p.price * quantity,
            discountedTotal:
              (p.price * quantity * (100 - p.discountPercentage)) / 100,
          };
        }
        return p;
      });

      this.cart = recalculateCart(this.cart, updatedProducts);
    },
  },
});
