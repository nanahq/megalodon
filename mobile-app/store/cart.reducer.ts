import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppActions } from "@store/reducers.actions";
import { Cart } from "@screens/AppNavigator/Screens/modals/Listing.Modal";

export interface CartState {
    vendor: string | undefined;
    cart: Cart[] | undefined;
    hasItemsInCart: boolean;
}

const initialState: CartState = {
    vendor: undefined,
    cart: undefined,
    hasItemsInCart: false,
};

export const readCartFromStorage = createAsyncThunk(AppActions.READ_CART_FROM_STORAGE,
    async () => {
        try {
            const storedCart = await AsyncStorage.getItem("cart");
            if (!storedCart) {
                return;
            }

            return JSON.parse(storedCart)
        } catch (error) {
            // Handle errors if needed
        }
    });

export const deleteCartFromStorage = createAsyncThunk(AppActions.DELETE_CART_FROM_STORAGE,
    async () => {
        try {
           await AsyncStorage.removeItem("cart");
           return true
        } catch (error) {
            // Handle errors if needed
        }
    });
export const saveCartToStorage = createAsyncThunk(
    AppActions.SAVE_CART_TO_STORAGE,
    async (cartData: { vendor: string; cart: Cart }) => {
            // Read the existing cart data from storage (if any)
            const storedCart = await AsyncStorage.getItem("cart");
            let existingCart: CartState = initialState; // Initialize with the initial state

            if (storedCart) {
                existingCart = JSON.parse(storedCart) as CartState;
            }

            const newCart: CartState = { ...existingCart }; // Clone the existing cart

            if (existingCart.vendor === cartData.vendor) {
                if (existingCart.cart !== undefined) {
                    newCart.cart = [...existingCart.cart, cartData.cart];
                    newCart.hasItemsInCart = true;
                    newCart.vendor = cartData.vendor;
                }
            } else {
                newCart.vendor = cartData.vendor;
                newCart.cart = [cartData.cart];
                newCart.hasItemsInCart = true;
            }

            // Save the updated cart data to storage
            await AsyncStorage.setItem("cart", JSON.stringify(newCart));
            return newCart;
    }
);


export const cart = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItemToCart: (state, { payload }: PayloadAction<{ vendor: string; cart: Cart }>) => {
            const { vendor, cart } = payload;
            if (state.vendor !== undefined) {
                if (vendor === state.vendor) {
                    if (state.cart !== undefined) {
                        state.cart = [...state.cart, cart];
                        state.hasItemsInCart = true;
                    }
                } else {
                    state.vendor = vendor;
                    state.cart = [cart];
                    state.hasItemsInCart = true;
                }
            } else {
                state.vendor = vendor;
                state.cart = [cart];
                state.hasItemsInCart = true;
            }
        },
    },
    extraReducers: builder => {
        builder.addCase(
            saveCartToStorage.fulfilled,
            (state, {payload}: PayloadAction<CartState>) => {
               state.cart = payload.cart
               state.vendor = payload.vendor
                state.hasItemsInCart = payload.hasItemsInCart
            }
        )
            .addCase(
                deleteCartFromStorage.fulfilled,
                (state,) => {
                    state.cart = undefined
                    state.vendor = undefined
                    state.hasItemsInCart = false
                }
            )
            .addCase(
                readCartFromStorage.fulfilled,
                (state, {payload}: any ) => {
                    state.cart = payload.cart
                    state.vendor = payload.vendor
                    state.hasItemsInCart = true
                }
            )
    }
});

export const { addItemToCart } = cart.actions;
