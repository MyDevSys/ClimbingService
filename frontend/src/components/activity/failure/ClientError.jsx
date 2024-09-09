"use client";

import Link from "next/link";
import styles from "./Failure.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// クライアントエラー画面を表示するコンポーネント
export function ClientError({ status, isFullScreen }) {
  const [isReload, setIsReload] = useState(false);
  const router = useRouter();

  const errorTitles = {
    400: "400 - 不正なリクエスト",
    403: "403 - アクセス拒否",
    404: "404 - ページが存在しません",
    405: "405 - 許可されていないメソッド",
    408: "408 - リクエストタイムアウト",
  };

  const errorMessages = {
    400: "不正なリクエストです。入力内容をご確認の上、再度お試しください。",
    403: "このページへのアクセスは拒否されています。適切な権限がありません。",
    404: "アクセスしようとしたページは削除、変更されたか、現在利用できない可能性があります。",
    405: "リクエストメソッドが許可されていません。正しい方法で再度お試しください。",
    408: "サーバーがリクエストを待機中にタイムアウトしました。再度お試しください。",
  };

  const title = errorTitles[status] || `${status} - クライアントエラー`;
  const message =
    errorMessages[status] ||
    "クライアントエラーが発生しました。入力内容をご確認の上、再度お試しください。";

  // ページのタイトルと説明の設定
  useEffect(() => {
    document.title = title;
    document.querySelector('meta[name="description"]').setAttribute("content", message);
    return () => {};
  }, [title, message]);

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
        <h1 className={styles.ErrorDefault__Heading}>{title}</h1>
        <p className={styles.ErrorDefault__Message}>{message}</p>
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
