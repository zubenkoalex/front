import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState } from "./state";
import { UserModel } from "../../../models/UserModel";

const initialState: UserState = {
    user: null
}

export const AccountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<UserModel>) {
            state.user = action.payload;
        },
        updateSessionInactiveDays(state, action: PayloadAction<number>) {
            if (state.user) {
                state.user.sessionInactiveDays = action.payload;
            }
        },
        logout(state) {
            state.user = null;
        },
    }
})

export default AccountSlice.reducer;