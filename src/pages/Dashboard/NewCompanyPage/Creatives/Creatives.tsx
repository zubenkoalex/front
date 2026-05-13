import { useEffect, useRef, useMemo, FC } from "react";
import styles from "./Creatives.module.scss";
import { useActions, useAppSelector } from "../../../../hooks/redux";
import { allActions } from "../../../../store/reducers/actions";
import { Button, CircularProgress, FileUploader, Input, Tooltip } from "../../../../components/UI";
import useInput from "../../../../hooks/useInput";
import { FilledCheck, FilledError, ImagePlaceholder, Sparkles, SparklesCircleFilled, SparklesFilled } from "../../../../components/SVG";
import { useGenerateCreativeMutation, useUploadCreativeFileMutation } from "../../../../services/dashboardService";
import { getErrorMessage } from "../../../../utils";
import { playSound2D } from "../../../../utils/sounds";
import { FileUploaderRef } from "../../../../types/UI";
import { useWizardValidation } from "../WizardValidationContext";

const HOLD_DELAY = 500;

export const Creatives: FC = () => {
    const { setValid } = useWizardValidation();
    const { creatives } = useAppSelector(state => state.dashboardReducer.newCompanyBuild);
    const { selectCreatives, createCreatives, setActiveModal, setShowedImage } = useActions(allActions.dashboard);
    const { addToast } = useActions(allActions.page);

    const uploaderRef = useRef<FileUploaderRef | null>(null);
    const pressTimer = useRef<number | null>(null);
    const isLongPress = useRef(false);

    const [generateCreative, {isLoading, isError, error, isSuccess}] = useGenerateCreativeMutation();
    const [uploadCreativeFile] = useUploadCreativeFileMutation();

    const creativeInput = useInput("");

    const selectedSet = useMemo(() => new Set(creatives.selected), [creatives.selected]);

    const isValid = useMemo(() => {
        const hasUploadingOrError = creatives.default.some(c => c.status === 'uploading' || c.status === 'error');
        return Boolean(creatives.selected.length > 0 && !hasUploadingOrError);
    }, [creatives.selected, creatives.default]);

    useEffect(() => {
        setValid(isValid);
    }, [isValid]);

    const handleLoadAttachment = () => uploaderRef.current?.openFilePicker();

    const handleFileSelect = (selectedFiles: File | File[]) => {
        const filesArray = Array.isArray(selectedFiles) ? selectedFiles : [selectedFiles];
        
        filesArray.forEach(file => {
            const id = crypto.randomUUID();
            const previewUrl = URL.createObjectURL(file);

            createCreatives({
                id,
                name: file.name,
                size: file.size,
                type: file.type,
                previewUrl,
                status: 'uploading',
                progress: 0,
                generated: false
            });

            uploadCreativeFile({ file, id })
                .unwrap()
                .catch(err => console.error("Ошибка загрузки:", err));
        });
    };

    const handleGenerate = async () => await generateCreative(creativeInput.value).unwrap();

    const handleMouseDown = (image: string) => {
        isLongPress.current = false;
        pressTimer.current = setTimeout(() => {
            isLongPress.current = true;
            setActiveModal("image");
            setShowedImage(image);
        }, HOLD_DELAY);
    };

    const handleMouseUpOrLeave = () => {
        if (pressTimer.current) {
            clearTimeout(pressTimer.current);
            pressTimer.current = null;
        }
    };

    useEffect(() => {
        if (!isLoading && isError) {
            addToast({ msg: getErrorMessage(error), type: "error"});
            playSound2D("error", 1);
        }
    }, [isError, isLoading])

    useEffect(() => {
        if (!isLoading && isSuccess) playSound2D("ui-load", 0.15)
    }, [isSuccess, isLoading])

    useEffect(() => {
        return () => {
            creatives.default.forEach(c => {
                if (c.previewUrl && c.previewUrl.startsWith('blob:')) 
                    URL.revokeObjectURL(c.previewUrl);
            });

            if (pressTimer.current) clearTimeout(pressTimer.current);
        };
    }, []);

    return (
        <div className={styles["content"]}>
            <div className={styles["gerate-container"]}>
                <span className={styles["label"]}>Создание креатива</span>
                <div className={styles["input-container"]}>
                    <Input
                        value={creativeInput.value}
                        onChange={creativeInput.onChange}
                        placeholder="Опишите, какое изображение вы хотите сгенерировать" 
                        className={styles["input"]}
                    />
                    <Button className={styles["button"]} onClick={handleGenerate} isLoading={isLoading} disabled={creativeInput.value.length === 0}>
                        <Sparkles className={styles["icon"]} />
                        <span>Сгенерировать</span>
                    </Button>
                </div>
            </div>
            
            <div className={styles["creatives-cards"]}>
                <span className={styles["title"]}>Креативы</span>
                <div className={styles["cards"]}>
                    <div className={styles["load-card"]} onClick={handleLoadAttachment}>
                        <ImagePlaceholder className={styles["icon"]} />
                        <span>Загрузить изображение</span>
                    </div>
                    {creatives.default.map((crt) => {
                        const imageUrl = crt.serverUrl || crt.previewUrl;

                        return  (
                            <div 
                                key={crt.id} 
                                className={`
                                    ${styles["card"]} 
                                    ${selectedSet.has(crt.id) ? styles["selected"] : ""}
                                `}
                                onMouseDown={() => crt.status !== 'uploading' && crt.status !== 'error' && handleMouseDown(imageUrl)}
                                onMouseUp={handleMouseUpOrLeave}
                                onMouseLeave={handleMouseUpOrLeave}
                                onClick={() => {
                                    if (isLongPress.current || crt.status === 'uploading' || crt.status === 'error') return;
    
                                    selectCreatives(crt);
                                }}
                            >
                                {crt.status === "uploading" &&
                                    <div className={styles["file-status"]}>
                                        <CircularProgress 
                                            className={styles["progress"]}
                                            progress={crt.progress}
                                            radius={7}
                                            strokeWidth={1}
                                        />
                                    </div>
                                }
                                {crt.status === "error" &&
                                    <div className={styles["file-status"]}>
                                        <FilledError className={styles["icon"]} />
                                    </div>
                                }
                                {selectedSet.has(crt.id) && <div className={styles["background-overlay"]} />}
                                <img src={imageUrl} className={styles["image"]} />
                                {crt.generated &&
                                    <Tooltip
                                        content={<>
                                            <SparklesFilled className={styles["content-icon"]}/>
                                            <span className={styles["tooltip-text"]}>Сгенерировано AI</span>
                                        </>}
                                        className={styles["tooltip"]}
                                        contentClassName={styles["tooltip-content"]}
                                    >
                                        <SparklesCircleFilled className={`${styles["tooltip-icon"]} ${styles["generated"]}`} />
                                    </Tooltip>
                                }
                                {selectedSet.has(crt.id) && <FilledCheck className={`${styles["status"]} ${styles["selected"]}`} />}
                            </div>
                        )
                    })}
                </div>
            </div>
            <FileUploader
                ref={uploaderRef} 
                accept="image/*"
                onFileSelected={handleFileSelect} 
            />
        </div>
    );
};
