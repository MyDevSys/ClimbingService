"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { StatusCodes } from "http-status-codes";
import clientFetch from "@utils/fetch/client";
import { getRedirectQueryParams } from "@utils/control/query";
import { LoadingIndicator } from "@components/loading";
import { API_URL_PATH, URL_PATH } from "@data/constants";
import { log } from "@utils/logger/client";
import { getErrorComponent } from "@utils/handler/error";

import styles from "./Login.module.css";

// ログイン画面を表示するコンポーネント
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [isEmailError, setIsEmailError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [isPasswordError, setIsPasswordError] = useState(false);
  const [redirectPath, setRedirectPath] = useState("");
  const [isAuthError, setIsAuthError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [isError, setIsError] = useState(null);
  const MIN_PASSWORD_LENGTH = 8;
  const searchParams = useSearchParams();

  // CSRFトークンの取得処理
  useEffect(() => {
    clientFetch
      .get(API_URL_PATH.CSRF)
      .then((response) => {
        setCsrfToken(response.data.CSRF_Token);
        // ローディング画面を非表示
        setIsLoading(false);
      })
      .catch((error) => {
        log.error(`${Login.displayName} error (${error.message})`);
        // ローディング画面を非表示
        setIsLoading(false);
        setIsError(error);
      });

    // クリーンアップ処理
    return () => {};
  }, []);

  // ログイン後にリダイレクトする先を記載したクエリパラメータとハッシュフラグメントの取得処理
  useEffect(() => {
    // クエリパラメータの取得
    const urlPathname = getRedirectQueryParams(searchParams);
    if (urlPathname !== null) {
      // ハッシュフラグメントを取得(存在しない場合は空文字)
      const hashFragment = window.location.hash;

      // クエリパラメータとハッシュフラグメントの設定
      setRedirectPath(urlPathname + hashFragment);
    }

    // クリーンアップ処理
    return () => {};
  }, [searchParams]);

  // eメールのバリデーション関数
  const validateEmail = (email) => {
    if (!email) {
      setEmailErrorMessage("メールアドレスを入力してください");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailErrorMessage("メールアドレスのフォーマットが正しくありません");
      return false;
    } else {
      setEmailErrorMessage("");
      return true;
    }
  };

  // パスワードのバリデーション関数
  const validatePassword = (password) => {
    if (!password) {
      setPasswordErrorMessage(`パスワードを入力してください`);
      return false;
    } else if (password.length < 8) {
      setPasswordErrorMessage(`パスワードは${MIN_PASSWORD_LENGTH}文字以上で入力してください`);
      return false;
    } else {
      setPasswordErrorMessage("");
      return true;
    }
  };

  // フォームのサブミット関数
  const handleSubmit = async (event) => {
    event.preventDefault();

    // バリデーションエラーの場合、処理終了
    const resultEmail = validateEmail(email);
    const resultPassword = validatePassword(email);
    if (!resultEmail || !resultPassword) {
      setIsEmailError(resultEmail);
      setIsPasswordError(resultPassword);
      return;
    }

    // 認証前のstateの初期化
    setIsAuthError(false);
    setIsEmailError(false);
    setIsPasswordError(false);
    setIsAuthenticating(true);

    // 認証要求
    clientFetch
      .post(API_URL_PATH.TOKEN, csrfToken, { data: { email, password } })
      .then((response) => {
        // ユーザーIDを取得
        const user_id = response.data.user_id;

        // リダイレクト先の設定
        const finalRedirectPath = redirectPath || URL_PATH.USER.set(user_id);

        // リダイレクト先にリダイレクト
        window.location.replace(finalRedirectPath);

        return;
      })
      .catch((error) => {
        log.error(`${Login.displayName} error (${error.message})`);

        // 認証結果が認証エラーの場合は、再度ログイン画面を表示するようにstateを設定
        // それ以外のエラーの場合は、エラー画面を表示するようにstateを設定
        if (error.response) {
          if (error.response.status === StatusCodes.UNAUTHORIZED) {
            setIsAuthError(true);
            setIsEmailError(true);
            setIsPasswordError(true);
          } else {
            setIsError(error);
          }
        } else {
          setIsError(error);
        }

        setIsAuthenticating(false);
      });
  };

  // eメールフィールドの変更ハンドラ関数
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    if (isAuthError) {
      setIsAuthError(false);
      setIsPasswordError(false);
    }

    const resultEmail = validateEmail(newEmail);
    if (!resultEmail) {
      setIsEmailError(true);
    } else {
      isEmailError && setIsEmailError(false);
    }
  };

  // パスワードフィールドの変更ハンドラ関数
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (isAuthError) {
      setIsAuthError(false);
      setIsEmailError(false);
    }

    const resultPassword = validatePassword(newPassword);
    if (!resultPassword) {
      setIsPasswordError(true);
    } else {
      isPasswordError && setIsPasswordError(false);
    }
  };

  // ローディング画面を表示
  if (isLoading) {
    return <LoadingIndicator />;
  }

  // エラー画面を表示
  if (isError) {
    const errorComponent = getErrorComponent(isError);

    return errorComponent;
  }

  return (
    <div className={styles.Login__Container}>
      <div className={styles.Login__Box}>
        <h1 className={styles.Login__Title}>ログイン</h1>
        <p className={styles.Login__Description}>
          会員登録が完了している方は、こちらからログインしてください。
        </p>
        <form onSubmit={handleSubmit} noValidate className={styles.Login__Form}>
          <div className={styles.Login__Email}>
            <input
              type="email"
              value={email}
              id="email"
              name="email"
              autoComplete="email"
              placeholder="メールアドレス"
              onChange={handleEmailChange}
              className={`${styles.Login__Email__Input} ${isEmailError ? styles["Input--Error"] : ""}`}
            />
            {emailErrorMessage && (
              <p className={styles.Input_Error__Message}>{emailErrorMessage}</p>
            )}
          </div>
          <div className={styles.Login__Password}>
            <input
              type="password"
              value={password}
              id="password"
              name="password"
              autoComplete="off"
              placeholder="パスワード（8文字以上）"
              onChange={handlePasswordChange}
              className={`${styles.Login__Password__Input} ${isPasswordError ? styles["Input--Error"] : ""}`}
            />
            {passwordErrorMessage && (
              <p className={styles.Input_Error__Message}>{passwordErrorMessage}</p>
            )}
            {isAuthError && (
              <p className={styles.Input_Error__Message}>
                認証に失敗しました。
                <br />
                メールアドレスまたはパスワードが正しくありません
              </p>
            )}
          </div>
          <button
            type="submit"
            aria-label="認証"
            className={`${styles.Login__SubmitButton} ${isAuthenticating ? styles["Login--Authenticating"] : ""}`}
            disabled={isEmailError || isPasswordError}
          >
            {isAuthenticating ? "認証中..." : "ログイン"}
          </button>
        </form>
      </div>
    </div>
  );
};

Login.displayName = "Login";

export const LoginPage = () => {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
};
