import {createAsyncThunk, createSlice, PayloadAction,} from "@reduxjs/toolkit";
import {AppActions} from "@store/reducers.actions";
import {_api} from "@api/_request";
import {clearOnAuthError} from "@store/common";
import {ResponseWithStatus, UserI, UpdateUserDto, LocationCoordinates} from '@nanahq/sticky'
import { showToastStandard } from "@components/commons/Toast";


export interface ProfileStateI extends Omit<UserI, 'location'>{
    location?: LocationCoordinates
    expoNotificationToken?: string
}
export interface ProfileState {
  profile: ProfileStateI
  hasFetchedProfile: boolean
  updatingProfile: boolean
}

const initialState: ProfileState = {
    profile: {
        orders: [],
        location: undefined,
        password: '',
        _id: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        isValidated: false,
        status: 'ONLINE',
        createdAt: '',
        updatedAt: '',
        isDeleted: false,
        expoNotificationToken: undefined
    },
    hasFetchedProfile: false,
    updatingProfile: false,
};

export const fetchProfile = createAsyncThunk(
    AppActions.FETCH_PROFILE,
    async () => {
        return await _api.requestData<undefined>({
            method: 'get',
            url: 'user/profile'
        })
    }
);

export const updateUserProfile = createAsyncThunk(
    AppActions.UPDATE_PROFILE,
    async (data: Partial<any>, {dispatch}): Promise<ResponseWithStatus> => {
        const res = (await _api.requestData<Partial<UpdateUserDto>>({
            method: 'PUT',
            url: 'user/update',
            data
        })).data

        dispatch(fetchProfile())
        return res
    }
);


export const profile = createSlice({
    name: "profile",
    initialState,
    reducers: {
        setHasFetchedProfile: (state, action: PayloadAction<boolean>) => {
            state.hasFetchedProfile = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(
            fetchProfile.fulfilled,
            (state, {payload: {data}}: PayloadAction<{data: any, cookies: any}>) => {
               state.profile = {...data}
                state.hasFetchedProfile = true
            }
        ).addCase(
            fetchProfile.rejected,
            (_, _payload) => {
                    showToastStandard('Can not fetch profile', 'error')
                    if (_payload.error.message === 'Unauthorized') {
                        void clearOnAuthError()
                    }
                    if (_payload.error.message?.includes('id is not found')) {
                        void clearOnAuthError()
                    }
            }
        ).addCase(fetchProfile.pending, (state) => {
            state.hasFetchedProfile = false
        })
            .addCase(updateUserProfile.pending, (state) => {
                state.updatingProfile = true
            })
            .addCase(updateUserProfile.fulfilled, (state) => {
                state.updatingProfile = false
            })
            .addCase(updateUserProfile.rejected, (state) => {
                state.updatingProfile = false
            })

    },
});
