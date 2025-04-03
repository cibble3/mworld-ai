import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import Translatable from '@/components/Translatable';
import LanguageSelector from '@/components/LanguageSelector';
import styles from './MobileMenu.module.css';

const MobileMenu = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const closeMobileMenu = () => {
    dispatch({
      type: 'TOGGLE_MENU',
      payload: {},
    });
  };
  
  const handleNavClick = (path) => {
    router.push(path);
    closeMobileMenu();
  };
  
  return (
    <div className={styles.mobileMenu}>
      <div className={styles.mobileMenuContent}>
        <div className={styles.mobileLanguageSelector}>
          <LanguageSelector />
        </div>
        
        <nav className={styles.mobileNav}>
          <ul className={styles.mobileNavList}>
            <li className={styles.mobileNavItem}>
              <button 
                onClick={() => handleNavClick('/home')}
                className={`${styles.mobileNavLink} ${router.pathname === '/home' ? styles.active : ''}`}
              >
                <Translatable>Home</Translatable>
              </button>
            </li>
            
            <li className={styles.mobileNavItem}>
              <div className={styles.mobileSectionTitle}>
                <Translatable>Cam Girls</Translatable>
              </div>
              <ul className={styles.mobileSubNav}>
                <li>
                  <button onClick={() => handleNavClick('/girls')} className={styles.mobileNavSubLink}>
                    <Translatable>All Girls</Translatable>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick('/girls/asian')} className={styles.mobileNavSubLink}>
                    <Translatable>Asian</Translatable>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick('/girls/ebony')} className={styles.mobileNavSubLink}>
                    <Translatable>Ebony</Translatable>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick('/girls/latina')} className={styles.mobileNavSubLink}>
                    <Translatable>Latina</Translatable>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick('/girls/blonde')} className={styles.mobileNavSubLink}>
                    <Translatable>Blonde</Translatable>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick('/girls/brunette')} className={styles.mobileNavSubLink}>
                    <Translatable>Brunette</Translatable>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick('/girls/bbw')} className={styles.mobileNavSubLink}>
                    <Translatable>BBW</Translatable>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick('/girls/milf')} className={styles.mobileNavSubLink}>
                    <Translatable>MILF</Translatable>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick('/girls/teen')} className={styles.mobileNavSubLink}>
                    <Translatable>18+ Teen</Translatable>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick('/girls/mature')} className={styles.mobileNavSubLink}>
                    <Translatable>Mature</Translatable>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick('/girls/fetish')} className={styles.mobileNavSubLink}>
                    <Translatable>Fetish</Translatable>
                  </button>
                </li>
              </ul>
            </li>
            
            <li className={styles.mobileNavItem}>
              <div className={styles.mobileSectionTitle}>
                <Translatable>Trans Cams</Translatable>
              </div>
              <ul className={styles.mobileSubNav}>
                <li>
                  <button onClick={() => handleNavClick('/trans')} className={styles.mobileNavSubLink}>
                    <Translatable>All Trans</Translatable>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick('/trans/asian')} className={styles.mobileNavSubLink}>
                    <Translatable>Asian</Translatable>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick('/trans/ebony')} className={styles.mobileNavSubLink}>
                    <Translatable>Ebony</Translatable>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick('/trans/latina')} className={styles.mobileNavSubLink}>
                    <Translatable>Latina</Translatable>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick('/trans/blonde')} className={styles.mobileNavSubLink}>
                    <Translatable>Blonde</Translatable>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick('/trans/brunette')} className={styles.mobileNavSubLink}>
                    <Translatable>Brunette</Translatable>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick('/trans/fetish')} className={styles.mobileNavSubLink}>
                    <Translatable>Fetish</Translatable>
                  </button>
                </li>
              </ul>
            </li>
            
            <li className={styles.mobileNavItem}>
              <div className={styles.mobileSectionTitle}>
                <Translatable>Free Cams</Translatable>
              </div>
              <ul className={styles.mobileSubNav}>
                <li>
                  <button onClick={() => handleNavClick('/free/girls')} className={styles.mobileNavSubLink}>
                    <Translatable>Girls</Translatable>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick('/free/trans')} className={styles.mobileNavSubLink}>
                    <Translatable>Trans</Translatable>
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
        
        <div className={styles.mobileMenuFooter}>
          <button className={styles.joinButton} onClick={() => handleNavClick('https://www.cams.mistressworld.xxx/en/auth/sign-up')}>
            <Translatable>Join Now</Translatable>
          </button>
          <button className={styles.loginButton} onClick={() => handleNavClick('https://www.cams.mistressworld.xxx/en/auth/login')}>
            <Translatable>Login</Translatable>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu; 