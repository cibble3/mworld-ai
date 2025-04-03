"use client";
import React, { useEffect, useState } from "react";
import { Dropdown, DropdownButton, Nav } from "react-bootstrap";
import { RxCaretDown } from "react-icons/rx";
import { useRouter } from "next/router";

const DropdownComponent = ({
  label,
  parentText,
  menuItems,
  parentMenuNames = [],
  menuData,
}) => {
  const [dropMenu, setDropMenu] = useState(false);
  const router = useRouter();

  const { query } = router;
  useEffect(() => {
    const currentPath = router.asPath.toLowerCase();
    const activeTab = currentPath.split("/")[1];

    if (
      activeTab === "" &&
      currentPath === "/" &&
      parentText.toLowerCase() === "girls"
    ) {
      setDropMenu(true);
    } else if (activeTab === parentText.toLowerCase()) {
      setDropMenu(true);
    } else if (
      ["chat", "video", "models-wanted", "18-2257"].includes(activeTab)
    ) {
      if (Object.keys(menuData).includes(parentText) && activeTab !== "") {
        setDropMenu(true);
      }
    } else if (currentPath.indexOf(parentText.toLowerCase()) >= 0) {
      setDropMenu(true);
    } else {
      setDropMenu(false);
    }
  }, [router.asPath, parentText]);

  return (
    <>
      <div
        className="w-full relative "
        style={{ borderTop: "1px solid #494949" }}
      >
        <div>
          <Dropdown>
            <DropdownButton
              title={label}
              className={"dropcustom"}
              show={dropMenu}
              onClick={() => setDropMenu(!dropMenu)}
            ></DropdownButton>
          </Dropdown>

          {dropMenu && (
            <Dropdown.Menu show={dropMenu} className="nestedDropdownMenu">
              {Object.keys(menuItems).map((key) => (
                <div
                  className="cursor-pointer"
                  // onClick={
                  //   () =>
                  //     router.push(
                  //       `/${[parentText, ...parentMenuNames]
                  //         .join("/")
                  //         .toLowerCase()}/${key
                  //         .replace(/\s+/g, "-")
                  //         .toLowerCase()}`
                  //     )
                  onClick={() =>
                    router.push(
                      `/${[parentText, ...parentMenuNames]
                        .join("/")
                        .toLowerCase()}/${key}`
                    )
                  }
                >
                  <div
                    key={key}
                    className={`subMenu ${
                      router.asPath
                        .toLowerCase()
                        .substring(
                          router.asPath.toLowerCase().lastIndexOf("/") + 1
                        ) === key.toLowerCase()
                        ? "active"
                        : ""
                    }`}
                  >
                    {menuItems[key]}
                  </div>
                  {/* </Link> */}
                </div>
              ))}
            </Dropdown.Menu>
          )}
        </div>
        <div className="dropArrow">
          <RxCaretDown
            onClick={() => setDropMenu(!dropMenu)}
            size={25}
            color="white"
            className={`dropdownArrow ${dropMenu ? "dropdown-open" : ""}`}
          />
        </div>
      </div>
    </>
  );
};

export default DropdownComponent;
