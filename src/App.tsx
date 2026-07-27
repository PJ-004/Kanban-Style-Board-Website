import { useState, useEffect } from 'react'
import './App.css'
import { statuses, type Task } from './utils/Data-Task'
import Column from './components/Column'
import SignIn from './components/SignIn'
import AddTask from './components/AddTask'
import { supabase } from './utils/supabase'
import type { Session } from '@supabase/supabase-js'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [tasks, setTasks] = useState<Task[]>([])

  const fetchTasks = async () => {
    const { data, error } = await supabase.from('tasks').select()
    if (data) setTasks(data as Task[])
    if (error) console.error(error)
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error(error)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    )

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) fetchTasks()
  }, [session])

  if (loading) return <div>Loading...</div>
  if (!session) return <SignIn />

  return (
    <div className="min-h-screen bg-gray-900">
      <AddTask userId={session.user.id} onTaskAdded={fetchTasks} />
      <div className="flex justify-center gap-6">
        {statuses.map((status) => (
          <Column
            key={status}
            status={status}
            tasks={tasks.filter((task) => task.status === status)}
            onTaskUpdated={fetchTasks}
          />
        ))}
      </div>

      <div className="p-4 flex justify-center">
        <button
          onClick={handleLogout}
          className="px-3 py-1 border-2 border-red-500 text-red-500 rounded font-bold"
        >
          Log Out
        </button>
      </div>
    </div>
  )
}