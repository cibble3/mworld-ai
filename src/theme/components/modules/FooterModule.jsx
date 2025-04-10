import React from 'react';
import Link from 'next/link';
import Container from '../grid/Container';
import { FaInstagram, FaTwitter } from "react-icons/fa6";
import { IoLogoYoutube } from 'react-icons/io';
import { popularTags } from '@/components/navigation/DynamicSidebar';

/**
 * FooterModule - Unified footer component that is consistent across all pages.
 * This prevents duplicate footers and ensures a standard layout.
 */
const FooterModule = ({ 
  showSidebar = true,
  className = ''
}) => {
  return (
    <footer
      data-mw-module="footer"
      className={`border-t bg-background py-8 ${showSidebar ? 'lg:ml-64 ml-0' : ''} ${className}`}
    >
      <Container>
        {/* Footer content */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-primary font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="/about-us" className="text-textPrimary">About Us</a></li>
              <li><a href="/contact" className="text-textPrimary">Contact</a></li>
              <li><a href="/models-wanted" className="text-textPrimary">Models Wanted</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-primary font-bold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link href="/girls" className="text-textPrimary">Cam Girls</Link></li>
              <li><Link href="/trans" className="text-textPrimary">Trans Cams</Link></li>
              <li><Link href="/free" className="text-textPrimary">Free Cams</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-primary font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-textPrimary">Terms of Service</Link></li>
              <li><Link href="/privacy" className="text-textPrimary">Privacy Policy</Link></li>
              <li><Link href="/dmca" className="text-textPrimary">DMCA</Link></li>
              <li><Link href="/2257" className="text-textPrimary">2257 Statement</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-primary font-bold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-textPrimary text-2xl"><FaInstagram /></a>
              <a href="#" className="text-textPrimary text-2xl"><IoLogoYoutube /></a>
              <a href="#" className="text-textPrimary text-2xl"><FaTwitter /></a>
            </div>
          </div>
          <div className="lg:hidden block">
            <h3 className="text-primary font-bold text-xl mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link className="text-textPrimary" href="/girls">Girls</Link></li>
              <li><Link className="text-textPrimary" href="/trans">Trans</Link></li>
              <li><Link className="text-textPrimary" href="/fetish">Fetish</Link></li>
              <li><Link className="text-textPrimary" href="/free">Free Cams</Link></li>
              <li><Link className="text-textPrimary" href="/videos">Videos</Link></li>
            </ul>
          </div>
          <div className="lg:hidden block">
            <h3 className="text-primary font-bold text-xl mb-4">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.slice(0, 12).map((tag) => (
                <Link key={tag} href={`/tag/${tag}`}>
                  <span className="px-2 py-1 bg-primary text-sm rounded text-white transition-colors">
                    {tag}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div
          className="mt-8 pt-8 border-t text-center"
          style={{
            borderColor: '#333',
            color: '#a0a0a0'
          }}
        >
          <p>&copy; {new Date().getFullYear()} MistressWorld. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
};

export default FooterModule; 