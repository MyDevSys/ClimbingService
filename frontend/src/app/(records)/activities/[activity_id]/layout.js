import { redirect } from "next/navigation";
import { SetCookie } from "@components/activity/cookie";
import { DataSet } from "@components/activity/detail/set";
import { fetchActivity } from "@utils/fetch/server";
import { getErrorComponent } from "@utils/handler/error";
import { UnauthorizedError, RefreshRetryOverError } from "@exceptions/auth";
import { URL_PATH } from "@data/constants";
import { appLogger } from "@utils/logger/server";

// 登山の活動内容を表示する画面のレイアウトコンポーネント
export default async function ActivityLayout({ children, params }) {
  const { activity_id } = params;

  try {
    // 登山の活動情報の取得処理
    const response = await fetchActivity(activity_id);

    return (
      <SetCookie setCookies={response.setCookies}>
        <DataSet data={response.data}>{children}</DataSet>
      </SetCookie>
    );
  } catch (error) {
    appLogger.warn(
      `${ActivityLayout.displayName} fetch Error (status : ${error?.response?.status || "none"}) \n  ${error?.message || ""}`,
    );

    // 認証エラーまたはトークンのリフレッシュでリトライオーバした場合は、ログイン画面にリダイレクト
    if (error instanceof UnauthorizedError || error instanceof RefreshRetryOverError) {
      appLogger.debug(`${ActivityLayout.displayName} Redirect Login Page`);

      redirect(URL_PATH.LOGIN);
    }

    // エラー画面のコンポーネントを取得
    const errorComponent = getErrorComponent(error, false);

    return errorComponent;
  }
}

ActivityLayout.displayName = "ActivityLayout";
