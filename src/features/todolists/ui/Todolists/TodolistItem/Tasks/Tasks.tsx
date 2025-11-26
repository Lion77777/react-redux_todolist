import { useAppDispatch, useAppSelector } from "@/common/hooks"
import type { DomaintTodolist } from "@/features/todolists/model/todolists-slice"
import { TaskItem } from "./TaskItem/TaskItem"
import List from "@mui/material/List"
import { fetchTasksTC, selectTasks } from "@/features/todolists/model/tasks-slice"
import { useEffect } from "react"

type Props = {
  todolist: DomaintTodolist
}

export const Tasks = ({ todolist }: Props) => {
  const { id, filter } = todolist

  const tasks = useAppSelector(selectTasks)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchTasksTC(id))
  }, [])

  const todolistTasks = tasks[id]
  let filteredTasks = todolistTasks
  if (filter === "active") {
    filteredTasks = todolistTasks.filter((task) => !task.isDone)
  }
  if (filter === "completed") {
    filteredTasks = todolistTasks.filter((task) => task.isDone)
  }

  return (
    <>
      {filteredTasks?.length === 0 ? (
        <p>Тасок нет</p>
      ) : (
        <List>
          {filteredTasks?.map((task) => (
            <TaskItem key={task.id} task={task} todolistId={id} />
          ))}
        </List>
      )}
    </>
  )
}
