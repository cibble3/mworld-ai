import React from "react";
import { IoCloseSharp } from "react-icons/io5";
import styles from "./dashbpard-dark-theme.module.css";
import Footer from "./menuFooter";
import useWindowSize from "@/hooks/useWindowSize";
import Link from "next/link";
import DropdownComponent from "./DropdownComponent";
import menuData from "../../../context/menuData.json";
import { Button, Nav, Tab } from "react-bootstrap";
import { useRouter } from "next/router";
import { RxCaretDown } from "react-icons/rx";
import { useState } from "react";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";

const SideBar = ({ collapse, setCollapse, parentMenuNames = [] }) => {
  const { width, height } = useWindowSize();
  const router = useRouter();
  const [support, setSupport] = useState(false);
  const activeTab = router.asPath.split("/");
  const lowercaseKeys = Object.keys(menuData).map(
    (key) => !["blog"].includes(key.toLowerCase()) && key.toLowerCase()
  );

  const checkActiveTab = () => {
    return activeTab.find((tab) => lowercaseKeys.includes(tab.toLowerCase()));
  };

  const defaultActiveKey =
    checkActiveTab() || Object.keys(menuData)[0].toLowerCase();

  return (
    !collapse && (
      <div
        className={` w-3/12  md:w-3/12 lg:w-2/12  p-0 ${styles.topView}`}
        style={{
          overflow: "hidden",
          height: width > 670 ? height - 80 : height,
        }}
      >
        <div
          className={styles?.dashbpardDarkThemeItem}
          style={{
            borderRight: "1px solid #707070",
            overflowY: "scroll",
            position: "relative",
          }}
        >
          <div>
            <div className={styles.sideHeader}>
              <div className={`flex justify-between ${styles.sign_btn_group}`}>
                <Link href={"https://www.cams.mistressworld.xxx/en/auth/login"}>
                  <Button
                    className={`bg-transparent border-0 ${styles.sidebar_login}`}
                  >
                    Login
                  </Button>
                </Link>
                <Link
                  href={"https://www.cams.mistressworld.xxx/en/auth/sign-up"}
                  className={`${styles.sidebar_register} py-2  px-3`}
                >
                  Join Now for Free{" "}
                </Link>
              </div>
              <IoCloseSharp
                color="#818181"
                size={20}
                onClick={() => setCollapse(true)}
                className={`mt-[-5px] absolute right-[10px] top-[10px]`}
              />
              <div className="flex justify-center items-center">
                <a
                  className={styles.footer_menu_item}
                  // className="inline-block py-[10px]"
                  tab="_blank"
                  href="https://www.instagram.com/mistressworldcams/"
                >
                  <AiFillInstagram fontSize={24} />
                </a>
                <a
                  className={styles.footer_menu_item}
                  tab="_blank"
                  href="https://www.youtube.com/channel/UCaGwZy3QLT5wMnzvQIwMJwA"
                >
                  <AiFillYoutube fontSize={24} />
                </a>
                <a
                  className={styles.footer_menu_item}
                  tab="_blank"
                  href="https://twitter.com/mistressworld4u/"
                >
                  <AiOutlineTwitter fontSize={24} />
                </a>
                <a
                  className={styles.footer_menu_item}
                  tab="_blank"
                  href="https://www.facebook.com/livefetishcams/"
                >
                  <AiFillFacebook fontSize={24} />
                </a>
              </div>
            </div>
          </div>
          <Tab.Container defaultActiveKey={defaultActiveKey}>
            <Nav variant="tabs" className="flex nav nav-tabs">
              {Object.keys(menuData).map((key) => {
                return (
                  menuData[key].type === "tab" && (
                    <Nav.Item key={key.toLowerCase()} className="">
                      <Nav.Link
                        as="span"
                        activekey={key.toLowerCase()}
                        className="rounded-0 "
                        eventKey={key.toLowerCase()}
                      >
                        <Link rel="preconnect" href={`/${key.toLowerCase()}`}>
                          {key}
                        </Link>
                      </Nav.Link>
                    </Nav.Item>
                  )
                );
              })}
            </Nav>
            <Tab.Content>
              {Object.keys(menuData).map((itemkey) => (
                <Tab.Pane
                  eventKey={itemkey.toLowerCase()}
                  key={itemkey.toLowerCase()}
                >
                  {Object.keys(menuData[itemkey].data).map((key) =>
                    key.toLowerCase() === "categories" ? (
                      <DropdownComponent
                        key={key}
                        parentText={itemkey}
                        label={key}
                        menuItems={menuData[itemkey].data[key]}
                        menuData={menuData}
                      />
                    ) : (
                      <DropdownComponent
                        key={key}
                        label={key}
                        parentText={key}
                        menuItems={menuData[itemkey].data[key]}
                        menuData={menuData}
                        parentMenuNames={[...parentMenuNames, itemkey]}
                      />
                    )
                  )}
                </Tab.Pane>
              ))}
            </Tab.Content>
          </Tab.Container>

          {Object.keys(menuData).map(
            (itemkey) =>
              menuData[itemkey].type === "dropdown" &&
              Object.keys(menuData[itemkey].data).map(
                (key) =>
                  key.toLowerCase() === "categories" && (
                    <DropdownComponent
                      key={key}
                      parentText={`${itemkey}/${key}`}
                      label={itemkey}
                      menuItems={menuData[itemkey].data[key]}
                      menuData={menuData}
                    />
                  )
              )
          )}
          <div
            style={{ borderTop: "1px solid #606060" }}
            className="px-1 dropcustom py-1"
            onClick={() => router.push("/models-wanted")}
          >
            <Link
              className={`${styles.footer_menu_item}  text-[17px]`}
              title="models wanted"
              href="/models-wanted"
            >
              Models Wanted
            </Link>
          </div>
          <a
            style={{ borderTop: "1px solid #606060" }}
            className={`${styles.footer_menu_item} px-3 text-[17px] dropcustom`}
            tab="_blank"
            href="//awejmp.com/?siteId=awe&amp;pageName=home&amp;prm[referral_rs]=mikeeyy3"
          >
            Affiliates
          </a>

          {/* <div className="mt-[412px]"> */}
          <div className="absolute bottom-0 w-full z-20 ">
            <div className="" style={{ borderTop: "1px solid #606060" }}>
              <div
                className="flex  justify-between cursor-pointer items-center py-3 px-3 dropcustom bg-[#303030]"
                onClick={() => {
                  setSupport(!support);
                }}
              >
                <h1
                  className="text-white text-[17px] "
                  onClick={() => {
                    setSupport(!support);
                  }}
                >
                  Support
                </h1>
                <RxCaretDown
                  size={25}
                  color="white"
                  className={`dropdownArrow2 ${support ? "dropdown-open" : ""}`}
                />
              </div>

              {support && (
                <>
                  <div className="">
                    <Link
                      className={`${styles.footer_menu_item} w-full px-3  dropcustom`}
                      href="/sitemap"
                    >
                      Sitemap
                    </Link>
                    <br />
                    <Link
                      rel="preconnect"
                      className={`${styles.footer_menu_item} w-full px-3  dropcustom`}
                      tab="_blank"
                      href="https://www.cams.mistressworld.xxx/en/privacy-policy#personaldata"
                    >
                      Privacy
                    </Link>
                    <br />

                    <Link
                      rel="preconnect"
                      className={`${styles.footer_menu_item} w-full px-3  dropcustom`}
                      title="Terms"
                      tab="_blank"
                      href="https://www.cams.mistressworld.xxx/en/terms-and-conditions"
                    >
                      Terms
                    </Link>
                    <br />

                    <Link
                      rel="preconnect"
                      className={`${styles.footer_menu_item} w-full px-3  dropcustom`}
                      title="Contact"
                      tab="_blank"
                      href="https://www.cams.mistressworld.xxx/en/contact-us?page=online-support"
                    >
                      Contact Us
                    </Link>
                  </div>
                </>
              )}
            </div>

            <div className="bg-black py-2 ">
              <div className="flex justify-center items-center">
                <Link
                  rel="preconnect"
                  className="text-white text-center text-sm underline decoration-solid hover:underline hover:decoration-solid"
                  tab="_blank"
                  href="/18-2257"
                >
                  18 U.S.C. 2257
                </Link>
              </div>
              <div className="flex justify-center items-center px-1">
                <h1 className="text-white text-center text-[11px] py-1 leading-relaxed ">
                  {" "}
                  Copyrights © 2023 &amp; All Rights Reserved by MistressWorld
                </h1>
              </div>
            </div>
          </div>
          <div className={styles?.invite}>
            <Footer />
          </div>
        </div>
      </div>
    )
  );
};

export default SideBar;
