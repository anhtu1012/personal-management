import { persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import taskReducer from "./slices/taskSlice"
import themeReducer from "./slices/themeSlice"
import moneyReducer from "./slices/moneySlice"

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

// Persist config for money
const moneyPersistConfig = {
  key: "money",
  storage,
  whitelist: ["members", "expenses", "payments", "personalExpenses"], // Persist all money data
}

export const persistedTaskReducer = persistReducer(tasksPersistConfig, taskReducer)
export const persistedThemeReducer = persistReducer(themePersistConfig, themeReducer)
export const persistedMoneyReducer = persistReducer(moneyPersistConfig, moneyReducer)
