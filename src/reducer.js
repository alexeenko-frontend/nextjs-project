import { combineReducers } from "redux";
import { all } from "redux-saga/effects";

export const rootReducers = combineReducers({});

export const rootSagas = function* rootSaga() {
  yield all([]);
};
