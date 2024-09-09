"use client";

import Image from "next/image";
import Link from "next/link";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useRecoilValue } from "recoil";
import { activityState } from "@state/atoms";
import { FILE_NAME, FILE_URL_PATH, URL_PATH } from "@data/constants";
import { PremiumIcon } from "@components/icons";

import styles from "./ActivityTitle.module.css";

// 登山の活動詳細のタイトルを表示するコンポーネント
export const ActivityTitle = ({ activity_id }) => {
  const activity = useRecoilValue(activityState);

  return (
    <div
      className={styles.ActivityDetailTabLayout__Image}
      style={{
        backgroundImage: `url(${FILE_URL_PATH.ACTIVITY.set(activity_id)}/${activity?.cover_photo_name})`,
      }}
    >
      <header className={styles.ActivityDetailTabLayout__Header}>
        <div className={styles.ActivityDetailTabLayout__Header__Inner}>
          <h1 className={styles.ActivityDetailTabLayout__Title}>{activity?.title}</h1>
          <div className={styles.ActivityDetailTabLayout__MapName}>{activity?.areas[0]}</div>
          <div className={styles.ActivityDetailTabLayout__Middle}>
            <span className={styles.ActivityDetailTabLayout__Middle__Date}>
              {activity?.start_at_display}
            </span>
            <span className={styles.ActivityDetailTabLayout__Middle__Days}>
              {activity?.stay_days === 0 ? "日帰り" : `${activity?.activity_days}DAYS`}
            </span>
            <span className={styles.ActivityDetailTabLayout__Middle__Prefecture__Wrapper}>
              <LocationOnIcon className={styles.ActivityDetailTabLayout__Middle__Icon} />
              {activity?.prefectures.join("・")}
            </span>
          </div>
          <div className={styles.ActivityDetailTabLayout__Bottom}>
            <Link
              href={URL_PATH.USER.set(activity?.user_id)}
              className={styles.ActivityDetailTabLayout__User}
            >
              <div className={styles.ActivityDetailTabLayout__UserAvatar}>
                <Image
                  alt={activity?.user_name}
                  src={`${FILE_URL_PATH.USER.set(activity?.user_id)}/${FILE_NAME.ICON}`}
                  className={styles.UserAvatarImage__Avatar}
                  width={32}
                  height={32}
                />
              </div>
              <div className={styles.ActivityDetailTabLayout__UserName}>{activity?.user_name}</div>
              {activity?.is_paid && (
                <PremiumIcon className={styles.ActivityDetailTabLayout__UserTypeMark} />
              )}
            </Link>
          </div>
        </div>
      </header>
    </div>
  );
};
