import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, ItemSize, User } from '@/types';

interface CartStore {
  items: CartItem[];
  addItem: (productId: string, size: ItemSize, quantity: number, product?: CartItem['product']) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateSize: (itemId: string, size: ItemSize) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (productId, size, quantity, product) => {
        const items = get().items;
        const existingItem = items.find(
          item => item.product_id === productId && item.size === size
        );
        if (existingItem) {
          set({
            items: items.map(item =>
              item.id === existingItem.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          });
        } else {
          set({
            items: [
              ...items,
              {
                id: crypto.randomUUID(),
                user_id: '',
                product_id: productId,
                size,
                quantity,
                created_at: new Date().toISOString(),
                product
              }
            ]
          });
        }
      },
      removeItem: (itemId) => {
        set({ items: get().items.filter(item => item.id !== itemId) });
      },
      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }
        set({
          items: get().items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          )
        });
      },
      updateSize: (itemId, size) => {
        set({
          items: get().items.map(item =>
            item.id === itemId ? { ...item, size } : item
          )
        });
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => {
          if (!item.product) return total;
          const price = item.size === 'quarter'
            ? item.product.price_quarter
            : item.size === 'gallon'
              ? item.product.price_gallon
              : item.product.price_drum;
          return total + (price * item.quantity);
        }, 0);
      }
    }),
    {
      name: 'tawakkal-cart'
    }
  )
);

interface LocationStore {
  area: string | null;
  setArea: (area: string) => void;
  hasSelectedArea: boolean;
  setHasSelectedArea: (value: boolean) => void;
}

export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      area: null,
      hasSelectedArea: false,
      setArea: (area) => set({ area, hasSelectedArea: true }),
      setHasSelectedArea: (value) => set({ hasSelectedArea: value })
    }),
    {
      name: 'tawakkal-location'
    }
  )
);

interface UserStore {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      loading: true,
      setUser: (user) => set({ user, isAuthenticated: !!user, loading: false }),
      setLoading: (loading) => set({ loading })
    }),
    {
      name: 'tawakkal-user'
    }
  )
);

interface UIStore {
  isLocationPopupOpen: boolean;
  setLocationPopupOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  redirectAfterAuth: string | null;
  setRedirectAfterAuth: (path: string | null) => void;
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      isLocationPopupOpen: false,
      setLocationPopupOpen: (open) => set({ isLocationPopupOpen: open }),
      isSearchOpen: false,
      setSearchOpen: (open) => set({ isSearchOpen: open }),
      isMobileMenuOpen: false,
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
      isAuthModalOpen: false,
      setAuthModalOpen: (open) => set({ isAuthModalOpen: open }),
      authModalMode: 'login',
      setAuthModalMode: (mode) => set({ authModalMode: mode }),
      redirectAfterAuth: null,
      setRedirectAfterAuth: (path) => set({ redirectAfterAuth: path })
    }),
    {
      name: 'tawakkal-ui'
    }
  )
);
