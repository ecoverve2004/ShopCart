import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { ArrowRight, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import { fallbackProducts, fallbackFeatured, ERROR_MESSAGE } from '../data/fallbackData'

const highlights = [
  {
    id: 'delivery',
    icon: Truck,
    title: 'Next-Day Options',
    description: 'Priority shipping available on all campus-zone orders.'
  },
  {
    id: 'quality',
    icon: ShieldCheck,
    title: 'Verified Quality',
    description: 'Every product is tested and reviewed before being listed.'
  },
  {
    id: 'curated',
    icon: Sparkles,
    title: 'Curated Drops',
    description: 'Weekly releases tailored to student and creator workflows.'
  }
]

export default function Home({ addToCart }) {
  const [products, setProducts] = useState([])
  const [featured, setFeatured] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterFeedback, setNewsletterFeedback] = useState({ type: 'idle', message: '' })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setError('')
      const [productsRes, featuredRes] = await Promise.allSettled([
        axios.get('/api/products'),
        axios.get('/api/featured')
      ])

      const nextProducts =
        productsRes.status === 'fulfilled' && Array.isArray(productsRes.value.data) && productsRes.value.data.length > 0
          ? productsRes.value.data
          : fallbackProducts

      const nextFeatured =
        featuredRes.status === 'fulfilled' && Array.isArray(featuredRes.value.data) && featuredRes.value.data.length > 0
          ? featuredRes.value.data
          : fallbackFeatured

      setProducts(nextProducts)
      setFeatured(nextFeatured)

      // Show error message when using fallback data
      if (productsRes.status === 'rejected' || featuredRes.status === 'rejected') {
        setError(ERROR_MESSAGE)
      } else if (!productsRes.value.data || productsRes.value.data.length === 0) {
        setError(ERROR_MESSAGE)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      setProducts(fallbackProducts)
      setFeatured(fallbackFeatured)
      setError(ERROR_MESSAGE)
    } finally {
      setLoading(false)
    }
  }

  const topProducts = useMemo(
    () =>
      [...products]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6),
    [products]
  )

  const handleNewsletterSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await axios.post('/api/newsletter', { email: newsletterEmail })
      setNewsletterFeedback({
        type: 'success',
        message: response.data?.alreadySubscribed ? 'You are already on the list.' : 'You are subscribed. Watch your inbox.'
      })
      setNewsletterEmail('')
    } catch (submitError) {
      setNewsletterFeedback({ type: 'error', message: submitError.response?.data?.error || 'Could not subscribe right now.' })
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto flex h-96 items-center justify-center px-4">
        <p className="text-xl font-semibold text-gray-600">Loading homepage...</p>
      </div>
    )
  }

  return (
    <div>
      <section className="relative overflow-hidden bg-mesh px-4 py-20">
        <div className="absolute -top-20 left-1/4 h-52 w-52 rounded-full bg-secondary/25 blur-3xl" />
        <div className="container relative z-10 mx-auto grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-3 inline-flex rounded-full bg-white/80 px-4 py-1 text-sm font-bold text-primary shadow">
              Student Tech Marketplace
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight text-ink md:text-5xl lg:text-6xl">
              Build your best semester setup.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-gray-700">
              Discover reliable gear for classes, content creation, and late-night projects. Better tools, less guesswork.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3 font-bold text-white transition hover:bg-teal-700"
              >
                Explore Shop <ArrowRight size={18} />
              </Link>
              <Link
                to="/contact"
                className="rounded-xl border border-teal-200 bg-white px-7 py-3 font-bold text-primary transition hover:border-primary"
              >
                Ask an Expert
              </Link>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-glow md:col-span-2">
              <p className="text-sm uppercase tracking-wide text-gray-500">Top Categories</p>
              <p className="mt-2 text-2xl font-bold text-ink">Audio, Accessories, Wearables, Video</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow">
              <p className="text-sm uppercase tracking-wide text-gray-500">On-Time Delivery</p>
              <p className="mt-2 text-3xl font-bold text-primary">98%</p>
            </div>
            <div className="rounded-2xl bg-white p-6 shadow">
              <p className="text-sm uppercase tracking-wide text-gray-500">Avg Rating</p>
              <p className="mt-2 text-3xl font-bold text-secondary">4.7</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="container mx-auto">
          {error && (
            <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {error}
            </div>
          )}

          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {highlights.map((item) => (
              <div key={item.id} className="rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
                <div className="mb-4 inline-flex rounded-xl bg-teal-50 p-3 text-primary">
                  <item.icon size={24} />
                </div>
                <h3 className="text-xl font-bold">{item.title}</h3>
                <p className="mt-2 text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
            {featured.map(item => (
              <div key={item.id} className="overflow-hidden rounded-2xl bg-white shadow transition hover:-translate-y-1 hover:shadow-lg">
                <img src={item.image} alt={item.title} className="h-48 w-full object-cover" />
                <div className="p-5">
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="mt-1 text-sm text-gray-600">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-12">
        <div className="container mx-auto">
          <h2 className="mb-12 text-center font-display text-3xl font-bold md:text-4xl">Top Rated Products</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {topProducts.map(product => (
              <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link to="/shop" className="inline-block rounded-xl bg-primary px-8 py-3 font-bold text-white transition hover:bg-teal-700">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-16">
        <div className="container mx-auto max-w-3xl rounded-3xl border border-teal-100 bg-white p-8 shadow-md">
          <h2 className="text-center font-display text-3xl font-bold">Subscribe to Weekly Deals</h2>
          <p className="mx-auto mt-2 max-w-lg text-center text-gray-600">
            Get a short Friday email with new product drops and campus discount codes.
          </p>

          <form onSubmit={handleNewsletterSubmit} className="mt-6 flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              value={newsletterEmail}
              onChange={(event) => setNewsletterEmail(event.target.value)}
              placeholder="Enter your email"
              className="flex-1 rounded-xl border border-teal-100 px-4 py-3 focus:border-primary focus:outline-none"
              required
            />
            <button type="submit" className="rounded-xl bg-secondary px-8 py-3 font-bold text-white transition hover:bg-amber-500">
              Subscribe
            </button>
          </form>

          {newsletterFeedback.type !== 'idle' && (
            <p className={`mt-4 text-sm font-semibold ${newsletterFeedback.type === 'success' ? 'text-emerald-700' : 'text-red-600'}`}>
              {newsletterFeedback.message}
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
