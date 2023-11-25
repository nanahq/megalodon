import {createAsyncThunk, createSlice, PayloadAction,} from "@reduxjs/toolkit";
import {AppActions} from "@store/reducers.actions";
import {_api} from "@api/_request";
import {clearOnAuthError} from "@store/common";
import { showToastStandard } from "@components/commons/Toast";
import {VendorUserI} from '@nanahq/sticky'


export interface VendorState {
    vendors: VendorUserI[] | undefined

    subscriptions: any[] | undefined
    hasFetchedVendor: boolean
}

const initialState: VendorState = {
    hasFetchedVendor: false,
    subscriptions: undefined,
    vendors: undefined
};

export const fetchVendors = createAsyncThunk(
    AppActions.FETCH_VENDORS,
    async () => {
        return await _api.requestData<undefined>({
            method: 'get',
            url: 'vendor/vendors'
        })
    }
);

export const fetchSubscriptions = createAsyncThunk(
    AppActions.FETCH_SUBS,
    async (id: string) => {
        return await _api.requestData<undefined>({
            method: 'get',
            url: `vendor/subscriptions/${id}`
        })
    }
);

export const vendors = createSlice({
    extraReducers: (builder) => {
        builder
            .addCase(
                fetchVendors.fulfilled,
                (state, {payload: {data}}: PayloadAction<{ data: any, cookies: any }>) => {
                    state.vendors = data
                    state.hasFetchedVendor = true
                }
            ).addCase(
            fetchVendors.rejected,
            (_, _payload) => {
                showToastStandard('Can not fetch profile', 'error')
                if (_payload.error.message === 'Unauthorized') {
                    void clearOnAuthError()
                }
                if (_payload.error.message?.includes('id is not found')) {
                    void clearOnAuthError()
                }
            }
        ).addCase(fetchVendors.pending, (state) => {
            state.hasFetchedVendor = false

        }).addCase(fetchSubscriptions.fulfilled, (state, {payload: {data}}: PayloadAction<{ data: any, cookies: any }>) => {
                state.subscriptions = data
            })

    },
    initialState,
    name: "profile",
    reducers: {
        setHasFetchedProfile: (state, action: PayloadAction<boolean>) => {
            state.hasFetchedVendor = action.payload
        }
    },
});
