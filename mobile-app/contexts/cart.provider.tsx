import { VendorUserI } from "@nanahq/sticky";
import { createContext, PropsWithChildren, useContext, useState } from "react";
import { Cart } from "@screens/AppNavigator/Screens/modals/Listing.Modal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {clearOnAuthError} from "@store/common";

interface CartState {
    vendor: VendorUserI | undefined;
    cart: Cart[] | undefined;
    hasItemsInCart: boolean;
    cartItemAvailableDate?: number;
}

    interface CartContextValue {
    cart: CartState;
    removeCartItem: (cartItemId: string) => Promise<CartState | undefined>;
    readCart: () => Promise<CartState | null>;
    deleteCart: () => Promise<boolean>;
    saveCart: (cartData: SaveCartInput) => Promise<CartState>;
}

interface SaveCartInput {
    vendor: VendorUserI;
    cart: Cart;
    cartAvailableDate?: number;
}

// Storage Constants
const STORAGE_KEY = 'cart';

// Create Context with a more specific type
const CartContext = createContext<CartContextValue | undefined>(undefined);

// Custom hook with better error handling
export function useCart(): CartContextValue {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

const storage = {
    async get<T>(): Promise<T | null> {
        try {
            const data = await AsyncStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error reading from storage:', error);
            return null;
        }
    },

    async set<T>(value: T): Promise<void> {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
        } catch (error) {
            console.error('Error writing to storage:', error);
            throw error;
        }
    },

    async remove(): Promise<void> {
        try {
            await AsyncStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('Error removing from storage:', error);
            throw error;
        }
    }
};

export function CartProvider({ children }: PropsWithChildren): JSX.Element {

    const [cartState, setCartState] = useState<CartState>({
        vendor: undefined,
        cart: undefined,
        hasItemsInCart: false,
        cartItemAvailableDate: undefined
    });

    const removeCartItem = async (cartItemId: string): Promise<CartState | undefined> => {
        try {
            const storedCart = await storage.get<CartState>();
            if (!storedCart) return undefined;

            const itemIndex = storedCart.cart?.findIndex((item, index) => {
                const uniqueCartItemId = `${item?.cartItem?._id}-${index}`;
                return uniqueCartItemId === cartItemId;
            });

            if (itemIndex === undefined || itemIndex === -1) {
                return storedCart;
            }

            const updatedCartItems = storedCart.cart?.filter((_, index) => index !== itemIndex);

            if (updatedCartItems && updatedCartItems.length > 0) {
                const updatedCartState: CartState = {
                    ...storedCart,
                    cart: updatedCartItems,
                    hasItemsInCart: true
                };
                await storage.set(updatedCartState);
                setCartState(updatedCartState);
                return updatedCartState;
            }

            await storage.remove();
            const emptyCart: CartState = {
                vendor: undefined,
                cart: undefined,
                hasItemsInCart: false,
                cartItemAvailableDate: undefined
            };
            setCartState(emptyCart);
            return undefined;
        } catch (error) {
            console.error("Error removing cart item:", error);
            return undefined;
        }
    }
    const readCart = async (): Promise<CartState | null> => {
        try {
            const storedCart = await storage.get<CartState>();
            if (storedCart) {
                setCartState(storedCart);
            }
            return storedCart;
        } catch (error) {
            console.error("Error reading cart:", error);
            return null;
        }
    };

    const deleteCart = async (): Promise<boolean> => {
        try {
            await storage.remove();
            setCartState({
                vendor: undefined,
                cart: undefined,
                hasItemsInCart: false,
                cartItemAvailableDate: undefined
            });
            return true;
        } catch (error) {
            console.error("Error deleting cart:", error);
            return false;
        }
    };

    const saveCart = async (cartData: SaveCartInput): Promise<CartState> => {
        try {
            const storedCart = await storage.get<CartState>();
            const existingCart: CartState = storedCart || cartState;

            const newCart: CartState = {
                ...existingCart,
                vendor: cartData.vendor,
                hasItemsInCart: true,
                cartItemAvailableDate: cartData.cartAvailableDate
            };

            if (existingCart.vendor?._id === cartData.vendor._id) {
                newCart.cart = [...(existingCart.cart || []), cartData.cart];
            } else {
                newCart.cart = [cartData.cart];
            }

            await storage.set(newCart);
            setCartState(newCart);
            return newCart;
        } catch (error) {
            console.error("Error saving cart:", error);
            throw error;
        }
    };

    const contextValue: CartContextValue = {
        cart: cartState,
        removeCartItem,
        readCart,
        deleteCart,
        saveCart
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
}
