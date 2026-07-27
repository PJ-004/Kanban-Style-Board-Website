// components/AddTask.tsx
import { useState } from "react"
import { supabase } from "../utils/supabase"
import { statuses, type Status } from "../utils/Data-Task"

const AddTask = ({ userId, onTaskAdded }: { userId: string; onTaskAdded: () => void }) => {
  const [title, setTitle] = useState("")
  const [status, setStatus] = useState<Status>("Todo")
  const [dueDate, setDueDate] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAddTask = async () => {
    if (!title.trim()) return

    setLoading(true)
    setError(null)

    const { error } = await supabase
      .from("tasks")
      .insert({
        title,
        status,
        user_id: userId,
        due_date: dueDate || null,
      })

    if (error) {
      setError(error.message)
    } else {
      setTitle("")
      setStatus("Todo")
      setDueDate("")
      onTaskAdded()
    }

    setLoading(false)
  }

  return (
    <div className="flex gap-2 p-2 items-center">
      <input
        type="text"
        placeholder="New task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border rounded px-2 py-1"
      />
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as Status)}
        className="border rounded px-2 py-1"
      >
        {statuses.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="border rounded px-2 py-1"
      />
      <button
        onClick={handleAddTask}
        disabled={loading}
        className="px-3 py-1 border-2 border-blue-500 text-blue-500 rounded font-bold"
      >
        {loading ? "Adding..." : "Add Task"}
      </button>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  )
}

export default AddTask