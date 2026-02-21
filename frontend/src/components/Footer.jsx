import React from 'react'
import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-16 bg-ink text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 font-display text-2xl font-bold text-secondary">CampusCart</h3>
            <p className="text-gray-300">Curated tech for study, creators, and campus life.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/" className="hover:text-secondary">Home</Link></li>
              <li><Link to="/shop" className="hover:text-secondary">Shop</Link></li>
              <li><Link to="/contact" className="hover:text-secondary">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-300">
              <li><span>24/7 Student Support</span></li>
              <li><span>30-Day Returns</span></li>
              <li><span>Secure Checkout</span></li>
              <li><span>Fast Campus Delivery</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#" className="hover:text-secondary" aria-label="Facebook"><Facebook size={20} /></a>
              <a href="#" className="hover:text-secondary" aria-label="Twitter"><Twitter size={20} /></a>
              <a href="#" className="hover:text-secondary" aria-label="Instagram"><Instagram size={20} /></a>
              <a href="#" className="hover:text-secondary" aria-label="LinkedIn"><Linkedin size={20} /></a>
            </div>
          </div>
        </div>
        <hr className="border-gray-700" />
        <div className="mt-8 text-center text-gray-300">
          <p>&copy; 2026 CampusCart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
