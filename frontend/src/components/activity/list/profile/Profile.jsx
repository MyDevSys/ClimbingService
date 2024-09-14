"use client";

import Image from "next/image";
import { PremiumIcon } from "@components/icons";
import { FILE_URL_PATH, FILE_NAME } from "@data/constants";
import styles from "./Profile.module.css";
import { useRecoilValue } from "recoil";
import { userProfileState } from "@state/atoms";

// ユーザーのプロフィール情報を表示するコンポーネント
export const Profile = ({ user_id }) => {
  const profile = useRecoilValue(userProfileState);

  return (
    <>
      <header className={styles.UsersId__Head}>
        <div className={styles.ProfileCover}>
          <div
            className={styles.ProfileCover__Image}
            style={{
              backgroundImage: `url(${FILE_URL_PATH.USER.set(user_id)}/${FILE_NAME.BACKGROUND_IMG})`,
            }}
          ></div>
        </div>
        <section className={styles.UsersId__Head__Inner}>
          <div className={styles.UsersId__FaceInfo__Container}>
            <div className={styles.UsersId__FaceInfo}>
              <div
                className={styles.UsersId__FaceInfo__Cover}
                style={{
                  backgroundImage: `url(${FILE_URL_PATH.USER.set(user_id)}/${FILE_NAME.BACKGROUND_IMG})`,
                }}
              >
                <div className={styles.UsersId__FaceInfo__Overlay}></div>
              </div>
              <div className={styles.UsersId__FaceInfo__Wrap}>
                <div className={styles.UsersId__FaceInfo__Icon}>
                  <div
                    className={`${styles.UsersId__FaceInfo__UserIcon} ${styles.UserAvatarImage} ${styles["UserAvatarImage--profile"]}`}
                  >
                    <Image
                      alt={profile?.name ?? ""}
                      src={`${FILE_URL_PATH.USER.set(user_id)}/${FILE_NAME.ICON}`}
                      className={styles.UserAvatarImage__Avatar}
                      width={140}
                      height={140}
                    />
                  </div>
                </div>
                <div className={styles.UsersId__FaceInfo__Name__Wrap}>
                  <h1 className={styles.UsersId__FaceInfo__Name}>{profile?.name}</h1>
                  {profile?.is_paid && (
                    <PremiumIcon className={styles.UsersId__FaceInfo__premiumIcon} />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={styles.UsersId__UserInfo__Container}>
            <div className={styles.UsersId__Info}>
              <div className={styles.UserType}>
                <div className={styles.UserType__Name}>
                  {profile?.is_paid === true && <p>プレミアムユーザー</p>}
                  {profile?.is_paid === false && <p>一般ユーザー</p>}
                </div>
                <div className={styles.UserType__Id}>
                  <p>
                    ユーザーID:
                    <span>{profile?.id}</span>
                  </p>
                </div>
              </div>
              <ul className={styles.UsersId__BasicInfo}>
                {profile?.activity_prefecture.length > 0 && (
                  <li className={styles.UsersId__BasicInfo__Item}>
                    {profile?.activity_prefecture.join("、")}で活動
                  </li>
                )}
                {profile?.birth_year !== null && (
                  <li className={styles.UsersId__BasicInfo__Item}>{profile?.birth_year}年生まれ</li>
                )}
                <li className={styles.UsersId__BasicInfo__Item}>{profile?.gender}</li>
              </ul>
            </div>
          </div>
        </section>
      </header>
    </>
  );
};
