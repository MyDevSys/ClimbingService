import { ClientError, ServerError } from "@components/activity/failure";

// 引数に指定したエラーオブジェクトにしたがって、エラー画面コンポーネントを返す関数
export function getErrorComponent(error, isFullScreen = true) {
  // エラーオブジェクトからレスポンスのステータスを取得
  const status = error?.response?.status || null;

  let errorComponent = <ServerError status={status} isFullScreen={isFullScreen} />;

  // レスポンスのステータスが400番台の場合はクライアントエラーのコンポーネントを返し
  // それ以外はサーバーエラーのコンポーネントを返す
  if (status) {
    if (status >= 400 && status < 500) {
      errorComponent = <ClientError status={status} isFullScreen={isFullScreen} />;
    }
  }

  return errorComponent;
}
