"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isEqual } from "lodash";
import { LoadingIndicator } from "@components/loading";
import clientFetch from "@utils/fetch/client";
import { log } from "@utils/logger/client";
import { URL_PATH } from "@data/constants";

// cookieを設定するためのコンポーネント
export const SetCookie = React.memo(
  ({ children, setCookies }) => {
    const [isLoading, setIsLoading] = useState(setCookies ? true : false);
    const router = useRouter();

    useEffect(() => {
      if (setCookies) {
        // cookieの設定要求関数
        async function apiFetch() {
          try {
            // cookieの設定要求
            await clientFetch.setCookie(setCookies);
            setIsLoading(false);
          } catch (error) {
            // cookieの設定要求でエラーが発生した場合は、ログインページにリダイレクト
            log.error(`${SetCookie.displayName} error (${error.message})`);
            router.push(URL_PATH.LOGIN);
          }
        }

        apiFetch();
      }
    }, [router, setCookies]);

    // cookieの設定要求時のローディング画面の表示
    if (isLoading) {
      return <LoadingIndicator />;
    }

    return <>{children}</>;
  },
  (prevProps, nextProps) => {
    return isEqual(prevProps.setCookies, nextProps.setCookies);
  },
);

SetCookie.displayName = "SetCookie";
