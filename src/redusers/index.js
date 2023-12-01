import { combineReducers } from "redux";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from "redux-thunk";

const defaultStatus = {
    authorizationStatus: false
}

function authReducer(state = defaultStatus, action) {
    if (action.type === "LOG_IN")
        return {...state, authorizationStatus: true}
    else if (action.type === "LOG_OUT")
        return {...state, authorizationStatus: false}
    else
        return state
}

const rootReducer = combineReducers({
    auth: authReducer
});

export const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)))