import { configureStore } from "@reduxjs/toolkit"
import thunk from "redux-thunk"
import { createLogger } from "redux-logger"
import { persistStore, persistReducer } from "redux-persist"
import storage from "./createWebStorage"
import bagReducer from "./reducers/bagReducer"

const persistConfig = {
  key: "root",
  storage,
}

const persistedReducer = persistReducer(persistConfig, bagReducer)

let middleware =  [thunk]

if (process.env.NODE_ENV !== 'production') {
  const logger = createLogger();
  middleware = [...middleware, logger];
}

export const store = configureStore({
  reducer: {
    bag: persistedReducer,
  },
  middleware,
  devTools: process.env.NODE_ENV !== "production",
})

export const persistor = persistStore(store)