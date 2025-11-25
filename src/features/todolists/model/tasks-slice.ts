import { createSlice, nanoid } from "@reduxjs/toolkit"
import { createTodolistTC, deleteTodolistAC } from "./todolists-slice"

const initialState: TasksState = {}

export const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: create => ({
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
      .addCase(deleteTodolistAC, (state, action) => {
        delete state[action.payload.id]
      })
  }
})

export const { createTaskAC, deleteTaskAC, changeTaskTitleAC, changeTaskStatusAC } = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer

export type Task = {
  id: string
  title: string
  isDone: boolean
}

export type TasksState = Record<string, Task[]>
