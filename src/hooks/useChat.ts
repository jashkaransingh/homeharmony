import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import type { Message } from "../types/listing";

export function useChat(listingId: string, currentUserId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // Initial load
  useEffect(() => {
    async function loadMessages() {
      const { data } = await supabase
        .from("messages")
        .select("*, sender:profiles(full_name)")
        .eq("listing_id", listingId)
        .order("created_at", { ascending: true });
      setMessages(data ?? []);
      setLoading(false);
    }
    loadMessages();
  }, [listingId]);

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel(`listing-chat-${listingId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `listing_id=eq.${listingId}`,
        },
        async (payload) => {
          // Fetch the full message with sender profile
          const { data } = await supabase
            .from("messages")
            .select("*, sender:profiles(full_name)")
            .eq("id", payload.new.id)
            .single();
          if (data) {
            setMessages((prev) => [...prev, data]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [listingId]);

  const sendMessage = useCallback(
    async (content: string) => {
      await supabase.from("messages").insert({
        listing_id: listingId,
        sender_id: currentUserId,
        content: content.trim(),
      });
    },
    [listingId, currentUserId]
  );

  return { messages, loading, sendMessage };
}
