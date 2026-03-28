import { configureStore, EnhancedStore } from "@reduxjs/toolkit"
import { persistedTaskReducer, persistedThemeReducer, persistedMoneyReducer } from "./persistConfig"

export const store: EnhancedStore = configureStore({
  reducer: {
    tasks: persistedTaskReducer,
    theme: persistedThemeReducer,
    money: persistedMoneyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore redux-persist actions
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
