/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {configureStore} from "@reduxjs/toolkit";
import {profile} from "@store/profile.reducer";
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux";
import {vendors} from "@store/vendors.reducer";
import {cart} from "@store/cart.reducer";
import {addressBook} from "@store/AddressBook.reducer";
import {listings} from "@store/listings.reducer";
/**
 * RootState for Nana Main App
 *
 * All state reducer in this store must be designed for global use and placed in this
 * directory as such. Reducer that are not meant to be global must not be part of
 * RootState.
 *
 * Non-global state should be managed independently within its own React Component.
 */
export function initializeStore() {
    return configureStore({
        reducer: {
            profile: profile.reducer,
            vendors: vendors.reducer,
            cart: cart.reducer,
            addressBook: addressBook.reducer,
            listings: listings.reducer
        },
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({ serializableCheck: false })
    });
}

export type RootStore = ReturnType<typeof initializeStore>;
export type RootState = ReturnType<RootStore["getState"]>;

const store = initializeStore()

export type AppDispatch = typeof store.dispatch


export const useAppDispatch = () => useDispatch<AppDispatch>()

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
