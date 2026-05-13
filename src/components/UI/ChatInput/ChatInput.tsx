import { FC, HTMLProps, useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./ChatInput.module.scss";
import { Input } from "../Input/Input";
import { ArrowRightLong, Cross, FilledError, Stop, Upload } from "../../SVG";
import { CircularProgress, ContextMenu, FileUploader } from "..";
import { ContextMenuItem, FileMetadata, FileUploaderRef } from "../../../types/UI";
import { useActions, useAppSelector } from "../../../hooks/redux";
import { getFileMetadata } from "../../../utils";
import { allActions } from "../../../store/reducers/actions";

interface ComponentProps {
    className?: HTMLProps<HTMLElement>["className"];
    value: string;
    files?: FileMetadata[];
    maxHeight?: number;
    isGenerating?: boolean;
    onRemoveFile?: (key: string) => void;
    onAddFiles?: (files: File[]) => void;
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSend?: (message: string) => void;
    onStop?: () => void;
}

export const ChatInput: FC<ComponentProps> = ({
    className,
    value,
    files,
    onSend,
    onChange,
    onRemoveFile,
    onAddFiles,
    onStop,
    maxHeight = 140,
    isGenerating = false
}) => {
    const {setActiveModal, setShowedImage} = useActions(allActions.dashboard);

    const [expanded, setExpanded] = useState<boolean>(false);
    const [contextMenu, setContextMenu] = useState<boolean>(false);

    const contextMenuRef = useRef<HTMLDivElement>(null);
    const uploaderRef = useRef<FileUploaderRef | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const baseHeightRef = useRef<number>(0);

    useEffect(() => {
        const el = textareaRef.current;
        if (!el || !onAddFiles) return;

        const handlePaste = (e: ClipboardEvent) => {
            const items = e.clipboardData?.items;
            if (!items) return;

            const pastedFiles: File[] = [];

            for (let i = 0; i < items.length; i++) {
                if (items[i].kind === 'file') {
                    const blob = items[i].getAsFile();
                    if (blob) {
                        pastedFiles.push(blob);
                    }
                }
            }

            if (pastedFiles.length > 0) {
                e.preventDefault();
                onAddFiles(pastedFiles);
            }
        };

        el.addEventListener('paste', handlePaste);
        return () => el.removeEventListener('paste', handlePaste);
    }, [onAddFiles]);


    useLayoutEffect(() => {
        const el = textareaRef.current;
        if (!el) return;

        const startHeight = el.offsetHeight;

        el.style.height = "auto";
        const scrollHeight = el.scrollHeight;
        
        if (!baseHeightRef.current) {
            baseHeightRef.current = scrollHeight;
        }

        const baseHeight = baseHeightRef.current;

        if (!expanded && scrollHeight > baseHeight) {
            setExpanded(true);
        }

        if ((!files || files.length === 0) && expanded && value.length === 0) {
            setExpanded(false);
        }

        const newHeight = Math.min(scrollHeight, maxHeight);
        
        el.style.height = startHeight + "px";
        el.style.overflowY = scrollHeight > maxHeight ? "auto" : "hidden";

        void el.offsetHeight; 

        el.style.height = newHeight + "px";

    }, [value, expanded]);

    useEffect(() => {
        if (files && files.length > 0) setExpanded(true);
        else setExpanded(false);
    }, [files])

    const handleSend = () => {
        if (!onSend || isGenerating) return;

        const message = value.trim();
        if (!message && (!files || files.length === 0)) return;

        onSend(message);
    };

    const handleLoadAttachment = () => uploaderRef.current?.openFilePicker();

    const attachmentsChat: ContextMenuItem[][] = [
        [
            {
                key: "load-attachment",
                Icon: Upload,
                title: "Загрузить вложение",
                description: "Файл, изображение, видео, аудио",
                onClick: handleLoadAttachment
            }
        ],
    ]

    const handleFileSelect = (selectedFiles: File | File[]) => {
        setContextMenu(false);
        const filesArray = Array.isArray(selectedFiles) ? selectedFiles : [selectedFiles];
        onAddFiles?.(filesArray);
    };
    
    return (
        <div className={`${styles["chat-input"]} ${className ?? ""}`}>
            <div className={`${styles["files"]} ${expanded ? styles["expanded"] : styles["collapsed"]}`}>
                {files?.map(file => {
                    const { key, category, Icon, isImage } = getFileMetadata(file);

                    return (
                        isImage ? 
                            <div 
                                key={file.id} 
                                className={`${styles["file"]} ${styles[key]}`}
                                onClick={() => {                                    
                                    setActiveModal("image");
                                    setShowedImage(file.serverUrl || file.previewUrl);
                                }}
                            >
                                {file.status === "uploading" &&
                                    <div className={styles["status"]}>
                                        <CircularProgress 
                                            className={styles["progress"]}
                                            progress={file.progress}
                                            radius={7}
                                            strokeWidth={1}
                                        />
                                    </div>
                                }
                                {file.status === "error" &&
                                    <div className={styles["status"]}>
                                        <FilledError className={styles["icon"]} />
                                    </div>
                                }
                                <img src={file.previewUrl} className={styles["image"]} />
                                <div 
                                    className={styles["close-container"]} 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemoveFile?.(file.id)
                                    }}
                                >
                                    <Cross className={styles["icon"]} />
                                </div>
                            </div>
                            :
                            <div key={file.id} className={`${styles["file"]} ${styles[key]} ${styles[file.status]}`}>
                                <div className={styles["content"]}>
                                    <div className={styles["icon-container"]}>
                                        {file.status === "uploading" ?
                                            <CircularProgress 
                                                className={styles["progress"]}
                                                progress={file.progress}
                                                radius={7}
                                                strokeWidth={1}
                                            />
                                            :
                                            <Icon className={styles["icon"]} />
                                        }
                                    </div>
                                    <div className={styles["info"]}>
                                        <span className={styles["filename"]}>{file.name}</span>
                                        <span className={styles["category"]}>{category}</span>
                                    </div>
                                </div>
                                <div className={styles["close-container"]} onClick={() => onRemoveFile?.(file.id)}>
                                    <Cross className={styles["icon"]} />
                                </div>
                            </div>
                    )
                })}
            </div>
            <div className={styles["inner"]}>
                <div 
                    className={`
                        ${styles["control"]} 
                        ${styles["attachment"]} 
                        ${expanded ? styles["hidden"] : styles["visible"]}
                        ${contextMenu ? styles["active"] : ""}
                    `}
                    onClick={() => setContextMenu(!contextMenu)}
                >
                    <span>+</span>
                </div>
                <Input 
                    ref={textareaRef}
                    mode="textarea"
                    value={value}
                    onChange={onChange}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();

                            if (isGenerating)
                                onStop?.();
                            else
                                handleSend();
                        }
                    }}
                    className={styles["input"]}
                    innerClassName={styles["input-inner"]}
                    rows={1}
                />    
                <div 
                    className={`
                        ${styles["control"]} 
                        ${styles["send"]} 
                        ${expanded ? styles["hidden"] : styles["visible"]}
                    `} 
                    onClick={isGenerating ? onStop : handleSend}
                >
                    {isGenerating ? 
                        <Stop className={styles["icon"]} />
                        :
                        <ArrowRightLong className={styles["icon"]} />
                    }
                </div>
            </div>
            <div className={`${styles["controls"]} ${expanded ? styles["expanded"] : styles["collapsed"]}`}>
                <div 
                    className={`
                        ${styles["control"]} 
                        ${styles["attachment"]} 
                        ${contextMenu ? styles["active"] : ""}
                    `}
                    onClick={() => setContextMenu(!contextMenu)}
                >
                    <span>+</span>
                </div>
                <div 
                    className={`
                        ${styles["control"]} 
                        ${styles["send"]}
                    `} 
                    onClick={isGenerating ? onStop : handleSend}
                >
                    {isGenerating ? 
                        <Stop className={styles["icon"]} />
                        :
                        <ArrowRightLong className={styles["icon"]} />
                    }
                </div>
            </div>
            {contextMenu && 
                <div ref={contextMenuRef}>
                    <ContextMenu className={styles["context-menu"]} elements={attachmentsChat} setActive={setContextMenu}/>
                </div>
            }
            <FileUploader
                ref={uploaderRef}
                onFileSelected={handleFileSelect} 
            />
        </div>
    );
};