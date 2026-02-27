import { useEffect, useState } from 'react'
import { signInWithGoogle, signOut } from '../../lib/auth'
import { restoreSession } from '../../lib/session'
import { getNotes, addNote, deleteNote, updateNote } from '../../lib/notes'
import { supabase } from '../../lib/supabaseClient'

export default function App() {
  const [user, setUser] = useState<any>(null)
  const [notes, setNotes] = useState<any[]>([])
  const [text, setText] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')

  useEffect(() => {
    init()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        loadNotes()
      } else {
        setNotes([])
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function init() {
    await restoreSession()

    const { data } = await supabase.auth.getUser()
    setUser(data.user)

    if (data.user) loadNotes()
  }

  async function loadNotes() {
    const data = await getNotes()
    setNotes(data)
  }

  async function handleAdd() {
    await addNote(user.id, text)
    setText('')
    loadNotes()
  }

  async function handleDelete(id: string) {
    await deleteNote(id)
    loadNotes()
  }

  function startEdit(note: any) {
    setEditingId(note.id)
    setEditText(note.content)
  }

  async function handleUpdate() {
    if (editingId) {
      await updateNote(editingId, editText)
      setEditingId(null)
      setEditText('')
      loadNotes()
    }
  }

  if (!user) {
    return (
      <div style={{
        width: '300px',
        height: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <h2 style={{ color: 'white', marginBottom: '30px' }}>Welcome</h2>
        <button
          onClick={signInWithGoogle}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '600',
            color: '#333',
            background: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          🔐 Sign in with Google
        </button>
      </div>
    )
  }

  return (
    <div style={{
      width: '300px',
      minHeight: '400px',
      padding: '20px',
      background: '#f5f5f5',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ marginBottom: '15px', fontSize: '14px', color: '#666' }}>
        {user.email}
      </div>
      
      <button
        onClick={async () => {
          await signOut()
          setUser(null)
          setNotes([])
        }}
        style={{
          padding: '6px 12px',
          fontSize: '12px',
          background: '#ff4444',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Sign out
      </button>

      <hr style={{ margin: '15px 0', border: 'none', borderTop: '1px solid #ddd' }} />

      <div style={{ display: 'flex', gap: '8px', marginBottom: '15px' }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a note..."
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />
        <button
          onClick={handleAdd}
          style={{
            padding: '8px 16px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Add
        </button>
      </div>

      {notes.map((note) => (
        <div
          key={note.id}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px',
            marginBottom: '8px',
            background: 'white',
            borderRadius: '4px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}
        >
          {editingId === note.id ? (
            <>
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                style={{
                  flex: 1,
                  padding: '6px',
                  border: '1px solid #ddd',
                  borderRadius: '3px',
                  fontSize: '14px',
                  marginRight: '8px'
                }}
              />
              <button
                onClick={handleUpdate}
                style={{
                  padding: '4px 8px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  marginRight: '4px'
                }}
              >
                ✓
              </button>
              <button
                onClick={() => setEditingId(null)}
                style={{
                  padding: '4px 8px',
                  background: '#999',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                ✕
              </button>
            </>
          ) : (
            <>
              <span style={{ fontSize: '14px', flex: 1 }}>{note.content}</span>
              <button
                onClick={() => startEdit(note)}
                style={{
                  padding: '4px 8px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  marginRight: '4px'
                }}
              >
                ✎
              </button>
              <button
                onClick={() => handleDelete(note.id)}
                style={{
                  padding: '4px 8px',
                  background: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                ×
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  )
}