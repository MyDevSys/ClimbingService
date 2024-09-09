import { RecoilProvider } from "@components/recoil";

import "modern-css-reset/src/reset.css";
import "./globals.css";

export const metadata = {
  title: "Loading",
  description: "登山活動ページ",
};

// ルートのレイアウトコンポーネント
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/data/favicon/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/data/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/data/favicon/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/data/favicon/apple-touch-icon.png" />
      </head>
      <body>
        <RecoilProvider>{children}</RecoilProvider>
      </body>
    </html>
  );
}
