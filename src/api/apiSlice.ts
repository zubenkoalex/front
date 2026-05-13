import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import { allActions } from '../store/reducers/actions';

interface RefreshResponse {
  accessToken: string;
}

const baseQuery = fetchBaseQuery({
    baseUrl: 'https://adzen-ai.ru/api',
    credentials: 'include'
})

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs, 
    unknown, 
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    return result
}

export const apiSlice = createApi({
    baseQuery: baseQueryWithReauth,
    tagTypes: [
        'chat',
        'chat-list',
        'company',
        'statistics',
        'forecast',
        'creative',
        'Sessions'
    ],
    endpoints: builder => ({})
})