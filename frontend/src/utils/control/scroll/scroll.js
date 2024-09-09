// ハッシュフラグメントに指定した位置にページをスクロールする関数
export const scrollToHash = () => {
  // ハッシュフラグメントが存在する場合
  if (typeof window !== "undefined" && window.location.hash) {
    // ハッシュフラグメントから#を取り除いた文字列を取得
    const hash = window.location.hash.substring(1);
    // 遷移先の要素を取得し、スクロールを実施
    const element = document.getElementById(hash);
    if (element) {
      element.scrollIntoView({ block: "start" });
    }
  }
};
