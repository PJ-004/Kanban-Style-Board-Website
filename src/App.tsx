import { useState, useEffect } from 'react'
import './App.css'
import { statuses, type Task } from './utils/Data-Task'
import Column from './components/Column'
import AddTask from './components/AddTask'
import BoardStats from './components/BoardStats'
import { supabase } from './utils/supabase'
import type { Session } from '@supabase/supabase-js'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [tasksLoading, setTasksLoading] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const fetchTasks = async () => {
    setTasksLoading(true)
    setFetchError(null)

    const { data, error } = await supabase.from('tasks').select()

    if (error) {
      setFetchError("Couldn't load your tasks. Please try refreshing.")
      console.error(error)
    } else if (data) {
      setTasks(data as Task[])
    }

    setTasksLoading(false)
  }

  const handleNewGuestSession = async () => {
    setLoading(true)
    setTasks([])
    setFetchError(null)

    await supabase.auth.signOut()

    const { data, error } = await supabase.auth.signInAnonymously()
    if (error) {
      setFetchError("Couldn't start a new guest session. Please try again.")
      console.error(error)
    } else {
      setSession(data.session)
    }

    setLoading(false)
  }

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (session) {
        setSession(session)
      } else {
        const { data, error } = await supabase.auth.signInAnonymously()
        if (error) {
          setFetchError("Couldn't start your guest session. Please refresh the page.")
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-300">
          <div className="w-8 h-8 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin" />
          <div>Setting up your board...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <AddTask userId={session!.user.id} onTaskAdded={fetchTasks} />

      {fetchError && (
        <div className="flex justify-center px-4">
          <div className="bg-red-950 border border-red-700 text-red-300 rounded px-4 py-2 mb-2 text-sm">
            {fetchError}
          </div>
        </div>
      )}

      <BoardStats tasks={tasks} />

      <div className="flex justify-center px-4 pb-2">
        <input
          type="text"
          placeholder="Search tasks by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border border-gray-600 bg-gray-800 text-white placeholder-gray-400 rounded px-3 py-1.5 w-72"
        />
      </div>

      <div className="flex justify-center gap-6 flex-wrap">
        {statuses.map((status) => (
          <Column
            key={status}
            status={status}
            tasks={filteredTasks.filter((task) => task.status === status)}
            onTaskUpdated={fetchTasks}
            loading={tasksLoading}
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