"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  DoMoIcon,
  CreateIcon,
  BellIcon,
  SearchIcon,
  PremiumIcon,
  DiaryIcon,
  MenuIcon,
  LogoutIcon,
  CloseIcon,
} from "@components/icons";
import { FILE_URL_PATH, API_URL_PATH, FILE_NAME, URL_PATH } from "@data/constants";
import clientFetch from "@utils/fetch/client";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import { Drawer, List, ListItem, ListItemButton } from "@mui/material";
import { useSetRecoilState } from "recoil";
import { userProfileState } from "@state/atoms";
import { log } from "@utils/logger/client";

import styles from "./Header.module.css";
import "./Header.global.css";

// アバターアイコンを表示するコンポーネント
const AvatarIcon = ({ user_id, profile }) => {
  return (
    <>
      <Image
        alt={profile.name}
        src={`${FILE_URL_PATH.USER.set(user_id)}/${FILE_NAME.ICON}`}
        className={styles.ContentHeader__Navigation__Avatar}
        height={40}
        width={40}
      ></Image>
      {profile.is_paid && <PremiumIcon className={styles.Avatar__Premium__Icon} />}
    </>
  );
};

// ページのヘッダーを表示するコンポーネント
export const Header = ({ user_id, profile }) => {
  const setProfile = useSetRecoilState(userProfileState);
  const [anchorAccountMenu, setAnchorAccountMenu] = useState(null);
  const [isDrawerMenuOpen, setIsDrawerMenuOpen] = useState(false);
  const isAccountMenuOpen = Boolean(anchorAccountMenu);
  const router = useRouter();

  // propsで受けたユーザーのプロファイル情報をstateに保存
  useEffect(() => {
    if (profile) {
      setProfile(profile);
    }

    // クリーンアップ処理
    return () => {};
  }, [profile, setProfile]);

  // Domoポイントボタンのハンドラ関数
  const handleDomoPoint = (e) => {
    e.preventDefault();
  };

  // コンテンツ作成ボタンのハンドラ関数
  const handleCreateContentsMenu = () => {};

  // 通知ボタンのハンドラ関数
  const handleNotification = () => {};

  // 検索ボタンのハンドラ関数
  const handleSearch = () => {};

  // 活動日記ボタンのハンドラ関数
  const handleCreateDiary = () => {};

  // アカウントメニューボタンのハンドラ関数
  const handleAccountMenu = (event) => {
    setAnchorAccountMenu(event.currentTarget);
  };

  // マイページボタンのハンドラ関数
  const handleMyPage = () => {
    setAnchorAccountMenu(null);
    setIsDrawerMenuOpen(false);

    // 登山の活動リストページに遷移
    router.push(URL_PATH.USER.set(user_id));
  };

  // ログアウトボタンのハンドラ関数
  const handleLogout = async () => {
    try {
      // ログアウトAPIのコール
      await clientFetch.fetchWithTokenRetry([() => clientFetch.post(API_URL_PATH.LOGOUT)]);

      setAnchorAccountMenu(null);
      setIsDrawerMenuOpen(false);
    } catch (error) {
      log.error(`${Header.name} error (${error.message})`);
    } finally {
      // ログインページに遷移
      router.push(URL_PATH.LOGIN);
    }
  };

  // クローズボタンのハンドラ関数
  const handleClose = () => {
    setAnchorAccountMenu(null);
  };

  // ドロワーのトグル関数
  const toggleDrawer = (newOpen) => () => {
    setIsDrawerMenuOpen(newOpen);
  };

  return (
    <>
      <header id="ActivitySiteHeader" className={styles.ContentHeader}>
        <div className={styles.ContentHeader__Inner}>
          <div className={styles.ContentHeader__ContentWrapper}>
            <div className={`${styles.ContentHeader__Item} `}>
              <nav>
                <ul className={styles.ContentHeader__Navigation}>
                  <li className={styles.ContentHeader__Navigation__Item}>
                    <div className={styles.DomoPoint}>
                      <Link
                        href="#"
                        className={styles.DomoAvailableAmountBadge}
                        onClick={handleDomoPoint}
                      >
                        <DoMoIcon filled className={styles.DomoAvailableAmountBadge__Icon} />
                        <span className={styles.DomoAvailableAmountBadge__Amount}>
                          {profile.domo_points}
                        </span>
                      </Link>
                    </div>
                  </li>
                  <li
                    className={`${styles.ContentHeader__Navigation__Item} ${styles["ContentHeader__Item--pc"]}`}
                  >
                    <div className={styles.CreateContentsMenu__Container}>
                      <button
                        aria-label="作成"
                        onClick={handleCreateContentsMenu}
                        className={styles.ContentHeader__Navigation__Button}
                      >
                        <CreateIcon className={styles.ContentHeader__Navigation__Icon} />
                      </button>
                    </div>
                  </li>
                  <li
                    className={`${styles.ContentHeader__Navigation__Item} ${styles["ContentHeader__Item--pc"]}`}
                  >
                    <div className={styles.Notification__Container}>
                      <button
                        aria-label="通知"
                        onClick={handleNotification}
                        className={styles.ContentHeader__Navigation__Button}
                      >
                        <BellIcon className={styles.ContentHeader__Navigation__Icon} />
                      </button>
                    </div>
                  </li>
                  <li className={styles.ContentHeader__Navigation__Item}>
                    <div className={styles.Search__Container}>
                      <button
                        aria-label="検索"
                        onClick={handleSearch}
                        className={styles.ContentHeader__Navigation__Button}
                      >
                        <SearchIcon className={styles.ContentHeader__Navigation__Icon} />
                      </button>
                    </div>
                  </li>
                  <li
                    className={`${styles.ContentHeader__Navigation__Item} ${styles["ContentHeader__Item--pc"]}`}
                  >
                    <div className={styles.AccountMenu__Container}>
                      <button
                        aria-label="アカウント"
                        onClick={handleAccountMenu}
                        className={styles.ContentHeader__Navigation__Avatar__Button}
                      >
                        <AvatarIcon user_id={user_id} profile={profile} />
                      </button>
                    </div>
                  </li>
                  <li
                    className={`${styles.ContentHeader__Navigation__Item} ${styles["ContentHeader__Item--mb"]}`}
                  >
                    <div className={styles.AccountMenu__Container}>
                      <button
                        aria-label="アカウント"
                        onClick={toggleDrawer(true)}
                        className={styles.ContentHeader__Navigation__Button}
                      >
                        <MenuIcon className={styles.ContentHeader__Navigation__Icon} />
                      </button>
                    </div>
                  </li>
                </ul>
              </nav>
              <Menu
                classes={{ paper: styles.AccountMenu }}
                anchorEl={anchorAccountMenu}
                open={isAccountMenuOpen}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                MenuListProps={{
                  className: styles.AccountMenu__List,
                }}
              >
                <MenuItem onClick={handleMyPage} disableRipple className={styles.AccountMenu__item}>
                  <ListItemIcon>
                    <div className={styles.Avatar__Icon__Container}>
                      <AvatarIcon user_id={user_id} profile={profile} />
                    </div>
                  </ListItemIcon>
                  <div className={styles.Avatar__Title__Container}>
                    <span className={styles.Avatar__NickName}>{profile.name}</span>
                    <span className={styles.Avatar__SubTitle}>マイページを表示</span>
                  </div>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} disableRipple className={styles.AccountMenu__item}>
                  <ListItemIcon>
                    <LogoutIcon className={styles.AccountMenu__Icon} />
                  </ListItemIcon>
                  <span className={styles.AccountMenu__Title}>ログアウト</span>
                </MenuItem>
              </Menu>
              <Drawer
                id="drawerMenu"
                anchor="right"
                open={isDrawerMenuOpen}
                onClose={toggleDrawer(false)}
                classes={{ paper: styles.DrawerPaper }}
              >
                <List className={styles.DrawerMenu__List}>
                  <ListItem disablePadding className={styles.DrawerMenu__CloseButton__ListItem}>
                    <button
                      aria-label="メニュー"
                      onClick={toggleDrawer(false)}
                      className={styles.DrawerMenu__CloseButton}
                    >
                      <CloseIcon className={styles.DrawerMenu__CloseButton__Icon} />
                    </button>
                  </ListItem>
                  <Divider className={styles.DrawerMenu__Divider} />
                  <ListItem disablePadding className={styles.DrawerMenu__ListItem}>
                    <ListItemButton
                      disableRipple
                      onClick={handleMyPage}
                      className={styles.DrawerMenu__Button}
                    >
                      <ListItemIcon>
                        <div className={styles.Avatar__Icon__Container}>
                          <AvatarIcon user_id={user_id} profile={profile} />
                        </div>
                      </ListItemIcon>
                      <div className={styles.Avatar__Title__Container}>
                        <span className={styles.Avatar__NickName}>{profile.name}</span>
                        <span className={styles.Avatar__SubTitle}>マイページを表示</span>
                      </div>
                    </ListItemButton>
                  </ListItem>
                  <Divider className={styles.DrawerMenu__Divider} />
                  <ListItem disablePadding className={styles.DrawerMenu__ListItem}>
                    <ListItemButton
                      disableRipple
                      onClick={handleCreateDiary}
                      className={styles.DrawerMenu__Button}
                    >
                      <ListItemIcon>
                        <DiaryIcon className={styles.DrawerMenu__Icon} />
                      </ListItemIcon>
                      <span className={styles.DrawerMenu__Title}>活動日記の作成</span>
                    </ListItemButton>
                  </ListItem>
                  <ListItem disablePadding className={styles.DrawerMenu__ListItem}>
                    <ListItemButton
                      disableRipple
                      onClick={handleNotification}
                      className={styles.DrawerMenu__Button}
                    >
                      <ListItemIcon>
                        <BellIcon className={styles.DrawerMenu__Icon} />
                      </ListItemIcon>
                      <span className={styles.DrawerMenu__Title}>お知らせ</span>
                    </ListItemButton>
                  </ListItem>
                  <Divider className={styles.DrawerMenu__Divider} />
                  <ListItem disablePadding className={styles.DrawerMenu__ListItem}>
                    <ListItemButton
                      disableRipple
                      onClick={handleLogout}
                      className={styles.DrawerMenu__Button}
                    >
                      <ListItemIcon>
                        <LogoutIcon className={styles.DrawerMenu__Logout__Icon} />
                      </ListItemIcon>
                      <span className={styles.DrawerMenu__Title}>ログアウト</span>
                    </ListItemButton>
                  </ListItem>
                </List>
              </Drawer>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
