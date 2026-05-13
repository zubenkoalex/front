import { useState } from "react";

export default function useInput(initialValue: string) {
    const [value, setValue] = useState(initialValue); // Используем initialValue

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setValue(e.target.value);
    };

    return {
        value,
        setValue,
        onChange
    };
}
