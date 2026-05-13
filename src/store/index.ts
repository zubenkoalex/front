import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authorizationReducer from "./reducers/Authorization/authorizationSlice";
import accountReducer from "./reducers/User/accountSlice";
import pageReducer from "./reducers/Page/pageSlice";
import dashboardReducer from "./reducers/Dashboard/dashboardSlice";
import { apiSlice } from "../api/apiSlice";

const rootReducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    authorizationReducer,
    accountReducer,
    pageReducer,
    dashboardReducer
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware)
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']