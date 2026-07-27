// components/BoardStats.tsx
import type { Task } from "../utils/Data-Task"

const parseLocalDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split("-").map(Number)
  return new Date(year, month - 1, day)
}

const isOverdue = (dueDateStr?: string) => {
  if (!dueDateStr) return false
  const due = parseLocalDate(dueDateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  due.setHours(0, 0, 0, 0)
  return due.getTime() < today.getTime()
}

const BoardStats = ({ tasks }: { tasks: Task[] }) => {
  const total = tasks.length
  const completed = tasks.filter((t) => t.status === "Done").length
  const overdue = tasks.filter((t) => t.status !== "Done" && isOverdue(t.due_date)).length

  return (
    <div className="flex justify-center gap-6 text-sm text-gray-300 py-2">
      <div>
        <span className="font-bold text-white">{total}</span> total
      </div>
      <div>
        <span className="font-bold text-green-400">{completed}</span> completed
      </div>
      <div>
        <span className="font-bold text-red-400">{overdue}</span> overdue
      </div>
    </div>
  )
}

export default BoardStats