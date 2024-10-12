# Climbing Service

## 目次
1. [概要](#概要)
1. [システムの特徴](#システムの特徴)
1. [主要技術](#主要技術)
1. [システム体験](#システム体験)
1. [ディレクトリ構成](#ディレクトリ構成)
1. [設定](#設定)
1. [パフォーマンス](#パフォーマンス)
1. [技術課題と解決アプローチ](#技術課題と解決アプローチ)
1. [今後の予定](#今後の予定)
1. [参考](#参考)

## 概要
Climbing Serviceは、登山の活動記録(ルート情報や写真、日記など)を参照、管理、共有するためのシステムです。
資格取得や自主学習で学んだ技術を実践的に応用し、実務レベルのスキルに引き上げることを目的として構築しました。

本プロジェクトでは、UIデザインに関しては効率的な開発を図るために既存の優れたデザインを参考にしており、機能実装や
技術スタックの選定を通じて、より高い実装スキルの習得を目指しました。


## システムの特徴
### SPA として動作し、登山の活動情報をインタラクティブに把握可能
![インタラクティブ操作画面](https://github.com/user-attachments/assets/8ed4cc6d-525f-45b8-942d-6932ff6c2e27)
**図1** : インタラクティブ操作画面

### レスポンシブデザインを採用し、デバイスごとに最適な表示を提供。また、クロスブラウザに対応。
![レスポンシブデザイン画面](https://github.com/user-attachments/assets/5a7effc0-07dc-4108-9491-e5311b1b30b3)
**図2** : レスポンシブデザイン画面

### Gitプッシュで自動テスト・デプロイを行い、迅速に本番環境へ反映するCI/CDを実現
![CI/CDパイプライン構成図](https://github.com/user-attachments/assets/0cb680d0-129b-46f8-9320-ef0280e68252)
**図3** : Climbing ServiceのCI/CDパイプライン構成図


## 主要技術
- フロントエンド
    | カテゴリ         | 項目                       | 使用技術                                |
    | -------------- | ------------------------- | ------------------------------------- |
    | 開発言語         | -                         | JavaScript (ES6+)                     |
    | フレームワーク    | -                         | Next.js (v14.2) ※App Router使用        |
    | UI関連          | 状態管理                    | Recoil                                |
    |                | スタイル                    | CSS Module                            |
    |                | コンポーネント               | React、Material UI                     |
    |                | アイコン                    | Material UI Icons、Google Fonts Icons |
    |                | マップ                     | Leaflet-React                         |
    |                | チャート                    | Chart.js                              |
    | 開発ツール       | フォーマッター                | Prettier                              |
    |                | 静的チェック                 | ESLint                                |
    |                | テスト                     | Jest (単体試験)、Playwright (E2E試験)     |
    | ユーティリティ    | 日本語形態素解析　             | Kuromoji                              |
    |                | ログ出力/管理                | Winston                               |
    | 外部API         | 地図API                    | 国土地理院 地図API(地図描画、位置データ取得)   |


- バックエンド
    | カテゴリ         | 項目                  | 使用技術                               |
    | -------------- | ------------------------- | ------------------------------------ |
    | 言語            | -                         | Python (v3.12)                       |
    | フレームワーク    | -                         | Django (v5.0.7)                      |
    | データーベース    | -                         | MySQL (v8.0.39)                      |
    | サーバー         | WSGI                      | Gunicorn                             |
    | 開発―ル         | フォーマッター               | Black                                |
    |                | 静的チェック                 | Flake8                               |
    |                | テスト                     | pytest (単体試験)、Playwright (E2E試験)  |
    | ユーティリティ    | CORS設定                   | corsheaders                          |
    |                | 認証                       | simplejwt                            |
    |                | ログ出力/管理                | Python Logger                        |
    |                | 地理空間データ操作            | GeoPandas、Geopy、GeoJSON             |
    

- フロントエンド / バックエンド共通
    | カテゴリ         | 項目                       | 使用技術                            |
    | -------------- | ------------------------- | --------------------------------- |
    | 開発ツール　　    | エディタ                    | VSCode                            |
    |                | コード管理                  | GitHub                            |
    | 管理ツール       | プロセス管理                 | PM2                               |
    |                | シークレット管理　            | Vault                             |
    |                | シークレット管理             | GitHub Secrets　　　　　            　|
    | 監視ツール       | システム監視                 | Zabbix                            |
    | サーバー         | リバースプロキシ             | Apache                             |


## システム体験

## ディレクトリ構成

## 設定
### 環境変数一覧
- フロントエンド
    | 英名                     | 和名                | 説明                                                    |
    |-------------------------|--------------------|--------------------------------------------------------|
    | `BACKEND_BASE_URL`      | バックエンドベースURL  | バックエンドのベースURL                        |
    | `FRONTEND_BASE_URL`　   | フロントエンドベースURL | フロントエンドのベースURL                         |
    | `COOKIE_DOMAIN`         | Cookieドメイン       | Cookieを有効にするドメイン                        |
    | `GSI_TILE_URL`          | 地理院タイルURL       | 国土地理院のタイルマップのURL            　　　　　　　|


- バックエンド
    | 英名                     | 和名                | 説明                                                    |
    |-------------------------|--------------------|--------------------------------------------------------|
    | `ALLOWED_HOSTS`         | 許可ホスト           | アクセス許可するホスト名                           |
    | `COOKIE_DOMAIN`         | クッキードメイン       | Cookieを有効にするドメイン                        |
    | `CORS_ALLOWED_ORIGINS`  | CORS許可オリジン      | CORSでアクセスを許可するオリジン（ドメイン）           |
    | `CSRF_TRUSTED_ORIGINS`  | CSRF信頼済みオリジン   | CSRF保護が信頼するオリジン（ドメイン）               |
    | `DB_HOST`               | データベースホスト     | 接続するデータベースのホスト名                       |
    | `DB_NAME`               | データベース名        | 使用するデータベース名                             |
    | `DB_PASSWORD`           | データベースパスワード  | データベース接続用のパスワード                       |
    | `DB_PORT`               | データベースポート     | データベース接続に使用するポート番号                  |
    | `DB_USER`               | データベースユーザー    | データベース接続に使用するユーザー名                  |
    | `DEBUG`                 | デバッグモード        | デバッグモードの有効/無効（True/False）             |
    | `SECRET_KEY`            | シークレットキー       | Djangoアプリケーションのシークレットキー             |


## パフォーマンス

## 技術課題と解決アプローチ

## 今後の予定

## 参考
