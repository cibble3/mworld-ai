import React, { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import styles from "./dashbpard-dark-theme.module.css";
import Image from "next/image";
import { IoPersonCircleSharp } from "react-icons/io5";
// import LanguageSelector from "@/components/LanguageSelector";
// import { logoutUser } from "@/store/actions/authActions";
import { useRouter } from "next/router";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";

const HorizontalMenu = ({ collapse, setCollapse }) => {
  // const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const router = useRouter();
  const colorMode = useSelector((state) => state.darklight);

  const [showDropdown, setShowDropdown] = useState(false);
  const google = true;
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };
  const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        autoDisplay: false,
      },
      "google_translate_element"
    );
  };
  let renderOneTimeVariable = true;
  useEffect(() => {
    if (renderOneTimeVariable) {
      var addScript = document.createElement("script");
      addScript.setAttribute(
        "src",
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      );
      document.body.appendChild(addScript);
      window.googleTranslateElementInit = googleTranslateElementInit;
      renderOneTimeVariable = false;
    }
  }, []);

  return (
    <div
      className={styles.header}
      style={{ borderBottom: "1px solid #707070" }}
    >
      <div></div>
      <div className={`${styles?.headerMenu} justify-content-between`}>
        <div className="flex">
          <Image
            rel="preload"
            as="image"
            loading="eager"
            priority={true}
            alt="button"
            height={30}
            width={30}
            src="/images/nounmenu6294661.svg"
            className={`${styles.collapseIcon} ms-3 `}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setCollapse(!collapse);
              localStorage.setItem("collapse", !collapse);
            }}
          />

          <Image
            rel="preload"
            as="image"
            loading="eager"
            priority={true}
            height={50}
            width={50}
            fetchpriority={"high"}
            onClick={() => router.push("/")}
            alt="logo sas"
            src={colorMode === "dark" ? "/images/logo.png" : "/images/logo.png"}
            className={styles.mulVodMainXcraveXcavelogoIcon}
          />
        </div>
        <div className="flex justify-center items-center flex-wrap">
          <ul className={styles.navList}>
            {/* <LanguageSelector /> */}
            <li className={`me-4`}>
              <div className="flex gap-5 items-center">
                {/* {!isAuthenticated && (
                  <span
                    className={`${styles.tabletVisible} ${styles.mobileVisible}`}
                  >
                    <Link href={"/login"} className="text-white">
                      Login
                    </Link>
                  </span>

                )} */}
                <div
                  id="google_translate_element"
                  className="md:flex hidden"
                ></div>
                <span
                  className={`${styles.tabletVisible} ${styles.mobileVisible}`}
                >
                  <Link
                    href={"https://www.cams.mistressworld.xxx/en/auth/login"}
                    className="text-white"
                  >
                    Login
                  </Link>
                </span>
                <IoPersonCircleSharp
                  onClick={toggleDropdown}
                  className={styles.navPerson}
                />
              </div>
            </li>
          </ul>
          {/* {!isAuthenticated ? (
            <Link
              href={"/register"}
              className={`${styles.navBtn} ${styles.tabletVisible} ${styles.mobileVisible} mx-2`}
            >
              Join Now for FREE
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className={`${styles.navBtn} ${styles.tabletVisible} ${styles.mobileVisible} mx-4`}
            >
              Logout
            </button>
          )} */}
          <Link
            href={"https://www.cams.mistressworld.xxx/en/auth/sign-up"}
            className={`${styles.navBtn} ${styles.tabletVisible} ${styles.mobileVisible} mx-2`}
          >
            Join Now for FREE
          </Link>
          <div className=" justify-center items-center lg:block hidden">
            <a
              className={styles.footer_menu_item}
              tab="_blank"
              href="https://www.instagram.com/mistressworldcams/"
              aria-label="Instagram"
            >
              <AiFillInstagram fontSize={24} />
            </a>
            <a
              className={styles.footer_menu_item}
              tab="_blank"
              href="https://www.youtube.com/channel/UCaGwZy3QLT5wMnzvQIwMJwA"
              aria-label="YouTube"
            >
              <AiFillYoutube fontSize={24} />
            </a>
            <a
              className={styles.footer_menu_item}
              tab="_blank"
              href="https://twitter.com/mistressworld4u/"
              aria-label="Twitter"
            >
              <AiOutlineTwitter fontSize={24} />
            </a>
            <a
              className={styles.footer_menu_item}
              tab="_blank"
              href="https://www.facebook.com/livefetishcams/"
              aria-label="FaceBook"
            >
              <AiFillFacebook fontSize={24} />
            </a>
          </div>
          <Image
            rel="preload"
            as="image"
            loading="eager"
            priority={true}
            alt="button"
            height={30}
            width={30}
            src="/images/nounmenu6294661.svg"
            className={`${styles.menuRight} ms-2`}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setCollapse(!collapse);
              localStorage.setItem("collapse", !collapse);
            }}
          />

          <style jsx global>{`
            :root {
              --color-white: ${colorMode === "light" ? "#fff" : "#303030"};
              --text-color: ${colorMode === "light" ? "#333" : "#eee"};
              --dark: ${colorMode === "light" ? "#303030" : "#ed135d"};
              --light: ${colorMode === "light" ? "#ed135d" : "#fff"};
              --opacity-light: ${colorMode === "light" ? "0.33" : "1"};
              --opacity-dark: ${colorMode === "light" ? "1" : "0.33"};
              --bg-color: ${colorMode === "light" ? "#82828233" : "#16181c"};
              --font-color: ${colorMode === "light" ? "#000" : "#fff"};
              --background-color: ${colorMode === "light" ? "#fff" : "#303030"};
              --bg-box: ${colorMode === "light" ? "#82828233" : "#ffffff1a"};
              --text-light: ${colorMode === "light" ? "#4f4f4f" : "#a1a2a4"};
              --text-light-100: ${colorMode === "light"
                ? "#4f4f4f"
                : "#c5c2c2"};
              --bg-label: ${colorMode === "light" ? "#82828233" : "#2e3033"};
              --bg-dashboard: ${colorMode === "light" ? "#f6f6f6" : "#000"};
              --color-radial: ${colorMode === "light"
                ? "radial-gradient(50% 50%at 50% 50%, rgb(237 19 93 / 45%), var(--color-white))"
                : "radial-gradient(50% 50%at 50% 50%, #ed135d, var(--color-white))"};
              --color-light-200: ${colorMode === "light" ? "#000" : "#9a9a9a"};
            }

            body {
              background-color: var(--bg-color);
              color: var(--text-color);
            }
          `}</style>
        </div>
      </div>
    </div>
  );
};

export default HorizontalMenu;
