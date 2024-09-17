"use client";

import styles from "./Footer.module.css";

// ページのヘッダーを表示するコンポーネント
const Footer = () => {
  return (
    <footer id="ActivitySiteFooter" className={styles.Footer}>
      <small className={styles.Footer__Copyright}>&copy; XXXX INC. All Rights Reserved.</small>
    </footer>
  );
};

export default Footer;
