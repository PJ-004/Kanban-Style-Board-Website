// components/AddTask.tsx
import { useState } from "react"
import { supabase } from "../utils/supabase"
import { statuses, priorities, type Status, type Priority } from "../utils/Data-Task"

const AddTask = ({ userId, onTaskAdded }: { userId: string; onTaskAdded: () => void }) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [status, setStatus] = useState<Status>("Todo")
  const [priority, setPriority] = useState<Priority>("normal")
  const [dueDate, setDueDate] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAddTask = async () => {
    if (!title.trim()) {
      setError("Title is required")
      return
    }

    setLoading(true)
    setError(null)

    const { error } = await supabase.from("tasks").insert({
      title,
      description: description || null,
      status,
      priority,
      user_id: userId,
      due_date: dueDate || null,
    })

    if (error) {
      setError(error.message)
    } else {
      setTitle("")
      setDescription("")
      setStatus("Todo")
      setPriority("normal")
      setDueDate("")
      onTaskAdded()
    }

    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-2 p-4 items-center">
      <div className="flex gap-2 flex-wrap justify-center">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border border-gray-600 bg-gray-800 text-white placeholder-gray-400 rounded px-2 py-1"
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border border-gray-600 bg-gray-800 text-white placeholder-gray-400 rounded px-2 py-1 w-56"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as Status)}
          className="border border-gray-600 bg-gray-800 text-white rounded px-2 py-1"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="border border-gray-600 bg-gray-800 text-white rounded px-2 py-1"
        >
          {priorities.map((p) => (
            <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
          ))}
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="border border-gray-600 bg-gray-800 text-white rounded px-2 py-1 [color-scheme:dark]"
        />
        <button
          onClick={handleAddTask}
          disabled={loading}
          className="px-3 py-1 border-2 border-blue-500 text-blue-400 rounded font-bold hover:bg-blue-950"
        >
          {loading ? "Adding..." : "Add Task"}
        </button>
      </div>
      {error && <span className="text-red-400 text-sm">{error}</span>}
    </div>
  )
}

export default AddTask