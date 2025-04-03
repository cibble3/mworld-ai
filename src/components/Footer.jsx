import React from 'react';
import Link from 'next/link';

/**
 * Shared footer component for all pages
 */
const Footer = () => {
  return (
    <footer className="border-t py-8 bg-[#1a1a1a] border-[#333]">
      <div className="container mx-auto px-4">
        {/* Footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-pink-500 font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about-us" className="text-gray-300 hover:text-white">About Us</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
              <li><Link href="/models-wanted" className="text-gray-300 hover:text-white">Models Wanted</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-pink-500 font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/girls" className="text-gray-300 hover:text-white">Cam Girls</Link></li>
              <li><Link href="/trans" className="text-gray-300 hover:text-white">Trans Cams</Link></li>
              <li><Link href="/fetish" className="text-gray-300 hover:text-white">Fetish Cams</Link></li>
              <li><Link href="/free" className="text-gray-300 hover:text-white">Free Cams</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-pink-500 font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-gray-300 hover:text-white">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/dmca" className="text-gray-300 hover:text-white">DMCA</Link></li>
              <li><Link href="/2257" className="text-gray-300 hover:text-white">2257 Statement</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-pink-500 font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white text-2xl">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-2xl">
                <i className="fab fa-youtube"></i>
              </a>
              <a href="#" className="text-gray-300 hover:text-white text-2xl">
                <i className="fab fa-twitter"></i>
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-[#a0a0a0] border-[#333]">
          <p>&copy; {new Date().getFullYear()} MistressWorld. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 