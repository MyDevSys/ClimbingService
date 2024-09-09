"use client";

import Image from "next/image";
import Link from "next/link";
import { useRecoilValue } from "recoil";
import { routePhotosState, activityState } from "@state/atoms";
import { FILE_URL_PATH, URL_PATH } from "@data/constants";

import styles from "./ActivityArticle.module.css";

// 登山の活動詳細の記事を表示するコンポーネント
export const ActivityArticle = ({ activity_id }) => {
  const photos = useRecoilValue(routePhotosState);
  const activity = useRecoilValue(activityState);

  return (
    <section className={styles.ActivitiesId__Section}>
      <div className={styles.ActivitiesId__SectionInner}>
        <div className={styles.ActivitiesId__HeadingWrapper}>
          <h2 className={styles.ActivitiesId__HeadingInline}>活動詳細</h2>
          <Link
            href={URL_PATH.ARTICLE.set(activity_id)}
            className={styles.ActivitiesId__Heading__ReadMore}
          >
            すべて見る
          </Link>
        </div>
        {activity?.activity_article != "" && (
          <div className={styles.ActivitiesId__Description}>
            <p className={`${styles.ActivitiesId__Description__Body} ${styles.LinkableText}`}>
              <span>{activity?.activity_article}</span>
            </p>
          </div>
        )}
        <div className={styles.ActivitiesId__Photos}>
          {photos?.map((item, index) => (
            <figure key={index} className={styles.ActivitiesId__Photo}>
              <Link
                href={`${URL_PATH.ARTICLE.set(activity_id)}#${item.photo_name.split(".")[0]}`}
                className={styles.ActivitiesId__Photo__Link}
              >
                <Image
                  alt={item.photo_comment}
                  src={`${FILE_URL_PATH.ACTIVITY.set(activity_id)}/${item.photo_name}`}
                  className={styles.ActivitiesId__Photo__Image}
                  loading="lazy"
                  sizes="(min-width: 992px) 25%, (min-width: 768px) 33.33%, 33.33%"
                  fill
                />
                <figcaption className={styles.ActivitiesId__Photo__Caption}>
                  {item.photo_comment}
                </figcaption>
              </Link>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
