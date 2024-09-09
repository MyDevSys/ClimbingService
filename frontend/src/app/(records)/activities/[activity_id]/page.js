import { ActivityDetail } from "@components/activity/detail";

// 各登山の活動内容を表示するコンポーネント
export default async function ActivityDetailPage({ params }) {
  const { activity_id } = params;

  return <ActivityDetail activity_id={activity_id} />;
}
