// components/UserTask.tsx
import { useState } from "react"
import type { Task } from "../utils/Data-Task"
import { supabase } from "../utils/supabase"

const priorityColors: Record<string, string> = {
  low: "bg-gray-400 text-gray-900",
  normal: "bg-blue-400 text-blue-950",
  high: "bg-red-400 text-red-950",
}

// Parses a "YYYY-MM-DD" string as a LOCAL date, avoiding UTC off-by-one issues
const parseLocalDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-").map(Number)
  return new Date(year, month - 1, day)
}

const getUrgency = (dueDateStr?: string) => {
  if (!dueDateStr) return null

  const due = parseLocalDate(dueDateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  due.setHours(0, 0, 0, 0)

  const diffDays = Math.round((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return "overdue"
  if (diffDays <= 1) return "soon" // due today or tomorrow
  return null
}

const urgencyStyles: Record<string, string> = {
  overdue: "bg-red-600 text-white",
  soon: "bg-amber-400 text-amber-950",
}

const urgencyLabels: Record<string, string> = {
  overdue: "Overdue",
  soon: "Due soon",
}

const UserTask = ({ task, onTaskUpdated }: { task: Task; onTaskUpdated: () => void }) => {
  const [editing, setEditing] = useState(false)
  const [dueDate, setDueDate] = useState(task.due_date ?? "")

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

  const urgency = getUrgency(task.due_date)

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="border rounded-lg px-2 m-2 bg-gray-200 w-56 cursor-move"
    >
      <div className="flex justify-between items-start pt-1 px-1 gap-1">
        <div className="text-base font-semibold py-1">{task.title}</div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-bold whitespace-nowrap ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <div className="text-sm text-gray-600 px-1 pb-1">{task.description}</div>
      )}

      {urgency && (
        <div className="px-1 pb-1">
          <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${urgencyStyles[urgency]}`}>
            {urgencyLabels[urgency]}
          </span>
        </div>
      )}

      <div className="flex justify-between text-sm text-gray-700 items-center px-1 pb-1">
        <div>ID: {String(task.id).slice(0, 8)}</div>
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
            {task.due_date ? parseLocalDate(task.due_date).toLocaleDateString() : "Set due date"}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserTask