import { apiSlice } from "../api/apiSlice";
import { Company } from "../models/Company";
import { allActions } from "../store/reducers/actions";
import { Chat, CompanyForecast, Message, CompanyCreative, NewCompanyMainInfo, NewCompanyTargetPeople } from "../types/Dashboard";
import { AdCompanyProps, ChartSeries, ChartData, StatisticsValues } from "../types/UI";
import { getErrorMessage } from "../utils";
import { playSound2D } from "../utils/sounds";

export interface GetCompaniesRequest {
    offset: number;
    limit: number;
    sortBy: string;
    sortOrder: "desc" | "asc";
    search?: string;
    status?: string;
    platform?: string;
}

export interface GetCompaniesResponse {
    items: Company[];
    totalCount: number;
}

export interface GetStatisticsRequest {
    type: "performance" | "spending";
    filter: "current-month" | "days" | "other";
    companyId?: string;
    days?: string;
    dateFrom?: string;
    dateTo?: string;
}

export interface GetStatisticsResponse {
    chartData: ChartData[];
    series: ChartSeries[];
}

export interface GetGlobalStatisticsResponse {
    totalSpent: StatisticsValues,
    audienceReach: StatisticsValues,
    ctr: StatisticsValues,
    conversion: StatisticsValues
}

export interface GetCompanyForecastsRequest {
    main: NewCompanyMainInfo;
    targetPeople: NewCompanyTargetPeople;
    creatives: string[];
}

export interface CreateCompanyRequest {
    main: NewCompanyMainInfo;
    targetPeople: NewCompanyTargetPeople;
    selectedCreatives: CompanyCreative[];
    platform: string;
    strategy: string;
}

export const dashboardApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        getGlobalStatistics: builder.query<GetGlobalStatisticsResponse, undefined>({
            query: () => ({
                url: '/statistics/general',
                method: 'GET'
            }),
            providesTags: ['statistics']
        }),
        getStatistics: builder.query<GetStatisticsResponse, GetStatisticsRequest>({
            query: credentials => ({
                url: '/statistics',
                method: 'GET',
                params: credentials
            }),
            providesTags: ['statistics']
        }),
        getCompanies: builder.query<GetCompaniesResponse, GetCompaniesRequest>({
            query: credentials => ({
                url: '/companies',
                method: 'GET',
                params: credentials
            })
        }),
        generateCreative: builder.mutation<{ url: string }, string>({
            query: credentials => ({
                url: '/generate/creative',
                method: 'POST',
                body: credentials
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    
                    dispatch(allActions.dashboard.createCreatives({
                        id: crypto.randomUUID(),
                        previewUrl: data.url,
                        serverUrl: data.url,
                        name: "AI Creative",
                        type: "image/png",
                        size: 0,
                        status: 'completed',
                        progress: 100,
                        generated: true
                    }));

                    playSound2D("ui-load", 0.15);
                } catch (err) {
                    console.error("dashboardApiSlice /generate/creative error: ", err);
                }
            }
        }),
        uploadCreativeFile: builder.mutation<{ url: string }, { file: File; id: string }>({
            queryFn: async ({ file, id }, { dispatch }) => {
                return new Promise((resolve) => {
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', `https://adzen-ai.ru/api/upload`);

                    xhr.upload.onprogress = (event) => {
                        if (event.lengthComputable) {
                            const progress = Math.round((event.loaded / event.total) * 100);
                            dispatch(allActions.dashboard.updateCreativeProgress({ id, progress }));
                        }
                    };

                    xhr.onload = () => {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            try {
                                const response = JSON.parse(xhr.responseText);

                                if (!response?.url) {
                                    throw new Error("Ответ сервера не содержит url");
                                }

                                dispatch(allActions.dashboard.updateCreativeStatus({ id, status: 'completed', serverUrl: response.url }));
                                playSound2D("ui-load", 0.15);
                                resolve({ data: response });
                            } catch (e) {
                                const errorMsg = `Некорректный ответ сервера при загрузке ${file.name}`;
                                dispatch(allActions.dashboard.updateCreativeStatus({ id, status: "error" }));
                                dispatch(allActions.page.addToast({ msg: errorMsg, type: "error" }));
                                playSound2D("error", 1);
                                resolve({ error: { status: "PARSING_ERROR", data: errorMsg } as any });
                            }
                            
                        } else {
                            let errorMsg = `Ошибка загрузки файла ${file.name}`;
                            try {
                                const parsedError = JSON.parse(xhr.responseText);
                                errorMsg = parsedError.message || parsedError.error || errorMsg;
                            } catch (e) { errorMsg = xhr.responseText; }

                            dispatch(allActions.dashboard.updateCreativeStatus({ id, status: 'error' }));
                            dispatch(allActions.page.addToast({ msg: errorMsg, type: "error" }));
                            playSound2D("error", 1);
                            resolve({ error: { status: xhr.status, data: errorMsg } as any });
                        }
                    };

                    xhr.onerror = () => {
                        dispatch(allActions.dashboard.updateCreativeStatus({ id, status: 'error' }));
                        dispatch(allActions.page.addToast({ msg: "Ошибка сети при загрузке", type: "error" }));
                        playSound2D("error", 1);
                        resolve({ error: { status: 'FETCH_ERROR', error: 'Network error' } as any });
                    };

                    const formData = new FormData();
                    formData.append('file', file);
                    xhr.send(formData);
                });
            },
        }),
        getCompanyForecasts: builder.query<CompanyForecast, GetCompanyForecastsRequest>({
            query: credentials => ({
                url: '/generate/forecasts',
                method: 'POST',
                body: credentials
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    dispatch(allActions.dashboard.setForecast(data));
                } catch (err) {
                    console.error("dashboardApiSlice /generate/forecasts error: ", err);
                }
            }
        }),
        createCompany: builder.mutation<string, CreateCompanyRequest>({
            query: credentials => ({
                url: '/create-company',
                method: 'POST',
                body: credentials
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    dispatch(allActions.dashboard.clearBuild());
                } catch (err) {
                    console.error("dashboardApiSlice /create-company error: ", err);
                }
            }
        }),
        getChatHistory: builder.query<Message[], string>({
            query: (chatId) => ({
                url: `/chat/${chatId}/history`,
                method: 'GET'
            }),
            providesTags: (result, error, chatId) => [
                { type: 'chat', id: chatId }
            ],
            async onQueryStarted(chatId, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    data.forEach(msg => dispatch(allActions.dashboard.addMessage(msg)));
                } catch (err) {
                    console.error("Ошибка загрузки истории чата:", err);
                }
            }
        }),
        getChats: builder.query<Chat[], undefined>({
            query: () => ({
                url: `/chats`,
                method: 'GET'
            }),
            providesTags: ['chat-list'],
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;

                    data.forEach(chat => dispatch(allActions.dashboard.addChat({ 
                        id: chat.id, 
                        name: chat.name 
                    })));
                } catch (err) {
                    console.error("Ошибка загрузки списка чатов:", err);
                }
            }
        }),
        uploadChatFile: builder.mutation<{ url: string }, { file: File; id: string }>({
            queryFn: async ({ file, id }, { dispatch }) => {
                return new Promise((resolve) => {
                    const xhr = new XMLHttpRequest();
                    xhr.open('POST', `https://adzen-ai.ru/api/upload`);

                    xhr.upload.onprogress = (event) => {
                        if (event.lengthComputable) {
                            const progress = Math.round((event.loaded / event.total) * 100);
    
                            dispatch(allActions.dashboard.updateFileProgress({ id, progress }));
                        }
                    };

                    xhr.onload = () => {
                        if (xhr.status >= 200 && xhr.status < 300) {

                            try {
                                const response = JSON.parse(xhr.responseText);

                                if (!response?.url) {
                                    throw new Error("Ответ сервера не содержит url");
                                }

                                dispatch(allActions.dashboard.updateFileStatus({ id, status: 'completed', serverUrl: response.url }));
                                resolve({ data: response });
                            } catch (e) {
                                const errorMsg = `Некорректный ответ сервера при загрузке ${file.name}`;
                                dispatch(allActions.dashboard.updateFileStatus({ id, status: "error" }));
                                dispatch(allActions.page.addToast({ msg: errorMsg, type: "error" }));
                                playSound2D("error", 1);
                                resolve({ error: { status: "PARSING_ERROR", data: errorMsg } as any });
                            }
                        } else {
                            dispatch(allActions.dashboard.updateFileStatus({ id, status: 'error' }));
                            dispatch(allActions.page.addToast({ msg: getErrorMessage(xhr.responseText), type: "error" }));
                            playSound2D("error", 1);

                            resolve({ error: { status: xhr.status, data: xhr.statusText } as any });
                        }
                    };

                    xhr.onerror = () => {
                        const errorMsg = xhr.statusText || `Ошибка сети при загрузке ${file.name}. Проверьте подключение.`;

                        dispatch(allActions.dashboard.updateFileStatus({ id, status: 'error' }));
                        dispatch(allActions.page.addToast({ msg: xhr.statusText ? getErrorMessage(xhr.statusText) : errorMsg, type: "error" }));
                        playSound2D("error", 1);

                        resolve({ error: { status: 'FETCH_ERROR', error: xhr.statusText ? getErrorMessage(xhr.statusText) : errorMsg } as any });
                    };

                    const formData = new FormData();
                    formData.append('file', file);
                    xhr.send(formData);
                });
            },
        }),
        generateChatTitle: builder.mutation<{ title: string }, { chatId: string; prompt: string }>({
            query: ({ chatId, prompt }) => ({
                url: `/chat/generate-title`, 
                method: 'POST',
                body: { chatId, prompt }
            }),
            async onQueryStarted({ chatId }, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    
                    dispatch(allActions.dashboard.renameChat({ id: chatId, name: data.title }));
                } catch (err) {
                    console.error("Ошибка генерации названия чата: ", err);
                }
            }
        }),
        getCompanyById: builder.query<Company, string>({
            query: (id) => ({
                url: `/companies/${id}`,
                method: 'GET'
            }),
        }),
        reportBug: builder.mutation<void, {message: string;}>({
            query: credentials => ({
                url: '/report',
                method: 'POST',
                body: credentials
            }),
            async onQueryStarted(_, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;

                    dispatch(allActions.page.addToast({ msg: "Спасибо! Ваше сообщение отправлено разработчикам", type: "success" }));
                    playSound2D("success", 1);
                } catch (err) {
                    console.error("dashboardApiSlice /report error: ", err);

                    dispatch(allActions.page.addToast({ msg: "Не удалось отправить отчет", type: "error" }));
                    playSound2D("error", 1);
                }
            }
        }),
    })
})

export const { 
    useGetCompaniesQuery, 
    useGetGlobalStatisticsQuery, 
    useGetStatisticsQuery, 
    useGenerateCreativeMutation, 
    useGetCompanyForecastsQuery, 
    useCreateCompanyMutation,
    useUploadChatFileMutation,
    useGenerateChatTitleMutation,
    useGetChatsQuery,
    useGetChatHistoryQuery,
    useUploadCreativeFileMutation,
    useGetCompanyByIdQuery,
    useReportBugMutation
} = dashboardApiSlice;