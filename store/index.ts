import { configureStore } from "@reduxjs/toolkit"
import taskReducer from "./slices/taskSlice"
import themeReducer from "./slices/themeSlice"
import { localStorageMiddleware } from "./middleware/localStorageMiddleware"

const makeStore = () => {
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

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore["getState"]>
export type AppDispatch = AppStore["dispatch"]
