import { State } from './../reducer/assets.reducer';
import { Action } from '@ngrx/store';

export const SET_ASSETS = '[Assets] Set assets...';
export const SET_I18N = '[Assets] Set i18n...';

export class SetAssetsAction implements Action {
    readonly type = SET_ASSETS;

    constructor( public assets: State ){
    }
}

export class SetI18nAction implements Action {
    readonly type = SET_I18N;

    constructor( public i18n: State ){
    }
}

export type actions = SetAssetsAction | SetI18nAction;
