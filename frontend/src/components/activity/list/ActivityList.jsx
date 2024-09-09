"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { AchievementTable } from "@components/activity/list/table";
import { Profile } from "@components/activity/list/profile";
import { ActivityDiary } from "@components/activity/list/diary";
import { scrollToHash } from "@utils/control/scroll";
import { getUrlString } from "@utils/control/query";

import styles from "./ActivityList.module.css";

const ClimbingMap = dynamic(() => import("@components/activity/list/map"), {
  ssr: false,
});

// 登山の活動実績の情報を一覧表示するメインコンポーネント
export const ActivityList = ({
  user_id,
  activityDataList,
  profile,
  achievementList,
  climbingPrefectures,
  mapData,
}) => {
  const TABS_NAME = "tab";
  const pathname = usePathname();
  const initRef = useRef(false);
  const searchParams = useSearchParams();
  const tabInfo = [
    { name: "activities", label: "活動日記", length: activityDataList?.length },

    { name: "achievements", label: "登頂した山", length: achievementList?.length },
  ];
  const firstTabName = tabInfo[0].name;
  const [tabParam, setTabParam] = useState(firstTabName);

  // マウント後にハッシュフラグメントの有無で表示位置をスクロール
  useEffect(() => {
    if (initRef.current) {
      scrollToHash();
    } else {
      initRef.current = true;
    }
  }, [searchParams]);

  // マウント時、ページロードが完了した後にハッシュフラグメントの有無で表示位置をスクロール
  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => {
        scrollToHash();
      }, 100);
    };

    window.addEventListener("load", handleLoad);

    // クリーンアップ処理
    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, []);

  // ページタイトルと説明の設定
  useEffect(() => {
    if (profile) {
      const tab = searchParams.get(TABS_NAME);
      let title;
      let description;

      if (tab === null) {
        title = `活動一覧（${profile.name}）`;
        description = `${profile.name}の登山の活動一覧を表示するページ`;
      } else if (tab === firstTabName) {
        title = `活動日記一覧（${profile.name}）`;
        description = `${profile.name}が登山した日記一覧を表示するページ`;
      } else {
        title = `登頂した山一覧（${profile.name}）`;
        description = `${profile.name}の登頂した山一覧を表示するページ`;
      }

      document.title = title;
      document.querySelector('meta[name="description"]').setAttribute("content", description);
    }
    // クリーンアップ処理
    return () => {};
  }, [profile, searchParams, firstTabName]);

  // クエリパラメータの読み込み/設定処理
  useEffect(() => {
    // タブのクエリパラメータの読み込み処理
    const newTab = searchParams.get(TABS_NAME);
    setTabParam(newTab || firstTabName);

    // クリーンアップ処理
    return () => {};
  }, [searchParams, firstTabName]);

  // タブクリック時のハンドラ関数
  const handleTabClick = (e, tabName) => {
    // デフォルトのリンクの動作をキャンセル;
    e.preventDefault();

    const params = new URLSearchParams();
    params.set("tab", tabName);

    // クエリパラメータを反映したURLの取得
    const urlString = getUrlString(pathname, params);

    // URLを変更し、履歴に追加
    window.history.pushState({}, "", urlString);
    scrollToHash();
  };

  return (
    <>
      <div className={styles.overWriteCSS}>
        <article className={styles.UserId}>
          {/* ヘッダー */}
          <Profile user_id={user_id} />
          {/* タブ */}
          <div className={styles.UsersId__Tab}>
            <ul id="tabs" className={styles.UsersId__Tab__Inner}>
              {tabInfo.map((tab, index) => (
                <li key={index} className={styles.UsersId__Tab__Item}>
                  <Link
                    href="#"
                    onClick={(e) => handleTabClick(e, tab.name)}
                    className={`${styles.UsersId__Tab__Link} ${tab.name === tabParam ? styles["UsersId__Tab__Link--active"] : ""}`}
                  >
                    {tab.label}
                    <span
                      className={styles.UsersId__Tab__Count}
                    >{`${tab.length}${tab.name === firstTabName ? " 件" : " 座"}`}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {/* 検索フィルタ―と活動リスト */}
          <div className={styles.UsersId__Body}>
            <section className={tabParam === firstTabName ? styles.activeTab : styles.inactiveTab}>
              <ActivityDiary user_id={user_id} activityDataList={activityDataList} />
            </section>
          </div>
          <div className={styles.UsersId__Body}>
            <section
              className={tabParam === tabInfo[1].name ? styles.activeTab : styles.inactiveTab}
            >
              <ClimbingMap
                climbingPrefectures={climbingPrefectures}
                mapData={mapData}
                tabState={tabParam === tabInfo[1].name}
              />
              <AchievementTable achievementList={achievementList} />
            </section>
          </div>
        </article>
      </div>
    </>
  );
};
