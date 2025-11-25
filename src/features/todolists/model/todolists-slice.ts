import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { Todolist } from "../api/todolistsApi.types"
import { todolistsApi } from "../api/todolistsApi"

export const todolistsSlice = createSlice({
  name: 'todolists',
  initialState: [] as DomaintTodolist[],
  reducers: create => ({
    deleteTodolistAC: create.reducer<{ id: string }>((state, action) => {
      const index = state.findIndex(todolist => todolist.id === action.payload.id)

      if (index !== -1) {
        state.splice(index, 1)
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
      return action.payload.todolists.map(todolist => ({ ...todolist, filter: 'all' }))
    })
      .addCase(changeTodolistTitleTC.fulfilled, (state, action) => {
        const todolist = state.find(todolist => todolist.id === action.payload.id)

        if (todolist) {
          todolist.title = action.payload.title
        }
      })
      .addCase(createTodolistTC.fulfilled, (state, action) => {
        state.unshift({ ...action.payload, filter: 'all', addedDate: '', order: 0 })
      })
  }
})

export const fetchTodolistsTC = createAsyncThunk(`${todolistsSlice.name}/fetchTodolistsTC`,
  async (_, thunkApi) => {
    try {
      const response = await todolistsApi.getTodolists()

      return { todolists: response.data }
    } catch (error) {
      return thunkApi.rejectWithValue(error)
    }
  }
)

export const createTodolistTC = createAsyncThunk(`${todolistsSlice.name}/createTodolistTC`,
  async (title: string, thunkApi) => {
    try {
      const response = await todolistsApi.createTodolist(title)

      return response.data.data.item
    } catch (error) {
      return thunkApi.rejectWithValue(error)
    }
  }
)

export const changeTodolistTitleTC = createAsyncThunk(`${todolistsSlice.name}/changeTodolistTitleTC`,
  async (payload: { id: string, title: string }, thunkApi) => {
    try {

      await todolistsApi.changeTodolistTitle(payload)
      return payload
    } catch (error) {
      return thunkApi.rejectWithValue(error)
    }
  }
)

export const {
  deleteTodolistAC,
  changeTodolistFilterAC,
} = todolistsSlice.actions

export const todolistsReducer = todolistsSlice.reducer

export type DomaintTodolist = Todolist & {
  filter: FilterValues
}

export type FilterValues = "all" | "active" | "completed"
