"use client";

import { useEffect, useState } from "react";
import { TimerIcon, WalkIcon, NorthEastIcon, SouthEastIcon, HeatIcon } from "@components/icons";

import styles from "./ActivityHeader.module.css";
import { useRecoilValue } from "recoil";
import { activityState } from "@state/atoms";

// 活動詳細ページのヘッダー情報を表示するコンポーネント
export const ActivityHeader = () => {
  const class_list = ["", "", "", "", "ActivityRecord__Calorie"];
  const title_list = ["タイム", "距離", "のぼり", "くだり", "カロリー"];
  const score_unit_list = ["", "km", "m", "m", "kcal"];
  const icon_list = [
    <TimerIcon key="timer" />,
    <WalkIcon key="walk" />,
    <NorthEastIcon key="northEast" />,
    <SouthEastIcon key="southEast" />,
    <HeatIcon key="heat" />,
  ];

  const [score, setScore] = useState([]);
  const activity = useRecoilValue(activityState);

  // ヘッダー情報に表示する数値の取得
  useEffect(() => {
    if (!activity) return;

    const _score = [];
    _score.push(activity.active_time);
    _score.push(activity.route_distance);
    _score.push(activity.ascent_distance);
    _score.push(activity.descent_distance);
    _score.push(activity.calories);
    setScore(_score);

    // クリーンアップ処理
    return () => {};
  }, [activity]);

  return (
    <div className={styles.ActivitiesId__Record}>
      <section className={styles.ActivityRecord__Container}>
        {Array.from({ length: title_list.length }).map((_, i) => (
          <section
            key={i}
            className={`${styles.ActivityRecord__Item} ${class_list[i] ? styles[class_list[i]] : ""}`}
          >
            <h3 className={styles.ActivityRecord__Label}>
              <i className={` ${styles.ActivityRecord__Icon}`}>{icon_list[i]}</i>
              {title_list[i]}
            </h3>
            <p className={styles.ActivityRecord__Score}>
              {score[i]}
              {score_unit_list[i] === "" ? (
                ""
              ) : (
                <span className={styles.ActivityRecord__ScoreUnit}>{score_unit_list[i]}</span>
              )}
            </p>
          </section>
        ))}
      </section>
    </div>
  );
};
