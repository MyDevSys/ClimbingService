import L from "leaflet";
import iconInfo from "@data/iconFileNames.json";
import { FILE_URL_PATH } from "@data/constants";

// アイコンファイル名の取得関数
const getIconFilenameById = (id) => {
  const icon = iconInfo.icon_filenames.find((icon) => icon.id === id);
  return icon ? `${FILE_URL_PATH.ICON}/${icon.filename}` : null;
};

// 地図に表示するアイコンオブジェクト(leaflet)の取得関数
export const getIcon = (id, hasAnchor = false) => {
  if (hasAnchor) {
    return L.icon({
      iconUrl: getIconFilenameById(id),
      iconSize: [28, 28],
      iconAnchor: [14, 28], // アイコンのアンカー（吹き出しの位置）
    });
  } else {
    return L.icon({
      iconUrl: getIconFilenameById(id),
      iconSize: [20, 20],
    });
  }
};

// ポップアップ用のアイコンオブジェクト(leaflet)の取得関数
export const getPopupIcon = (id) => {
  return L.icon({
    iconUrl: getIconFilenameById(id),
    iconSize: [28, 28],
    iconAnchor: [14, 28], // アイコンのアンカー（吹き出しの位置）
    popupAnchor: [0, -18], // ポップアップのアンカー（吹き出しの位置）
  });
};
