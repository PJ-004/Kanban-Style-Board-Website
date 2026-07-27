import { useState, useEffect } from 'react'
import './App.css'
import { statuses, type Task } from './utils/Data-Task'
import Column from './components/Column'
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

  const handleNewGuestSession = async () => {
    setLoading(true)
    setTasks([])

    // End the current guest session
    await supabase.auth.signOut()

    // Immediately spin up a brand new anonymous session
    const { data, error } = await supabase.auth.signInAnonymously()
    if (error) {
      console.error(error)
    } else {
      setSession(data.session)
    }

    setLoading(false)
  }

  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        setSession(session)
      } else {
        const { data, error } = await supabase.auth.signInAnonymously()
        if (error) {
          console.error(error)
        } else {
          setSession(data.session)
        }
      }

      setLoading(false)
    }

    initSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setSession(session)
    )

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) fetchTasks()
  }, [session])

  if (loading) return <div>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-900">
      <AddTask userId={session!.user.id} onTaskAdded={fetchTasks} />
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

      <div className="p-4 flex justify-center mt-8">
        <button
          onClick={handleNewGuestSession}
          className="px-3 py-1 border-2 border-red-500 text-red-500 rounded font-bold"
        >
          New Guest Session
        </button>
      </div>
    </div>
  )
}