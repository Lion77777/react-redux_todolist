import { beforeEach, expect, test } from "vitest"
import {
  createTaskTC,
  deleteTaskTC,
  tasksReducer,
  updateTaskTC,
  type TasksState,
} from "../tasks-slice"
import { createTodolistTC, deleteTodolistTC } from "../todolists-slice"
import { TaskPriority, TaskStatus } from "@/common/enums"
import { nanoid } from "@reduxjs/toolkit"

let startState: TasksState = {}
const taskDefaultValues = {
  description: '',
  priority: TaskPriority.Low,
  startDate: '',
  deadline: '',
  order: 0,
  addedDate: ''
}

beforeEach(() => {
  startState = {
    todolistId1: [
      { id: "1", title: "CSS", status: TaskStatus.New, todoListId: "todolistId1", ...taskDefaultValues },
      { id: "2", title: "JS", status: TaskStatus.Completed, todoListId: "todolistId1", ...taskDefaultValues },
      { id: "3", title: "React", status: TaskStatus.New, todoListId: "todolistId1", ...taskDefaultValues },
    ],
    todolistId2: [
      { id: "1", title: "bread", status: TaskStatus.New, todoListId: "todolistId2", ...taskDefaultValues },
      { id: "2", title: "milk", status: TaskStatus.Completed, todoListId: "todolistId2", ...taskDefaultValues },
      { id: "3", title: "tea", status: TaskStatus.New, todoListId: "todolistId2", ...taskDefaultValues },
    ],
  }
})

test("correct task should be deleted", () => {
  const endState = tasksReducer(startState, deleteTaskTC.fulfilled({ task: { todolistId: "todolistId2", taskId: "2" } }, 'requestId', { todolistId: "todolistId2", taskId: "2" }))

  expect(endState).toEqual({
    todolistId1: [
      { id: "1", title: "CSS", status: TaskStatus.New, todoListId: "todolistId1", ...taskDefaultValues },
      { id: "2", title: "JS", status: TaskStatus.Completed, todoListId: "todolistId1", ...taskDefaultValues },
      { id: "3", title: "React", status: TaskStatus.New, todoListId: "todolistId1", ...taskDefaultValues },
    ],
    todolistId2: [
      { id: "1", title: "bread", status: TaskStatus.New, todoListId: "todolistId2", ...taskDefaultValues },
      { id: "3", title: "tea", status: TaskStatus.New, todoListId: "todolistId2", ...taskDefaultValues },
    ],
  })
})

test("correct task should be created at correct array", () => {
  const endState = tasksReducer(
    startState,
    createTaskTC.fulfilled({
      task: {
        id: "4",
        status: TaskStatus.New,
        todoListId: "todolistId2",
        title: "juice",
        ...taskDefaultValues
      }
    }, 'requestId', { todolistId: "todolistId2", title: "juice" }),
  )

  expect(endState.todolistId1.length).toBe(3)
  expect(endState.todolistId2.length).toBe(4)
  expect(endState.todolistId2[0].id).toBeDefined()
  expect(endState.todolistId2[0].title).toBe("juice")
  expect(endState.todolistId2[0].status).toBe(TaskStatus.New)
})

test("correct task should change its status", () => {
  const updatedTask = {
    description: '',
    priority: TaskPriority.Low,
    status: TaskStatus.New,
    startDate: '',
    deadline: '',
  }
  const task = {
    id: "3",
    title: "tea",
    status: TaskStatus.New,
    todoListId: "todolistId2",
    description: '',
    priority: TaskPriority.Low,
    startDate: '',
    deadline: '',
    order: 0,
    addedDate: '',
  }
  const endState = tasksReducer(
    startState,
    updateTaskTC.fulfilled({ task }, 'requestId', { todolistId: "todolistId2", taskId: "2", domainModel: updatedTask }),
  )

  expect(endState.todolistId2[2].status).toBe(TaskStatus.New)
  expect(endState.todolistId1[1].status).toBe(TaskStatus.Completed)
})

test("correct task should change its title", () => {
  const updatedTask = {
    description: '',
    priority: TaskPriority.Low,
    status: TaskStatus.New,
    startDate: '',
    deadline: '',
  }
  const task = {
    id: "2",
    title: "coffee",
    status: TaskStatus.New,
    todoListId: "todolistId2",
    description: '',
    priority: TaskPriority.Low,
    startDate: '',
    deadline: '',
    order: 0,
    addedDate: '',
  }
  const endState = tasksReducer(
    startState,
    updateTaskTC.fulfilled({ task }, 'requestId', { todolistId: "todolistId2", taskId: "2", domainModel: updatedTask }),
  )

  expect(endState.todolistId2[1].title).toBe("coffee")
  expect(endState.todolistId1[1].title).toBe("JS")
})

test("array should be created for new todolist", () => {
  const title = "New todolist"
  const id = nanoid()
  const todolist = {
    id,
    title,
    addedDate: '',
    filter: 'all',
    order: 0
  }
  const endState = tasksReducer(startState, createTodolistTC.fulfilled({ todolist }, 'requestId', title))

  const keys = Object.keys(endState)
  const newKey = keys.find((k) => k !== "todolistId1" && k !== "todolistId2")

  if (!newKey) {
    throw Error("New key should be added")
  }

  expect(keys.length).toBe(3)
  expect(endState[newKey]).toEqual([])
})

test("property with todolistId should be deleted", () => {
  const endState = tasksReducer(startState, deleteTodolistTC.fulfilled({ id: "todolistId2" }, 'requestId', "todolistId2"))

  const keys = Object.keys(endState)

  expect(keys.length).toBe(1)
  expect(endState["todolistId2"]).not.toBeDefined()
  expect(endState["todolistId2"]).toBeUndefined()
})