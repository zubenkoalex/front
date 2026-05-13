import { createContext, useContext } from "react";

interface AnimationContextProps {
    status: "loading" | "success" | "error";
    error?: string;
    setIsAnimationFinished?: (isFinished: boolean) => void;
    retry?: () => void;
}

export const AnimationContext = createContext<AnimationContextProps | null>(null);

export const useAnimationContext = () => {
    const context = useContext(AnimationContext);
    if (!context) throw new Error("useAnimationContext must be used within AnimationProvider");
    return context;
};