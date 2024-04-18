import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppActions } from "@store/reducers.actions";
import {_api} from "@api/_request";
import {ListingCategoryI, LocationCoordinates, ScheduledListingI, UserHomePage} from "@nanahq/sticky";

export interface ListingsState {
    hompage: UserHomePage | undefined

    categories: ListingCategoryI[] | undefined
    hasFetchedListings: boolean;
}

const initialState: ListingsState = {
    hompage: undefined,
    hasFetchedListings: false,
    categories: undefined
};

export const fetchAllScheduledListings = createAsyncThunk(
    AppActions.FETCHED_SCHEDULED_LISTING,
    async () => {
        return await _api.requestData<undefined, ScheduledListingI[]>({
            method: 'GET',
            url: 'listing/scheduled'
        })
    }
);

export const fetchHomaPage = createAsyncThunk(
    AppActions.FETCH_HOMEPAGE,
    async (data: LocationCoordinates) => {
        return await _api.requestData<LocationCoordinates, UserHomePage>({
            method: 'POST',
            url: 'listing/homepage',
            data
        })
    }
);

export const fetchAllCategories = createAsyncThunk(
    AppActions.FETCH_CATEGORY,
    async () => {
        return await _api.requestData<undefined, ListingCategoryI[]>({
            method: 'GET',
            url: 'listing/categories'
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
                fetchAllCategories.fulfilled,
                (state, {payload: {data}}: PayloadAction<{data: ListingCategoryI[]}>) => {
                    state.categories = data
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
                (state) => {
                    state.hasFetchedListings = false
                }
            )
    }
});

