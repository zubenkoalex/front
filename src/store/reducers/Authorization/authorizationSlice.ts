import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthorizationState } from "./state";
import { AuthorizationPages } from "../../../types/Authorization";

const initialState: AuthorizationState = {
    page: "login",
    email: null
}

export const AuthorizationSlice = createSlice({
    name: 'authorization',
    initialState,
    reducers: {
        setPage(state, action: PayloadAction<AuthorizationPages>) {
            state.page = action.payload;
        },
        setEmail(state, action: PayloadAction<string | null>) {
            state.email = action.payload;
        },
        resetState() {
            return initialState;
        }
    }
})

export default AuthorizationSlice.reducer;