import { AuthorizationPages } from "../../../types/Authorization";

export interface AuthorizationState {
    page: AuthorizationPages;
    email: string | null;
}