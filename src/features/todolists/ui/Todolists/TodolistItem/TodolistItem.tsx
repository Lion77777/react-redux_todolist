import { useAppDispatch } from "@/common/hooks"
import { FilterButtons } from "./FilterButtons/FilterButtons"
import type { DomaintTodolist } from "@/features/todolists/model/todolists-slice"
import { Tasks } from "./Tasks/Tasks"
import { TodolistTitle } from "./TodolistTitle/TodolistTitle"
import { CreateItemForm } from "@/common/components/CreateItemForm/CreateItemForm"
import { createTaskTC } from "@/features/todolists/model/tasks-slice"

type Props = {
  todolist: DomaintTodolist
}

export const TodolistItem = ({ todolist }: Props) => {
  const dispatch = useAppDispatch()

  const createTask = (title: string) => {
    dispatch(createTaskTC({ todolistId: todolist.id, title }))
  }

  return (
    <div>
      <TodolistTitle todolist={todolist} />
      <CreateItemForm onCreateItem={createTask} disabled={todolist.entityStatus === 'loading'}/>
      <Tasks todolist={todolist} />
      <FilterButtons todolist={todolist} />
    </div>
  )
}
