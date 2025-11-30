import { Todolist } from "../api/todolistsApi.types"
import { todolistsApi } from "../api/todolistsApi"
import { createAppSlice, handleServerAppError, handleServerNetworkError } from "@/common/utils"
import { setAppStatusAC } from "@/app/app-slice"
import { RequestStatus } from "@/common/types"
import { ResultCode } from "@/common/enums"

export const todolistsSlice = createAppSlice({
  name: 'todolists',
  initialState: [] as DomaintTodolist[],
  reducers: create => ({
    fetchTodolistsTC: create.asyncThunk(
      async (_, thunkApi) => {
        try {
          thunkApi.dispatch(setAppStatusAC({ status: 'loading' }))

          const response = await todolistsApi.getTodolists()

          thunkApi.dispatch(setAppStatusAC({ status: 'succeeded' }))

          return { todolists: response.data }
        } catch (error) {
          thunkApi.dispatch(setAppStatusAC({ status: 'failed' }))

          return thunkApi.rejectWithValue(error)
        }
      },
      {
        fulfilled: (_, action) => {
          return action.payload.todolists.map(todolist => ({ ...todolist, filter: 'all', entityStatus: 'succeeded' }))
        }
      }
    ),
    createTodolistTC: create.asyncThunk(
      async (title: string, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: 'loading' }))

          const response = await todolistsApi.createTodolist(title)

          if (response.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: 'succeeded' }))

            return { todolist: response.data.data.item }
          } else {
            handleServerAppError(response.data, dispatch)

            return rejectWithValue(null)
          }
        } catch (error: any) {
          handleServerNetworkError(error, dispatch)

          return rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          const todolist = action.payload.todolist

          state.unshift({ ...todolist, filter: 'all', entityStatus: 'succeeded' })
        }
      }
    ),
    deleteTodolistTC: create.asyncThunk(
      async (id: string, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: 'loading' }))

          const response = await todolistsApi.deleteTodolist(id)

          if (response.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: 'succeeded' }))

            return { id }
          } else {
            handleServerAppError(response.data, dispatch)

            return rejectWithValue(null)
          }
        } catch (error: any) {
          handleServerNetworkError(error, dispatch)

          return rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          const index = state.findIndex(todolist => todolist.id === action.payload.id)

          if (index !== -1) {
            state.splice(index, 1)
          }
        }
      }
    ),
    changeTodolistTitleTC: create.asyncThunk(
      async (payload: { id: string, title: string }, { dispatch, rejectWithValue }) => {
        try {
          dispatch(setAppStatusAC({ status: 'loading' }))

          const response = await todolistsApi.changeTodolistTitle(payload)

          if (response.data.resultCode === ResultCode.Success) {
            dispatch(setAppStatusAC({ status: 'succeeded' }))

            return { ...payload }
          } else {
            handleServerAppError(response.data, dispatch)

            return rejectWithValue(null)
          }
        } catch (error: any) {
          handleServerNetworkError(error, dispatch)

          return rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          const todolist = state.find(todolist => todolist.id === action.payload.id)

          if (todolist) {
            todolist.title = action.payload.title
          }
        }
      }
    ),
    changeTodolistFilterAC: create.reducer<{ id: string, filter: FilterValues }>((state, action) => {
      const todolist = state.find(todolist => todolist.id === action.payload.id)

      if (todolist) {
        todolist.filter = action.payload.filter
      }
    }),
    changeTodolistStatusAC: create.reducer<{ id: String, entityStatus: RequestStatus }>((state, action) => {
      const todolist = state.find(todolist => todolist.id === action.payload.id)

      if (todolist) {
        todolist.entityStatus = action.payload.entityStatus
      }
    })
  }),
  selectors: {
    selectTodolists: (state: DomaintTodolist[]) => state
  }
})

export const {
  changeTodolistFilterAC,
  changeTodolistStatusAC,
  fetchTodolistsTC,
  createTodolistTC,
  deleteTodolistTC,
  changeTodolistTitleTC
} = todolistsSlice.actions

export const todolistsReducer = todolistsSlice.reducer
export const { selectTodolists } = todolistsSlice.selectors

export type DomaintTodolist = Todolist & {
  filter: FilterValues
  entityStatus: RequestStatus
}

export type FilterValues = "all" | "active" | "completed"
