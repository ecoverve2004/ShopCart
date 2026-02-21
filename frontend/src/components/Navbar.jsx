import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Menu, X, ShoppingCart, Search } from 'lucide-react'

export default function Navbar({ cartCount, searchQuery, onSearchChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    onSearchChange(searchQuery.trim())
    navigate('/shop')
    setIsOpen(false)
  }

  const navItemClass = ({ isActive }) =>
    `block font-semibold transition ${isActive ? 'text-primary' : 'text-gray-700 hover:text-primary'}`

  return (
    <nav className="sticky top-0 z-50 border-b border-teal-100 bg-white/95 backdrop-blur">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="font-display text-2xl font-bold text-primary">
            ShopCart
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <NavLink to="/" className={navItemClass}>Home</NavLink>
            <NavLink to="/shop" className={navItemClass}>Shop</NavLink>
            <NavLink to="/contact" className={navItemClass}>Contact</NavLink>
          </div>

          <form onSubmit={handleSubmit} className="hidden flex-1 max-w-sm lg:block">
            <label className="relative block">
              <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Search products"
                className="w-full rounded-xl border border-teal-100 bg-teal-50/40 py-2 pl-9 pr-3 focus:border-primary focus:outline-none"
              />
            </label>
          </form>

          <div className="flex items-center gap-2">
            <Link to="/cart" className="relative rounded-lg p-2 hover:bg-teal-50">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-lg p-2 hover:bg-teal-50 md:hidden"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="space-y-4 border-t border-teal-100 pb-1 pt-4 md:hidden">
            <form onSubmit={handleSubmit}>
              <label className="relative block">
                <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => onSearchChange(event.target.value)}
                  placeholder="Search products"
                  className="w-full rounded-xl border border-teal-100 bg-teal-50/40 py-2 pl-9 pr-3 focus:border-primary focus:outline-none"
                />
              </label>
            </form>
            <div className="space-y-2">
              <NavLink to="/" onClick={() => setIsOpen(false)} className={navItemClass}>Home</NavLink>
              <NavLink to="/shop" onClick={() => setIsOpen(false)} className={navItemClass}>Shop</NavLink>
              <NavLink to="/contact" onClick={() => setIsOpen(false)} className={navItemClass}>Contact</NavLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
