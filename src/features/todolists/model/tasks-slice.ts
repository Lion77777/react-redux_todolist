import { createSlice, nanoid } from "@reduxjs/toolkit"
import { createTodolistTC, deleteTodolistTC } from "./todolists-slice"
import { createAppSlice } from "@/common/utils"
import { tasksApi } from "../api/tasksApi"
import { DomainTask } from "../api/tasksApi.types"

const initialState: TasksState = {}

export const tasksSlice = createAppSlice({
  name: 'tasks',
  initialState,
  reducers: create => ({
    fetchTasksTC: create.asyncThunk(
      async (todolistId: string, thunkApi) => {
        try {
        const response = await tasksApi.getTasks(todolistId)

          return {todolistId, tasks: response.data.items}
        } catch(error) {
          return thunkApi.rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.todolistId] = action.payload.tasks
        }
      }
    ),
    createTaskAC: create.preparedReducer(
      (payload: { todolistId: string, title: string }) => {
        const id = nanoid()

        return { payload: { ...payload, id } }
      },
      (state, action) => {
        state[action.payload.todolistId].unshift({ ...action.payload, isDone: false })
      }
    ),
    deleteTaskAC: create.reducer<{ todolistId: string, taskId: string }>((state, action) => {
      const index = state[action.payload.todolistId].findIndex(task => task.id === action.payload.taskId)

      if (index !== -1) {
        state[action.payload.todolistId].splice(index, 1)
      }
    }),
    changeTaskTitleAC: create.reducer<{ todolistId: string, taskId: string, title: string }>((state, action) => {
      const task = state[action.payload.todolistId].find(task => task.id === action.payload.taskId)

      if (task) {
        task.title = action.payload.title
      }
    }),
    changeTaskStatusAC: create.reducer<{ todolistId: string, taskId: string, isDone: boolean }>((state, action) => {
      const task = state[action.payload.todolistId].find(task => task.id === action.payload.taskId)

      if (task) {
        task.isDone = action.payload.isDone
      }
    })
  }),
  extraReducers: builder => {
    builder.addCase(createTodolistTC.fulfilled, (state, action) => {
      state[action.payload.id] = []
    })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
  },
  selectors: {
    selectTasks: (state: TasksState) => state
  }
})

export const { createTaskAC, deleteTaskAC, changeTaskTitleAC, changeTaskStatusAC, fetchTasksTC } = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer
export const { selectTasks } = tasksSlice.selectors

// export type Task = {
//   id: string
//   title: string
//   isDone: boolean
// }

export type TasksState = Record<string, DomainTask[]>
