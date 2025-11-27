import type { RootState } from "@/app/store"
import type { DomaintTodolist } from "./todolists-slice"

export const selectTodolists = (state: RootState): DomaintTodolist[] => state.todolists
