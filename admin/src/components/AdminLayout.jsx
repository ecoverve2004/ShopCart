import React from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, Box, Inbox as InboxIcon } from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/products', label: 'Products', icon: Box },
  { to: '/inbox', label: 'Inbox', icon: InboxIcon },
]

const pageTitles = {
  '/dashboard': 'Overview',
  '/products': 'Product Manager',
  '/inbox': 'Customer Inbox',
}

export default function AdminLayout() {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-canvas">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">CampusCart Admin</p>
              <h1 className="font-display text-2xl font-bold text-ink">Control Center</h1>
            </div>
            <p className="text-sm font-semibold text-slate-500">
              {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <nav className="mt-4 flex flex-wrap gap-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${
                      isActive
                        ? 'bg-primary text-white shadow'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`
                  }
                >
                  <Icon size={16} />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <h2 className="mb-6 font-display text-3xl font-bold text-ink">
          {pageTitles[location.pathname] || 'Admin'}
        </h2>
        <Outlet />
      </main>
    </div>
  )
}
