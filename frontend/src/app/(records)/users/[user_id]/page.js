import { redirect } from "next/navigation";
import serverFetch from "@utils/fetch/server";
import { API_URL_PATH, FILE_NAME, FILE_URL_PATH, URL_PATH } from "@data/constants";
import { ActivityList } from "@components/activity/list";
import { SetCookie } from "@components/activity/cookie";
import { getErrorComponent } from "@utils/handler/error";
import { UnauthorizedError, RefreshRetryOverError } from "@exceptions/auth";
import { appLogger } from "@utils/logger/server";

// 登山の活動内容の概要を表示するコンポーネント
export default async function ActivityListPage({ params }) {
  const { user_id } = params;

  try {
    // 登山の活動内容の概要を表示するために必要な情報の取得
    const responses = await serverFetch.fetchWithTokenRetry([
      () => serverFetch.get(API_URL_PATH.USER.set(user_id)),
      () => serverFetch.get(API_URL_PATH.PROFILE.set(user_id)),
      () => serverFetch.get(API_URL_PATH.ACHIEVEMENT.set(user_id)),
      () => serverFetch.get(`${FILE_URL_PATH.MAP}/${FILE_NAME.MAP}`),
    ]);

    const [activityDataList, profile, achievementList, mapData] = responses.data;

    // 取得した登山実績から都道府県毎の登山回数をカウント
    const climbingPrefectures = {};
    achievementList
      .flatMap((item) => item.prefecture_name)
      .forEach((item) => {
        if (!climbingPrefectures[item]) {
          climbingPrefectures[item] = 0;
        }
        climbingPrefectures[item] += 1;
      });

    const props = {
      user_id,
      activityDataList,
      profile,
      achievementList,
      climbingPrefectures,
      mapData,
    };

    return (
      <>
        <SetCookie setCookies={responses.setCookies}>
          <ActivityList {...props} />
        </SetCookie>
      </>
    );
  } catch (error) {
    appLogger.warn(
      `${ActivityListPage.displayName} fetch Error (status : ${error?.response?.status || "none"}) \n  ${error?.message || ""}`,
    );

    // 認証エラーまたはトークンのリフレッシュでリトライオーバした場合は、ログイン画面にリダイレクト
    if (error instanceof UnauthorizedError || error instanceof RefreshRetryOverError) {
      appLogger.debug(`${ActivityListPage.displayName} Redirect Login Page`);

      redirect(URL_PATH.LOGIN);
    }

    // エラー画面のコンポーネントを取得
    const errorComponent = getErrorComponent(error, false);

    return errorComponent;
  }
}

ActivityListPage.displayName = "ActivityListPage";
