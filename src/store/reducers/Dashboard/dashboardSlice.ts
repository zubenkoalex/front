import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DashboardState } from "./state";
import { CompanyForecast, companyForecastTest, Message, CompanyCreative, NewCompanyMainInfo, NewCompanyTargetPeople, SettingPages } from "../../../types/Dashboard";
import { playSound2D } from "../../../utils/sounds";
import { FileMetadata } from "../../../types/UI";
// ДОБАВЛЕН ИМПОРТ API
import { dashboardApiSlice } from '../../../services/dashboardService';

const THEME_STORAGE_KEY = "adzen-theme-mode";

const getInitialThemeMode = (): DashboardState["themeMode"] => {
    if (typeof window === "undefined") return "dark";

    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (saved === "dark" || saved === "light" || saved === "system") return saved;

    return "dark";
};

const initialState: DashboardState = {
    themeMode: getInitialThemeMode(),
    isSideBarOpen: true,
    activeModal: null,
    modalPage: null,
    showedImage: null,
    newCompanyBuild: {
        main: undefined,
        targetPeople: {
            gender: "all",
            age: "all",
            country: "all",
            interests: []
        },
        creatives: {
            default: [],
            selected: [],
        },
        forecast: companyForecastTest,
        platform: null,
        strategy: null
    },
    chat: {
        chats: {},
        messages: {},
        uploadedFiles: [],
        isTyping: false,
    }
}

