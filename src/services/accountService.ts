import { apiSlice } from "../api/apiSlice";
import { Session } from "../models/Session";
import { UserModel } from "../models/UserModel";
import { allActions } from "../store/reducers/actions";

export interface SendEmailRequest {
    type: "authorization" | "authorization.receive" | "settings.confirm" | "settings.confirm.receive" | "settings.new" | "settings.new.receive";
    email?: string | null;
}

export interface ConfirmServiceRequest {
    service: "email" | "google";
    type: "auth" | "settings";
    code: string[];
    email?: string | null;
}

export interface ChangePasswordRequest {
    email?: string | null;
    password: string;
    repeatPassword: string;
}

export const accountApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getMe: builder.query<UserModel, void>({
            query: () => ({
                url: 'account/me', 
                method: 'GET'
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    dispatch(allActions.account.setUser(data));
                } catch (err) {
                    console.error("accountApiSlice /me error: ", err);

                    dispatch(allActions.account.logout());
                }
            }
        }),
        sendEmail: builder.mutation<undefined, SendEmailRequest>({
            query: credentials => ({
                url: 'account/email',
                method: 'POST',
                body: credentials
            }),
            async onQueryStarted(queryArgument, { dispatch }) {
                try {
                    dispatch(allActions.authorization.setPage("recoveryCode"));
                    dispatch(allActions.authorization.setEmail(queryArgument.email ?? null));
                } catch (err) {
                    console.error("accountApiSlice /email error: ", err);
                }
            }
        }),
        confirmService: builder.mutation<undefined, ConfirmServiceRequest>({
            query: credentials => ({
                url: 'account/confrim-service',
                method: 'POST',
                body: credentials
            }),
            async onQueryStarted(queryArgument, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;

                    if (queryArgument.service === "email" && queryArgument.type === "auth") {
                        setTimeout(() => {
                            dispatch(allActions.authorization.setPage("recoveryPassword"));
                        }, 1125);
                    }

                    if (queryArgument.service === "google" && queryArgument.type === "auth") {
                        setTimeout(() => {
                            window.location.href = '/dashboard';
                        }, 1125);
                    }
                } catch (err) {
                    console.error("accountApiSlice /confrim-service error: ", err);
                }
            }
        }),
        getGoogleQr: builder.query<{base64: string}, void>({
            query: _ => ({
                url: '/account/get-2fa-qr',
                method: 'GET'
            })
        }),
        changePassword: builder.mutation<string, ChangePasswordRequest>({
            query: credentials => ({
                url: 'account/change-password',
                method: 'POST',
                body: credentials
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;

                    //mb success toast 
                } catch (err) {
                    console.error("accountApiSlice /change-password error: ", err);
                }
            }
        }),
        checkPassword: builder.mutation<void, {password: string}>({
            query: credentials => ({
                url: 'account/check-password',
                method: 'POST',
                body: credentials
            })
        }),
        deleteAccount: builder.mutation<void, {password: string}>({
            query: credentials => ({
                url: 'account/delete',
                method: 'POST',
                body: credentials
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    

                    // logout 
                } catch (err) {
                    console.error("accountApiSlice account/delete error: ", err);
                }
            }
        }),
        updateProfileName: builder.mutation<void, {firstname: string, lastname: string}>({
            query: credentials => ({
                url: 'account/update-name',
                method: 'POST',
                body: credentials
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    
                } catch (err) {
                    console.error("accountApiSlice account/update-name error: ", err);
                }
            }
        }),
        getSessions: builder.query<Session[], void>({
            query: () => ({
                url: '/account/sessions',
                method: 'GET'
            }),
            providesTags: ['Sessions'] 
        }),
        endSession: builder.mutation<void, number>({
            query: (sessionId) => ({
                url: `/account/sessions/${sessionId}`,
                method: 'DELETE'
            }),
            invalidatesTags: ['Sessions']
        }),
        endAllOtherSessions: builder.mutation<void, void>({
            query: () => ({
                url: '/account/sessions/others',
                method: 'DELETE'
            }),
            invalidatesTags: ['Sessions'] 
        }),
        updateInactivityTimeout: builder.mutation<void, number>({
            query: (days) => ({
                url: '/account/sessions/inactivity',
                method: 'PUT',
                body: { days }
            }),
            async onQueryStarted(days, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(allActions.account.updateSessionInactiveDays(days));
                } catch (err) {
                    console.error("Ошибка обновления периода неактивности:", err);
                }
            }
        })
    })
})

export const { 
    useSendEmailMutation, 
    useConfirmServiceMutation, 
    useChangePasswordMutation, 
    useCheckPasswordMutation, 
    useDeleteAccountMutation, 
    useGetGoogleQrQuery, 
    useUpdateProfileNameMutation,
    useGetSessionsQuery,
    useEndSessionMutation,
    useEndAllOtherSessionsMutation,
    useUpdateInactivityTimeoutMutation,
    useGetMeQuery
} = accountApiSlice;