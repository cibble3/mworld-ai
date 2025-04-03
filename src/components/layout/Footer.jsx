import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Translatable from '@/components/Translatable';
import { 
  AiFillFacebook, 
  AiFillInstagram, 
  AiFillYoutube, 
  AiOutlineTwitter 
} from 'react-icons/ai';
import styles from './Footer.module.css';

const Footer = () => {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerTop}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerHeading}>
              <Translatable>Company</Translatable>
            </h3>
            <ul className={styles.footerList}>
              <li>
                <Link href="/about" className={styles.footerLink}>
                  <Translatable>About Us</Translatable>
                </Link>
              </li>
              <li>
                <Link href="/contact" className={styles.footerLink}>
                  <Translatable>Contact</Translatable>
                </Link>
              </li>
              <li>
                <Link href="/models-wanted" className={styles.footerLink}>
                  <Translatable>Models Wanted</Translatable>
                </Link>
              </li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h3 className={styles.footerHeading}>
              <Translatable>Categories</Translatable>
            </h3>
            <ul className={styles.footerList}>
              <li>
                <Link href="/girls" className={styles.footerLink}>
                  <Translatable>Cam Girls</Translatable>
                </Link>
              </li>
              <li>
                <Link href="/trans" className={styles.footerLink}>
                  <Translatable>Trans Cams</Translatable>
                </Link>
              </li>
              <li>
                <Link href="/free/girls" className={styles.footerLink}>
                  <Translatable>Free Cams</Translatable>
                </Link>
              </li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h3 className={styles.footerHeading}>
              <Translatable>Legal</Translatable>
            </h3>
            <ul className={styles.footerList}>
              <li>
                <Link href="/terms" className={styles.footerLink}>
                  <Translatable>Terms of Service</Translatable>
                </Link>
              </li>
              <li>
                <Link href="/privacy" className={styles.footerLink}>
                  <Translatable>Privacy Policy</Translatable>
                </Link>
              </li>
              <li>
                <Link href="/dmca" className={styles.footerLink}>
                  <Translatable>DMCA</Translatable>
                </Link>
              </li>
              <li>
                <Link href="/2257" className={styles.footerLink}>
                  <Translatable>2257 Statement</Translatable>
                </Link>
              </li>
            </ul>
          </div>
          
          <div className={styles.footerSection}>
            <h3 className={styles.footerHeading}>
              <Translatable>Follow Us</Translatable>
            </h3>
            <div className={styles.socialLinks}>
              <a 
                href="https://www.instagram.com/mistressworldcams/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.socialLink}
                aria-label="Instagram"
              >
                <AiFillInstagram />
              </a>
              <a 
                href="https://www.youtube.com/channel/UCaGwZy3QLT5wMnzvQIwMJwA" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.socialLink}
                aria-label="YouTube"
              >
                <AiFillYoutube />
              </a>
              <a 
                href="https://twitter.com/mistressworld4u/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.socialLink}
                aria-label="Twitter"
              >
                <AiOutlineTwitter />
              </a>
              <a 
                href="https://www.facebook.com/livefetishcams/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className={styles.socialLink}
                aria-label="Facebook"
              >
                <AiFillFacebook />
              </a>
            </div>
          </div>
        </div>
        
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © {currentYear} <Translatable>MistressWorld. All rights reserved.</Translatable>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 