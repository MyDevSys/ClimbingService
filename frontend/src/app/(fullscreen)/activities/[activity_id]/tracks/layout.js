import ActivityLayout from "app/(records)/activities/[activity_id]/layout";

// 登山の活動内容をマップ表示する画面のレイアウトコンポーネント
export default async function ActivityTrackLayout({ children, params }) {
  return <ActivityLayout params={params}>{children}</ActivityLayout>;
}
