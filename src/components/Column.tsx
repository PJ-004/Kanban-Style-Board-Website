// components/Column.tsx
import { useState } from "react"
import type { Task, Status } from "../utils/Data-Task"
import UserTask from "./UserTask"
import { supabase } from "../utils/supabase"

const statusColors: Record<Status, string> = {
  "Todo": "bg-slate-800",
  "In Progress": "bg-slate-700",
  "In Review": "bg-slate-600",
  "Done": "bg-slate-500",
}

const Column = ({
  status,
  tasks,
  onTaskUpdated,
  loading,
}: {
  status: Status
  tasks: Task[]
  onTaskUpdated: () => void
  loading: boolean
}) => {
  const [dropError, setDropError] = useState<string | null>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData("taskId")
    if (!taskId) return

    setDropError(null)

    const { error } = await supabase
      .from("tasks")
      .update({ status })
      .eq("id", taskId)

    if (error) {
      setDropError("Couldn't move that task. Please try again.")
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

      {dropError && (
        <div className="text-red-300 text-xs bg-red-950 border border-red-700 rounded px-2 py-1 mx-1 mb-2">
          {dropError}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col gap-2 px-2">
          <div className="h-16 bg-gray-700/50 rounded-lg animate-pulse" />
          <div className="h-16 bg-gray-700/50 rounded-lg animate-pulse" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-gray-400 text-sm text-center px-4 py-8 italic">
          No tasks here yet
        </div>
      ) : (
        tasks.map((task) => (
          <UserTask key={task.id} task={task} onTaskUpdated={onTaskUpdated} />
        ))
      )}
    </div>
  )
}

export default Column