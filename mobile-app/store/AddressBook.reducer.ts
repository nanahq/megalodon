import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppActions } from "@store/reducers.actions";
import {AddressBookDto, AddressBookI, AddressLabelI} from "@nanahq/sticky";
import {_api} from "@api/_request";
import {showToastStandard} from "@components/commons/Toast";
import {clearOnAuthError} from "@store/common";

export interface AddressBookState {
    addressLabels: AddressLabelI[] ;
    addressBook: AddressBookI[] ;
    hasFetchedAddresses: boolean;

    addingAddress: boolean
}

const initialState: AddressBookState = {
    addressBook: [],
    addressLabels: [],
    hasFetchedAddresses: false,
    addingAddress: false
};

export const fetchAddressLabels = createAsyncThunk(
    AppActions.FETCH_ADDRESS_LABEL,
    async () => {
        return await _api.requestData<undefined>({
            method: 'get',
            url: 'address-books/labels'
        })
    }
);

export const fetchAddressBook = createAsyncThunk(
    AppActions.FETCH_ADDRESS_BOOK,
    async () => {
        return await _api.requestData<undefined>({
            method: 'get',
            url: 'address-books'
        })
    }
);


export const addAddressBook =  createAsyncThunk(
    AppActions.ADD_ADDRESS_BOOK,
    async (data: any, {dispatch}) => {
        const response = await _api.requestData<AddressBookDto>({
            method: 'post',
            url: 'address-books',
            data
        })
        dispatch(fetchAddressBook())
        return response
    }
);

export const addressBook = createSlice({
    name: "addressBook",
    initialState,
    reducers: {
        },
    extraReducers: builder => {
        builder
            .addCase(
            fetchAddressLabels.fulfilled,
            (state, {payload: {data}}: PayloadAction<{data: AddressLabelI[]}>) => {
                state.addressLabels = data
            }
        )
        .addCase(
            fetchAddressBook.fulfilled,
            (state, {payload: {data}}: PayloadAction<{data: AddressBookI[]}>) => {
                state.addressBook = data
                state.hasFetchedAddresses = true
            }
        ).addCase(
            addAddressBook.rejected,
            (state, _payload) => {
                state.addingAddress = false
                showToastStandard(_payload.error.message ?? 'Can not add address at this time', 'error')
                if (_payload.error.message === 'Unauthorized') {
                    void clearOnAuthError()
                }
                if (_payload.error.message?.includes('id is not found')) {
                    void clearOnAuthError()
                }
            }
        )
            .addCase(
                addAddressBook.fulfilled,
                (state) => {
                    state.addingAddress = false
                    showToastStandard( 'Address saved!', 'success')

                }
            )

            .addCase(
                addAddressBook.pending,
                (state) => {
                    state.addingAddress = true
                }
            )
    }
});

