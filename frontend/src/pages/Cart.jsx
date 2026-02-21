import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Trash2, Plus, Minus } from 'lucide-react'

export default function Cart({ items, removeFromCart, updateQuantity, clearCart }) {
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [checkoutMessage, setCheckoutMessage] = useState('')
  const [checkoutError, setCheckoutError] = useState('')

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 9.99
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  const handleCheckout = async () => {
    try {
      setCheckoutError('')
      setCheckoutMessage('')
      setIsCheckingOut(true)

      const response = await axios.post('/api/checkout', { items })
      setCheckoutMessage(`Order #${response.data.orderId} placed successfully.`)
      clearCart()
    } catch (error) {
      setCheckoutError(error.response?.data?.error || 'Checkout failed. Please try again.')
    } finally {
      setIsCheckingOut(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="mb-4 font-display text-4xl font-bold">Shopping Cart</h1>
        {checkoutMessage && (
          <div className="mx-auto mb-6 max-w-xl rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
            {checkoutMessage}
          </div>
        )}
        <p className="mb-8 text-xl text-gray-600">Your cart is empty</p>
        <Link to="/shop" className="inline-block rounded-xl bg-primary px-8 py-3 font-bold text-white transition hover:bg-teal-700">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 font-display text-4xl font-bold">Shopping Cart</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 rounded-2xl border border-teal-100 bg-white p-4 shadow-sm">
                <img src={item.image} alt={item.name} className="h-24 w-24 rounded-xl object-cover" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold">{item.name}</h3>
                  <p className="font-semibold text-primary">${Number(item.price).toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Stock: {item.stock}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="rounded p-1 hover:bg-gray-200"
                    aria-label={`Decrease quantity for ${item.name}`}
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-8 text-center font-bold">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= Number(item.stock)}
                    className="rounded p-1 hover:bg-gray-200 disabled:cursor-not-allowed disabled:text-gray-300"
                    aria-label={`Increase quantity for ${item.name}`}
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-red-500 hover:text-red-700"
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="h-fit rounded-2xl border border-teal-100 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-xl font-bold">Order Summary</h3>
          <div className="mb-6 space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <hr />
            <div className="flex justify-between text-xl font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {checkoutError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700">
              {checkoutError}
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={isCheckingOut}
            className="mb-3 w-full rounded-lg bg-primary py-3 font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {isCheckingOut ? 'Processing...' : 'Proceed to Checkout'}
          </button>
          <button
            onClick={clearCart}
            className="mb-3 w-full rounded-lg border border-teal-200 py-3 font-bold text-primary transition hover:border-primary"
          >
            Clear Cart
          </button>

          {checkoutMessage && (
            <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
              {checkoutMessage}
            </div>
          )}

          <Link to="/shop" className="block text-center text-primary hover:text-teal-700">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
