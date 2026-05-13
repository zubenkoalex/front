import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { allActions } from '../store/reducers/actions';
import { startChatStream } from '../services/chatStreamService';
import { useActions, useAppSelector } from './redux';
import { FileMetadata } from '../types/UI';
import { Attachment } from '../types/Dashboard';

export const useChatSend = () => {
    const dispatch = useDispatch();
    const { addMessage, chatStartAiMessage, editMessage, truncateChatAfterMessage } = useActions(allActions.dashboard);

    const sendMessage = async (chatId: string, text: string, files: FileMetadata[] = []) => {
        const userMessageId = crypto.randomUUID();

        const messageAttachments: Attachment[] = files.map(f => ({
            id: f.id,
            url: f.serverUrl || f.previewUrl || '', 
            name: f.name,
            size: f.size,
            type: f.type
        }));

        addMessage({
            id: userMessageId,
            chatId,
            sender: 'user',
            content: text,
            attachments: messageAttachments,
            timestamp: Date.now(),
            status: 'sent'
        });

        const aiMessageId = crypto.randomUUID();

        chatStartAiMessage({ id: aiMessageId, chatId });

        startChatStream({ 
            chatId, 
            messageId: aiMessageId, 
            text, 
            attachments: messageAttachments,
            dispatch 
        });
    };

    const resendEditedMessage = async (chatId: string, messageId: string, newText: string, attachments: Attachment[] = []) => {
        editMessage({ id: messageId, content: newText });
        
        truncateChatAfterMessage({ chatId, messageId });

        const aiMessageId = crypto.randomUUID();
        chatStartAiMessage({ id: aiMessageId, chatId });

        startChatStream({ 
            chatId, 
            messageId: aiMessageId, 
            text: newText, 
            attachments,
            dispatch 
        });
    };

    return { sendMessage, resendEditedMessage };
};