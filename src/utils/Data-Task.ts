export type Status = "Todo" | "In Progress" | "In Review" | "Done"

export type Task = {
    title: string,
    id: number,
    status: Status,
    due_date?: Date
}

export const statuses: Status[] = ["Todo", "In Progress", "In Review", "Done"]

export const tasks: Task[] = [
    {
      title: 'Something',
      id: 1234,
      status: "Todo",
      due_date: new Date(2026, 7, 8)
    }, {
      title: 'Something Else',
      id: 5678,
      status: "In Progress",
      due_date: new Date(2026, 7, 9)
    }, {
      title: 'Another',
      id: 9101112,
      status: "Todo",
      due_date: new Date(2026, 7, 10)
    }, {
      title: 'Yet More',
      id: 13141516,
      status: "In Review",
      due_date: new Date(2026, 7, 11)
    }, {
      title: 'Again',
      id: 17181920,
      status: "Done",
      due_date: new Date(2026, 7, 12)
    }
]