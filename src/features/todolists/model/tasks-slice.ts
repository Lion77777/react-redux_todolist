import { createTodolistTC, deleteTodolistTC } from "./todolists-slice"
import { createAppSlice } from "@/common/utils"
import { tasksApi } from "../api/tasksApi"
import { DomainTask, UpdateTaskModel } from "../api/tasksApi.types"
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
    updateTaskTC: create.asyncThunk(
      async (payload: { todolistId: string, taskId: string, domainModel: Partial<UpdateTaskModel> }, { getState, rejectWithValue }) => {
        const { todolistId, taskId, domainModel } = payload
        const tasks = (getState() as RootState).tasks[todolistId]
        const task = tasks.find(task => task.id === taskId)

        if (!task) {
          return rejectWithValue(null)
        }

        const updateTask = { ...task, ...domainModel } as UpdateTaskModel

        try {
          const response = await tasksApi.updateTask({ todolistId, taskId, model: updateTask })

          return {task: response.data.data.item}
        } catch (error) {
          return rejectWithValue(error)
        }
      },
      {
        fulfilled: (state, action) => {
          const {id, todoListId} = action.payload.task
          const index = state[todoListId].findIndex(task => task.id === id)

          if(index !== -1) {
            state[todoListId].splice(index, 1, action.payload.task)
          }
        }
      }
    )
  }),
  extraReducers: builder => {
    builder.addCase(createTodolistTC.fulfilled, (state, action) => {
      state[action.payload.todolist.id] = []
    })
      .addCase(deleteTodolistTC.fulfilled, (state, action) => {
        delete state[action.payload.id]
      })
  },
  selectors: {
    selectTasks: (state: TasksState) => state
  }
})

export const { createTaskTC, deleteTaskTC, updateTaskTC, fetchTasksTC } = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer
export const { selectTasks } = tasksSlice.selectors

export type TasksState = Record<string, DomainTask[]>
