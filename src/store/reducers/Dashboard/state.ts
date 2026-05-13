import { NewCompanyMainInfo, NewCompanyTargetPeople, CompanyCreative, CompanyForecast, Chat, Message, SettingPages } from "../../../types/Dashboard";
import { FileMetadata } from "../../../types/UI";

export interface DashboardState {
    themeMode: "dark" | "light" | "system";
    isSideBarOpen: boolean;
    activeModal: string | null;
    modalPage: SettingPages | null;
    showedImage: string | null;
    newCompanyBuild: {
        main?: NewCompanyMainInfo;
        targetPeople: NewCompanyTargetPeople;
        creatives: {
            default: CompanyCreative[];
            selected: string[];
        };
        forecast: CompanyForecast | null;
        platform: string | null;
        strategy: string | null;
    };
    chat: {
        chats: Record<string, Chat>;
        messages: Record<string, Message>;
        uploadedFiles: FileMetadata[];
        isTyping: boolean;
    }
}