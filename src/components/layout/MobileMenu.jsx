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
                  <button onClick={() => handleNavClick('/girls?ethnicity=asian')} className={styles.mobileNavSubLink}>
                    <Translatable>Asian</Translatable>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick('/girls?ethnicity=ebony')} className={styles.mobileNavSubLink}>
                    <Translatable>Ebony</Translatable>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick('/girls?ethnicity=latina')} className={styles.mobileNavSubLink}>
                    <Translatable>Latina</Translatable>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick('/girls?hair_color=blonde')} className={styles.mobileNavSubLink}>
                    <Translatable>Blonde</Translatable>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick('/girls?hair_color=brunette')} className={styles.mobileNavSubLink}>
                    <Translatable>Brunette</Translatable>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick('/girls?body_type=bbw')} className={styles.mobileNavSubLink}>
                    <Translatable>BBW</Translatable>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick('/girls?tags=milf')} className={styles.mobileNavSubLink}>
                    <Translatable>MILF</Translatable>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick('/girls?age_group=18-22')} className={styles.mobileNavSubLink}>
                    <Translatable>18+ Teen</Translatable>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick('/girls?age_group=40%2B')} className={styles.mobileNavSubLink}>
                    <Translatable>Mature</Translatable>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick('/girls?tags=fetish')} className={styles.mobileNavSubLink}>
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
                  <button onClick={() => handleNavClick('/trans?ethnicity=asian')} className={styles.mobileNavSubLink}>
                    <Translatable>Asian</Translatable>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick('/trans?ethnicity=ebony')} className={styles.mobileNavSubLink}>
                    <Translatable>Ebony</Translatable>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick('/trans?ethnicity=latina')} className={styles.mobileNavSubLink}>
                    <Translatable>Latina</Translatable>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick('/trans?hair_color=blonde')} className={styles.mobileNavSubLink}>
                    <Translatable>Blonde</Translatable>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick('/trans?hair_color=brunette')} className={styles.mobileNavSubLink}>
                    <Translatable>Brunette</Translatable>
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavClick('/trans?tags=fetish')} className={styles.mobileNavSubLink}>
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