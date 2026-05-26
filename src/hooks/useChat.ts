import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import type { Message } from '../types/listing'

export function useChat(listingId: string, receiverId: string) {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('listing_id', listingId)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: true })

      setMessages(data ?? [])
      setLoading(false)

      await supabase
        .from('messages')
        .update({ read: true })
        .eq('listing_id', listingId)
        .eq('receiver_id', user.id)
        .eq('read', false)

      channelRef.current = supabase
        .channel(`messages:${listingId}:${user.id}`)
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `listing_id=eq.${listingId}`
        }, (payload) => {
          setMessages(prev => [...prev, payload.new as Message])
        })
        .subscribe()
    }

    init()
    return () => { channelRef.current?.unsubscribe() }
  }, [listingId, receiverId])

  async function sendMessage(content: string) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase.from('messages').insert({
      listing_id: listingId,
      sender_id: user.id,
      receiver_id: receiverId,
      content,
      read: false
    })

    if (error) throw error
  }

  return { messages, loading, sendMessage }
}
