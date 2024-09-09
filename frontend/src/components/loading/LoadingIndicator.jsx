"use client";

import styles from "./LoadingIndicator.module.css";

// ローディング画面を表示するコンポーネント
export const LoadingIndicator = () => {
  return (
    <div className={styles.loadingScreen}>
      <div className={styles.spinner}></div>
    </div>
  );
};
