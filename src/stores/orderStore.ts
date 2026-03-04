import { defineStore } from 'pinia';

export type CartItem = {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: number;
  items: CartItem[];
  customerName: string;
  table: string;
  status: 'pending' | 'ready' | 'canceled';
  createdAt: string;
};

export const useOrderStore = defineStore('order', {
  state: () => ({
    cart: [] as CartItem[],
    orders: [] as Order[],
    nextOrderId: 1,
  }),
  actions: {
    addToCart(item: Omit<CartItem, 'quantity'>) {
      const found = this.cart.find((i) => i.id === item.id);
      if (found) {
        found.quantity++;
      } else {
        this.cart.push({ ...item, quantity: 1 });
      }
    },
    updateCartQuantity(itemId: number, qty: number) {
      const found = this.cart.find((i) => i.id === itemId);
      if (found && qty > 0) found.quantity = qty;
      else if (found && qty <= 0) this.removeFromCart(itemId);
    },
    removeFromCart(itemId: number) {
      this.cart = this.cart.filter((i) => i.id !== itemId);
    },
    clearCart() {
      this.cart = [];
    },
    processTransaction(customerName: string, table: string) {
      if (!this.cart.length) return;
      this.orders.unshift({
        id: this.nextOrderId++,
        items: JSON.parse(JSON.stringify(this.cart)),
        customerName,
        table,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      this.clearCart();
    },
    setOrderStatus(orderId: number, status: Order['status']) {
      const order = this.orders.find((o) => o.id === orderId);
      if (order) order.status = status;
    },
  },
});
