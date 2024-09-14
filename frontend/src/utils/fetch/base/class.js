import retry from "retry";
import { StatusCodes } from "http-status-codes";
import { NoAccessTokenError, UnauthorizedError } from "@exceptions/auth";
import { FetchError, FetchRetryOverError } from "@exceptions/fetch";
import { parseSetCookieHeader } from "@utils/parse";
import { API_URL_PATH, FRONTEND_BASE_URL } from "@data/constants";
import { RETRY_OPTIONS } from "../setting/settings";

// サーバー/クライアントコンポーネントのデータフェッチの基底クラス
export class FetchBase {
  constructor(baseUrl = null) {
    this.retryOptions = RETRY_OPTIONS;
    this.accessToken = null;
    this.baseUrl = baseUrl || FRONTEND_BASE_URL;
    this.refreshingPromise = null;
  }

  // データフェッチのリクエストメソッド
  async request(url, method, { headers = {}, data = null, cache = "no-cache" } = {}) {
    // リクエストヘッダーの設定
    let authHeaders = {
      "Content-Type": "application/json",
      ...headers,
      ...(this.accessToken ? { Authorization: `Bearer ${this.accessToken}` } : {}),
    };

    const additionalHeaders = this.addCookieHeader();

    authHeaders = {
      ...authHeaders,
      ...additionalHeaders,
    };

    const options = { method, headers: authHeaders, cache, credentials: "include" };

    if (data) {
      options.body = JSON.stringify(data);
    }

    // リトライ設定
    const operation = retry.operation(this.retryOptions);

    // データフェッチ
    return new Promise((resolve, reject) => {
      operation.attempt(async () => {
        try {
          const requestUrl = FetchBase.isAbsoluteURL(url) ? url : `${this.baseUrl}${url}`;

          const response = await fetch(requestUrl, options);

          if (response.ok) {
            const responseData = await response.json();

            resolve({ data: responseData, headers: response.headers });
          } else {
            if (response.status === StatusCodes.UNAUTHORIZED) {
              const errorData = await response.json();

              if (errorData?.detail === "No access token in request") {
                throw new NoAccessTokenError(
                  `Unauthorized Error (${url} - ${response.statusText}(${response.status}))`,
                  response,
                );
              } else {
                throw new UnauthorizedError(
                  `Access Token Invalid (${url} - ${response.statusText}(${response.status}))`,
                  response,
                );
              }
            }
            throw new FetchError(
              `Data Fetch Error (${url} - ${response.statusText}(${response.status}))`,
              response,
            );
          }
        } catch (error) {
          const status = error.response ? error.response.status : null;
          if (status === null || (status && status >= 500)) {
            if (!operation.retry(error)) {
              reject(operation.mainError());
            }
          } else {
            reject(error);
          }
        }
      });
    });
  }

  // アクセストークンの有効期限切れの際にアクセストークンの払い出し処理を行うデータフェッチメソッド
  async fetchWithTokenRetry(requestFunctions) {
    let requests;

    // データフェッチのPromiseオブジェクトを作成し、並列でデータをフェッチ
    try {
      requests = requestFunctions.map((requestFunction) => requestFunction());

      const responses = await Promise.all(requests);

      const data = responses.map((response) => response.data);
      const headers = responses.map((response) => response.headers);

      if (requests.length === 1) {
        return { data: data[0], headers: headers[0] };
      }

      return { data, headers };
    } catch (error) {
      if (error instanceof NoAccessTokenError) {
        const { accessToken, setCookies } = await this.refreshAccessToken();

        this.setAccessToken(accessToken);

        requests = requestFunctions.map((requestFunction) => requestFunction());

        const retryResponses = await Promise.all(requests);

        const data = retryResponses.map((response) => response.data);
        const headers = retryResponses.map((response) => response.headers);

        if (requests.length === 1) {
          return { data: data[0], headers: headers[0], setCookies };
        }

        return { data, headers, setCookies };
      }

      throw error;
    } finally {
      this.resetAccessToken();
    }
  }

  // リフレッシュトークンでアクセストークンの払い出しを行うメソッド
  async refreshAccessToken() {
    // 既に払い出しリクエストが進行中の場合、そのPromiseを返却
    if (this.refreshingPromise) {
      return this.refreshingPromise;
    }

    // フロントエンドのAPIルートを経由してアクセストークンの払い出しを要求
    this.refreshingPromise = new Promise((resolve, reject) => {
      const operation = retry.operation(this.retryOptions);

      operation.attempt(async () => {
        try {
          const additionalHeaders = this.addCookieHeader();

          const response = await fetch(API_URL_PATH.TOKEN_REFRESH_FRONTEND, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...additionalHeaders,
            },
            body: null,
            credentials: "include",
          });

          if (response.ok) {
            const accessToken = (await response.json()).access_token;
            const setCookieHeader = response.headers.get("Set-Cookie");
            const setCookies = parseSetCookieHeader(setCookieHeader);

            resolve({ accessToken, setCookies });
          } else {
            if (response.status === StatusCodes.UNAUTHORIZED) {
              throw new UnauthorizedError(
                `Refresh Token Invalid (${response.status} - ${response.statusText})`,
                response,
              );
            } else {
              throw new FetchError(
                `Refresh Token Get Error (${response.status} - ${response.statusText})`,
                response,
              );
            }
          }
        } catch (error) {
          // 400系以外のエラーレスポンスの場合はリトライを行い、400系の場合はリトライせず終了
          const status = error.response ? error.response.status : null;
          if (status === null || (status && status >= 500)) {
            if (!operation.retry(error)) {
              reject(new FetchRetryOverError("Refresh Token Retry Over", operation.mainError()));
            }
          } else {
            reject(error);
          }
        } finally {
          this.refreshingPromise = null;
        }
      });
    });

    return this.refreshingPromise; // 進行中のPromiseを返す
  }

  // URLが絶対パスかどうかを判定するクラスメソッド
  static isAbsoluteURL(url) {
    return /^(?:[a-z]+:)?\/\//i.test(url);
  }

  // 払い出したアクセストークンをオブジェクトに設定するメソッド
  setAccessToken(newAccessToken) {
    this.accessToken = newAccessToken;
  }

  // オブジェクトに設定するアクセストークンをリセットするメソッド
  resetAccessToken() {
    this.accessToken = null;
  }

  // リクエストヘッダーにcookieを設定するメソッド(サーバサイド向け)
  addCookieHeader() {
    return {};
  }

  // GETリクエストのメソッド
  get(url, options = {}) {
    return this.request(url, "GET", options);
  }

  // POSTリクエストのメソッド
  post(url, csrfToken = null, options = {}) {
    if (csrfToken) {
      options.headers = options.headers || {};
      options.headers["X-CSRFToken"] = csrfToken;
    }
    return this.request(url, "POST", options);
  }
}
