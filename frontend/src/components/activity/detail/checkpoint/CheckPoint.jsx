"use client";

import Link from "next/link";
import { StartPopup, EndPopup, StayPlaceIcon } from "@components/icons";
import { routeCheckPointState } from "@state/atoms";
import { useRecoilValue } from "recoil";

import styles from "./CheckPoint.module.css";

// 登山活動のチェックポイント情報を表示するコンポーネント
export const CheckPoint = () => {
  const TYPE_START_POINT = 1;
  const TYPE_END_POINT = 2;
  const TYPE_STAY_POINT = 3;
  const TYPE_CHECK_POINT_VALUE_SINGLE = 4;
  const TYPE_CHECK_POINT_VALUE_DOUBLE = 5;

  const checkPointData = useRecoilValue(routeCheckPointState);

  // チェックポイントのリンクのクリックハンドラ関数
  const handleLinkClick = (e) => {
    e.preventDefault();
  };

  return (
    <section className={styles.ActivitiesId__Section}>
      <div className={styles.ActivitiesId__SectionInner}>
        <div className={styles.ActivitiesId__CheckPoints}>
          <h2 className={styles.ActivitiesId__Heading}>チェックポイント</h2>
          <div className={styles.ActivitiesId__CourseTime}>
            <div className={styles.CourseTime}>
              {checkPointData?.day_info.map((data, index) => (
                <div key={index} className={styles.CourseTime__Item}>
                  <div className={styles.CourseTimeItem}>
                    <div className={styles.CourseTimeItem__Header}>
                      <div className={styles.CourseTimeItem__Title}>
                        <span>DAY</span>
                        <span className={styles.CourseTimeItem__Title__Number}>{index + 1}</span>
                      </div>
                      <div className={styles.CourseTimeItem__Total}>
                        <div className={styles.CourseTimeItem__Total__Label}>合計時間</div>
                        <div className={styles.CourseTimeItem__Total__Time}>
                          {data.active_time.hr != 0 && (
                            <>
                              <span className={styles.CourseTimeItem__Total__Number}>
                                {data.active_time.hr}
                              </span>
                              <span className={styles.CourseTimeItem__Total__Unit}>時間</span>
                            </>
                          )}
                          <span className={styles.CourseTimeItem__Total__Number}>
                            {data.active_time.min}
                          </span>
                          <span className={styles.CourseTimeItem__Total__Unit}>分</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.CourseTimeItem__Totals}>
                      <div className={styles.CourseTimeItem__Total}>
                        <div className={styles.CourseTimeItem__Total__Label}>休憩時間</div>
                        <div className={styles.CourseTimeItem__Total__RestTime}>
                          {data.rest_time.hr != 0 && (
                            <>
                              <span className={styles.CourseTimeItem__Total__Number}>
                                {data.rest_time.hr}
                              </span>
                              <span className={styles.CourseTimeItem__Total__Unit}>時間</span>
                            </>
                          )}
                          <span className={styles.CourseTimeItem__Total__Number}>
                            {data.rest_time.min}
                          </span>
                          <span className={styles.CourseTimeItem__Total__Unit}>分</span>
                        </div>
                      </div>
                      <div className={styles.CourseTimeItem__Total}>
                        <div className={styles.CourseTimeItem__Total__Label}>距離</div>
                        <div className={styles.CourseTimeItem__Total__Distance}>
                          <span className={styles.CourseTimeItem__Total__Number}>
                            {data.distance.route.toFixed(1)}
                          </span>
                          <span className={styles.CourseTimeItem__Total__Unit}>km</span>
                        </div>
                      </div>
                      <div className={styles.CourseTimeItem__Total}>
                        <div className={styles.CourseTimeItem__Total__Label}>のぼり / くだり</div>
                        <div className={styles.CourseTimeItem__Total__Cumulative}>
                          <span className={styles.CourseTimeItem__Total__Number}>
                            {data.distance.up.toFixed(0)}
                          </span>
                          <span className={styles.CourseTimeItem__Total__Slash}>/</span>
                          <span className={styles.CourseTimeItem__Total__Number}>
                            {data.distance.down.toFixed(0)}
                          </span>
                          <span className={styles.CourseTimeItem__Total__Unit}>m</span>
                        </div>
                      </div>
                    </div>
                    <div className={styles.CourseTimeItem__Body}>
                      <div className={styles.CourseTimeItem__PassedPoints}>
                        {data.check_point.map((point, index) => (
                          <div key={index} className={styles.CourseTimeItem__PassedPoint}>
                            <div className={styles.CourseTimeItem__PassedPoint__Times}>
                              <div className={styles.CourseTimeItem__PassedPoint__Time}>
                                {point.stay_time[0]}
                              </div>
                              {point.type == TYPE_CHECK_POINT_VALUE_DOUBLE && (
                                <div className={styles.CourseTimeItem__PassedPoint__Time}>
                                  {point.stay_time[1]}
                                </div>
                              )}
                              {point?.next_point_time && (
                                <div className={styles.CourseTimeItem__PassedPoint__TimeDiff}>
                                  {point.next_point_time.hr != 0 && (
                                    <span
                                      data-unit="時間"
                                      className={styles.CourseTimeItem__PassedPoint__TimeDiffValue}
                                    >
                                      {point.next_point_time.hr}
                                    </span>
                                  )}
                                  {point.next_point_time.min != 0 && (
                                    <span
                                      data-unit="分"
                                      className={styles.CourseTimeItem__PassedPoint__TimeDiffValue}
                                    >
                                      {point.next_point_time.min}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            <div className={styles.CourseTimeItem__PassedPoint__StayAt}>
                              {point.type == TYPE_START_POINT && (
                                <StartPopup className={styles.CourseTimeItem__PassedPoint__Icon} />
                              )}
                              {point.type == TYPE_END_POINT && (
                                <EndPopup className={styles.CourseTimeItem__PassedPoint__Icon} />
                              )}
                              {point.type == TYPE_STAY_POINT && (
                                <StayPlaceIcon
                                  className={styles.CourseTimeItem__PassedPoint__Icon}
                                />
                              )}
                              {point.type == TYPE_CHECK_POINT_VALUE_SINGLE && (
                                <>
                                  <div
                                    className={`${styles.CourseTimeItem__PassedPoint__StayingIcon} ${styles["CourseTimeItem__PassedPoint__StayingIcon--single"]}`}
                                  ></div>
                                </>
                              )}
                              {point.type == TYPE_CHECK_POINT_VALUE_DOUBLE && (
                                <>
                                  <div
                                    className={`${styles.CourseTimeItem__PassedPoint__StayingIcon}`}
                                  ></div>
                                </>
                              )}
                            </div>
                            <div className={styles.CourseTimeItem__PassedPoint__NameWrapper}>
                              {point?.spot_name && (
                                <Link
                                  href="#"
                                  className={styles.CourseTimeItem__PassedPoint__Name}
                                  onClick={(e) => handleLinkClick(e)}
                                >
                                  {point.spot_name}
                                  <i
                                    aria-hidden="true"
                                    className={`${styles["Icon--angle-right"]} ${styles.CourseTimeItem__PassedPoint__NameIcon}`}
                                  ></i>
                                </Link>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
