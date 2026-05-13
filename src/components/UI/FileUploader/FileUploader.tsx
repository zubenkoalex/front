import { ChangeEvent, forwardRef, useImperativeHandle, useRef, useState } from "react";
import { FileUploaderRef } from "../../../types/UI";

interface ComponentProps {
    accept?: string;
    multiple?: boolean;
    onFileSelected: (files: File[]) => void;
}

export const FileUploader = forwardRef<FileUploaderRef, ComponentProps>(
    ({ accept = "*", multiple = true, onFileSelected }, ref) => {
        const inputRef = useRef<HTMLInputElement | null>(null);

        useImperativeHandle(ref, () => ({
            openFilePicker: () => {
                inputRef.current?.click();
            },
        }));

        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
            const files = event.target.files;
            
            if (!files || files.length === 0) return;

            const filesArray = Array.from(files);
            
            onFileSelected(filesArray);

            if (inputRef.current) {
                inputRef.current.value = '';
            }
        };

        return (
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleChange}
                style={{ display: 'none' }}
            />
        );
    }
);