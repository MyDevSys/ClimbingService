import retry from "retry";
import { FetchBase } from "../base";
import { FetchRetryOverError, FetchError } from "@exceptions/fetch";
import { API_URL_PATH } from "@data/constants";

// クライアントコンポーネントのデータフェッチクラス
export class ClientFetch extends FetchBase {
  constructor() {
    super();
    this.setCookiePromise = null;
  }

  // 引数に指定したcookie情報を元にset-cookieを要求するメソッド
  async setCookie(setCookies) {
    // 他の処理で本リクエストが進行中の場合、そのPromiseを返却
    if (this.setCookiePromise) {
      return this.setCookiePromise;
    }

    // フロントエンドにset-cookieを要求
    this.setCookiePromise = new Promise((resolve, reject) => {
      const operation = retry.operation(this.retryOptions);
      operation.attempt(async () => {
        try {
          const response = await fetch(API_URL_PATH.COOKIE, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ setCookies }),
            credentials: "include",
          });

          if (response.ok) {
            resolve();
          } else {
            throw new FetchError(
              `Cookie Set Error (${response.status} - ${response.statusText})`,
              response,
            );
          }
        } catch (error) {
          // 400系以外のエラーレスポンスの場合はリトライを行い、400系の場合はリトライせず終了
          const status = error.response ? error.response.status : null;
          if (status === null || (status && status >= 500)) {
            if (!operation.retry(error)) {
              reject(new FetchRetryOverError("Cookie Set Retry Over", operation.mainError()));
            }
          } else {
            reject(error);
          }
        } finally {
          this.setCookiePromise = null;
        }
      });
    });

    return this.setCookiePromise;
  }
}

const clientFetch = new ClientFetch();
export default clientFetch;
