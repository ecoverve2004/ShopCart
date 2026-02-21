import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import ProductCard from '../components/ProductCard'
import { fallbackProducts, ERROR_MESSAGE } from '../data/fallbackData'

const sortProducts = (items, sortBy) => {
  switch (sortBy) {
    case 'price-asc':
      return [...items].sort((a, b) => a.price - b.price)
    case 'price-desc':
      return [...items].sort((a, b) => b.price - a.price)
    case 'rating':
      return [...items].sort((a, b) => b.rating - a.rating)
    case 'name':
      return [...items].sort((a, b) => a.name.localeCompare(b.name))
    default:
      return [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
}

export default function Shop({ addToCart, searchQuery, onSearchChange }) {
  const [products, setProducts] = useState([])
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('newest')
  const [maxPrice, setMaxPrice] = useState(500)
  const [priceCap, setPriceCap] = useState(500)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setError('')
      const res = await axios.get('/api/products')
      
      if (Array.isArray(res.data) && res.data.length > 0) {
        setProducts(res.data)
        const nextCap = Math.max(...res.data.map((product) => Number(product.price)), 100)
        const roundedCap = Math.ceil(nextCap)
        setPriceCap(roundedCap)
        setMaxPrice(roundedCap)
      } else {
        // API returned empty array, use fallback
        setProducts(fallbackProducts)
        const nextCap = Math.max(...fallbackProducts.map((product) => Number(product.price)), 100)
        const roundedCap = Math.ceil(nextCap)
        setPriceCap(roundedCap)
        setMaxPrice(roundedCap)
        setError(ERROR_MESSAGE)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
      // Use fallback data when API fails
      setProducts(fallbackProducts)
      const nextCap = Math.max(...fallbackProducts.map((product) => Number(product.price)), 100)
      const roundedCap = Math.ceil(nextCap)
      setPriceCap(roundedCap)
      setMaxPrice(roundedCap)
      setError(ERROR_MESSAGE)
    } finally {
      setLoading(false)
    }
  }

  const categories = useMemo(
    () => ['All', ...new Set(products.map((product) => product.category))],
    [products]
  )

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    const result = products.filter((product) => {
      const categoryMatch = selectedCategory === 'All' || product.category === selectedCategory
      const textMatch =
        query.length === 0 ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      const priceMatch = Number(product.price) <= maxPrice

      return categoryMatch && textMatch && priceMatch
    })

    return sortProducts(result, sortBy)
  }, [products, selectedCategory, searchQuery, maxPrice, sortBy])

  if (loading) {
    return (
      <div className="container mx-auto flex h-96 items-center justify-center px-4">
        <p className="text-xl font-semibold text-gray-600">Loading products...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-display text-4xl font-bold">Shop All Products</h1>
      <p className="mt-2 text-gray-600">Browse, filter, and compare products by category, price, and rating.</p>

      {error && (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="mt-8 grid gap-4 rounded-2xl border border-teal-100 bg-white p-5 shadow-sm lg:grid-cols-4">
        <label className="space-y-2">
          <span className="block text-sm font-bold text-gray-700">Search</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Find products"
            className="w-full rounded-xl border border-teal-100 px-3 py-2 focus:border-primary focus:outline-none"
          />
        </label>

        <label className="space-y-2">
          <span className="block text-sm font-bold text-gray-700">Sort by</span>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="w-full rounded-xl border border-teal-100 px-3 py-2 focus:border-primary focus:outline-none"
          >
            <option value="newest">Newest</option>
            <option value="rating">Top rated</option>
            <option value="price-asc">Price: Low to high</option>
            <option value="price-desc">Price: High to low</option>
            <option value="name">Name A-Z</option>
          </select>
        </label>

        <label className="space-y-2 lg:col-span-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-700">Max price</span>
            <span className="text-sm font-semibold text-primary">${Number(maxPrice).toFixed(0)}</span>
          </div>
          <input
            type="range"
            min="0"
            max={priceCap}
            value={maxPrice}
            onChange={(event) => setMaxPrice(Number(event.target.value))}
            className="w-full accent-primary"
          />
        </label>
      </div>

      <div className="mb-8 mt-6 flex flex-wrap items-center gap-3">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              selectedCategory === category
                ? 'bg-primary text-white'
                : 'bg-teal-50 text-gray-700 hover:bg-teal-100'
            }`}
          >
            {category}
          </button>
        ))}
        <button
          onClick={() => {
            setSelectedCategory('All')
            onSearchChange('')
            setMaxPrice(priceCap)
            setSortBy('newest')
          }}
          className="rounded-lg border border-teal-200 px-5 py-2 font-semibold text-primary transition hover:border-primary"
        >
          Clear Filters
        </button>
      </div>

      <p className="mb-5 text-sm font-semibold text-gray-500">
        Showing {filtered.length} of {products.length} products
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map(product => (
          <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-14 text-center">
          <p className="text-xl text-gray-600">No products found</p>
        </div>
      )}
    </div>
  )
}
