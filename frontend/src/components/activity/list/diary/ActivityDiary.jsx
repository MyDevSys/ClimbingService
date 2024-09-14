"use client";

import dynamic from "next/dynamic";
import React, { useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AutocompleteTextField } from "@components/activity/list/search";
import { Calendar } from "@components/activity/list/calendar";
import { CheckBox } from "@components/activity/list/checkbox";
import {
  PremiumIcon,
  CameraIcon,
  PointIcon,
  WatchIcon,
  DistanceIcon,
  UpIcon,
} from "@components/icons";
import { getPageQueryParams, setPageQueryParams } from "@utils/control/query";
import { FILE_URL_PATH, FILE_NAME, KEYWORD_TYPE, URL_PATH } from "@data/constants";
import { isZoomActivityMapState } from "@state/atoms";
import { useSetRecoilState } from "recoil";

import styles from "./ActivityDiary.module.css";

const Pagination = dynamic(() => import("@mui/material/Pagination"), {
  ssr: false,
});

// 登山の活動日記の一覧と検索フィルタを表示するコンポーネント
export const ActivityDiary = ({ user_id, activityDataList }) => {
  const ITEMS_PER_PAGE = 24;
  const ACTIVITY_TYPES = [
    "登山",
    "山歩",
    "トレイルランニング",
    "ロングトレイル",
    "ハイキング",
    "ウォーキング",
    "サイクリング",
    "沢登り",
    "カヌー",
    "観光",
    "スキー",
    "スノーボード",
    "ロゲイニング",
    "その他",
  ];
  const [keywords, setKeywords] = useState([]);
  const [startAt, setStartAt] = useState(null);
  const [endAt, setEndAt] = useState(null);
  const [monthCheckboxes, setMonthCheckboxes] = useState(Array(12).fill(false));
  const [typeCheckboxes, setTypeCheckboxes] = useState(Array(ACTIVITY_TYPES.length).fill(false));
  const [filteredKeywordList, setFilteredKeywordList] = useState([]);
  const [filteredStartAtList, setFilteredStartAtList] = useState([]);
  const [filteredEndAtList, setFilteredEndAtList] = useState([]);
  const [filteredMonthList, setFilteredMonthList] = useState([]);
  const [filteredTypeList, setFilteredTypeList] = useState([]);
  const [filteredDataList, setFilteredDataList] = useState([]);
  const setIsZoomMap = useSetRecoilState(isZoomActivityMapState);
  const [page, setPage] = useState(1);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filterMessage = useRef(null);

  // クエリパラメータの読み込み/設定処理
  useEffect(() => {
    // ページのクエリパラメータを取得し、その値をページのstateに反映
    const pageQueryValue = getPageQueryParams(searchParams);
    if (pageQueryValue !== null) {
      setPage(Number(pageQueryValue));
    } else {
      setPage(1);
    }

    // クリーンアップ処理
    return () => {};
  }, [searchParams]);

  // 検索キーワードによる活動リストのフィルタリング処理
  useEffect(() => {
    // 活動リストが未設定の場合、処理終了
    if (activityDataList === null) return;

    // 検索キーワードが未指定の処理
    if (keywords.length === 0) {
      // 活動リストの全データをフィルタ―結果として設定
      setFilteredKeywordList(activityDataList);

      // 処理終了
      return;
    }

    // 検索キーワードにしたがって活動リストをフィルタリング
    let filteredData;
    if (keywords.every((keyword) => keyword.type === KEYWORD_TYPE.LOCATION)) {
      filteredData = activityDataList.filter((activity) =>
        keywords.some((keyword) => activity.prefectures.includes(keyword.name)),
      );
    } else if (keywords.every((keyword) => keyword.type === KEYWORD_TYPE.AREA)) {
      filteredData = activityDataList.filter((activity) =>
        keywords.some((keyword) => activity.areas.includes(keyword.name)),
      );
    } else {
      // 検索キーワードが都道府県とエリア情報で構成している場合、フィルタリングの結果は、都道府県とエリアの
      // フィルタ結果の論理積で算出
      const filteredLocation = activityDataList.filter((activity) =>
        keywords.some((keyword) => activity.prefectures.includes(keyword.name)),
      );
      filteredData = filteredLocation.filter((activity) =>
        keywords.some((keyword) => activity.areas.includes(keyword.name)),
      );
    }

    // フィルタリングの結果をstateに保存
    setFilteredKeywordList(filteredData);

    // クリーンアップ処理
    return () => {};
  }, [keywords, activityDataList]);

  // 活動開始日による活動リストのフィルタリング処理
  useEffect(() => {
    // 活動リストが未設定の場合、処理終了
    if (activityDataList === null) return;

    // 活動開始日が未指定の場合の処理
    if (startAt === null) {
      // 活動リストの全データをフィルタ―結果として設定
      setFilteredStartAtList(activityDataList);

      // 処理終了
      return;
    }

    // 活動開始日にしたがって活動リストをフィルタリング
    const filteredData = activityDataList.filter((activity) => {
      const activityStartAt = new Date(activity.start_at);
      return activityStartAt.getTime() >= startAt.getTime();
    });

    // フィルタリングの結果をstateに保存
    setFilteredStartAtList(filteredData);

    // クリーンアップ処理
    return () => {};
  }, [startAt, activityDataList]);

  // 活動終了日による活動リストのフィルタリング処理
  useEffect(() => {
    // 活動リストが未設定の場合、処理終了
    if (activityDataList === null) return;

    // 活動終了日が未指定の場合の処理活動
    if (endAt === null) {
      // 活動リストの全データをフィルタ―結果として設定
      setFilteredEndAtList(activityDataList);

      // 処理終了
      return;
    }

    // 活動終了日にしたがって活動リストをフィルタリング
    const filteredData = activityDataList.filter((activity) => {
      const activityEndAt = new Date(activity.end_at);
      return activityEndAt.getTime() <= endAt.getTime();
    });

    // フィルタリングの結果をstateに保存
    setFilteredEndAtList(filteredData);

    // クリーンアップ処理
    return () => {};
  }, [endAt, activityDataList]);

  // 活動月による活動リストのフィルタリング処理
  useEffect(() => {
    // 活動リストが未設定の場合、処理終了
    if (activityDataList === null) return;

    // 活動月が未指定の場合の処理
    if (isEmptyCheckbox(monthCheckboxes)) {
      // 活動リストの全データをフィルタ―結果として設定
      setFilteredMonthList(activityDataList);

      // 処理終了
      return;
    }

    // チェックを入れた活動月のindexを抽出
    const trueMonth = monthCheckboxes
      .map((isCheck, index) => (isCheck ? index : -1))
      .filter((value) => value !== -1);

    // チェックを入れた活動月にしたがって活動リストをフィルタリング
    const filteredData = activityDataList.filter((item) =>
      trueMonth.some((value) => {
        // 活動開始日と活動終了日が月を跨いだ場合を考慮し、活動開始日と活動終了日で活動月をチェック
        const startAtJudge = new Date(item.start_at).getMonth() === value;
        const endAtJudge = new Date(item.end_at).getMonth() === value;
        return startAtJudge || endAtJudge;
      }),
    );

    // フィルタリングの結果をstateに保存
    setFilteredMonthList(filteredData);

    // クリーンアップ処理
    return () => {};
  }, [monthCheckboxes, activityDataList]);

  // 活動タイプによる活動リストのフィルタリング処理
  useEffect(() => {
    // 活動リストが未設定の場合、処理終了
    if (activityDataList === null) return;

    // 活動タイプが未指定の場合の処理
    if (isEmptyCheckbox(typeCheckboxes)) {
      // 活動リストの全データをフィルタ―結果として設定
      setFilteredTypeList(activityDataList);

      // 処理終了
      return;
    }

    // チェックを入れた活動タイプのindexを抽出
    const trueType = typeCheckboxes
      .map((isCheck, index) => (isCheck ? index : -1))
      .filter((value) => value !== -1);

    // 活動タイプにしたがって活動リストをフィルタリング(ただし、活動タイプの「その他」は除外)
    const filteredData = activityDataList.filter((item) =>
      trueType.some((index) =>
        ACTIVITY_TYPES[index] !== "その他" ? item.tags.includes(ACTIVITY_TYPES[index]) : false,
      ),
    );

    // 活動タイプの「その他」のチェックボックスにチェックを入れた場合、
    // 活動タイプのチェックボックスにない活動タイプの活動リストをフィルタリング
    let filteredDataOther = [];
    if (typeCheckboxes.at(-1) === true) {
      filteredDataOther = activityDataList.filter((item) =>
        item.tags.some((tag) => !ACTIVITY_TYPES.slice(0, -1).includes(tag)),
      );
    }

    // フィルタリングの結果をstateに保存
    setFilteredTypeList([...new Set([...filteredData, ...filteredDataOther])]);

    // クリーンアップ処理
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeCheckboxes, activityDataList]);

  // 各フィルタリング結果の結合処理
  useEffect(() => {
    if (activityDataList === null) return;

    // 各検索フィールドが全て未指定の場合は、活動リストの全データをフィルタ―結果として設定し、処理終了
    if (
      keywords.length === 0 &&
      startAt === null &&
      endAt === null &&
      isEmptyCheckbox(monthCheckboxes) &&
      isEmptyCheckbox(typeCheckboxes)
    ) {
      setFilteredDataList(activityDataList);
      return;
    }

    // 各フィルタリングの結果を論理積で結合
    const filteredData = filteredKeywordList.filter(
      (activity) =>
        filteredStartAtList.some((item) => item.activity_id == activity.activity_id) &&
        filteredEndAtList.some((item) => item.activity_id == activity.activity_id) &&
        filteredMonthList.some((item) => item.activity_id == activity.activity_id) &&
        filteredTypeList.some((item) => item.activity_id == activity.activity_id),
    );

    // フィルタリングの結果、該当項目がない場合のメッセージの設定
    if (filteredData.length === 0) {
      filterMessage.current = "該当する活動日記はありません。";
    } else {
      filterMessage.current = null;
    }

    // 最終のフィルタリング結果をstateに保存
    setFilteredDataList(filteredData);

    // クリーンアップ処理
    return () => {};

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filteredKeywordList,
    filteredStartAtList,
    filteredEndAtList,
    filteredMonthList,
    filteredTypeList,
    activityDataList,
  ]);

  // チェックボックスがチェックされているかどうかを判定する関数
  const isEmptyCheckbox = (checkbox) => {
    return checkbox.every((item) => item === false);
  };

  // 活動詳細リンクのハンドラ関数
  const handleActivityLinkClick = () => {
    setIsZoomMap(true);
  };

  // ユーザーリンクのハンドラ関数
  const handleUserLinkClick = (e, href) => {
    // リンク先が自ページの場合は、ページ先頭に移動しないように設定
    if (pathname === href) {
      e.preventDefault();
    }
  };

  // ページ変更のハンドラ関数
  const handlePageChange = (e, value) => {
    // デフォルトのリンクの動作をキャンセル
    e.preventDefault();

    // stateの更新
    setPage(value);

    // ページのクエリパラメータの設定
    setPageQueryParams(pathname, searchParams, value);
  };

  // ページごとのアイテム数を計算
  const paginatedItems = filteredDataList?.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  return (
    <>
      <div className={styles.UserActivityList__Box}>
        {/* 検索フィルタ― */}
        <div className={styles.ActivityFilter__Box}>
          <aside className={styles.ActivityFilter__Sidebar}>
            <div>
              <div className={styles.ActivityFilter}>
                <div className={styles.ActivityFilter__Container}>
                  <p className={styles.ActivityFilter__Title}>県名・エリア名</p>
                  <AutocompleteTextField
                    activityData={activityDataList}
                    selectedValues={keywords}
                    setSelectedValues={setKeywords}
                    setPage={setPage}
                  />
                </div>
              </div>
              <div className={styles.ActivityFilter}>
                <div className={styles.ActivityFilter__Container}>
                  <p className={styles.ActivityFilter__Title}>活動期間</p>
                  <div className={styles.ActivityFilter__Period__Start}>
                    <span className={styles.ActivityFilter__Period__Label}>開始日</span>
                    <div className={styles.ActivityFilter__Input__Date__wrapper}>
                      <Calendar
                        startAt={startAt}
                        setState={setStartAt}
                        minDate={null}
                        maxDate={endAt}
                        setPage={setPage}
                        className={styles.ActivityFilter__Input}
                      />
                    </div>
                  </div>
                  <div>
                    <span className={styles.ActivityFilter__Period__Label}>終了日</span>
                    <div className={styles.ActivityFilter__Input__Date__wrapper}>
                      <Calendar
                        endAt={endAt}
                        setState={setEndAt}
                        minDate={startAt}
                        maxDate={new Date()}
                        setPage={setPage}
                        className={styles.ActivityFilter__Input}
                        calendarClassName={styles.ActivityFilter__Calendar}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.ActivityFilter}>
                <div className={styles.ActivityFilter__Container}>
                  <p className={styles.ActivityFilter__Title}>月</p>
                  <CheckBox
                    monthCheckboxState={monthCheckboxes}
                    setState={setMonthCheckboxes}
                    labelList={[...Array(12)].map((_, index) => `${index + 1}月`)}
                    labelClassName={styles.ActivityFilter__CheckBox__Label__Month}
                  />
                </div>
              </div>
              <div className={styles.ActivityFilter}>
                <div className={styles.ActivityFilter__Container}>
                  <p className={styles.ActivityFilter__Title}>活動タイプ</p>
                  <CheckBox
                    typeCheckboxState={typeCheckboxes}
                    setState={setTypeCheckboxes}
                    labelList={ACTIVITY_TYPES}
                    labelClassName={styles.ActivityFilter__CheckBox__Label__Type}
                    boxClassName={styles.ActivityFilter__CheckBox__Type}
                  />
                </div>
              </div>
            </div>
          </aside>
        </div>
        {/* 活動リスト */}
        <div className={styles.UserActivityList__Container}>
          <main className={styles.UserActivityList__Main}>
            {paginatedItems?.length === 0 && filterMessage.current !== null && (
              <p className={styles.UserActivityList__FilterMessage}>{filterMessage.current}</p>
            )}
            <ul className={styles.UserActivityList__List}>
              {paginatedItems?.map((item, index) => (
                <>
                  <li key={index} className={styles.UserActivityList__Item}>
                    <article>
                      <Link
                        href={URL_PATH.ACTIVITY.set(item.activity_id)}
                        className={styles.ActivityItem__Thumbnail}
                        onClick={handleActivityLinkClick}
                      >
                        <Image
                          alt={item.title}
                          src={`${FILE_URL_PATH.ACTIVITY.set(item.activity_id)}/${item.cover_photo_name}`}
                          className={styles.ActivityItem__Thumbnail__Img}
                          loading="lazy"
                          sizes="(min-width: 768px) 33.33%"
                          fill
                        ></Image>
                        <div className={styles.ActivityParameter__Container}>
                          <div className={styles.ActivityParameter__Inner}>
                            <div className={styles.ActivityParameter__Top}>
                              <CameraIcon className={styles.ActivityParameter__Top__Icon} />
                              <span className={styles.ActivityParameter__Top__Counter}>
                                {item.total_photos}
                              </span>
                            </div>
                            <div className={styles.ActivityParameter__Top}>
                              <PointIcon className={styles.ActivityParameter__Top__Icon} />
                              <span className={styles.ActivityParameter__Top__Counter}>
                                {item.total_domo_points}
                              </span>
                            </div>
                          </div>
                          <div className={styles.ActivityParameter__Inner}>
                            <div className={styles.ActivityParameter__Bottom}>
                              <div className={styles.ActivityParameter__Bottom__Item}>
                                <WatchIcon className={styles.ActivityParameter__Bottom__Icon} />
                                <span className={styles.ActivityParameter__Bottom__Counter}>
                                  {item.active_time}
                                </span>
                              </div>
                              <div className={styles.ActivityParameter__Bottom__Item}>
                                <DistanceIcon className={styles.ActivityParameter__Bottom__Icon} />
                                <span className={styles.ActivityParameter__Bottom__Counter}>
                                  {`${item.route_distance} km`}
                                </span>
                              </div>
                              <div className={styles.ActivityParameter__Bottom__Item}>
                                <UpIcon className={styles.ActivityParameter__Bottom__Icon} />
                                <span className={styles.ActivityParameter__Bottom__Counter}>
                                  {`${item.ascent_distance} m`}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                      <Link
                        href={URL_PATH.ACTIVITY.set(item.activity_id)}
                        className={styles.ActivityItem__Link}
                        onClick={handleActivityLinkClick}
                      >
                        <h3 className={styles.ActivityItem__Heading}>{item.title}</h3>
                      </Link>
                      <p className={styles.ActivityItem__MapName}>
                        {item.areas.join(", ")}({item.prefectures.join(", ")})
                      </p>
                      <p className={styles.ActivityItem__Meta}>
                        <span className={styles.ActivityItem__Date}>{item.start_at_display}</span>
                        <span className={styles.ActivityItem__Days}>
                          {item.stay_days == 0 ? "日帰り" : item.activity_days + "DAYS"}
                        </span>
                      </p>
                      <div className={styles.ActivityItem__Author}>
                        <Link
                          href={URL_PATH.USER.set(user_id)}
                          className={styles.ActivityItem__User}
                          onClick={(e) => handleUserLinkClick(e, URL_PATH.USER.set(user_id))}
                        >
                          <div className={styles.ActivityItem__Avatar}>
                            <Image
                              alt={item.user_name}
                              src={`${FILE_URL_PATH.USER.set(item.user_id)}/${FILE_NAME.ICON}`}
                              className={styles.RidgeUserAvatarImage__Avatar}
                              height={40}
                              width={40}
                            ></Image>
                          </div>
                          <span className={styles.ActivityItem__UserName}>{item.user_name}</span>
                          {item.is_paid && (
                            <PremiumIcon
                              height={16}
                              width={16}
                              alt="プレミアムユーザー"
                              className={styles.ActivityItem__UserTypeMark}
                            />
                          )}
                        </Link>
                      </div>
                    </article>
                  </li>
                  <span className={styles.Pagination__text}>総計{filteredDataList?.length}件</span>
                </>
              ))}
            </ul>
          </main>
        </div>
      </div>
      <div className={`${styles.Pagination__Container} ${styles.Pagination__Padding}`}>
        {/* <span className={styles.Pagination__text}>総計{filteredDataList?.length}件</span> */}
        <Pagination
          count={Math.max(1, Math.ceil(filteredDataList?.length / ITEMS_PER_PAGE))}
          page={page}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
          size="medium"
        />
      </div>
    </>
  );
};
