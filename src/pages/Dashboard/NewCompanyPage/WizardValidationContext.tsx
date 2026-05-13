import { createContext, useContext } from "react";

interface WizardContextType {
    setValid: (isValid: boolean) => void;
    isCreating: boolean;
}

export const WizardValidationContext = createContext<WizardContextType | null>(null);

export const useWizardValidation = () => {
    const context = useContext(WizardValidationContext);
    if (!context) throw new Error("useWizardValidation must be used within NewCompanyPage");
    return context;
};