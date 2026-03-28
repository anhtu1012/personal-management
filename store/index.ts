import { configureStore } from "@reduxjs/toolkit"
import taskReducer from "./slices/taskSlice"
import themeReducer from "./slices/themeSlice"
import { localStorageMiddleware } from "./middleware/localStorageMiddleware"

export const makeStore = () => {
  return configureStore({
    reducer: {
      tasks: taskReducer,
      theme: themeReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(localStorageMiddleware),
  })
}

export const store = makeStore()

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
