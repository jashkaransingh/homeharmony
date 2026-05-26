# HomeHarmony

full stack subleasing platform for students. find or post rentals, chat with landlords in real time, and pay through Stripe. lease documents get verified with OCR before listings go live.

## features

- filter listings by city, price, bedrooms, availability
- real-time chat between buyers and sellers via Supabase postgres_changes
- Stripe Connect for landlord payouts straight to bank accounts
- Google Cloud Vision OCR for lease document verification
- Walk Score integration on every listing

## architecture

```
React + TypeScript (Vite)
   │
   ▼
Supabase (Postgres + Auth + Realtime + Storage)
   │
   ├─ listings table for CRUD and image storage
   ├─ messages table with realtime subscriptions
   └─ edge functions for Stripe Connect and OCR verification
```

## realtime messaging

uses Supabase's `postgres_changes` subscription. no polling, instant delivery. messages get marked read automatically when the receiver opens the chat.

```typescript
supabase
  .channel(`messages:${listingId}:${userId}`)
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, handler)
  .subscribe()
```

## the hard part

Stripe Connect onboarding. partial failures, webhook retries, idempotency keys, what happens when a landlord starts the flow and bails halfway through. every edge case felt like discovering something Stripe forgot to document. webhooks fire twice and you need to handle that. accounts can sit in restricted state without it being obvious. payouts can fail silently if requirements aren't met. spent more time on payment edge cases than the rest of the app combined. I read payment integrations differently now.

## run it locally

```bash
git clone https://github.com/jashkaransingh/homeharmony
cd homeharmony
npm install
cp .env.example .env
npm run dev
```

env vars

`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_STRIPE_PUBLISHABLE_KEY`

## stack

React, TypeScript, Vite, Supabase (Postgres + Realtime + Edge Functions), Stripe Connect, Google Cloud Vision.
