import { combineReducers } from "redux";

import mainReducer from "./mainReducer";

const reducers = combineReducers(
    {
        mainReducer: mainReducer,
    }
);

export default reducers;