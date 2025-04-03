import React from 'react';
import Meta from '../components/seo/Meta';
import Container from '../components/grid/Container';
import { useTheme, THEMES } from '@/context/ThemeContext';
import LegacySidebar from '../components/navigation/LegacySidebar';
import LegacyTopbar from '../components/navigation/LegacyTopbar';
import CookiesModal from '@/components/CookiesModal/CookiesModal';
import TopText from '../components/content/TopText';
import BottomContent from '../components/content/BottomContent';
import Link from 'next/link';
import { FaInstagram, FaTwitter } from "react-icons/fa6";
import { IoLogoYoutube } from 'react-icons/io';
import { popularTags } from '@/components/navigation/DynamicSidebar';
const LegacyLayout = ({
  children,
  meta = {},
  containerProps = {},
  className = '',
  title,
  description,
  bottomContentChildren,
  ...props
}) => {
  const { theme } = useTheme();

  // Always show sidebar for now to maintain consistent layout
  const showSidebar = true;

  return (
    <>
      <Meta {...meta} />

      <div
        className={`min-h-screen flex flex-col ${className}`}
        style={{
          backgroundColor: '#16181c',
          color: '#ffffff',
        }}
        {...props}
      >
        {/* Top Navigation */}
        <LegacyTopbar />

        {/* Sidebar - always displayed */}
        {showSidebar && <LegacySidebar />}

        {/* Main content area - with appropriate padding for sidebar */}
        <main
          className={`flex-grow pt-16  ${showSidebar ? 'lg:ml-64 ml-0' : ''}`}
        >
          <Container {...containerProps} fluid={true}>
            {/* Optional Cookies Modal - Rendered early */}
            <CookiesModal />

            {/* Use TopText component */}
            {(title || description) && (
              <TopText title={title} description={description} />
            )}

            {/* Main Page Content (e.g., ModelGrid) */}
            {children}

            {/* Use BottomContent component */}
            {bottomContentChildren && (
              <BottomContent>
                {bottomContentChildren}
              </BottomContent>
            )}
          </Container>
        </main>

        {/* Footer */}
        <footer
          className={`border-t py-8 ${showSidebar ? 'lg:ml-64 ml-0' : ''}`}
          style={{
            backgroundColor: '#1a1a1a',
            borderColor: '#333',
          }}
        >
          <Container>
            {/* Footer content */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-pink-500 font-bold mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="/about-us" className="text-gray-300 hover:text-white">About Us</a></li>
                  <li><a href="/contact" className="text-gray-300 hover:text-white">Contact</a></li>
                  <li><a href="/models-wanted" className="text-gray-300 hover:text-white">Models Wanted</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-pink-500 font-bold mb-4">Categories</h3>
                <ul className="space-y-2">
                  <li><a href="/girls" className="text-gray-300 hover:text-white">Cam Girls</a></li>
                  <li><a href="/trans" className="text-gray-300 hover:text-white">Trans Cams</a></li>
                  <li><a href="/free" className="text-gray-300 hover:text-white">Free Cams</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-pink-500 font-bold mb-4">Legal</h3>
                <ul className="space-y-2">
                  <li><a href="/terms" className="text-gray-300 hover:text-white">Terms of Service</a></li>
                  <li><a href="/privacy" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
                  <li><a href="/dmca" className="text-gray-300 hover:text-white">DMCA</a></li>
                  <li><a href="/2257" className="text-gray-300 hover:text-white">2257 Statement</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-pink-500 font-bold mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-300 hover:text-white text-2xl">
                    <FaInstagram />
                  </a>
                  <a href="#" className="text-gray-300 hover:text-white text-2xl">
                    <IoLogoYoutube />
                  </a>
                  <a href="#" className="text-gray-300 hover:text-white text-2xl">
                    <FaTwitter />
                  </a>
                </div>
              </div>
              <div className="lg:hidden block">
                <h3 className="text-pink-500 font-bold text-xl mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/girls" className="text-gray-300 hover:text-white">Girls</Link>
                  </li>
                  <li>
                    <Link href="/trans" className="text-gray-300 hover:text-white">Trans</Link>
                  </li>
                  <li>
                    <Link href="/fetish" className="text-gray-300 hover:text-white">Fetish</Link>
                  </li>
                  <li>
                    <Link href="/free" className="text-gray-300 hover:text-white">Free Cams</Link>
                  </li>
                  <li>
                    <Link href="/videos" className="text-gray-300 hover:text-white">Videos</Link>
                  </li>
                </ul>
              </div>
              <div className="lg:hidden block">
                <h3 className="text-pink-500 font-bold text-xl mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Link href={`/tag/${tag}`} key={tag}>
                      <span className="px-2 py-1 bg-gray-800 text-sm rounded hover:bg-gray-700 transition-colors">
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
      </div>
    </>
  );
};

export default LegacyLayout;