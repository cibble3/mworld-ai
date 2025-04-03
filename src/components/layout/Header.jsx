import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { IoMdArrowDropdown, IoMdSearch } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";

// Import components for translations
import LanguageSelector from "@/components/LanguageSelector";
import Translatable from "@/components/Translatable";
import { useLanguage } from "@/context/LanguageContext";

// Styles
import styles from "./Header.module.css";

const Header = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const pageLoaderText = useSelector((state) => state.pageLoader?.text);
  const fullPageLoader = useSelector((state) => state.pageLoader?.fullScreen);

  const { language } = useLanguage();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    dispatch({
      type: "TOGGLE_MENU",
      payload: {},
    });
  };

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;

    setVisible(
      (prevScrollPos > currentScrollPos && prevScrollPos - currentScrollPos > 70) ||
      currentScrollPos < 10
    );

    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos, visible]);

  return (
    <>
      {fullPageLoader && (
        <div className={styles.loader}>
          <svg
            className={styles.svgDiv}
            version="1.1"
            id="L3"
            x="0px"
            y="0px"
            viewBox="0 0 100 100"
            enableBackground="new 0 0 0 0"
          >
            <circle
              fill="none"
              stroke="#fff"
              strokeWidth="4"
              cx="50"
              cy="50"
              r="44"
              style={{ opacity: 0.5 }}
            />
            <circle
              fill="#fff"
              stroke="#e74c3c"
              strokeWidth="3"
              cx="8"
              cy="54"
              r="6"
            >
              <animateTransform
                attributeName="transform"
                dur="2s"
                type="rotate"
                from="0 50 48"
                to="360 50 52"
                repeatCount="indefinite"
              />
            </circle>
          </svg>
          <h1 className={styles.loaderInnerText}>{pageLoaderText}</h1>
        </div>
      )}

      <header className={`${styles.header} ${visible ? styles.headerFixed : styles.headerHide}`}>
        <div className={styles.headerContainer}>
          <div className={styles.menuToggle}>
            <button onClick={toggleMenu} className={styles.menuButton}>
              <div className={styles.menuIcon}>
                <div className={`${styles.menuLine} ${menuOpen ? styles.menuLineActive1 : ""}`}></div>
                <div className={`${styles.menuLine} ${menuOpen ? styles.menuLineActive2 : ""}`}></div>
                <div className={`${styles.menuLine} ${menuOpen ? styles.menuLineActive3 : ""}`}></div>
              </div>
            </button>
          </div>

          <div className={styles.headerContent}>
            <div className={styles.logo}>
              <Link href="/home">
                <Image
                  src="/images/logowhite.png"
                  alt="MistressWorld Logo"
                  width={180}
                  height={60}
                  style={{ width: 'auto', height: '40px' }}
                  priority
                />
              </Link>
            </div>
            
            <nav className={styles.navigation}>
              <ul className={styles.navList}>
                <li className={styles.navItem}>
                  <Link
                    href="/home"
                    className={`${styles.navLink} ${router.pathname === "/home" ? styles.active : ""}`}
                  >
                    <Translatable>Home</Translatable>
                  </Link>
                </li>
                
                <li className={styles.navItem}>
                  <div className={styles.dropdown}>
                    <Link
                      href="/girls"
                      className={`${styles.navLink} ${router.pathname.startsWith("/girls") ? styles.active : ""}`}
                    >
                      <Translatable>Cam Girls</Translatable> <IoMdArrowDropdown />
                    </Link>
                    
                    <div className={styles.dropdownMenu}>
                      <Link href="/girls/asian" className={styles.dropdownItem}>
                        <Translatable>Asian</Translatable>
                      </Link>
                      <Link href="/girls/ebony" className={styles.dropdownItem}>
                        <Translatable>Ebony</Translatable>
                      </Link>
                      <Link href="/girls/latina" className={styles.dropdownItem}>
                        <Translatable>Latina</Translatable>
                      </Link>
                      <Link href="/girls/blonde" className={styles.dropdownItem}>
                        <Translatable>Blonde</Translatable>
                      </Link>
                      <Link href="/girls/brunette" className={styles.dropdownItem}>
                        <Translatable>Brunette</Translatable>
                      </Link>
                      <Link href="/girls/bbw" className={styles.dropdownItem}>
                        <Translatable>BBW</Translatable>
                      </Link>
                      <Link href="/girls/milf" className={styles.dropdownItem}>
                        <Translatable>MILF</Translatable>
                      </Link>
                      <Link href="/girls/teen" className={styles.dropdownItem}>
                        <Translatable>18+ Teen</Translatable>
                      </Link>
                      <Link href="/girls/mature" className={styles.dropdownItem}>
                        <Translatable>Mature</Translatable>
                      </Link>
                      <Link href="/girls/fetish" className={styles.dropdownItem}>
                        <Translatable>Fetish</Translatable>
                      </Link>
                    </div>
                  </div>
                </li>
                
                <li className={styles.navItem}>
                  <div className={styles.dropdown}>
                    <Link
                      href="/trans"
                      className={`${styles.navLink} ${router.pathname.startsWith("/trans") ? styles.active : ""}`}
                    >
                      <Translatable>Trans Cams</Translatable> <IoMdArrowDropdown />
                    </Link>
                    
                    <div className={styles.dropdownMenu}>
                      <Link href="/trans/asian" className={styles.dropdownItem}>
                        <Translatable>Asian</Translatable>
                      </Link>
                      <Link href="/trans/ebony" className={styles.dropdownItem}>
                        <Translatable>Ebony</Translatable>
                      </Link>
                      <Link href="/trans/latina" className={styles.dropdownItem}>
                        <Translatable>Latina</Translatable>
                      </Link>
                      <Link href="/trans/blonde" className={styles.dropdownItem}>
                        <Translatable>Blonde</Translatable>
                      </Link>
                      <Link href="/trans/brunette" className={styles.dropdownItem}>
                        <Translatable>Brunette</Translatable>
                      </Link>
                      <Link href="/trans/fetish" className={styles.dropdownItem}>
                        <Translatable>Fetish</Translatable>
                      </Link>
                    </div>
                  </div>
                </li>
                
                <li className={styles.navItem}>
                  <div className={styles.dropdown}>
                    <Link
                      href="/free/girls"
                      className={`${styles.navLink} ${router.pathname.startsWith("/free") ? styles.active : ""}`}
                    >
                      <Translatable>Free Cams</Translatable> <IoMdArrowDropdown />
                    </Link>
                    
                    <div className={styles.dropdownMenu}>
                      <Link href="/free/girls" className={styles.dropdownItem}>
                        <Translatable>Girls</Translatable>
                      </Link>
                      <Link href="/free/trans" className={styles.dropdownItem}>
                        <Translatable>Trans</Translatable>
                      </Link>
                    </div>
                  </div>
                </li>
                
                <li className={styles.navItem}>
                  <button className={styles.searchButton} aria-label="Search">
                    <IoMdSearch />
                  </button>
                </li>
                
                <li className={styles.navItem}>
                  <div className={styles.languageSelector}>
                    <LanguageSelector />
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header; 