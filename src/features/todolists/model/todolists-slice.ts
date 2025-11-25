import { createAsyncThunk, createSlice, nanoid } from "@reduxjs/toolkit"
import { Todolist } from "../api/todolistsApi.types"
import { todolistsApi } from "../api/todolistsApi"

export const todolistsSlice = createSlice({
  name: 'todolists',
  initialState: [] as DomaintTodolist[],
  reducers: create => ({
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
  }),
  extraReducers: builder => {
    builder.addCase(fetchTodolistsTC.fulfilled, (_, action) => {
      return action.payload.todolists.map(todolist => ({...todolist, filter: 'all'}))
    })
  }
})

export const fetchTodolistsTC = createAsyncThunk(`${todolistsSlice.name}/fetchTodolistsTC`, 
  async (_, thunkApi) => {
    try {
      const response = await todolistsApi.getTodolists()

      return {todolists: response.data}
    } catch(error) {
      return thunkApi.rejectWithValue(error)
    }
  }
)

export const {
  deleteTodolistAC,
  changeTodolistTitleAC,
  changeTodolistFilterAC,
  createTodolistAC
} = todolistsSlice.actions

export const todolistsReducer = todolistsSlice.reducer

export type DomaintTodolist = Todolist & {
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"
