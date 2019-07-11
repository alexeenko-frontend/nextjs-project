import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import { persistStore, persistReducer } from "redux-persist";

import { rootReducers, rootSagas } from "reducer";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web and AsyncStorage for react-native

// const exampleInitialState = {
// count: 0,
// error: false,
// lastUpdate: 0,
// light: false,
// placeholderData: null
// };

const sagaMiddleware = createSagaMiddleware();

const bindMiddleware = middleware => {
  if (process.env.NODE_ENV !== "production") {
    const { composeWithDevTools } = require("redux-devtools-extension");
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

function configureStore(initialState = {}) {
  const persistConfig = {
    key: "maProject145",
    storage,
    whitelist: [
     
    ]
  };
  const persistedReducer = persistReducer(persistConfig, rootReducers);
  const store = createStore(
    persistedReducer,
    initialState,
    bindMiddleware([sagaMiddleware])
  );

  store.runSagaTask = () => {
    store.sagaTask = sagaMiddleware.run(rootSagas);
  };

  store.runSagaTask();
  return store;
}

export default configureStore;
