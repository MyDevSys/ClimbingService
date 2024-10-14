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

## 概要
Climbing Serviceは、登山の活動記録(ルート情報や写真、日記など)を参照、管理、共有するためのシステムです。
資格取得や自主学習で学んだ技術を実践的に応用し、実務レベルのスキルに引き上げることを目的として構築しました。

本プロジェクトでは、UIデザインに関しては効率的な開発を図るために既存の優れたデザインを参考にしており、機能実装や
技術スタックの選定を通じて、より高い実装スキルの習得を目指しました。


## システムの特徴
### 1. SPA として動作し、登山の活動情報をインタラクティブに把握可能
![インタラクティブ操作画面](https://github.com/user-attachments/assets/8ed4cc6d-525f-45b8-942d-6932ff6c2e27)
**図1** : インタラクティブ操作画面

### 2. レスポンシブデザインを採用し、デバイスごとに最適な表示を提供
![レスポンシブデザイン画面](https://github.com/user-attachments/assets/5a7effc0-07dc-4108-9491-e5311b1b30b3)
**図2** : レスポンシブデザイン画面

### 3. クロスブラウザ対応を行い、主要ブラウザで一貫した体験を実現
| ブラウザ  | 対応バージョン |
| --------- | -------------- |
| Chrome    | 127以降         |
| Edge      | 128以降         |
| Firefox   | 129以降         |
| Safari    | 17以降          |

### 4. Gitプッシュで自動テスト・デプロイを行い、迅速に本番環境へ反映するCI/CDを実現
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
    | ユーティリティ    | 日本語形態素解析              | Kuromoji                              |
    |                | ログ出力/管理                | Winston                               |
    | 外部API         | 地図API                    | 国土地理院 地図API(地図描画、位置データ取得)   |

- バックエンド
    | カテゴリ         | 項目                  | 使用技術                               |
    | -------------- | ------------------------- | ------------------------------------ |
    | 言語            | -                         | Python (v3.12)                       |
    | フレームワーク    | -                         | Django (v5.0.7)                      |
    | 開発ツール        | フォーマッター               | Black                                |
    |                | 静的チェック                 | Flake8                               |
    |                | テスト                     | pytest (単体試験)、Playwright (E2E試験)  |
    | ユーティリティ    | CORS設定                   | corsheaders                          |
    |                | 認証                       | simplejwt                            |
    |                | ログ出力/管理                | Python Logger                        |
    |                | 地理空間データ操作            | GeoPandas、Geopy、GeoJSON             |
    | サーバー         | WSGI                      | Gunicorn                             |
    | データーベース    | RDBMS                      | MySQL (v8.0.39)                      |

- フロントエンド / バックエンド共通
    | カテゴリ         | 項目                       | 使用技術                            |
    | -------------- | ------------------------- | --------------------------------- |
    | 開発ツール       | エディタ                    | VSCode                            |
    |                | コード管理                  | GitHub                            |
    | 管理ツール       | プロセス管理                 | PM2                               |
    |                | シークレット管理             | Vault                             |
    |                | シークレット管理             | GitHub Secrets                    |
    | 監視ツール       | システム監視                 | Zabbix                            |
    | サーバー         | リバースプロキシ             | Apache                             |

## システム体験
以下のゲストアカウントにて、システムを体験できます。
- アクセス情報
    | 項目            | パラメータ                      |
    | --------------- | ------------------------- |
    | アクセス先     | [https://climbing-service.com/login](https://climbing-service.com/login)|
    |              |  ![サイトQRコード](https://github.com/user-attachments/assets/06b09144-ebf6-43a3-bc66-bc69babb5768) |
    | ログイン用メールアドレス | `guest@example.com`                  |
    | ログイン用パスワード       | `guest_password`            |

- 推奨ブラウザ
    | ブラウザ  | 対応バージョン |
    | --------- | -------------- |
    | Chrome    | 127以上         |
    | Edge      | 128以上         |
    | Firefox   | 129以上         |
    | Safari    | 17以上         |

- 問い合わせ   
システム体験でご不明な点や不具合があった場合は、[GitHub Issues](https://github.com/MyDevSys/ClimbingService/issues)にて新しいIssueを挙げて、ご質問の詳細をお知らせください。


## ディレクトリ構成
```
ClimbingService
  ├── backend                                         # バックエンドプロジェクトルート
  │     ├── project                                   # プロジェクト系ファイル格納用
  │     ├── climbing                                  # アプリケーション系ファイル格納用
  │     │     ├── fixtures                            # フィクスチャーデータファイル格納用
  │     │     ├── management                          # カスタム管理コマンド格納用
  │     │     └── migrations                          # データベースマイグレーション用
  │     └── logs                                      # バックエンドログファイル格納用
  │
  ├── frontend                                        # フロントエンドプロジェクトルート
  │     ├── logs                                      # フロントエンドログファイル格納用
  │     ├── public                                    # フロントエンドパブリックデータ格納用
  │     └── src                                       # アプリケーション系ファイル格納用
  │           ├── app                                 # App Routerのエントリポイント
  │           │     ├── (fullscreen)
  │           │     │     └── activities
  │           │     │            └── [activity_id]
  │           │     │                   └── tracks    # 全画面表示する登山ルート画面用
  │           │     ├── (records)
  │           │     │     ├── activities
  │           │     │     │     └── [activity_id]
  │           │     │     │            └── articles   # 登山活動詳細画面用
  │           │     │     └── users
  │           │     │           └── [user_id]         # 登山活動リスト画面(ユーザ単位)用
  │           │     ├── login                         # ログイン用
  │           │     │
  │           │     └── api                           # APIのエントリポイント
  │           │          ├── auth
  │           │          │     ├── set-cookie         # set-cookie用API
  │           │          │     └── token
  │           │          │           └── refresh      # アクセストークンの再払い出し用API
  │           │          └── logout                   # ログアウト用API
  │           │     
  │           │
  │           ├── components                          # コンポーネント格納用
  │           │     ├── activity                      
  │           │     │     ├── detail                  # 活動詳細ページの構成コンポーネント格納用
  │           │     │     │     ├── article           # (コンポーネント)活動記事
  │           │     │     │     ├── chart             # (コンポーネント)活動チャート
  │           │     │     │     ├── checkpoint        # (コンポーネント)活動チェックポイント
  │           │     │     │     ├── diary             # (コンポーネント)活動日記
  │           │     │     │     ├── header            # (コンポーネント)活動詳細ヘッダー
  │           │     │     │     ├── map               # (コンポーネント)活動マップ
  │           │     │     │     ├── score             # (コンポーネント)活動スコア
  │           │     │     │     ├── misc              # (コンポーネント)活動その他情報
  │           │     │     │     ├── tab               # (コンポーネント)活動タブ
  │           │     │     │     ├── title             # (コンポーネント)活動タイトル
  │           │     │     │     └── set               # (コンポーネント)フェッチデータセット
  │           │     │     │ 
  │           │     │     ├── list                    # 活動リストの構成コンポーネント格納用
  │           │     │     │     ├── search            # (コンポーネント)オートコンプリート付検索ボックス
  │           │     │     │     ├── calendar          # (コンポーネント)フィルター用カレンダー
  │           │     │     │     ├── checkbox          # (コンポーネント)フィルタ―用チェックボックス
  │           │     │     │     ├── map               # (コンポーネント)フィルタ―用マップ
  │           │     │     │     ├── diary             # (コンポーネント)活動日記リスト
  │           │     │     │     ├── profile           # (コンポーネント)ユーザープロフィール
  │           │     │     │     └── table             # (コンポーネント)登頂済み山情報テーブル
  │           │     │     │ 
  │           │     │     ├── cookie                  # (コンポーネント)cookie設定
  │           │     │     ├── failure                 # (コンポーネント)エラー表示
  │           │     │     ├── header                  # (コンポーネント)ページ共通ヘッダー 
  │           │     │     ├── footer                  # (コンポーネント)ページ共通フッダー
  │           │     │     └── login                   # (コンポーネント)ログイン
  │           │     │
  │           │     ├── buttons                       # (コンポーネント)ボタン
  │           │     ├── icons                         # (コンポーネント)アイコン
  │           │     ├── loading                       # (コンポーネント)ローディング
  │           │     └── recoil                        # (コンポーネント)Recoilプロバイダー
  │           │
  │           ├── data                                # 定数データの格納用
  │           ├── exceptions                          # 例外定義の格納用
  │           ├── state                               # Recoil状態定義の格納用
  │           └── utils                               # ユーティリティ関数の格納用
  │                 ├── control                       # (関数)コントロール系
  │                 ├── convert                       # (関数)変換系
  │                 ├── fetch                         # (関数)フェッチ系
  │                 ├── handler                       # (関数)ハンドル系
  │                 ├── logger                        # (関数)ログ系
  │                 ├── parse                         # (関数)パース系
  │                 ├── style                         # (関数)スタイル系
  │                 └── vault                         # (関数)Vault系
  │  
  ├── tests                                           # E2Eテストファイル格納用
  └── tool                                            # 登山活動ファイルの生成ツール格納用
```

## 設定
### 環境変数一覧
- フロントエンド
    | 英名                     | 和名                | 説明                                                    |
    |-------------------------|--------------------|--------------------------------------------------------|
    | `BACKEND_BASE_URL`      | バックエンドベースURL  | バックエンドにリクエストを送る際のURLの共通部分      |
    | `FRONTEND_BASE_URL`     | フロントエンドベースURL | フロントエンドにリクエストを送る際のURLの共通部分        |
    | `COOKIE_DOMAIN`         | Cookieドメイン       | Cookieを有効にするドメイン                        |
    | `GSI_TILE_URL`          | 地理院タイルURL       | 国土地理院のタイルマップのURL                      |

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
- **全体評価**
    | 指標                        | 活動リスト画面         | 活動詳細画面        |
    | ---------------------------| ------------------- | ---------------- |
    | パフォーマンス                 | 99点 / 85点         | 99点 / 85点      |
    | ユーザー補助                  | 100点 / 100点       | 96点 / 96点       |
    | ベストプラクティス              | 100点 / 100点       | 100点 / 96点     |
    | SEO                        | 100点 / 100点       | 100点 / 100点     |

- **パフォーマンス詳細**
    | 指標                          | 活動リスト画面  | 活動詳細画面 |
    | ---------------------------- | ----------------- | ----------------- |
    | First Contentful Paint       | 0.36秒 / 1.22秒    | 0.42秒 / 0.92秒    |
    | Largest Contentful Paint     | 0.90秒 / 3.74秒    | 0.90秒 / 2.90秒    |
    | Total Blocking Time          | 0.01秒 / 0.23秒    | 0.03秒 / 0.43秒    |
    | Speed Index                  | 1.06秒 / 2.46秒    | 0.84秒 / 2.30秒    |
    | Cumulative Layout Shift      | 0.00 / 0.00       | 0.00 / 0.01       |

    **<スコア値の見方>**  
    ・ スコア値は、「デスクトップで測定したスコア / モバイルで測定したスコア」の形式で表記。

    **<スコア測定条件>**  
    ・ Windows 11上でChrome(v129)のLighthouseで測定。  
    ・ キャッシュや拡張機能などの影響を排除するため、ブラウザはシークレットモードで測定。  
    ・ 5回測定し、その平均点を記載。  

- **パフォーマンスリスクを考慮した設計施策**  
    ・ 静的リソースに対して長期キャッシュを設定し、サーバー負荷を軽減。  
    ・ バージョン番号やハッシュを用いたキャッシュバスティングを適用してリソース変更の即時反映を実現。  
    ・ Next.jsのImageコンポーネントを使用して、画面サイズに応じた画像サイズの自動調整を適用。  
    ・ スクロール時に表示されるリソースに対して遅延読み込みを設定し、初期ロードの負荷を軽減。   
    ・ WebPフォーマットの導入し、画像の軽量化を実施。データ転送量を削減し、ロード時間を短縮。  

- **今後のパフォーマンス改善施策**  
    ・ CDNを導入し、レスポンス速度の改善を図る。(AWSリプレース時にCloudFrontを導入予定)  

## 技術課題と解決アプローチ
- **フロントエンド開発における技術課題と解決アプローチ**  
　フロントエンド開発では、複雑化した状態管理による実装設計の問題から、依存パッケージの特定バージョンで想定通りに動作しないといった外的要因の問題など、多くの課題に直面しました。  
　これらの課題に対して、まずはデバッガを活用して問題の調査を進め、複雑な問題については最小構成のサンプルを作成して発生条件や原因を特定しました。解決手段が見つからない場合は、GitHubやStack Overflowで類似の問題を調査・問い合わせを行い、コミュニティを活用しました。パッケージに起因する課題に対しては、必要に応じて他の類似パッケージを再選定するなど、柔軟な対応を行いました。  
　これらの試行錯誤を重ねた結果、最終的に現在のフロントエンドを構築し、安定した動作を実現することができました。

- **アジャイル開発における課題と解決アプローチ**  
　今回のフロントエンド/バックエンド開発は、アジャイル開発手法を採用し、段階的にソフトウェアを発展させていきました。しかし、ソフトウェアの規模が拡大するにつれて、コードの可読性、メンテナンス性、再利用性の低下という課題に直面しました。
これらの課題に対しては、以下の施策を実施し、解決を図りました。結果、ソフトウェアの規模が拡大しても、効率的な開発と安定した運用を維持することができました。
    - **コンポーネントやユーティリティ関数のモジュール化**  
    機能分割して再利用性を向上。
    - **ディレクトリ構造の整理**  
    プロジェクト全体の構成を整備し、可読性とメンテナンス性を向上。  
    - **フォーマッターの導入**  
    コードの統一を図り、一貫性のある記述を実現。  
    - **状態管理ライブラリの導入**  
    状態管理の一元化によって複雑さを軽減。  
    - **StorybookやSwaggerを用いたドキュメント化**  
    UIやAPIの仕様を明確にして開発効率を向上。

## 今後の予定
今後の施策として、以下を予定しています。

- 登山記録用モバイルアプリの開発  
登山活動をリアルタイムで記録し、そのデータをシステムにアップロードできるモバイルアプリを開発中です。

- 登山記録の追加・編集機能の実装  
ユーザーが柔軟に登山記録を管理できるように、登山記録の追加・編集機能を追加予定です。

- マルチユーザ機能の追加  
登山者同士のコミュニケーションを可能にするため、ユーザー登録機能や登山記録へのコメント機能を実装予定です。

- システムのAWSへのリプレース  
スケーラビリティやパフォーマンス向上のため、現在VPS上で稼働しているシステムをAWSに移行する予定です。