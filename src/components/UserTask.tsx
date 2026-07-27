// components/UserTask.tsx
import { useState } from "react"
import type { Task } from "../utils/Data-Task"
import { supabase } from "../utils/supabase"

const UserTask = ({ task, onTaskUpdated }: { task: Task; onTaskUpdated: () => void }) => {
  const [editing, setEditing] = useState(false)
  const [dueDate, setDueDate] = useState(
    task.due_date ? new Date(task.due_date).toISOString().split("T")[0] : ""
  )

  const handleSave = async () => {
    const { error } = await supabase
      .from("tasks")
      .update({ due_date: dueDate || null })
      .eq("id", task.id)

    if (error) {
      console.error(error)
    } else {
      setEditing(false)
      onTaskUpdated()
    }
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("taskId", String(task.id))
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="border rounded-lg px-2 m-2 bg-gray-200 w-56 cursor-move"
    >
      <div className="text-base font-semibold py-1 m-1">{task.title}</div>
      <div className="flex justify-between text-sm text-gray-700 items-center">
        <div>ID: {task.id}</div>
        {editing ? (
          <div className="flex gap-1 items-center">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border rounded px-1 text-xs"
            />
            <button onClick={handleSave} className="text-blue-600 text-xs font-bold">
              Save
            </button>
          </div>
        ) : (
          <div onClick={() => setEditing(true)} className="cursor-pointer underline">
            {task.due_date
              ? new Date(task.due_date).toLocaleDateString()
              : "Set due date"}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserTask