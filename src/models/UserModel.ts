export interface UserModel {
    userId: number;
    login: string;
    email: string;
    firstname: string;
    lastname: string;
    emailStatus: boolean;
    googleStatus: boolean;
    yandexDirectStatus: boolean;
    vkStatus: boolean;
    avatarPath: string;
    lastPasswordChange: string;
    createdAt: string;
    sessionInactiveDays: number;
}