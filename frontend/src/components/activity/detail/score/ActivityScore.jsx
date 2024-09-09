"use client";

import { useRecoilValue } from "recoil";
import { activityState } from "@state/atoms";
import { HikingIcon, MeterIcon } from "@components/icons";

import styles from "./ActivityScore.module.css";

// 登山の活動情報のスコア情報を表示するコンポーネント
export const ActivityScore = ({ className }) => {
  const activity = useRecoilValue(activityState);

  return (
    <>
      <div className={className}>
        <div className={`${styles.CourseConstant} ${styles.ActivitiesId__FitnessInfo__Top}`}>
          <div className={styles.CourseConstant__Header}>
            <i className={styles.CourseConstant__Icon}>
              <HikingIcon />
            </i>
            <div className={styles.CourseConstant__Header__Text}>
              <h3 className={styles.CourseConstant__Heading}>コース定数</h3>
              <p className={styles.CourseConstant__CalculateBy}>
                標準タイム {activity?.standard_time}で算出
              </p>
            </div>
          </div>
          <div className={styles.CourseConstant__Details}>
            <p className={styles.CourseConstant__DifficultyLevel}>
              {activity?.course_constant_level}
            </p>
            <p className={styles.CourseConstant__Value}>{activity?.course_constant}</p>
          </div>
        </div>

        <div className={`${styles.ActivityPace} ${styles.ActivitiesId__FitnessInfo__Bottom}`}>
          <div className={styles.ActivityPace__Header}>
            <i className={styles.ActivityPace__Icon}>
              <MeterIcon />
            </i>
            <h3 className={styles.ActivityPace__Heading}>平均ペース</h3>
          </div>
          <div className={styles.ActivityPace__Details}>
            <div className={styles.ActivityPace__Values}>
              <p className={styles.ActivityPace__Status}>{activity?.avg_pace_level}</p>
              <p className={styles.ActivityPace__Rate}>
                {activity?.avg_pace_min}
                <span className={styles.ActivityPace__Rate__Range}>~</span>
                {activity?.avg_pace_max}
                <span className={styles.ActivityPace__Unit}>%</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
