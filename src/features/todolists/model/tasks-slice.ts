import { createTodolistTC, deleteTodolistTC } from "./todolists-slice"
import { createAppSlice } from "@/common/utils"
import { tasksApi } from "../api/tasksApi"
import { DomainTask, UpdateTaskModel } from "../api/tasksApi.types"
import { TaskStatus } from "@/common/enums"
import { RootState } from "@/app/store"

const initialState: TasksState = {}

export const tasksSlice = createAppSlice({
  name: 'tasks',
  initialState,
  reducers: create => ({
    fetchTasksTC: create.asyncThunk(
      async (todolistId: string, thunkApi) => {
        try {
          const response = await tasksApi.getTasks(todolistId)

          return { todolistId, tasks: response.data.items }
        } catch (error) {
          return thunkApi.rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          state[action.payload.todolistId] = action.payload.tasks
        }
      }
    ),
    createTaskTC: create.asyncThunk(
      async (payload: { todolistId: string, title: string }, thunkApi) => {
        try {
          const response = await tasksApi.createTask(payload)

          return { task: response.data.data.item }
        } catch (error) {
          return thunkApi.rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          const { task } = action.payload

          state[task.todoListId].unshift({ ...task })
        }
      }
    ),
    deleteTaskTC: create.asyncThunk(
      async (payload: { todolistId: string, taskId: string }, thunkApi) => {
        try {
          await tasksApi.deleteTask(payload)

          return { task: payload }
        } catch (error) {
          return thunkApi.rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          const index = state[action.payload.task.todolistId].findIndex(task => task.id === action.payload.task.taskId)

          if (index !== -1) {
            state[action.payload.task.todolistId].splice(index, 1)
          }
        }
      }
    ),
    changeTaskTitleAC: create.reducer<{ todolistId: string, taskId: string, title: string }>((state, action) => {
      const task = state[action.payload.todolistId].find(task => task.id === action.payload.taskId)

      if (task) {
        task.title = action.payload.title
      }
    }),
    changeTaskStatusTC: create.asyncThunk(
      async (payload: { todolistId: string, taskId: string, status: TaskStatus }, thunkApi) => {
        const { todolistId, taskId, status } = payload
        const tasks = (thunkApi.getState() as RootState).tasks[todolistId]
        const task = tasks.find(task => task.id === taskId)

        if (!task) {
          return thunkApi.rejectWithValue(null)
        }

        try {
          const updatedTask: UpdateTaskModel = {
            title: task?.title,
            description: task?.description,
            status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline
          }

          const response = await tasksApi.updateTask({ todolistId, taskId, model: updatedTask })

          return { task: response.data.data.item }
        } catch (error) {
          return thunkApi.rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          const { todoListId, id, status } = action.payload.task
          const task = state[todoListId].find(task => task.id === id)

          if (task) {
            task.status = status
          }
        }
      }
    )
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

export const { createTaskTC, deleteTaskTC, changeTaskTitleAC, changeTaskStatusTC, fetchTasksTC } = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer
export const { selectTasks } = tasksSlice.selectors

export type TasksState = Record<string, DomainTask[]>
