import { apiSlice } from "../api/apiSlice";
import { allActions } from "../store/reducers/actions";
import { getErrorMessage } from "../utils";
import { playSound2D } from "../utils/sounds";

export interface LoginRequest {
    loginOrEmail: string;
    password: string;
    remember: boolean;
}

export interface LoginResponse {
    accessToken: string;
}

export interface RegisterRequest {
    login: string;
    email: string;
    password: string;
    repeatPassword: string;
}

export const authorizationApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: credentials => ({
                url: '/login',
                method: 'POST',
                body: credentials
            })
        }),
        signup: builder.mutation<LoginResponse, RegisterRequest>({
            query: credentials => ({
                url: '/signup',
                method: 'POST',
                body: credentials
            })
        }),
        logout: builder.mutation<void, void>({
            query: () => ({
                url: '/logout',
                method: 'POST',
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;

                    dispatch(allActions.account.logout());
                    dispatch(allActions.dashboard.resetState());
                    dispatch(allActions.authorization.resetState());
                    dispatch(allActions.page.clearToasts());
                    dispatch(apiSlice.util.resetApiState());
                } catch (err) {
                    console.error("authorizationApiSlice /logout error: ", err);

                    dispatch(allActions.page.addToast({ msg: getErrorMessage(err), type: "error" }));
                    playSound2D("error", 1);
                }
            }
        })
    })
})

export const { 
    useLoginMutation, 
    useSignupMutation,
    useLogoutMutation
} = authorizationApiSlice;