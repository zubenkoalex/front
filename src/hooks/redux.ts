import { bindActionCreators } from "redux";
import { AppDispatch, RootState } from "../store";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

type BoundActions<T> = {
    [K in keyof T]: T[K] extends (...args: infer A) => (dispatch: any, getState?: any) => infer R
        ? (...args: A) => R
        : T[K];
};

export const useActions = <T extends Record<string, any>>(actions: T) => {
    const dispatch = useAppDispatch();
    return bindActionCreators(actions, dispatch) as BoundActions<T>;
}