import { FC, HTMLProps, useEffect } from "react";
import styles from "./AiChatPage.module.scss";
import { useActions, useAppSelector } from "../../../hooks/redux";
import { allActions } from "../../../store/reducers/actions";
import { CirclePlus, Logotype, LogotypeFilled } from "../../../components/SVG";
import { ChatInput, ChatMessage, Spinner } from "../../../components/UI";
import useInput from "../../../hooks/useInput";
import { useNavigate, useParams } from "react-router-dom";
import { useChatSend } from "../../../hooks/useChatSend";
import { useGenerateChatTitleMutation, useGetChatHistoryQuery, useGetChatsQuery, useUploadChatFileMutation } from "../../../services/dashboardService";
import { playSound2D } from "../../../utils/sounds";
import { stopChatStream } from "../../../services/chatStreamService";

interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
}

export const AiChatPage: FC<ComponentProps> = ({
    className,
}) => {
    const navigate = useNavigate();
    const { chatId } = useParams<{ chatId: string }>();

    const { themeMode } = useAppSelector(state => state.dashboardReducer);
    const { uploadedFiles, chats, messages } = useAppSelector(state => state.dashboardReducer.chat);
    const {  addChat, chatAddFile, removeUploadedFile, clearUploadedFiles } = useActions(allActions.dashboard);
    const {  addToast } = useActions(allActions.page);

    const chatInput = useInput("");
    const { sendMessage, resendEditedMessage } = useChatSend();

    const [uploadChatFile] = useUploadChatFileMutation();
    const [generateTitle] = useGenerateChatTitleMutation();

    const { data: serverChats, isLoading: isChatsLoading } = useGetChatsQuery(undefined);

    const isChatOnServer = serverChats?.some(c => c.id === chatId);

    const {isLoading: isChatHistoryLoading} = useGetChatHistoryQuery(chatId ?? "", { 
        skip: !chatId || !isChatOnServer 
    });

    const activeChat = chatId ? chats[chatId] : null;
    // Добавляем фильтр, чтобы React не пытался рисовать пустоту, пока данные летят с сервера
    const chatMessages = activeChat ? activeChat.messages.map(id => messages[id]).filter(msg => msg !== undefined) : [];

    const lastMessage = chatMessages[chatMessages.length - 1];
    const isGenerating = lastMessage?.sender === 'ai' && (lastMessage?.status === 'thinking' || lastMessage?.status === 'streaming');

    useEffect(() => {
        return () => {
            uploadedFiles.forEach(file => {
                if (file.previewUrl) URL.revokeObjectURL(file.previewUrl);
            });
        };
    }, []);

    useEffect(() => {
        if (!activeChat || activeChat.name !== "Новый чат") return;

        if (activeChat.messages.length >= 2) {
            const firstUserMsgId = activeChat.messages[0];
            const firstAiMsgId = activeChat.messages[1];

            const firstUserMsg = messages[firstUserMsgId];
            const firstAiMsg = messages[firstAiMsgId];

            if (firstUserMsg && firstAiMsg && firstAiMsg.status === 'sent') {
                generateTitle({ 
                    chatId: activeChat.id, 
                    prompt: firstUserMsg.content 
                });
            }
        }
    }, [activeChat?.name, activeChat?.messages.length, messages[activeChat?.messages[1] || '']?.status]);

    const handleSend = (message: string) => {
        if (isGenerating) return;

        const hasUploadingFiles = uploadedFiles.some(f => f.status === 'uploading');

        if (hasUploadingFiles) {
            addToast({msg: "Файлы еще загружаются", type: "info"})
            playSound2D("info", 1);
            return;
        };

        const hasErrorFiles = uploadedFiles.some(f => f.status === 'error');
        if (hasErrorFiles) {
            addToast({msg: "Удалите файлы с ошибкой перед отправкой", type: "error"});
            playSound2D("error", 1);
            return;
        }

        if (!message.trim() && uploadedFiles.length === 0) return;

        let currentChatId = chatId;
        if (!currentChatId || !chats[currentChatId]) {
            currentChatId = crypto.randomUUID();
            addChat({ id: currentChatId, name: "Новый чат" });
            navigate(`/dashboard/chat/${currentChatId}`, { replace: true });
        }

        sendMessage(currentChatId, message, uploadedFiles);

        chatInput.onChange({ target: { value: '' } } as any);
        
        clearUploadedFiles();
    };

    const handleAddFiles = (files: File[]) => {
        files.forEach((file) => {
            const id = crypto.randomUUID();
            const previewUrl = URL.createObjectURL(file);

            chatAddFile({
                id,
                name: file.name,
                size: file.size,
                type: file.type,
                previewUrl,
                status: 'uploading',
                progress: 0
            });

            uploadChatFile({ file, id })
                .unwrap()
                .catch(err => console.error("Ошибка загрузки:", err));
        });
    };

    const handleRemoveFile = (id: string) => {
        const fileToRemove = uploadedFiles.find(f => f.id === id);
        
        if (fileToRemove?.previewUrl) {
            URL.revokeObjectURL(fileToRemove.previewUrl);
        }

        removeUploadedFile(id);
    };

    const handleEditSubmit = (messageId: string, newText: string) => {
        if (isGenerating) return;

        if (!chatId) return;

        const targetMessage = messages[messageId];
        if (!targetMessage) return;

        resendEditedMessage(
            chatId, 
            messageId, 
            newText, 
            targetMessage.attachments
        );
    };

    const handleRetry = (failedAiMessageId: string) => {
        if (isGenerating) return;

        if (!chatId) return;

        const currentChat = chats[chatId];
        if (!currentChat) return;

        const msgIndex = currentChat.messages.findIndex(id => id === failedAiMessageId);
        if (msgIndex <= 0) return;

        const previousUserMessageId = currentChat.messages[msgIndex - 1];
        const userMessage = messages[previousUserMessageId];

        if (!userMessage || userMessage.sender !== "user") return;

        resendEditedMessage(
            chatId,
            userMessage.id,
            userMessage.content,
            userMessage.attachments || []
        );
    };

    const handleStopGeneration = () => {
        stopChatStream();
    };

    const handleCreateChat = () => navigate(`/dashboard/chat`);
    const handleSelectChat = (id: string) => navigate(`/dashboard/chat/${id}`);
    
    const isNewChat = !chatId || !chats[chatId] || chats[chatId].messages.length === 0;

    return (
        <div className={`${styles["ai-chat-page"]} ${className ? className : ""}`}>
            <div className={styles["chats"]}>
                <div className={styles["create-chat"]} onClick={handleCreateChat}>
                    <CirclePlus className={styles["icon"]} />
                    <span className={styles["text"]}>Начать новый чат</span>
                </div>
                <span className={styles["line"]} />
                <div className={styles["chats-history"]}>
                    {isChatsLoading ? 
                        <div className={styles["spinner-container"]}>
                            <Spinner className={styles["spinner"]} />
                        </div>
                        :
                        Object.values(chats).map(chat => (
                            <div 
                                key={chat.id} 
                                className={`${styles["chat"]} ${chat.id === chatId ? styles["active"] : ""}`} 
                                onClick={() => handleSelectChat(chat.id)}
                            >
                                <div className={styles["icon-container"]}>
                                    <LogotypeFilled className={styles["icon"]} />
                                </div>
                                <span className={styles["text"]}>{chat.name}</span>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className={styles["chat-container"]}>
                {isChatHistoryLoading ?
                    <div className={styles["spinner-container"]}>
                        <Spinner className={styles["spinner"]} />
                    </div>
                    :
                    isNewChat ?
                        <div className={styles["new-chat"]}>
                            <div className={styles["header"]}>
                                <Logotype className={styles["icon"]} />
                                <span className={styles["text"]}>Задайте вопрос Adzen</span>
                            </div>
                            <ChatInput
                                {...chatInput} 
                                files={uploadedFiles} 
                                onAddFiles={handleAddFiles} 
                                onRemoveFile={handleRemoveFile}
                                onSend={handleSend}
                                className={styles["chat-input"]} 
                            />
                        </div>
                        :
                        <div className={styles["chat"]}>
                            <div className={styles["content"]}>
                                <div className={styles["messages"]}>
                                    {chatMessages.map(message => (
                                        <ChatMessage
                                            key={message.id}
                                            message={message} 
                                            onSubmitEdit={handleEditSubmit}
                                            onRetry={handleRetry}
                                        />
                                    ))}
                                </div>
                                {themeMode !== "light" && <div className={styles["scroll-fade"]} />}
                            </div>
                            <ChatInput
                                {...chatInput} 
                                files={uploadedFiles}
                                isGenerating={isGenerating}
                                onAddFiles={handleAddFiles} 
                                onRemoveFile={handleRemoveFile}
                                onSend={handleSend}
                                onStop={handleStopGeneration}
                                className={styles["chat-input"]} 
                            />
                        </div>
                }
            </div>
        </div>
    );
};