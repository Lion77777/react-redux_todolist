import { Todolist } from "../api/todolistsApi.types"
import { todolistsApi } from "../api/todolistsApi"
import { createAppSlice } from "@/common/utils"
import { setAppStatusAC } from "@/app/app-slice"
import { RequestStatus } from "@/common/types"

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
      async (title: string, thunkApi) => {
        try {
          const response = await todolistsApi.createTodolist(title)

          return { todolist: response.data.data.item }
        } catch (error) {
          return thunkApi.rejectWithValue(error)
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
          dispatch(changeTodolistStatusAC({ id, entityStatus: 'loading' }))

          await todolistsApi.deleteTodolist(id)

          dispatch(setAppStatusAC({ status: 'succeeded' }))


          return { id }
        } catch (error) {
          dispatch(setAppStatusAC({ status: 'failed' }))

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
      async (payload: { id: string, title: string }, thunkApi) => {
        try {
          await todolistsApi.changeTodolistTitle(payload)

          return { ...payload }
        } catch (error) {
          return thunkApi.rejectWithValue(error)
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
