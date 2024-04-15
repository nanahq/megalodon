import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppActions } from "@store/reducers.actions";
import { Cart } from "@screens/AppNavigator/Screens/modals/Listing.Modal";
import {VendorI, VendorUserI} from "@nanahq/sticky";

export interface CartState {
    vendor: VendorUserI | undefined;
    cart: Cart[] | undefined;
    hasItemsInCart: boolean;

    cartItemAvailableDate?: number
}

const initialState: CartState = {
    vendor: undefined,
    cart: undefined,
    hasItemsInCart: false,
    cartItemAvailableDate: undefined
};

export const readCartFromStorage = createAsyncThunk(AppActions.READ_CART_FROM_STORAGE,
    async () => {
        try {
            const storedCart = await AsyncStorage.getItem("cart");
            if (!storedCart) {
                return null;
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
            console.error(error)
        }
    });
export const saveCartToStorage = createAsyncThunk(
    AppActions.SAVE_CART_TO_STORAGE,
    async (cartData: { vendor: VendorUserI; cart: Cart, cartAvailableDate?: number}) => {
        // eslint-disable-next-line no-useless-catch
        try {
            // Fetch the existing cart from AsyncStorage
            const storedCart = await AsyncStorage.getItem("cart");
            let existingCart: CartState = initialState;


            if (storedCart) {
                existingCart = JSON.parse(storedCart) as CartState;
            }

            // Create a new cart object with updated data
            const newCart: CartState = { ...existingCart};
            if (existingCart.vendor?._id === cartData.vendor._id) {
                // If the vendor matches, add the cart item to the existing cart
                if (existingCart.cart !== undefined) {
                    newCart.cart = [...existingCart.cart, cartData.cart];
                    newCart.hasItemsInCart = true;
                    newCart.vendor = cartData.vendor;
                    newCart.cartItemAvailableDate = cartData.cartAvailableDate;
                }
            } else {
                newCart.vendor = cartData.vendor;
                newCart.cart = [cartData.cart];
                newCart.hasItemsInCart = true;
                newCart.cartItemAvailableDate = cartData.cartAvailableDate;
            }

            await AsyncStorage.setItem("cart", JSON.stringify(newCart));

            return newCart;
        } catch (error) {
            throw error;
        }
    }
);


export const cart = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addItemToCart: () => {

        }
    },
    extraReducers: builder => {
        builder.addCase(
            saveCartToStorage.fulfilled,
            (state, {payload}: PayloadAction<CartState>) => {
                state.cart = payload.cart
                state.vendor = payload.vendor
                state.hasItemsInCart = payload.hasItemsInCart
                state.cartItemAvailableDate = payload.cartItemAvailableDate
            }
        )
            .addCase(
                deleteCartFromStorage.fulfilled,
                (state,) => {
                    state.cart = undefined
                    state.vendor = undefined
                    state.hasItemsInCart = false
                    state.cartItemAvailableDate = undefined

                }
            )
            .addCase(
                readCartFromStorage.fulfilled,
                (state, {payload}: any ) => {
                    if (payload === null) {
                        state.cart = undefined
                        state.vendor = undefined
                        state.hasItemsInCart = false
                        state.cartItemAvailableDate = undefined
                        return
                    }
                    state.cart = payload.cart
                    state.vendor = payload.vendor
                    state.hasItemsInCart = true
                    state.cartItemAvailableDate = payload.cartItemAvailableDate

                }
            )
    }
});

export const { addItemToCart } = cart.actions;
