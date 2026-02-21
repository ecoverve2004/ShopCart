import React, { useState } from 'react'
import axios from 'axios'
import { Mail, Phone, MapPin, Clock3 } from 'lucide-react'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  subject: '',
  message: ''
}

export default function Contact() {
  const [formData, setFormData] = useState(initialForm)
  const [status, setStatus] = useState({ type: 'idle', message: '' })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus({ type: 'idle', message: '' })

    try {
      await axios.post('/api/contact', formData)
      setStatus({ type: 'success', message: 'Thanks for reaching out. We will reply shortly.' })
      setFormData(initialForm)
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.response?.data?.error || 'Could not send your message. Please try again.'
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-2 text-center font-display text-4xl font-bold">Contact Us</h1>
      <p className="mb-12 text-center text-gray-600">Questions about products, delivery, or bulk orders? We can help.</p>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div>
          <h2 className="mb-6 text-2xl font-bold">Get in Touch</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <Mail className="text-primary flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-bold">Email</h3>
                <p className="text-gray-600">support@campuscart.com</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Phone className="text-primary flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-bold">Phone</h3>
                <p className="text-gray-600">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex gap-4">
              <MapPin className="text-primary flex-shrink-0 mt-1" size={24} />
              <div>
                <h3 className="font-bold">Address</h3>
                <p className="text-gray-600">123 Student Avenue, Tech City, TC 12345</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Clock3 className="mt-1 flex-shrink-0 text-primary" size={24} />
              <div>
                <h3 className="font-bold">Hours</h3>
                <p className="text-gray-600">Mon - Fri, 9:00 AM to 6:00 PM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-teal-100 bg-white p-8 shadow-sm">
          {status.type === 'success' && (
            <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
              {status.message}
            </div>
          )}

          {status.type === 'error' && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block font-bold">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="mb-2 block font-bold">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block font-bold">Phone (optional)</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block font-bold">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block font-bold">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary focus:outline-none"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-primary py-3 font-bold text-white transition hover:bg-teal-700"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
