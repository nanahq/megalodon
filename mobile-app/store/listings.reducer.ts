import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppActions } from "@store/reducers.actions";
import {_api} from "@api/_request";
import {LocationCoordinates, UserHomePage} from "@nanahq/sticky";

export interface ListingsState {
    hompage: UserHomePage | undefined
    hasFetchedListings: boolean;
}

const initialState: ListingsState = {
    hompage: undefined,
    hasFetchedListings: false
};

export const fetchAllScheduledListings = createAsyncThunk(
    AppActions.FETCHED_SCHEDULED_LISTING,
    async () => {
        return await _api.requestData<undefined>({
            method: 'get',
            url: 'listing/scheduled'
        })
    }
);

export const fetchHomaPage = createAsyncThunk(
    AppActions.FETCH_HOMEPAGE,
    async (data: LocationCoordinates) => {
        return await _api.requestData<LocationCoordinates>({
            method: 'POST',
            url: 'listing/homepage',
            data
        })
    }
);

export const fetchAllCategories = createAsyncThunk(
    AppActions.FETCH_CATEGORY,
    async (data: LocationCoordinates) => {
        return await _api.requestData<LocationCoordinates>({
            method: 'POST',
            url: 'listing/categories',
            data
        })
    }
);


export const listings = createSlice({
    name: "listings",
    initialState,
    reducers: {
    },
    extraReducers: builder => {
        builder
            .addCase(
                fetchHomaPage.fulfilled,
                (state, {payload: {data}}: PayloadAction<{data: UserHomePage}>) => {
                    state.hompage = data
                    state.hasFetchedListings = true
                }
            )
            .addCase(
                fetchHomaPage.pending,
                (state) => {
                    state.hasFetchedListings = false
                }
            )
            .addCase(
                fetchHomaPage.rejected,
                (state, payload) => {
                    state.hasFetchedListings = false
                }
            )

    }
});

