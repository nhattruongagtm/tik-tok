import {
  configureStore,
  applyMiddleware,
  getDefaultMiddleware,
} from "@reduxjs/toolkit";
import sessionReducer from "../features/session/sessionSlice";
import createSagaMiddleware from "redux-saga";
import mySaga from "../saga/saga";

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    session: sessionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});
sagaMiddleware.run(mySaga);

export default store;
