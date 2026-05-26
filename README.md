# homeharmony

Subleasing platform built for college students. Browse listings with map-based search, message sellers in real-time, and pay securely through Stripe Connect with seller payouts.

## Features

- **Listings** — post properties with photos, map pin, and Walk Score integration
- **Real-time chat** — WebSocket + Supabase subscriptions for instant buyer-seller messaging
- **Payments** — Stripe Connect onboarding for sellers, secure checkout for buyers
- **Lease verification** — Google Cloud Vision OCR to validate uploaded lease documents
- **Auth** — Supabase Auth with email/password and Google OAuth

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, TypeScript, Tailwind CSS |
| Backend | Supabase (PostgreSQL + Auth + Realtime) |
| Payments | Stripe Connect |
| Maps | Google Maps API + Walk Score API |
| OCR | Google Cloud Vision |
| Deploy | Vercel (frontend) |

## Setup

```bash
git clone https://github.com/jashkaransingh/homeharmony
cd homeharmony
npm install
cp .env.example .env.local   # fill in Supabase + Stripe keys
npm run dev
```

## Database schema

```sql
users        -- Supabase Auth users extended with profiles
listings     -- Properties: address, price, photos, coords, owner_id
messages     -- Buyer-seller chat: listing_id, sender_id, content, created_at
payments     -- Stripe payment records: amount, status, listing_id
```
