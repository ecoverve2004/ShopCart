import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { Box, Mail, Users, ShoppingCart, DollarSign } from 'lucide-react'
import { fallbackStats, fallbackOrders, fallbackProducts, ERROR_MESSAGE } from '../data/fallbackData'

const chartColors = ['#0f766e', '#14b8a6', '#2dd4bf', '#f59e0b', '#fb923c']

const getDateLabel = (dateValue) =>
  new Date(dateValue).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError('')
        const [statsRes, ordersRes, productsRes] = await Promise.all([
          axios.get('/api/admin/stats'),
          axios.get('/api/admin/orders'),
          axios.get('/api/admin/products')
        ])

        // Check if we got valid data
        if (statsRes.data && ordersRes.data && productsRes.data) {
          setStats(statsRes.data)
          setOrders(ordersRes.data)
          setProducts(productsRes.data)
        } else {
          // API returned invalid data, use fallbacks
          setStats(fallbackStats)
          setOrders(fallbackOrders)
          setProducts(fallbackProducts)
          setError(ERROR_MESSAGE)
        }
      } catch (fetchError) {
        console.error(fetchError)
        // Use fallback data when API fails
        setStats(fallbackStats)
        setOrders(fallbackOrders)
        setProducts(fallbackProducts)
        setError(ERROR_MESSAGE)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const revenueTrend = useMemo(() => {
    const today = new Date()
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today)
      date.setDate(today.getDate() - (6 - index))
      const key = date.toISOString().slice(0, 10)
      return { key, label: getDateLabel(date) }
    })

    const totalsByDay = orders.reduce((acc, order) => {
      const key = new Date(order.createdAt).toISOString().slice(0, 10)
      acc[key] = (acc[key] || 0) + Number(order.total || 0)
      return acc
    }, {})

    return days.map((day) => ({
      day: day.label,
      revenue: Number((totalsByDay[day.key] || 0).toFixed(2))
    }))
  }, [orders])

  const categoryShare = useMemo(() => {
    const counts = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1
      return acc
    }, {})

    return Object.entries(counts).map(([name, value]) => ({ name, value }))
  }, [products])

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-soft">
        Loading dashboard...
      </div>
    )
  }

  const cards = [
    { id: 'products', label: 'Total Products', value: stats?.totalProducts || 0, icon: Box, color: 'text-primary' },
    { id: 'messages', label: 'Messages', value: stats?.totalMessages || 0, icon: Mail, color: 'text-indigo-600' },
    { id: 'subscribers', label: 'Subscribers', value: stats?.totalSubscribers || 0, icon: Users, color: 'text-emerald-600' },
    { id: 'orders', label: 'Orders', value: stats?.totalOrders || 0, icon: ShoppingCart, color: 'text-amber-600' },
    { id: 'revenue', label: 'Revenue', value: `$${Number(stats?.revenueValue || 0).toFixed(2)}`, icon: DollarSign, color: 'text-rose-600' },
  ]

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-500">{card.label}</span>
                <Icon size={18} className={card.color} />
              </div>
              <p className="text-3xl font-bold text-ink">{card.value}</p>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft xl:col-span-2">
          <h3 className="mb-4 text-lg font-bold">Revenue (Last 7 Days)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#0f766e" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
          <h3 className="mb-4 text-lg font-bold">Category Split</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryShare} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={95} label>
                  {categoryShare.map((entry, index) => (
                    <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
        <h3 className="mb-4 text-lg font-bold">Latest Orders</h3>
        {orders.length === 0 ? (
          <p className="text-sm text-slate-500">No recent orders yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-3">Order ID</th>
                  <th className="py-3">Date</th>
                  <th className="py-3">Status</th>
                  <th className="py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 8).map((order) => (
                  <tr key={order.id} className="border-b border-slate-100">
                    <td className="py-3 font-semibold">#{order.id}</td>
                    <td className="py-3">{getDateLabel(order.createdAt)}</td>
                    <td className="py-3 capitalize">{order.status}</td>
                    <td className="py-3 text-right font-bold">${Number(order.total).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
