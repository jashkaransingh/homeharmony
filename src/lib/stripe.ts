import { loadStripe } from '@stripe/stripe-js'

export const stripe = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

export async function createCheckoutSession(listingId: string, amount: number): Promise<string> {
  const { supabase } = await import('./supabase')
  const { data } = await supabase.functions.invoke('create-checkout', {
    body: { listing_id: listingId, amount }
  })
  return data.session.url
}

export async function createConnectAccount(): Promise<string> {
  const { supabase } = await import('./supabase')
  const { data } = await supabase.functions.invoke('create-connect-account', {})
  return data.url
}
