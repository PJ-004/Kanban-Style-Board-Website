import './App.css'
import type { Task } from './utils/Data-Task'
import UserTask from './components/UserTask'

function App() {
  const task: Task = {
    title: 'Dummy',
    id: 1234,
    due_date: new Date(2026, 7, 8)
  }

  return (
    <>
      <UserTask task={task}></UserTask>
      <UserTask task={task}></UserTask>
      <UserTask task={task}></UserTask>
      <UserTask task={task}></UserTask>
    </>
  )
}

export default App
