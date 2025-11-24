import { createSlice, nanoid } from "@reduxjs/toolkit"
import { Todolist } from "../api/todolistsApi.types"

export const todolistsSlice = createSlice({
  name: 'todolists',
  initialState: [] as DomaintTodolist[],
  reducers: create => ({
    setTodolistsAC: create.reducer<{ todolists: Todolist[] }>((state, action) => {
      return action.payload.todolists.map(todolist => ({...todolist, filter: 'all'}))
    }),
    createTodolistAC: create.preparedReducer(
      (title: string) => {
        const id = nanoid()
        return { payload: { id, title } }
      },
      (state, action) => {
        state.unshift({ ...action.payload, filter: 'all', addedDate: '', order: 0 })
      }
    ),
    deleteTodolistAC: create.reducer<{ id: string }>((state, action) => {
      const index = state.findIndex(todolist => todolist.id === action.payload.id)

      if (index !== -1) {
        state.splice(index, 1)
      }
    }),
    changeTodolistTitleAC: create.reducer<{ id: string, title: string }>((state, action) => {
      const todolist = state.find(todolist => todolist.id === action.payload.id)

      if (todolist) {
        todolist.title = action.payload.title
      }
    }),
    changeTodolistFilterAC: create.reducer<{ id: string, filter: FilterValues }>((state, action) => {
      const todolist = state.find(todolist => todolist.id === action.payload.id)

      if (todolist) {
        todolist.filter = action.payload.filter
      }
    })
  })
})

export const {
  deleteTodolistAC,
  changeTodolistTitleAC,
  changeTodolistFilterAC,
  createTodolistAC,
  setTodolistsAC
} = todolistsSlice.actions
export const todolistsReducer = todolistsSlice.reducer

export type DomaintTodolist = Todolist & {
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"
