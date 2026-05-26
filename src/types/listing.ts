export interface Listing {
  id: string
  title: string
  description: string
  price: number
  address: string
  city: string
  state: string
  zip: string
  bedrooms: number
  bathrooms: number
  available_from: string
  available_to: string
  photos: string[]
  owner_id: string
  owner_email: string
  walk_score?: number
  verified: boolean
  created_at: string
}

export interface Message {
  id: string
  listing_id: string
  sender_id: string
  receiver_id: string
  content: string
  created_at: string
  read: boolean
}

export interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  stripe_account_id?: string
}
