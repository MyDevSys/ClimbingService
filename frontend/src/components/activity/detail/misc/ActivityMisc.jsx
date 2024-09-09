"use client";

import Link from "next/link";
import { useRecoilValue } from "recoil";
import { activityState, activityFilePathState } from "@state/atoms";
import { MountainIcon, PlanIcon, TagIcon, GPXIcon, HeatIcon } from "@components/icons";
import { GPXDownloadButton } from "@components/buttons";

import styles from "./ActivityMisc.module.css";

// 登山の活動のその他補足情報を表示するコンポーネント
export const ActivityMisc = () => {
  const files = useRecoilValue(activityFilePathState);
  const activity = useRecoilValue(activityState);

  // リンクのハンドラ関数
  const handleLinkClick = (e) => {
    e.preventDefault();
  };

  return (
    <div className={styles.ActivitiesId__Miscs}>
      <div className={`${styles.ActivitiesId__Misc} ${styles.ActivitiesId__MiscCalorie}`}>
        <div className={styles.ActivitiesId__Misc__Label}>
          <span
            className={`material-symbols-outlined ${styles.RidgeIcon} ${styles.ActivitiesId__Misc__Icon}`}
          >
            <HeatIcon />
          </span>
          消費カロリー
        </div>
        <div className={styles.ActivitiesId__Misc__Value}>
          <div className={styles.ActivitiesId__Misc__Calorie}>
            {activity?.calories}
            <span className={styles.ActivitiesId__Misc__ScoreUnit}>kcal</span>
          </div>
        </div>
      </div>

      <div className={styles.ActivitiesId__Misc}>
        <div className={styles.ActivitiesId__Misc__Label}>
          <MountainIcon className={styles.ActivitiesId__Misc__Icon} />
          山の情報
        </div>
        <div className={styles.ActivitiesId__Misc__Value}>
          <div className={styles.ActivitiesId__Misc__MountainName}>
            {activity?.mountains.map((item, index) => (
              <span key={index}>
                <Link
                  href="#"
                  onClick={(e) => handleLinkClick(e)}
                  className={styles.ActivitiesId__Misc__MountainLink}
                >
                  {item}
                </Link>
                {activity?.mountains.length >= 2 && index < activity?.mountains.length - 1 && (
                  <span>・</span>
                )}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.ActivitiesId__Misc}>
        <div className={styles.ActivitiesId__Misc__Label}>
          <PlanIcon className={styles.ActivitiesId__Misc__Icon} />
          {activity?.is_plan_submitted ? "登山計画済み" : "登山計画未実施"}
        </div>
      </div>

      <div className={styles.ActivitiesId__Misc}>
        <div className={styles.ActivitiesId__Misc__Label}>
          <TagIcon className={styles.ActivitiesId__Misc__Icon} />
          タグ
        </div>
        <div className={styles.ActivitiesId__Misc__Value}>
          <ul className={styles.ActivitiesId__Misc__Tags}>
            {activity?.tags.map((item, index) => (
              <li key={index} className={styles.ActivitiesId__Misc__Tag}>
                <Link
                  className={`${styles.RidgeLinkButton} ${styles.ActivitiesId__Misc__TagLink} ${styles["is-size-s"]} ${styles["is-variant-secondary"]}`}
                  href="#"
                  onClick={(e) => handleLinkClick(e)}
                >
                  <div className={styles.RidgeLinkButton__Text}>{item}</div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className={styles.ActivitiesId__Misc}>
        <div className={styles.ActivitiesId__Misc__Label}>
          <GPXIcon className={styles.ActivitiesId__Misc__Icon} />
          GPXデータ
        </div>
        <div className={styles.ActivitiesId__Misc__Value}>
          <GPXDownloadButton gpx_file_path={files?.gpx} />
        </div>
      </div>
    </div>
  );
};
