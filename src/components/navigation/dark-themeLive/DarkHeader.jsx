import React, { useState, useEffect } from "react";
import styles from "./darkHeader.module.css";
import topstylelogodark from "../../../../public/images/logowhite.png";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/router";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdSearch } from "react-icons/io";

// Import our new components
import LanguageSelector from "@/components/LanguageSelector";
import Translatable from "@/components/Translatable";

const DarkHeader = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const toggleMenu = () => {
    dispatch({
      type: "TOGGLE_MENU",
      payload: {},
    });
  };

  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  const pageLoaderText = useSelector((state) => state.pageLoader.text);
  const fullPageLoader = useSelector((state) => state.pageLoader.fullScreen);
  const menuState = useSelector((state) => state.menuState.showMenu);

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;

    setVisible(
      (prevScrollPos > currentScrollPos &&
        prevScrollPos - currentScrollPos > 70) ||
        currentScrollPos < 10
    );

    setPrevScrollPos(currentScrollPos);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos, visible, handleScroll]);

  return (
    <>
      {fullPageLoader ? (
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
            ></circle>
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
              ></animateTransform>
            </circle>
          </svg>
          <h1 className={styles.loaderInnerText}>{pageLoaderText}</h1>
        </div>
      ) : null}

      <div
        className={`${styles.mainheader} ${
          visible ? styles.headerFixed : styles.headerHide
        }`}
      >
        <div className={styles.headerContainer}>
          <div className={styles.menuToggleDiv}>
            <button onClick={toggleMenu} className={styles.menuButton}>
              <div className={styles.menuWithThreeLIne}>
                <div
                  className={`${styles.menuLine} ${
                    menuState ? styles.menuRotateLineOne : ""
                  }`}
                ></div>
                <div
                  className={`${styles.menuLine} ${
                    menuState ? styles.menuRotateLineTwo : ""
                  }`}
                ></div>
                <div
                  className={`${styles.menuLine} ${
                    menuState ? styles.menuRotateLineThree : ""
                  }`}
                ></div>
              </div>
            </button>
          </div>

          <div className={styles.menucontentDiv}>
            <div className={styles.logoContainer}>
              <Link href="/home">
                <Image
                  src={topstylelogodark}
                  alt="logo"
                  width={180}
                  height={60}
                  style={{ width: 'auto', height: '40px' }}
                  priority
                />
              </Link>
            </div>
            <div className={styles.menuContainer}>
              <div className={styles.menunavContainer}>
                <div className={styles.homepagelink}>
                  <Link
                    href="/home"
                    className={`${styles.listItem} ${
                      router.pathname === "/home" ? styles.isActive : ""
                    }`}
                  >
                    <Translatable>Home</Translatable>
                  </Link>
                </div>
                <div className={styles.listItemdropdownContainer}>
                  <div className={styles.listItemdropdownDiv}>
                    <Link
                      href="/girls"
                      className={`${styles.listItem} ${
                        router.pathname === "/girls" ? styles.isActive : ""
                      }`}
                    >
                      <Translatable>Cam Girls</Translatable> <IoMdArrowDropdown />
                    </Link>

                    <div className={styles.listDropdownSubnav}>
                      <Link
                        href="/girls/asian"
                        className={`${styles.listDropdownSubnavItem}`}
                      >
                        <Translatable>Asian</Translatable>
                      </Link>
                      <Link
                        href="/girls/ebony"
                        className={`${styles.listDropdownSubnavItem}`}
                      >
                        <Translatable>Ebony</Translatable>
                      </Link>
                      <Link
                        href="/girls/latina"
                        className={`${styles.listDropdownSubnavItem}`}
                      >
                        <Translatable>Latina</Translatable>
                      </Link>
                      <Link
                        href="/girls/blonde"
                        className={`${styles.listDropdownSubnavItem}`}
                      >
                        <Translatable>Blonde</Translatable>
                      </Link>
                      <Link
                        href="/girls/brunette"
                        className={`${styles.listDropdownSubnavItem}`}
                      >
                        <Translatable>Brunette</Translatable>
                      </Link>
                      <Link
                        href="/girls/bbw"
                        className={`${styles.listDropdownSubnavItem}`}
                      >
                        <Translatable>BBW</Translatable>
                      </Link>
                      <Link
                        href="/girls/milf"
                        className={`${styles.listDropdownSubnavItem}`}
                      >
                        <Translatable>MILF</Translatable>
                      </Link>
                      <Link
                        href="/girls/teen"
                        className={`${styles.listDropdownSubnavItem}`}
                      >
                        <Translatable>18+ Teen</Translatable>
                      </Link>
                      <Link
                        href="/girls/mature"
                        className={`${styles.listDropdownSubnavItem}`}
                      >
                        <Translatable>Mature</Translatable>
                      </Link>
                      <Link
                        href="/girls/fetish"
                        className={`${styles.listDropdownSubnavItem}`}
                      >
                        <Translatable>Fetish</Translatable>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className={styles.listItemdropdownContainer}>
                  <div className={styles.listItemdropdownDiv}>
                    <Link
                      href="/trans"
                      className={`${styles.listItem} ${
                        router.pathname === "/trans" ? styles.isActive : ""
                      }`}
                    >
                      <Translatable>Trans Cams</Translatable> <IoMdArrowDropdown />
                    </Link>

                    <div className={styles.listDropdownSubnav}>
                      <Link
                        href="/trans/asian"
                        className={`${styles.listDropdownSubnavItem}`}
                      >
                        <Translatable>Asian</Translatable>
                      </Link>
                      <Link
                        href="/trans/ebony"
                        className={`${styles.listDropdownSubnavItem}`}
                      >
                        <Translatable>Ebony</Translatable>
                      </Link>
                      <Link
                        href="/trans/latina"
                        className={`${styles.listDropdownSubnavItem}`}
                      >
                        <Translatable>Latina</Translatable>
                      </Link>
                      <Link
                        href="/trans/blonde"
                        className={`${styles.listDropdownSubnavItem}`}
                      >
                        <Translatable>Blonde</Translatable>
                      </Link>
                      <Link
                        href="/trans/brunette"
                        className={`${styles.listDropdownSubnavItem}`}
                      >
                        <Translatable>Brunette</Translatable>
                      </Link>
                      <Link
                        href="/trans/fetish"
                        className={`${styles.listDropdownSubnavItem}`}
                      >
                        <Translatable>Fetish</Translatable>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className={styles.listItemdropdownContainer}>
                  <div className={styles.listItemdropdownDiv}>
                    <Link
                      href="/free/girls"
                      className={`${styles.listItem} ${
                        router.pathname === "/free/girls" ? styles.isActive : ""
                      }`}
                    >
                      <Translatable>Free Cams</Translatable> <IoMdArrowDropdown />
                    </Link>

                    <div className={styles.listDropdownSubnav}>
                      <Link
                        href="/free/girls"
                        className={`${styles.listDropdownSubnavItem}`}
                      >
                        <Translatable>Girls</Translatable>
                      </Link>
                      <Link
                        href="/free/trans"
                        className={`${styles.listDropdownSubnavItem}`}
                      >
                        <Translatable>Trans</Translatable>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className={styles.listItemSearch}>
                  <IoMdSearch />
                </div>

                {/* Add language selector */}
                <div className={styles.languageSelector}>
                  <LanguageSelector />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DarkHeader; 