import { headers } from "next/headers";
import { redirect } from "next/navigation";
import serverFetch from "@utils/fetch/server";
import { Header } from "@components/activity/header";
import { API_URL_PATH, URL_PATH } from "@data/constants";
import { SetCookie } from "@components/activity/cookie";
import { getErrorComponent } from "@utils/handler/error";
import { UnauthorizedError, RefreshRetryOverError } from "@exceptions/auth";
import { appLogger } from "@utils/logger/server";

import styles from "./RecordsLayout.module.css";

import dynamic from "next/dynamic";
const Footer = dynamic(() => import("@components/activity/footer"), {
  ssr: false,
});

// 登山の活動内容やリストを表示するページのレイアウトコンポーネント
export default async function RecordsLayout({ children }) {
  // 独自のリクエストヘッダーからユーザーIDを取得
  const headersList = headers();
  const user_id = headersList.get("x-user-id");

  let response;
  try {
    // ユーザーのプロフィール情報の取得
    response = await serverFetch.fetchWithTokenRetry([
      () => serverFetch.get(API_URL_PATH.PROFILE.set(user_id)),
    ]);
  } catch (error) {
    appLogger.error(
      `${RecordsLayout.displayName} fetch Error (status : ${error?.response?.status || "none"}) \n  ${error?.message || ""}`,
    );

    // 認証エラーまたはトークンのリフレッシュでリトライオーバした場合は、ログイン画面にリダイレクト
    if (error instanceof UnauthorizedError || error instanceof RefreshRetryOverError) {
      appLogger.debug(`${RecordsLayout.displayName} Redirect Login Page`);

      redirect(URL_PATH.LOGIN);
    }

    // エラー画面のコンポーネントを取得
    const errorComponent = getErrorComponent(error);

    return errorComponent;
  }

  return (
    <>
      <SetCookie setCookies={response.setCookies}>
        <div className={styles.Container}>
          <Header user_id={user_id} profile={response.data} />
          <div className={styles.Container__Item}>{children}</div>
          <Footer />
        </div>
      </SetCookie>
    </>
  );
}

RecordsLayout.displayName = "RecordsLayout";
