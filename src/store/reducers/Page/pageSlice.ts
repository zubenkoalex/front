import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PageState } from "./state";
import { ToastIcons, ToastProps, ToastTypes } from "../../../types/UI";
import { playSound2D } from "../../../utils/sounds";


const initialState: PageState = {
    toasts: []
}

export const pageSlice = createSlice({
    name: 'page',
    initialState,
    reducers: {
        addToast(state, action: PayloadAction<{msg: string, type: ToastTypes}>) {
            const newToast = {
                id: crypto.randomUUID(),
                description: action.payload.msg,
                type: action.payload.type
            }

            state.toasts.push(newToast);
        },
        deleteToast(state, action: PayloadAction<ToastProps>) {
            state.toasts = state.toasts.filter((toast) => toast.id !== action.payload.id);
        },
        clearToasts(state) {
            state.toasts = [];
        }
    }
})

export default pageSlice.reducer;