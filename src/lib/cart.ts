import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  slug: string;
  name: string;
  price: number;
  image: string;
  size: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (slug: string, size: string, qty: number) => void;
  remove: (slug: string, size: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item, qty = 1) => {
        const items = [...get().items];
        const i = items.findIndex((x) => x.slug === item.slug && x.size === item.size);
        if (i >= 0) {
          items[i] = { ...items[i], qty: items[i].qty + qty };
        } else {
          items.push({ ...item, qty });
        }
        set({ items });
      },
      setQty: (slug, size, qty) => {
        if (qty <= 0) {
          set({ items: get().items.filter((x) => !(x.slug === slug && x.size === size)) });
          return;
        }
        set({
          items: get().items.map((x) =>
            x.slug === slug && x.size === size ? { ...x, qty } : x,
          ),
        });
      },
      remove: (slug, size) =>
        set({ items: get().items.filter((x) => !(x.slug === slug && x.size === size)) }),
      clear: () => set({ items: [] }),
    }),
    { name: "swampforce-cart" },
  ),
);

export function cartCount(items: CartItem[]) {
  return items.reduce((n, i) => n + i.qty, 0);
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((n, i) => n + i.price * i.qty, 0);
}
