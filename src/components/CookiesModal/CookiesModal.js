import React, { useEffect, useState } from "react";
import styles from "./modal.module.css";
import Link from "next/link";

const CookiesModal = () => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const openModal = () => {
      const cookiesAccepted = localStorage.getItem("cookiesAccepted");
      !cookiesAccepted && setShowModal(true);
    };
    const supportsTouch =
      "ontouchstart" in window || navigator.msMaxTouchPoints;

    if (supportsTouch) {
      window.addEventListener("touchstart", openModal);
    } else {
      window.addEventListener("mousemove", openModal);
    }

    return () => {
      if (supportsTouch) {
        window.removeEventListener("touchstart", openModal);
      } else {
        window.removeEventListener("mousemove", openModal);
      }
    };
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookiesAccepted", "true");
    setShowModal(false);
  };

  return showModal ? (
    <div className={styles.mainModal}>
      <div className={styles.mainFlex}>
        <div className={styles.modalHeader}>
          <div className={styles.age}>
            <h2>18+</h2>
          </div>
          <div className={styles.heading}>
            <b>mistressworld.xxx contains adult content</b>
            <p>By using the website you acknowledge that you are over 18.</p>
          </div>
        </div>
        <div className={styles.mainContent}>
          <div className={styles.title}>
            <b>We Respect Your Privacy</b>
          </div>
          <p>
            We use cookies to improve your user experience. By continuing your
            browsing, you accept the use of cookies, including third-party
            cookies.{" "}
            <span className={styles.setColor}>
              <Link className="text-white" href="/cookie-policy">
                Cookie policy
              </Link>
            </span>
          </p>
          <div className={styles.continueBtn}>
            <button onClick={handleAccept}>Continue</button>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default CookiesModal;
