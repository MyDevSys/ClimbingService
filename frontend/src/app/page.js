// URLルートのページコンポーネント
import { URL_PATH } from "@data/constants";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// ルートパスにアクセスした際のページリダイレクトを行うコンポーネント
export default function Page() {
  // 独自のリクエストヘッダーからユーザーIDを取得
  const headersList = headers();
  const userId = headersList.get("x-user-id");

  // 認証済みの場合は登山の活動リストのページに、未認証の場合はログインページにリダイレクト
  if (userId) {
    redirect(URL_PATH.USER.set(userId));
  } else {
    redirect(URL_PATH.LOGIN);
  }
}
