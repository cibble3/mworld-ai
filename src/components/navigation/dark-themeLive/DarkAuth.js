import React from "react";
import styles from "../dark-themeLive/DarkAuth.module.css";

const DarkAuth = ({ children }) => {
  return (
    <div>
      <div className={styles.formWrapper}>{children}</div>
    </div>
  );
};

export default DarkAuth;
