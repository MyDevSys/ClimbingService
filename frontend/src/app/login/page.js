import { LoginPage } from "@components/activity/login";

// ログインページのタイトルと説明の設定
export const metadata = {
  title: "ログイン",
  description: "ログインページ",
};

// ログインページのコンポーネント
export default function Page() {
  return <LoginPage />;
}
