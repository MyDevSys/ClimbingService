"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { URL_PATH } from "@data/constants";

import styles from "./ActivityTab.module.css";

// 登山の活動詳細と活動日記を切り換えるタブを表示するコンポーネント
export const ActivityTab = ({ activity_id }) => {
  const pathname = usePathname();

  // 登山の活動詳細と活動日記にURLパスを取得
  const href_data = URL_PATH.ACTIVITY.set(activity_id);
  const href_diary = URL_PATH.ARTICLE.set(activity_id);

  // 現在のURLパスがどちらを表示しているかを判定
  const isActive_data = pathname === href_data;
  const isActive_diary = pathname === href_diary;

  return (
    <div className={styles.ActivityDetail__Tab}>
      <Link
        className={`${styles.ActivityDetail__TabItem} ${isActive_data ? "is-active" : ""}`}
        href={href_data}
        scroll={false}
      >
        活動データ
      </Link>
      <Link
        className={`${styles.ActivityDetail__TabItem} ${isActive_diary ? "is-active" : ""}`}
        href={href_diary}
        scroll={false}
      >
        日記
      </Link>
    </div>
  );
};
