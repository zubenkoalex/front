import { FC, HTMLProps, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import styles from "./ChatMessage.module.scss";
import { Check, Copy, Edit, LogotypeFilled } from "../../SVG";
import { Button, Input, MarkdownRenderer } from "..";
import { Message } from "../../../types/Dashboard";
import useInput from "../../../hooks/useInput";
import { getFileMetadata } from "../../../utils";
import { useActions } from "../../../hooks/redux";
import { allActions } from "../../../store/reducers/actions";

interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
    message: Message;
    onSubmitEdit?: (id: string, newText: string) => void;
    onRetry?: (id: string) => void;
}

const MAX_HEIGHT = 140;

export const ChatMessage: FC<ComponentProps> = ({
    className,
    message,
    onSubmitEdit,
    onRetry
}) => {
    const {setActiveModal, setShowedImage} = useActions(allActions.dashboard);
    
    const [copied, setCopied] = useState<boolean>(false);
    
    const [isEditing, setIsEditing] = useState<boolean>(false);
    
    const editInput = useInput(message.content);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    
    const isSaveDisabled = useMemo(() => editInput.value.length === 0, [editInput.value])
    
    useEffect(() => {
        if (isEditing && textareaRef.current) {
            editInput.setValue(message.content);

            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.focus();
                    const length = editInput.value.length;
                    textareaRef.current.setSelectionRange(length, length);
                }
            }, 0);
        }
    }, [isEditing]);

    useLayoutEffect(() => {
        const el = textareaRef.current;
        if (!el) return;

        const startHeight = el.offsetHeight;

        el.style.height = "auto";
        const scrollHeight = el.scrollHeight;
        
        const newHeight = Math.min(scrollHeight, MAX_HEIGHT);
        
        el.style.height = startHeight + "px";
        el.style.overflowY = scrollHeight > MAX_HEIGHT ? "auto" : "hidden";

        void el.offsetHeight; 

        el.style.height = newHeight + "px";

    }, [editInput.value]);

    const handleCopy = () => {
        if (!message.content) return;

        navigator.clipboard.writeText(message.content).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };
    
    const handleSave = () => {
        if (isSaveDisabled) return;

        if (editInput.value.trim() && editInput.value.trim() !== message.content)
            onSubmitEdit?.(message.id, editInput.value.trim());

        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSave();
        } else if (e.key === "Escape")
            setIsEditing(false);
    };


    if (message.sender === "user") 
        return (
            <div className={`${styles["message"]} ${styles["author"]}`}>
                {message.attachments &&
                    <div className={styles["files"]}>
                        {message.attachments?.map(file => {
                            const { key, category, Icon, isImage } = getFileMetadata(file);

                            return (
                                isImage ? 
                                    <div 
                                        key={file.id} 
                                        className={`${styles["file"]} ${styles[key]}`}
                                        onClick={() => {                                    
                                            setActiveModal("image");
                                            setShowedImage(file.url);
                                        }}
                                    >
                                        <img src={file.url} className={styles["image"]} />
                                    </div>
                                    :
                                    <div key={file.id} className={`${styles["file"]} ${styles[key]}`}>
                                        <div className={styles["content"]}>
                                            <div className={styles["icon-container"]}>
                                                <Icon className={styles["icon"]} />
                                            </div>
                                            <div className={styles["info"]}>
                                                <span className={styles["filename"]}>{file.name}</span>
                                                <span className={styles["category"]}>{category}</span>
                                            </div>
                                        </div>
                                    </div>
                            )
                        })}
                    </div>
                }
                {isEditing ?
                    <>
                        <div className={styles["inner"]}>
                            <Input 
                                ref={textareaRef}
                                mode="textarea"
                                value={editInput.value}
                                onChange={editInput.onChange}
                                onKeyDown={handleKeyDown}
                                className={styles["input"]}
                                innerClassName={styles["input-inner"]}
                                rows={1}
                            />    
                        </div>
                        <div className={styles["action-buttons"]}>
                            <Button 
                                variant="secondary"
                                onClick={() => setIsEditing(false)}
                                className={styles["action-button"]}
                            >
                                <span>Отмена</span>
                            </Button>
                            <Button 
                                variant="secondary"
                                disabled={isSaveDisabled}
                                onClick={handleSave}
                                className={styles["action-button"]}
                            >
                                <span>Отправить</span>
                            </Button>
                        </div>
                    </>
                    :
                    <>
                        {message.content &&                        
                            <div className={styles["author"]}>
                                <span>{message.content}</span>
                            </div>
                        }
                        <div className={styles["actions"]}>
                            <div className={styles["action"]} onClick={() => setIsEditing(true)}>
                                <Edit className={styles["icon"]} />
                            </div>
                            {message.content &&  
                                <div className={styles["action"]} onClick={handleCopy}>
                                    {copied ?
                                        <Check className={styles["icon"]} />
                                        :
                                        <Copy className={styles["icon"]} />
                                    }
                                </div>
                            }
                        </div>
                    </>

                }
            </div>
        );
    
    if (message.sender === "ai")
        if (message.status === "thinking")
            return (
                <div className={`${styles["message"]} ${styles["answer"]}`}>
                    <div className={styles["answer"]}>
                        <div className={styles["thinking-container"]}>
                            <LogotypeFilled className={styles["icon"]} />
                            <div className={styles["thinking"]} />
                        </div>
                    </div>
                </div>
            );

        if (message.status === "error")
            return (
                <div className={`${styles["message"]} ${styles["answer"]}`}>
                    <div className={styles["error"]}>
                        <span>{message.errorMessage}</span>
                        <div className={styles["action-buttons"]}>
                            <Button 
                                variant="secondary"
                                onClick={() => onRetry?.(message.id)}
                                className={`${styles["action-button"]} ${styles["repeat"]}`}
                            >
                                <span>Повторить</span>
                            </Button>
                        </div>
                    </div>
                </div>
            );

        return (
            <div className={`${styles["message"]} ${styles["answer"]}`}>
                <div className={styles["answer"]}>
                    <div className={styles["thinking-container"]}>
                        <LogotypeFilled className={styles["icon"]} />
                        <span>Думал на протяжении {message.thinkingTime || 1} {(message.thinkingTime || 1) === 1 ? "секунды" : "секунд"}...</span>
                    </div>
                    <div className={styles["message"]}>
                        <MarkdownRenderer>{message.content}</MarkdownRenderer>
                    </div>
                </div>
                <div className={styles["actions"]}>
                    <div className={styles["action"]} onClick={handleCopy}>
                        {copied ?
                            <Check className={styles["icon"]} />
                            :
                            <Copy className={styles["icon"]} />
                        }
                    </div>
                </div>
            </div>
        );

};