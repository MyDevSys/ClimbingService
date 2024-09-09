"use client";

import Link from "next/link";
import styles from "./Failure.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// サーバーエラー画面を表示するコンポーネント
export function ServerError({ status, isFullScreen }) {
  const [isReload, setIsReload] = useState(false);
  const router = useRouter();

  const errorTitles = {
    500: "500 - サーバーエラー",
    502: "502 - 不正なゲートウェイ",
    503: "503 - サービス利用不可",
    504: "504 - ゲートウェイタイムアウト",
  };

  const subtitle = (status && (errorTitles[status] || `${status} - サーバーエラー`)) || null;

  // ページのタイトルと説明の設定
  useEffect(() => {
    document.title = "システムエラー";
    document
      .querySelector('meta[name="description"]')
      .setAttribute("content", "システムエラーページ");
    return () => {};
  }, []);

  // 前のページに戻るボタンのハンドラ関数
  const handleBack = () => {
    router.back();
  };

  // 現在のページをリロードするハンドラ関数
  const handleReload = () => {
    setIsReload(true);
    window.location.reload();
  };

  return (
    <div
      className={styles.ErrorDefault}
      style={isFullScreen ? { height: "100vh" } : { height: "auto" }}
    >
      <div className={styles.ErrorDefault__Inner}>
        <div className={styles.ErrorDefault__Heading}>
          <span className={styles.ErrorDefault__title}>システム側で問題が発生しました</span>
          {subtitle && (
            <>
              <br />
              <span className={styles.ErrorDefault__SubTitle}>（{subtitle}）</span>
            </>
          )}
        </div>

        <p className={styles.ErrorDefault__Message}>
          一時的にサービスが利用できない状態です。
          <br />
          大変申し訳ございませんが、時間をおいて再度お試しください。
        </p>
        <div className={styles.Error__Layout__Wrap}>
          <button
            aria-label="ページを再実行"
            onClick={handleReload}
            className={`${styles.Button} ${styles["Error--Primary"]} ${isReload ? styles["Error--Reload"] : ""}`}
          >
            {isReload ? "実行中..." : "再実行"}
          </button>
        </div>
        <div className={styles.Error__Layout__Wrap}>
          <Link href="/" className={`${styles.Button} ${styles["Error--Secondary"]}`}>
            ホーム画面へ
          </Link>
          <button
            aria-label="前のページに戻る"
            onClick={handleBack}
            className={`${styles.Button} ${styles["Error--Secondary"]}`}
          >
            前のページへ
          </button>
        </div>
      </div>
    </div>
  );
}
