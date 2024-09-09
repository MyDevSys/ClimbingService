"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRecoilValue } from "recoil";
import { routePhotosState, activityState } from "@state/atoms";
import { ActivityTitle } from "@components/activity/detail/title";
import { ActivityTab } from "@components/activity/detail/tab";
import { DoMoIcon } from "@components/icons";
import { FILE_URL_PATH, URL_PATH } from "@data/constants";
import { scrollToHash } from "@utils/control/scroll";
import { Breadcrumbs } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

import styles from "./ActivityDiary.module.css";

// 登山の活動日記を表示するコンポーネント
export const ActivityDiary = ({ activity_id }) => {
  const photos = useRecoilValue(routePhotosState);
  const activity = useRecoilValue(activityState);

  const [isoDate, setIsoDate] = useState([]);

  // 写真撮影日時をISO 8601形式に変換(time要素のdatetime属性用)
  useEffect(() => {
    if (!photos) return;
    const _isoDate = photos.map((item) => {
      const dateString = item.date_time.replace(
        /(\d{4})\.(\d{2})\.(\d{2})\(.+\)\s+(\d{2}):(\d{2}):(\d{2})/,
        "$1-$2-$3T$4:$5:$6",
      );

      const date = new Date(dateString + "Z");
      const isoJSTString = date.toISOString().slice(0, 19) + "+09:00";

      return isoJSTString;
    });

    setIsoDate(_isoDate);

    // クリーンアップ処理
    return () => {};
  }, []);

  // ハッシュフラグメントスクロールのイベントハンドラ登録処理
  useEffect(() => {
    // イベントリスナーに登録
    window.addEventListener("hashchange", scrollToHash);

    // 初回レンダリング時に実行
    scrollToHash();

    // クリーンアップ処理
    return () => {
      // イベントリスナーの登録解除
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, []);

  // ページタイトルと説明の設定
  useEffect(() => {
    if (!activity) return;

    document.title = `活動日記（${activity.title}）`;
    document
      .querySelector('meta[name="description"]')
      .setAttribute("content", `${activity.title}の活動日記を表示するページ`);

    // クリーンアップ処理
    return () => {};
  }, [activity]);

  return (
    <article className={styles.ActivityDetailTabLayout__Body}>
      <ActivityTitle activity_id={activity_id} />
      <Breadcrumbs
        aria-label="breadcrumb"
        separator={<NavigateNextIcon fontSize="large" />}
        className={styles.Breadcrumbs}
      >
        <Link href={URL_PATH.USER.set(activity?.user_id)} className={styles.Breadcrumbs__Link}>
          活動一覧
        </Link>
        <span className={styles.Breadcrumbs__Text}>活動日記</span>
      </Breadcrumbs>
      <ActivityTab activity_id={activity_id} />
      <section className={styles.Article__Section}>
        <div className={styles.Article__SectionInner}>
          <main className={`${styles.Article__Container} ${styles.Article__Main}`}>
            <p className={`${styles.Article__Description} ${styles.LinkableText}`}>
              {activity?.activity_article}
            </p>
            <div className={`${styles.ImagesGallery} ${styles.Article__Photos}`}>
              <div className={styles.ImagesGalleryList}>
                {photos?.map((item, index) => (
                  <figure
                    key={index}
                    className={styles.ImagesGalleryList__Item}
                    style={{ paddingTop: `${item.aspect_ratio}%` }}
                  >
                    <Image
                      id={item.photo_name.split(".")[0]}
                      className={styles.ImagesGalleryList__Item__Image}
                      alt={item.photo_comment}
                      src={`${FILE_URL_PATH.ACTIVITY.set(activity_id)}/${item.photo_name}`}
                      sizes="(max-width: 1000px) 100vw, 1000px"
                      fill
                    ></Image>
                    <figcaption className={styles.ImagesGalleryList__Caption}>
                      <div className={styles.ImagesGalleryList__Caption__OnList}>
                        <div className={styles.ImagesGalleryList__Caption__OnList__Info}>
                          <div className={styles.ImagesGalleryList__Caption__OnList__Meta}>
                            <span className={styles.ImagesGalleryList__Caption__OnList__Count}>
                              {index + 1}/{photos?.length}
                            </span>
                            <time
                              dateTime={isoDate[index]}
                              className={styles.ImagesGalleryList__Caption__OnList__Date}
                            >
                              {item.date_time}
                            </time>
                          </div>
                          <div className={styles.ImagesGalleryList__Caption__OnList__Domo}>
                            <span
                              className={`${styles.RidgeIcon} ${styles.DomoActionContainer__DomoIcon}`}
                            >
                              <DoMoIcon className={styles.RidgeIcon__Body} />
                            </span>
                            <span className={styles.ImagesGalleryList__DomoUser}>
                              {item.domo}人
                            </span>
                          </div>
                        </div>
                        <p
                          className={`${styles.ImagesGalleryList__Caption__OnList__Caption} ${styles.LinkableText}`}
                        >
                          <span>{item.photo_comment}</span>
                        </p>
                      </div>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </main>
        </div>
      </section>
    </article>
  );
};
