import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  themeMode: "light" as ThemeMode,
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: create => ({
    changeThemeModeAC: create.reducer<{ themeMode: ThemeMode }>((state, action) => {
      state.themeMode = action.payload.themeMode
    })
  })
})

export const { changeThemeModeAC } = appSlice.actions
export const appReducer = appSlice.reducer

export type ThemeMode = "dark" | "light"
