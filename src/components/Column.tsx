// components/Column.tsx
import type { Task, Status } from "../utils/Data-Task"
import UserTask from "./UserTask"
import { supabase } from "../utils/supabase"

const statusColors: Record<Status, string> = {
  "Todo": "bg-slate-800",
  "In Progress": "bg-slate-800",
  "In Review": "bg-slate-800",
  "Done": "bg-slate-800",
}

const Column = ({
  status,
  tasks,
  onTaskUpdated,
}: {
  status: Status
  tasks: Task[]
  onTaskUpdated: () => void
}) => {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault() // required to allow dropping
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData("taskId")
    if (!taskId) return

    const { error } = await supabase
      .from("tasks")
      .update({ status })
      .eq("id", taskId)

    if (error) {
      console.error(error)
    } else {
      onTaskUpdated()
    }
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`min-h-[300px] w-64 rounded-lg p-2 shadow-lg border border-gray-700 ${statusColors[status]}`}
    >
      <h2 className="text-3xl p-2 font-bold text-red-400">{status}</h2>
      {tasks.map((task) => (
        <UserTask key={task.id} task={task} onTaskUpdated={onTaskUpdated} />
      ))}
    </div>
  )
}

export default Column