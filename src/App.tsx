import './App.css'
import { tasks, statuses } from './utils/Data-Task'
import UserTask from './components/UserTask'

function App() {
  const columns = statuses.map((status) => {
    const tasksInColumn = tasks.filter((task) => task.status === status)
    return {
      status,
      tasks: tasksInColumn
    }
  })

  return (
    <div className='flex divide-x'>
      {columns.map((column) => (
        <div>
          <h2 className='text-3xl p-2 font-bold text-red-500'>{column.status}</h2>
          {column.tasks.map((task) => <UserTask task={task}></UserTask>)}
        </div>
      ))}
    </div>
  )
}

export default App
