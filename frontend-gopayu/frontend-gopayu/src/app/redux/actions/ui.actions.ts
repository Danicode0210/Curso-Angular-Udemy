import { Action } from '@ngrx/store';

export const ACTIVE_LOADING = '[UI Loading] Loading...';
export const INACTIVE_LOADING = '[UI Loading] End loading...';
export const TOGGLE_MENU = '[UI Menu] Toggle Menu...';

export class ActiveLoadingAction implements Action {
    readonly type = ACTIVE_LOADING;
}

export class DesactiveLoadingAction implements Action {
    readonly type = INACTIVE_LOADING;
}

export class ToggleMenuAction implements Action {
    readonly type = TOGGLE_MENU;

    constructor( public isOpen: boolean ){}
}

export type actions = ActiveLoadingAction | DesactiveLoadingAction | ToggleMenuAction;
