import { ActivityDiary } from "@components/activity/detail/diary";

// 登山日記を表示するコンポーネント
export default function articlePage({ params }) {
  const { activity_id } = params;

  return <ActivityDiary activity_id={activity_id} />;
}
