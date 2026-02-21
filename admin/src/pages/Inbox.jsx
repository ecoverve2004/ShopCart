import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Mail, Users } from 'lucide-react'

const statusColor = {
  new: 'bg-sky-100 text-sky-700',
  'in-progress': 'bg-amber-100 text-amber-700',
  resolved: 'bg-emerald-100 text-emerald-700',
}

const toDisplayDate = (value) =>
  new Date(value).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })

export default function Inbox() {
  const [messages, setMessages] = useState([])
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError('')
        const [messagesRes, subscribersRes] = await Promise.all([
          axios.get('/api/admin/messages'),
          axios.get('/api/admin/subscribers')
        ])
        setMessages(messagesRes.data)
        setSubscribers(subscribersRes.data)
      } catch (fetchError) {
        console.error(fetchError)
        setError('Unable to load inbox data.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const updateMessageStatus = async (id, status) => {
    try {
      await axios.patch(`/api/admin/messages/${id}/status`, { status })
      setMessages((prev) =>
        prev.map((message) => (message.id === id ? { ...message, status } : message))
      )
    } catch (updateError) {
      console.error(updateError)
      setError('Could not update message status.')
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600 shadow-soft">
        Loading inbox...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft xl:col-span-2">
          <div className="mb-5 flex items-center gap-3">
            <Mail size={18} className="text-primary" />
            <h3 className="text-xl font-bold">Customer Messages</h3>
          </div>

          {messages.length === 0 ? (
            <p className="text-sm text-slate-500">No messages yet.</p>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <article key={message.id} className="rounded-xl border border-slate-200 p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-ink">{message.subject}</h4>
                      <p className="text-sm text-slate-500">
                        {message.name} ({message.email})
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusColor[message.status] || 'bg-slate-100 text-slate-700'}`}>
                      {message.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-700">{message.message}</p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs font-semibold text-slate-500">{toDisplayDate(message.createdAt)}</p>
                    <select
                      value={message.status}
                      onChange={(event) => updateMessageStatus(message.id, event.target.value)}
                      className="rounded-lg border border-slate-300 px-3 py-1 text-sm focus:border-primary focus:outline-none"
                    >
                      <option value="new">new</option>
                      <option value="in-progress">in-progress</option>
                      <option value="resolved">resolved</option>
                    </select>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
          <div className="mb-5 flex items-center gap-3">
            <Users size={18} className="text-primary" />
            <h3 className="text-xl font-bold">Newsletter</h3>
          </div>

          {subscribers.length === 0 ? (
            <p className="text-sm text-slate-500">No subscribers yet.</p>
          ) : (
            <div className="space-y-3">
              {subscribers.map((subscriber) => (
                <div key={subscriber.id} className="rounded-lg border border-slate-200 p-3">
                  <p className="text-sm font-semibold text-ink">{subscriber.email}</p>
                  <p className="text-xs text-slate-500">{toDisplayDate(subscriber.createdAt)}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
