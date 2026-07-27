export type Status = "Todo" | "In Progress" | "In Review" | "Done"

export type Task = {
  id: number
  title: string
  status: Status
  user_id?: string
  created_at?: string
  due_date?: Date
}

export const statuses: Status[] = ["Todo", "In Progress", "In Review", "Done"]