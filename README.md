# HomeHarmony

Subleasing platform built for students. Find and post short-term rentals, chat with landlords in real time, and pay securely through Stripe.

## Features

- **Listing search** — filter by city, price range, bedrooms, and availability
- **Real-time messaging** — WebSocket chat between buyers and sellers via Supabase subscriptions
- **Stripe Connect** — secure payouts directly to landlord bank accounts
- **OCR lease verification** — Google Cloud Vision validates lease documents before listings go live
- **Walk Score integration** — transit and walkability scores on every listing

## Architecture

```
React + TypeScript (Vite)
        │
        ▼
Supabase (PostgreSQL + Auth + Realtime)
        │
        ├── Listings table ──── CRUD, image storage
        ├── Messages table ──── realtime subscriptions
        └── Edge Functions ──── Stripe Connect, OCR verification
```

## Realtime Messaging

Uses Supabase's `postgres_changes` subscription — no polling, instant delivery. Messages are marked read automatically when the receiver opens the chat window.

```typescript
supabase
  .channel(`messages:${listingId}:${userId}`)
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, handler)
  .subscribe()
```

## Setup

```bash
git clone https://github.com/jashkaransingh/homeharmony
cd homeharmony
npm install
cp .env.example .env  # add your Supabase and Stripe keys
npm run dev
```

**Required env vars:**
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_STRIPE_PUBLISHABLE_KEY
```

## Stack

- **React + TypeScript** — frontend, Vite for bundling
- **Supabase** — PostgreSQL, auth, realtime subscriptions, edge functions
- **Stripe Connect** — payment processing and landlord payouts
- **Google Cloud Vision** — OCR-based lease document verification
