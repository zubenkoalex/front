import { AuthorizationSlice } from "./Authorization/authorizationSlice";
import { DashboardSlice } from "./Dashboard/dashboardSlice";
import { pageSlice } from "./Page/pageSlice";
import { AccountSlice } from "./User/accountSlice";


export const allActions = {
    authorization: {...AuthorizationSlice.actions},
    account: {...AccountSlice.actions},
    page: {...pageSlice.actions},
    dashboard: {...DashboardSlice.actions}
    // page: {...pageSlice.actions, ...pageThunk},
    // account: {...accountSlice.actions, ...accountActionCreators},
    // auth: {...authSlice.actions, ...authActionCreators},
    // queue: {...queueSlice.actions},
    // selectChar: {...selectCharSlice.actions, ...selectCharActionCreators},
    // createChar: {...createCharSlice.actions, ...createCharActionCreators},
    // char: {...charSlice.actions, ...charActionCreators},
    // hud: {...hudSlice.actions, ...hudThunk},
    // panelMenu: {...panelMenuSlice.actions, ...panelMenuThunk}
}