import { RequestStatus } from "@/common/types"
import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  themeMode: "light" as ThemeMode,
  status: 'idle' as RequestStatus,
  error: null as string | null
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: create => ({
    changeThemeModeAC: create.reducer<{ themeMode: ThemeMode }>((state, action) => {
      state.themeMode = action.payload.themeMode
    }),
    setAppStatusAC: create.reducer<{ status: RequestStatus }>((state, action) => {
      state.status = action.payload.status
    }),
    setAppErrorAC: create.reducer<{ error: string | null }>((state, action) => {
      state.error = action.payload.error
    })
  })
})

export const { changeThemeModeAC, setAppStatusAC, setAppErrorAC } = appSlice.actions
export const appReducer = appSlice.reducer

export type ThemeMode = "dark" | "light"
