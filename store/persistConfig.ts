import { persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import taskReducer from "./slices/taskSlice"
import themeReducer from "./slices/themeSlice"

// Persist config for tasks
const tasksPersistConfig = {
  key: "tasks",
  storage,
  whitelist: ["tasks"], // Only persist tasks array, not loading/error
}

// Persist config for theme
const themePersistConfig = {
  key: "theme",
  storage,
}

export const persistedTaskReducer = persistReducer(tasksPersistConfig, taskReducer)
export const persistedThemeReducer = persistReducer(themePersistConfig, themeReducer)
