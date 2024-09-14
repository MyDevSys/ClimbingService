"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { ActivityTitle } from "@components/activity/detail/title/ActivityTitle";
import { ActivityTab } from "@components/activity/detail/tab";
import { ActivityHeader } from "@components/activity/detail/header";
import { ActivityScore } from "@components/activity/detail/score";
import { ActivityMisc } from "@components/activity/detail/misc";
import { ActivityChart } from "@components/activity/detail/chart";
import { ActivityArticle } from "@components/activity/detail/article";
import { CheckPoint } from "@components/activity/detail/checkpoint";
import { useRecoilValue } from "recoil";
import { activityState } from "@state/atoms";

import styles from "./ActivityDetail.module.css";

// import ActivityMap from "@components/activity/detail/map";
const ActivityMap = dynamic(() => import("@components/activity/detail/map"), {
  ssr: false,
});

// 登山の活動詳細を表示するメインコンポーネント
export const ActivityDetail = ({ activity_id }) => {
  const activity = useRecoilValue(activityState);

  // ページのタイトルと説明を変更
  useEffect(() => {
    if (!activity) return;
    document.title = `活動データ（${activity.title}）`;
    document
      .querySelector('meta[name="description"]')
      .setAttribute("content", `${activity.title}の活動データを表示するページ`);

    // クリーンアップ処理
    return () => {};
  }, [activity]);

  return (
    <>
      {activity !== null && (
        <>
          <ActivityTitle activity_id={activity_id} />
          <article className={styles.ActivityDetail__Container}>
            <ActivityTab activity_id={activity_id} />
            <div className={styles.ActivityDetail__Body}>
              <main className={styles.ActivityDetail__Main}>
                <article className={styles.ActivitiesId__Section}>
                  <div className={styles.ActivitiesId__SectionInner}>
                    <h2 id="ActivitiesId__Heading" className={styles.ActivitiesId__Heading}>
                      活動データ
                    </h2>
                    <ActivityHeader />
                    <div className={styles.ActivitiesId__ActivityContainer}>
                      <ActivityScore className={styles.ActivitiesId__FitnessInfo__Container} />
                      <div className={styles.ActivitiesId__Map__Outer}>
                        <div className={styles.ActivitiesId__Map}>
                          <ActivityMap
                            activity_id={activity_id}
                            className={styles.ActivityDetailLeaflet}
                            hasWheelZoom={false}
                            isEnlargedMap={false}
                          />
                        </div>
                      </div>
                      <div className={styles.ActivitiesId__DataDetail}>
                        <ActivityChart className={styles.ActivitiesId__Chart} />
                        <ActivityMisc />
                      </div>
                    </div>
                  </div>
                </article>
                <CheckPoint />
                <ActivityArticle activity_id={activity_id} />
              </main>
            </div>
          </article>
        </>
      )}
    </>
  );
};
