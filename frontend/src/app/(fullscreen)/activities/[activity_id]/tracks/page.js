import dynamic from "next/dynamic";

import styles from "./ActivityTrackPage.module.css";

const ActivityMap = dynamic(() => import("@components/activity/detail/map"), {
  ssr: false,
});

// 登山の走行情報を全画面表示するコンポーネント
export default async function ActivityTrackPage({ params }) {
  const { activity_id } = params;

  return <ActivityMap activity_id={activity_id} className={styles.Activity__Map} />;
}
