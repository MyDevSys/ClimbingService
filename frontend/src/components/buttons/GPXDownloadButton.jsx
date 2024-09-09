"use client";
import React from "react";

import styles from "./GPXDownloadButton.module.css";

// GPXファイルのダウンロードボタンのコンポーネント
export const GPXDownloadButton = ({ gpx_file_path }) => {
  // ダウンロードボタンのハンドラ関数
  const handleDownload = () => {
    // ダウンロード用のa要素を作成
    const link = document.createElement("a");
    // ダウンロードするファイルのURLの設定
    link.href = gpx_file_path;
    // ダウンロードする際のファイル名の設定
    link.download = gpx_file_path?.split("/").pop();
    // body要素に作成したa要素を追加
    document.body.appendChild(link);
    // 作成したa要素をクリック
    link.click();
    // body要素に追加したa要素を削除
    document.body.removeChild(link);
  };

  return (
    <>
      <button
        className={`${styles.ActivitiesId__Misc__DownloadButton} ${styles.BaseButton} ${styles["is-size-m"]} ${styles["is-variant-primary"]}`}
        onClick={handleDownload}
        aria-label="エクスポート"
      >
        <span className={styles.BaseButton__Text}>エクスポート</span>
      </button>
    </>
  );
};
