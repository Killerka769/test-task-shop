import { create } from "zustand";
import { TProductItem } from "../Types/Types";
import { persist } from "zustand/middleware";

type TBasketItem = TProductItem & { count: number };

type TBasketStore = {
  basket: TBasketItem[];
  addItem: (item: TProductItem) => void;
  deleteItem: (id: number) => void;
  incrementItem: (id: number) => void;
  decrementItem: (id: number) => void;
  updateItemCount: (id: number, count: number) => void;
};

const useBasketStore = create<TBasketStore>()(
  persist(
    (set) => ({
      basket: [],

      addItem: (item) =>
        set((state) => {
          const exists = state.basket.find((el) => el.id === item.id);
          if (exists) return state;
          return {
            basket: [...state.basket, { ...item, count: 1 }],
          };
        }),

      deleteItem: (id) =>
        set((state) => ({
          basket: state.basket.filter((item) => item.id !== id),
        })),

      incrementItem: (id) =>
        set((state) => ({
          basket: state.basket.map((item) =>
            item.id === id ? { ...item, count: item.count + 1 } : item
          ),
        })),

      decrementItem: (id) =>
        set((state) => ({
          basket: state.basket
            .map((item) =>
              item.id === id ? { ...item, count: item.count - 1 } : item
            )
            .filter((item) => item.count > 0),
        })),

      updateItemCount: (id : number, count : number) =>
        set((state) => ({
          basket: state.basket.map((item) =>
            item.id === id ? { ...item, count } : item
          ),
        })),
    }),
    {
      name: 'basket',
    }
  )
);


export default useBasketStore;
