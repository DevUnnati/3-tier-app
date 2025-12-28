import React, { useEffect, useState } from 'react'

// Default to same-origin so Ingress can route /api -> backend
const API_URL = import.meta.env.VITE_API_URL || ''

export default function App() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({ name: '', email: '' })
  const [status, setStatus] = useState('')

  const load = async () => {
    try {
      const res = await fetch(`${API_URL}/api/users`)
      const data = await res.json()
      setUsers(data)
    } catch (e) {
      setStatus('Failed to load users')
    }
  }

  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    setStatus('Submitting...')
    try {
      const res = await fetch(`${API_URL}/api/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      if (!res.ok) throw new Error('Request failed')
      setForm({ name: '', email: '' })
      setStatus('User created!')
      await load()
    } catch (e) {
      setStatus('Failed to create user')
    }
  }

  return (
    <div style={{ fontFamily: 'system-ui', margin: 24 }}>
      <h1>Users</h1>
      <form onSubmit={submit} style={{ marginBottom: 16 }}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          style={{ marginRight: 8 }}
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          style={{ marginRight: 8 }}
        />
        <button type="submit">Add</button>
      </form>
      {status && <p>{status}</p>}
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.name} — {u.email}</li>
        ))}
      </ul>
    </div>
  )
}
