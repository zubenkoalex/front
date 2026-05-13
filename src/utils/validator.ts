// Проверка на валидность логина
export const isInvalidLogin = (str: string): { isInvalid: boolean; reason?: string } => {
    try {
        if (str.length > 32) return { isInvalid: true, reason: "Логин слишком большой. Максимальная длина — 32 символа." };
        if (str.length < 3) return { isInvalid: true, reason: "Логин слишком маленький. Минимальная длина — 3 символа." };
        if (/\s/.test(str)) return { isInvalid: true, reason: "Логин не должен содержать пробелов." };

        const letterCount = (str.match(/[a-zA-Z]/g) || []).length;
        if (letterCount < 2) return { isInvalid: true, reason: "Логин должен содержать минимум 2 буквы." };
        return { isInvalid: !/^[a-zA-Z1-9]*$/.test(str), reason: "Логин содержит недопустимые символы. Разрешены только буквы и цифры." };
    } catch (e) {
        console.error("try/catch", "isInvalidLogin", e);
        return {isInvalid: true};
    }
};

export const isInvalidNumber = (str: string): { isInvalid: boolean; reason?: string } => {
    try {
        if (str.length != 11) return { isInvalid: true, reason: "Неккоректный номер телефона. Номер телефона должен содержать 11 цифр." };
        if (!/^\d+$/.test(str)) return { isInvalid: true, reason: "Номер телефона должен содержать только цифры." };
        if (!/^(8|7)/.test(str)) return { isInvalid: true, reason: "Номер телефона должен начинаться с цифры 7 или 8." };

        return { isInvalid: false };
    } catch (e) {
        console.error("try/catch", "isInvalidNumber", e);
        return {isInvalid: true};
    }
};

// Проверка на валидность email
export const isInvalidEmail = (str: string): { isInvalid: boolean; reason?: string } => {
    try {
        if (str.length > 32) return { isInvalid: true, reason: "Почта слишком длинная. Максимальная длина — 32 символа." };
        if (str.length < 3) return { isInvalid: true, reason: "Почта слишком короткая. Минимальная длина — 3 символа." };
        if (/\s/.test(str)) return { isInvalid: true, reason: "Почта не должна содержать пробелов." };
        return { isInvalid: !/^[0-9a-z-_.]+@[0-9a-z-]{2,}\.[a-z]{2,}$/i.test(str), reason: "Некорректный формат почты. Проверьте правильность ввода." }
    } catch (e) {
        console.error("try/catch", "isInvalidEmail", e);
        return {isInvalid: true};
    }
};

// Проверка на валидность пароля
export const isInvalidPassword = (str: string): { isInvalid: boolean; reason?: string } => {
    try {
        if (str.length > 50) return { isInvalid: true, reason: "Пароль слишком длинный. Максимальная длина — 50 символов." };
        if (str.length < 10) return { isInvalid: true, reason: "Пароль слишком короткий. Минимальная длина — 10 символов." };
        if (!/[A-Z]/.test(str)) return { isInvalid: true, reason: "Пароль должен содержать хотя бы одну заглавную букву." };
        if (!/[a-z]/.test(str)) return { isInvalid: true, reason: "Пароль должен содержать хотя бы одну строчную букву." };
        if (!/[0-9]/.test(str)) return { isInvalid: true, reason: "Пароль должен содержать хотя бы одну цифру." };
        if (!/[!@#$%^&*()\-_=+[\]{};:'",.<>?/\\|~]/.test(str)) return { isInvalid: true, reason: "Пароль должен содержать хотя бы один специальный символ." };
        if (/\s/.test(str)) return { isInvalid: true, reason: "Пароль не должен содержать пробелов." };

        return {isInvalid: false};
    } catch (e) {
        console.error("try/catch", "isInvalidPassword", e);
        return {isInvalid: true};
    }
};

// Проверка на валидность русского имени/фамилии
export const checkRussianName = (str: string): { isInvalid: boolean; reason?: string } => {
    try {
        // Проверка, что строка содержит только кириллицу
        if (!/^[А-ЯЁа-яё]+$/.test(str)) {
            return { isInvalid: true, reason: "Должно содержать только кириллицу." };
        }

        // Проверка длины (не короче 2 и не длиннее 15 символов)
        if (str.length < 2 || str.length > 15) {
            return { isInvalid: true, reason: "Должно содержать от 2 до 15 символов." };
        }

        // Проверка, что первая буква заглавная
        const firstChar = str.charCodeAt(0);
        if (firstChar < 1040 || firstChar > 1071) { // 'А' (1040) - 'Я' (1071)
            return { isInvalid: true, reason: "Должно начинаться с заглавной буквы." };
        }

        // Подсчет заглавных букв
        let capitalCount = 0;
        for (let i = 0; i < str.length; i++) {
            const charCode = str.charCodeAt(i);
            if (charCode >= 1040 && charCode <= 1071) { // Заглавные буквы
                capitalCount++;
            }
        }

        // Проверка на одну заглавную букву
        if (capitalCount !== 1) {
            return { isInvalid: true, reason: "Должно содержать только одну заглавную букву." };
        }

        if (/\s/.test(str)) return { isInvalid: true, reason: "Не должно содержать пробелов." };

        return { isInvalid: false };
    } catch (e) {
        console.error("try/catch", "checkRussianName", e);
        return { isInvalid: true };
    }
};

export const isValidDate = (str: string): { isInvalid: boolean; reason?: string } => {
    try {
        if (str.length !== 10) return { isInvalid: true, reason: "Введите полную дату." };

        const [day, month, year] = str.split("/").map(Number);
        
        const date = new Date(year, month - 1, day);
        if (isNaN(date.getTime()) || date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) 
            return { isInvalid: true, reason: "Некорректная дата." };

        const age = calculateAge(`${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`);
        if (age === null) return { isInvalid: true, reason: "Некорректная дата." };
        if (age < 18 || age > 90) return { isInvalid: true, reason: "Возраст должен быть от 18 до 90 лет." };

        return { isInvalid: false };
    } catch (e) {
        console.error("try/catch", "isValidDate", e);
        return { isInvalid: true };
    }
};

const calculateAge = (dateString: string): number | null => {
    const today = new Date();
    const birthDate = new Date(dateString);

    if (isNaN(birthDate.getTime())) return null;

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
};

export const validateInput = (
    inputValue: string,
    validator: (value: string) => { isInvalid: boolean; reason?: string }, 
    setVariant: (variant: 'default' | 'success' | 'error') => void,
    setError?: (error: string | undefined) => void,
) => {
    const result = validator(inputValue);
    if (result.isInvalid) {
        setError?.(result.reason);
        setVariant('error');
    } else {
        setError?.("");
        setVariant('success');
    }
};