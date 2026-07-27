export type Status = "Todo" | "In Progress" | "In Review" | "Done"
export type Priority = "low" | "normal" | "high"

export type Task = {
  id: string
  title: string
  description?: string
  status: Status
  priority: Priority
  user_id?: string
  created_at?: string
  due_date?: string
}

export const statuses: Status[] = ["Todo", "In Progress", "In Review", "Done"]
export const priorities: Priority[] = ["low", "normal", "high"]