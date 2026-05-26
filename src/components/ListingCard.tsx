import React from 'react'
import type { Listing } from '../types/listing'

interface Props {
  listing: Listing
  onClick: () => void
}

export function ListingCard({ listing, onClick }: Props) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div onClick={onClick} style={{ cursor: 'pointer', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
      {listing.photos[0] && (
        <img src={listing.photos[0]} alt={listing.title} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
      )}
      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{listing.title}</h3>
          {listing.verified && (
            <span style={{ fontSize: 11, background: '#dcfce7', color: '#166534', padding: '2px 8px', borderRadius: 999 }}>
              Verified
            </span>
          )}
        </div>
        <p style={{ margin: '4px 0', color: '#6b7280', fontSize: 14 }}>{listing.city}, {listing.state}</p>
        <p style={{ margin: '8px 0 4px', fontWeight: 700, fontSize: 18 }}>
          {formatPrice(listing.price)}<span style={{ fontWeight: 400, fontSize: 14, color: '#6b7280' }}>/mo</span>
        </p>
        <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>
          {listing.bedrooms}bd · {listing.bathrooms}ba · Available {formatDate(listing.available_from)}
        </p>
        {listing.walk_score && (
          <p style={{ margin: '8px 0 0', fontSize: 12, color: '#6b7280' }}>Walk Score: {listing.walk_score}</p>
        )}
      </div>
    </div>
  )
}
