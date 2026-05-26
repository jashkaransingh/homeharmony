import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Listing } from '../types/listing'

interface Filters {
  city?: string
  minPrice?: number
  maxPrice?: number
  bedrooms?: number
  availableFrom?: string
}

export function useListings(filters: Filters = {}) {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchListings() {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('listings')
        .select('*')
        .order('created_at', { ascending: false })

      if (filters.city) query = query.ilike('city', `%${filters.city}%`)
      if (filters.minPrice) query = query.gte('price', filters.minPrice)
      if (filters.maxPrice) query = query.lte('price', filters.maxPrice)
      if (filters.bedrooms) query = query.eq('bedrooms', filters.bedrooms)
      if (filters.availableFrom) query = query.lte('available_from', filters.availableFrom)

      const { data, error: err } = await query

      if (err) {
        setError(err.message)
      } else {
        setListings(data ?? [])
      }
      setLoading(false)
    }

    fetchListings()
  }, [filters.city, filters.minPrice, filters.maxPrice, filters.bedrooms, filters.availableFrom])

  return { listings, loading, error }
}

export async function createListing(
  listing: Omit<Listing, 'id' | 'created_at' | 'owner_id' | 'verified'>
) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('listings')
    .insert({ ...listing, owner_id: user.id, owner_email: user.email, verified: false })
    .select()
    .single()

  if (error) throw error
  return data as Listing
}
