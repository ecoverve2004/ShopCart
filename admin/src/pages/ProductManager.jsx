import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Pencil, Trash2, PlusCircle, XCircle } from 'lucide-react'

const emptyForm = {
  name: '',
  category: '',
  price: '',
  stock: '',
  rating: '4.5',
  reviews: '0',
  image: '',
  description: '',
  featured: false
}

export default function ProductManager() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchProducts = async () => {
    try {
      setError('')
      const response = await axios.get('/api/admin/products')
      setProducts(response.data)
    } catch (fetchError) {
      console.error(fetchError)
      setError('Unable to load products.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      rating: Number(form.rating),
      reviews: Number(form.reviews),
      featured: Boolean(form.featured)
    }

    try {
      if (editingId) {
        await axios.put(`/api/admin/products/${editingId}`, payload)
        setSuccess('Product updated.')
      } else {
        await axios.post('/api/admin/products', payload)
        setSuccess('Product created.')
      }
      resetForm()
      await fetchProducts()
    } catch (submitError) {
      console.error(submitError)
      setError(submitError.response?.data?.error || 'Could not save product.')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (product) => {
    setEditingId(product.id)
    setForm({
      name: product.name,
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      rating: String(product.rating),
      reviews: String(product.reviews),
      image: product.image,
      description: product.description,
      featured: Boolean(product.featured)
    })
    setSuccess('')
    setError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (productId) => {
    const confirmed = window.confirm('Delete this product?')
    if (!confirmed) return

    try {
      await axios.delete(`/api/admin/products/${productId}`)
      setProducts((prev) => prev.filter((item) => item.id !== productId))
      if (editingId === productId) {
        resetForm()
      }
    } catch (deleteError) {
      console.error(deleteError)
      setError('Delete failed. Try again.')
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft xl:col-span-2">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-bold">{editingId ? `Edit Product #${editingId}` : 'Add Product'}</h3>
          {editingId && (
            <button
              onClick={resetForm}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold text-slate-600 hover:border-slate-300"
            >
              <XCircle size={16} />
              Cancel Edit
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="space-y-1">
              <span className="text-sm font-semibold text-slate-700">Name</span>
              <input
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none"
                required
              />
            </label>
            <label className="space-y-1">
              <span className="text-sm font-semibold text-slate-700">Category</span>
              <input
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none"
                required
              />
            </label>
          </div>

          <label className="space-y-1">
            <span className="text-sm font-semibold text-slate-700">Image URL</span>
            <input
              value={form.image}
              onChange={(event) => setForm({ ...form, image: event.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none"
              required
            />
          </label>

          <label className="space-y-1">
            <span className="text-sm font-semibold text-slate-700">Description</span>
            <textarea
              rows="4"
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none"
              required
            ></textarea>
          </label>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <label className="space-y-1">
              <span className="text-sm font-semibold text-slate-700">Price</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(event) => setForm({ ...form, price: event.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none"
                required
              />
            </label>
            <label className="space-y-1">
              <span className="text-sm font-semibold text-slate-700">Stock</span>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(event) => setForm({ ...form, stock: event.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none"
                required
              />
            </label>
            <label className="space-y-1">
              <span className="text-sm font-semibold text-slate-700">Rating</span>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={(event) => setForm({ ...form, rating: event.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none"
                required
              />
            </label>
            <label className="space-y-1">
              <span className="text-sm font-semibold text-slate-700">Reviews</span>
              <input
                type="number"
                min="0"
                value={form.reviews}
                onChange={(event) => setForm({ ...form, reviews: event.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-primary focus:outline-none"
                required
              />
            </label>
          </div>

          <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(event) => setForm({ ...form, featured: event.target.checked })}
              className="h-4 w-4 accent-primary"
            />
            Mark as featured
          </label>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <PlusCircle size={16} />
            {saving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft xl:col-span-3">
        <h3 className="mb-4 text-xl font-bold">Product Inventory</h3>
        {loading ? (
          <p className="text-slate-500">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-slate-500">No products available.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-3">Name</th>
                  <th className="py-3">Category</th>
                  <th className="py-3 text-right">Price</th>
                  <th className="py-3 text-right">Stock</th>
                  <th className="py-3 text-right">Rating</th>
                  <th className="py-3 text-center">Featured</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-slate-100">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="h-10 w-10 rounded object-cover" />
                        <span className="font-semibold">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3">{product.category}</td>
                    <td className="py-3 text-right font-semibold">${Number(product.price).toFixed(2)}</td>
                    <td className="py-3 text-right">{product.stock}</td>
                    <td className="py-3 text-right">{product.rating}</td>
                    <td className="py-3 text-center">{product.featured ? 'Yes' : 'No'}</td>
                    <td className="py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="rounded-md bg-slate-100 p-2 text-slate-700 hover:bg-slate-200"
                          aria-label={`Edit ${product.name}`}
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="rounded-md bg-red-50 p-2 text-red-600 hover:bg-red-100"
                          aria-label={`Delete ${product.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
