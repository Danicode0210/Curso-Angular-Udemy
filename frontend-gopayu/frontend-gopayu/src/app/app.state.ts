import { ActionReducerMap } from '@ngrx/store';

import * as UIReducer from './redux/reducer/ui.reducer';
import * as AssetsReducer from './redux/reducer/assets.reducer';

export interface AppState {
    ui: UIReducer.State;
    assets: AssetsReducer.State;
}

export const appReducers: ActionReducerMap<AppState> = {
    ui: UIReducer.uiReducer,
    assets: AssetsReducer.assetsReducer,
};

