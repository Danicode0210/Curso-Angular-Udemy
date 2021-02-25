
import * as fromUI from '../actions/ui.actions';

export interface State {
    isLoading: boolean;
    isOpen: boolean;
}

const initState: State = {
    isLoading: false,
    isOpen: false,
};

export function uiReducer( state = initState, action: fromUI.actions ): State {

    switch ( action.type ) {

        case fromUI.ACTIVE_LOADING:
            return {
                ...state,
                isLoading: true
            };

        case fromUI.INACTIVE_LOADING:
            return {
                ...state,
                isLoading: false
            };

        case fromUI.TOGGLE_MENU:
            return {
                ...state,
                isOpen: action.isOpen
            };

        default:
            return state;
    }
}
