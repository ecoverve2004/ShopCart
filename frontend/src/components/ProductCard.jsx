import React from 'react'
import { ShoppingCart, Star } from 'lucide-react'

export default function ProductCard({ product, onAddToCart }) {
  const rating = Math.round(product.rating || 0)
  const inStock = Number(product.stock) > 0

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-glow">
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          onError={(event) => {
            event.currentTarget.src = 'https://via.placeholder.com/600x600?text=Product+Image'
          }}
        />
        <div className="absolute left-3 top-3 rounded-full bg-white/85 px-3 py-1 text-xs font-bold text-ink">
          {product.category}
        </div>
        <div className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${inStock ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-700'}`}>
          {inStock ? `${product.stock} in stock` : 'Out of stock'}
        </div>
      </div>
      <div className="p-4">
        <h3 className="mt-1 text-lg font-bold">{product.name}</h3>
        <p className="mt-2 min-h-[48px] text-sm text-gray-600">{product.description}</p>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < rating ? 'fill-secondary text-secondary' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">({product.reviews})</span>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">${Number(product.price).toFixed(2)}</span>
          <button
            onClick={() => onAddToCart(product)}
            disabled={!inStock}
            className="rounded-xl bg-primary p-2 text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
