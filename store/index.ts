import { configureStore, EnhancedStore } from "@reduxjs/toolkit"
import taskReducer from "./slices/taskSlice"
import themeReducer from "./slices/themeSlice"
import { localStorageMiddleware } from "./middleware/localStorageMiddleware"

export const store: EnhancedStore = configureStore({
  reducer: {
    tasks: taskReducer,
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
