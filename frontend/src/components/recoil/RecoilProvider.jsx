"use client";

import { RecoilRoot } from "recoil";

// Recoilのプロバイダーコンポーネント
export const RecoilProvider = ({ children }) => {
  return <RecoilRoot>{children}</RecoilRoot>;
};
