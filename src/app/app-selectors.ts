import { RequestStatus } from "@/common/types"
import type { ThemeMode } from "./app-slice"
import type { RootState } from "./store"

export const selectThemeMode = (state: RootState): ThemeMode => state.app.themeMode
export const selectStatus = (state: RootState): RequestStatus => state.app.status
export const selectAppError = (state: RootState): string | null => state.app.error