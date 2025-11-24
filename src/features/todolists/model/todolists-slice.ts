import { createSlice, nanoid } from "@reduxjs/toolkit"

export const todolistsSlice = createSlice({
  name: 'todolists',
  initialState: [] as Todolist[],
  reducers: create => ({
    setTodolistsAC: create.reducer<{ todolists: Todolist[] }>((state, action) => {
      return action.payload.todolists
    }),
    createTodolistAC: create.preparedReducer(
      (title: string) => {
        const id = nanoid()
        return { payload: { id, title } }
      },
      (state, action) => {
        state.unshift({ ...action.payload, filter: 'all' })
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

export type Todolist = {
  id: string
  title: string
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"
