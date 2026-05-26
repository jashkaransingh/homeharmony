import React, { useState, useRef, useEffect } from 'react'
import { useChat } from '../hooks/useChat'
import type { Message } from '../types/listing'

interface Props {
  listingId: string
  receiverId: string
  currentUserId: string
}

export function ChatWindow({ listingId, receiverId, currentUserId }: Props) {
  const { messages, loading, sendMessage } = useChat(listingId, receiverId)
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    const text = input.trim()
    if (!text || sending) return
    setSending(true)
    setInput('')
    try {
      await sendMessage(text)
    } finally {
      setSending(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (loading) return <p style={{ padding: 16, color: '#6b7280' }}>Loading...</p>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', border: '1px solid #e5e7eb', borderRadius: 12 }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {messages.map((msg: Message) => {
          const isOwn = msg.sender_id === currentUserId
          return (
            <div key={msg.id} style={{ display: 'flex', justifyContent: isOwn ? 'flex-end' : 'flex-start' }}>
              <div style={{
                maxWidth: '70%', padding: '8px 12px',
                borderRadius: isOwn ? '12px 12px 0 12px' : '12px 12px 12px 0',
                background: isOwn ? '#2563eb' : '#f3f4f6',
                color: isOwn ? '#fff' : '#111'
              }}>
                <p style={{ margin: 0, fontSize: 14 }}>{msg.content}</p>
                <p style={{ margin: '4px 0 0', fontSize: 11, opacity: 0.7 }}>
                  {new Date(msg.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>
      <div style={{ borderTop: '1px solid #e5e7eb', padding: 12, display: 'flex', gap: 8 }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          style={{ flex: 1, resize: 'none', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', fontSize: 14, fontFamily: 'inherit' }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}
        >
          Send
        </button>
      </div>
    </div>
  )
}