export const DashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        setThemeMode(state, action: PayloadAction<"dark" | "light" | "system">) {
            state.themeMode = action.payload;
            if (typeof window !== "undefined") {
                window.localStorage.setItem(THEME_STORAGE_KEY, action.payload);
            }
        },
        toggleSideBar(state) {
            state.isSideBarOpen = !state.isSideBarOpen;
        },
        setActiveModal(state, action: PayloadAction<string | null>) {
            state.activeModal = action.payload
        },
        setNewCompanyMainInfo(state, action: PayloadAction<Partial<NewCompanyMainInfo>>) {
            if (!state.newCompanyBuild.main) {
                state.newCompanyBuild.main = {} as NewCompanyMainInfo;
            }

            state.newCompanyBuild.main = {
                ...state.newCompanyBuild.main,
                ...action.payload
            };
        },
        setNewCompanyTargetPeople(state, action: PayloadAction<Partial<NewCompanyTargetPeople>>) {
            state.newCompanyBuild.targetPeople = {
                ...state.newCompanyBuild.targetPeople,
                ...action.payload
            }
        },
        updateTargetPeopleInterests(state, action: PayloadAction<string>) {
            const interests = state.newCompanyBuild.targetPeople.interests;
            const interest = action.payload;

            if (interests.includes(interest)) {
                playSound2D("ui-click", 0.15);
                state.newCompanyBuild.targetPeople.interests = interests.filter(int => int !== interest);
                return;
            }

            if (interests.length === 10) return;

            playSound2D("ui-click", 0.15);
            interests.push(interest);
        },
        createCreatives(state, action: PayloadAction<CompanyCreative>) {
            state.newCompanyBuild.creatives.default.push(action.payload);
        },
        selectCreatives(state, action: PayloadAction<CompanyCreative>) {
            const selectedCreatives = state.newCompanyBuild.creatives.selected;
            const creativeId = action.payload.id;

            if (selectedCreatives.includes(creativeId)) {
                state.newCompanyBuild.creatives.selected = selectedCreatives.filter(id => id !== creativeId);
                return;
            }

            playSound2D("ui-click", 0.15);
            selectedCreatives.push(creativeId);
        },
        updateCreativeProgress(state, action: PayloadAction<{ id: string; progress: number }>) {
            const creative = state.newCompanyBuild.creatives.default.find(c => c.id === action.payload.id);
            if (creative) creative.progress = action.payload.progress;
        },
        updateCreativeStatus(state, action: PayloadAction<{ id: string; status: FileMetadata['status']; serverUrl?: string }>) {
            const creative = state.newCompanyBuild.creatives.default.find(c => c.id === action.payload.id);
            if (creative) {
                creative.status = action.payload.status;
                if (action.payload.serverUrl) creative.serverUrl = action.payload.serverUrl;
            }
        },
        removeCreative(state, action: PayloadAction<string>) {
            state.newCompanyBuild.creatives.default = state.newCompanyBuild.creatives.default.filter(c => c.id !== action.payload);
            state.newCompanyBuild.creatives.selected = state.newCompanyBuild.creatives.selected.filter(id => id !== action.payload);
        },
        setShowedImage(state, action: PayloadAction<string | null>) {
            state.showedImage = action.payload;
            if (action.payload) playSound2D("ui-click", 0.15);
        },
        setPlatform(state, action: PayloadAction<string | null>) {
            state.newCompanyBuild.platform = action.payload;
            state.newCompanyBuild.strategy = null;
            playSound2D("ui-click", 0.15);
        },
        setStrategy(state, action: PayloadAction<string | null>) {
            state.newCompanyBuild.strategy = action.payload;
            playSound2D("ui-click", 0.15);
        },
        setForecast(state, action: PayloadAction<CompanyForecast | null>) {
            state.newCompanyBuild.forecast = action.payload;
        },
        clearBuild(state) {
           state.newCompanyBuild = {
                targetPeople: {
                    gender: "all",
                    age: "all",
                    country: "all",
                    interests: []
                },
                creatives: {
                    default: [],
                    selected: [],
                },
                forecast: null,
                platform: null,
                strategy: null
            }
        },
        updateFileProgress(state, action: PayloadAction<{ id: string; progress: number }>) {
            const file = state.chat.uploadedFiles.find(f => f.id === action.payload.id);
            if (file) file.progress = action.payload.progress;
        },
        updateFileStatus(state, action: PayloadAction<{ id: string; status: FileMetadata['status']; serverUrl?: string }>) {
            const file = state.chat.uploadedFiles.find(f => f.id === action.payload.id);
            if (file) {
                file.status = action.payload.status;
                if (action.payload.serverUrl) file.serverUrl = action.payload.serverUrl;
            }
        },
        removeUploadedFile(state, action: PayloadAction<string>) {
            state.chat.uploadedFiles = state.chat.uploadedFiles.filter(
                (file) => file.id !== action.payload
            );
        },
        clearUploadedFiles(state) {
            state.chat.uploadedFiles = [];
        },
        addChat: (state, action: PayloadAction<{ id: string; name: string }>) => {
            const { id, name } = action.payload;
            const existingChat = state.chat.chats[id];

            if (existingChat) {
                existingChat.name = name;
                existingChat.updatedAt = Date.now();
                return;
            }

            state.chat.chats[id] = {
                id,
                name,
                messages: [],
                createdAt: Date.now(),
                updatedAt: Date.now(),
            };
        },
        chatAddFile(state, action: PayloadAction<FileMetadata>) {
            state.chat.uploadedFiles.push(action.payload);
        },
        addMessage: (state, action: PayloadAction<Message>) => {
            const msg = action.payload;
            const existingMessage = state.chat.messages[msg.id];
            state.chat.messages[msg.id] = msg;

            if (state.chat.chats[msg.chatId]) {
                if (!existingMessage && !state.chat.chats[msg.chatId].messages.includes(msg.id)) {
                    state.chat.chats[msg.chatId].messages.push(msg.id);
                }
                state.chat.chats[msg.chatId].updatedAt = Date.now();
            }
        },
        updateMessageStatus: (state, action: PayloadAction<{ id: string; status: 'sending' | 'sent' | 'error' }>) => {
            const msg = state.chat.messages[action.payload.id];
            if (msg) msg.status = action.payload.status;
        },
        chatStartAiMessage(state, action: PayloadAction<{ id: string; chatId: string }>) {
            state.chat.messages[action.payload.id] = {
                id: action.payload.id,
                chatId: action.payload.chatId,
                sender: 'ai',
                content: '',
                timestamp: Date.now(),
                status: 'thinking'
            };

            state.chat.chats[action.payload.chatId]?.messages.push(action.payload.id);
            state.chat.isTyping = true;
        },
        editMessage(state, action: PayloadAction<{ id: string; content: string }>) {
            const msg = state.chat.messages[action.payload.id];

            if (msg) msg.content = action.payload.content;
        },
        truncateChatAfterMessage(state, action: PayloadAction<{ chatId: string; messageId: string }>) {
            const chat = state.chat.chats[action.payload.chatId];

            if (chat) {
                const msgIndex = chat.messages.findIndex(id => id === action.payload.messageId);
                
                if (msgIndex !== -1) {
                    const removedMsgIds = chat.messages.slice(msgIndex + 1);
                    
                    chat.messages = chat.messages.slice(0, msgIndex + 1);
                    
                    removedMsgIds.forEach(id => {
                        delete state.chat.messages[id];
                    });
                }
            }
        },
        chatAppendChunk(state, action: PayloadAction<{ id: string; chunk: string }>) {
            const msg = state.chat.messages[action.payload.id];

            if (msg) {
                if (msg.content === '') {
                    const seconds = Math.round((Date.now() - msg.timestamp) / 1000);
                    msg.thinkingTime = Math.max(1, seconds); 
                    
                    msg.status = 'streaming'; 
                }

                msg.content += action.payload.chunk;
            }
        },
        chatCompleteMessage(state, action: PayloadAction<{ id: string }>) {
            const msg = state.chat.messages[action.payload.id];
            if (msg) msg.status = 'sent';
            state.chat.isTyping = false;
        },
        chatErrorMessage(state, action: PayloadAction<{ id: string; error?: string }>) {
            const msg = state.chat.messages[action.payload.id];

            if (msg) {
                msg.status = 'error';

                if (action.payload.error) 
                    msg.errorMessage = action.payload.error;
            }

            state.chat.isTyping = false;
        },
        renameChat(state, action: PayloadAction<{ id: string; name: string }>) {
            const chat = state.chat.chats[action.payload.id];
            
            if (chat) chat.name = action.payload.name;
        },
        setModalPage(state, action: PayloadAction<SettingPages | null>) {
            state.modalPage = action.payload;
        },
        resetState() {
            return initialState;
        }
    },
    // === ДОБАВЛЯЕМ EXTRA REDUCERS ДЛЯ СИНХРОНИЗАЦИИ С БЭКЕНДОМ ===
    extraReducers: (builder) => {
        // 1. Слушаем загрузку списка чатов
        builder.addMatcher(
            dashboardApiSlice.endpoints.getChats.matchFulfilled,
            (state, action: any) => {
                const { payload } = action;
                payload.forEach((chat: any) => {
                    if (!state.chat.chats[chat.id]) {
                        state.chat.chats[chat.id] = {
                            id: chat.id,
                            name: chat.name,
                            messages: chat.messages || [], 
                            createdAt: chat.createdAt,
                            updatedAt: chat.createdAt
                        };
                    } else {
                        // Обновляем существующие
                        state.chat.chats[chat.id].name = chat.name;
                        state.chat.chats[chat.id].messages = chat.messages || [];
                    }
                });
            }
        );

        // 2. Слушаем загрузку истории конкретного чата
        builder.addMatcher(
            dashboardApiSlice.endpoints.getChatHistory.matchFulfilled,
            (state, action: any) => {
                const { payload, meta } = action;
                const chatId = meta.arg.originalArgs; // Достаем ID чата из запроса
                
                // Сохраняем массив ID сообщений в чат
                if (state.chat.chats[chatId]) {
                    state.chat.chats[chatId].messages = payload.map((m: any) => m.id);
                }

                // Раскладываем сами сообщения в общий словарь
                payload.forEach((msg: any) => {
                    state.chat.messages[msg.id] = msg;
                });
            }
        );
    }
})

export default DashboardSlice.reducer;