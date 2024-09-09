import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { StatusCodes } from "http-status-codes";
import { API_URL_PATH } from "@data/constants";
import { apiLogger } from "@utils/logger/server";
import serverFetch from "@utils/fetch/server";

// アクセストークンの払い出し要求のAPI
export async function POST(request) {
  let responseBody;
  let responseStatus = { status: StatusCodes.OK };

  // リクエスト処理の開始時間を記録（アクセスログ用）
  const startTime = performance.now();

  // リクエストのcookieからリフレッシュトークンとCSRFトークンを取得
  const cookieStore = cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value || null;
  const csrfToken = cookieStore.get("csrftoken")?.value || null;

  // リフレッシュトークンまたはCSRFトークンがcookieに付与されていない場合、未認証エラーでレスポンス
  if (!refreshToken || !csrfToken) {
    const isRefreshToken = refreshToken ? "exist" : "none";
    const isCsrfToken = csrfToken ? "exist" : "none";
    responseBody = {
      message: `No token provided(refresh : ${isRefreshToken}, CSRF : ${isCsrfToken} )`,
    };
    responseStatus = { status: StatusCodes.UNAUTHORIZED };
    return NextResponse.json(responseBody, responseStatus);
  }

  try {
    // アクセストークンの払い出し要求
    const apiResponse = await serverFetch.post(API_URL_PATH.TOKEN_REFRESH_BACKEND, csrfToken, {
      data: { refresh: refreshToken },
    });

    // 本APIのレスポンスの作成
    responseBody = {
      message: "access token refresh successful",
      access_token: apiResponse.data.access_token,
    };
    const response = NextResponse.json(responseBody);

    // 払い出し要求のレスポンスのset-cookieヘッダーを本APIのレスポンスに設定
    const setCookieHeader = apiResponse.headers.get("set-cookie");
    response.headers.set("Set-Cookie", setCookieHeader);

    // 正常レスポンスを送信
    return response;
  } catch (error) {
    // アクセストークンの払い出し失敗時のレスポンスを作成
    responseBody = { error: error.message };
    responseStatus = { status: error.response.status };

    // 異常レスポンスを作成
    return NextResponse.json(responseBody, responseStatus);
  } finally {
    // リクエストの処理時間を取得（アクセスログ用）
    const duration = performance.now() - startTime;

    // リクエストのAPIパスを取得（アクセスログ用）
    const { pathname } = new URL(request.url);

    // レスポンスのステータスコードを取得
    const statusCode = responseStatus.status;

    // クライアントのIPアドレスを取得（アクセスログ用）
    const clientIp = request.headers.get("x-forwarded-for") || null;

    // レスポンスボディのサイズを計算（アクセスログ用）
    const responseSize = JSON.stringify(responseBody).length;

    // アクセスログの出力
    apiLogger.info(
      `${request.method} ${pathname} ${statusCode} ${clientIp || "unknown"} ${responseSize} ${duration.toFixed(3)}`,
    );
  }
}
