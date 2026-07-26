import './App.css'
import { tasks, statuses } from './utils/Data-Task'
import UserTask from './components/UserTask'
import SignIn from './components/SignIn'

export default function App() {
  /*
  const [todos, setTodos] = useState([])

  useEffect(() => {
    
    async function getTodos() {
      const { data: todos } = await supabase.from('users').select()

      if (todos) {
        setTodos(todos)
      }
    }

    getTodos()
  }, [])
  */

  const columns = statuses.map((status) => {
    const tasksInColumn = tasks.filter((task) => task.status === status)
    return {
      status,
      tasks: tasksInColumn
    }
  })

  return (
    <>
      <div className='flex divide-x'>
        {columns.map((column) => (
          <div>
            <h2 className='text-3xl p-2 font-bold text-red-500'>{column.status}</h2>
            {column.tasks.map((task) => <UserTask task={task}></UserTask>)}
          </div>
        ))}
      </div>

      <SignIn></SignIn>
    </>
  )
}