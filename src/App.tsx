import { useState, useEffect } from 'react'
import './App.css'
import { tasks, statuses } from './utils/Data-Task'
import UserTask from './components/UserTask'
import SignIn from './components/SignIn'
import { supabase } from './utils/supabase'
import type { Session } from '@supabase/supabase-js'

export default function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check current session on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for sign in / sign out events
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const columns = statuses.map((status) => {
    const tasksInColumn = tasks.filter((task) => task.status === status)
    return {
      status,
      tasks: tasksInColumn
    }
  })

  if (loading) {
    return <div>Loading...</div>
  }

  if (!session) {
    return <SignIn />
  }

  return (
    <>
      <div className='flex divide-x'>
        {columns.map((column) => (
          <div key={column.status}>
            <h2 className='text-3xl p-2 font-bold text-red-500'>{column.status}</h2>
            {column.tasks.map((task) => <UserTask key={task.id} task={task}></UserTask>)}
          </div>
        ))}
      </div>
    </>
  )
}