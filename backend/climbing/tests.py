from django.test import TestCase
from rest_framework.test import APIClient
from django.urls import reverse
from django.conf import settings
from types import SimpleNamespace
import json


class UserAuthenticationTest(TestCase):
    fixtures = [
        "test/gender_master.json",
        "test/prefecture_master.json",
        "test/plan_master.json",
        "test/tag_master.json",
        "test/area_master.json",
        "test/avg_pace_level_master.json",
        "test/course_constant_level_master.json",
        "test/mountain_master.json",
        "test/mountain_prefecture.json",
        "test/user.json",
        "test/user_activity_prefecture.json",
        "test/contract.json",
        "test/activity.json",
        "test/activity_tag.json",
        "test/activity_prefecture.json",
        "test/activity_area.json",
        "test/activity_photo.json",
        "test/activity_mountain.json",
    ]

    def setUp(self):
        # テスト用クライアントのセットアップ
        self.client = APIClient()
        self.valid_user_data = {
            "email": "test@example.com",
            "password": "test1234",
        }
        self.invalid_user_data = {
            "email": "test@example.com",
            "password": "test12345",
        }

    def get_csrf_token(self):
        """CSRFトークンを取得する"""

        # CSRFトークンのGETリクエストを送信
        response = self.client.get(reverse("csrf_token"))

        csrf_cookie = response.cookies.get("csrftoken")

        result = SimpleNamespace(
            status_code=response.status_code,
            csrf_cookie=csrf_cookie.value if csrf_cookie else None,
            csrf_response=response.json().get("CSRF_Token"),
        )

        return result

    def login_user(self, user_data):
        """ログイン認証を行う"""

        # CSRFトークンの取得
        csrf_result = self.get_csrf_token()

        # CSRFトークンを含めて認証リクエストを送信
        login_result = self.client.post(
            reverse("token_obtain_pair"),
            data=json.dumps(user_data),
            content_type="application/json",
            HTTP_X_CSRFTOKEN=csrf_result.csrf_response,
            HTTP_COOKIE=f"csrftoken={csrf_result.csrf_cookie}",
        )

        login_result_json = login_result.json()
        user_id_cookie = login_result.cookies.get(settings.SIMPLE_JWT["USER_ID_COOKIE"])
        access_token_cookie = login_result.cookies.get(settings.SIMPLE_JWT["AUTH_COOKIE"])
        refresh_token_cookie = login_result.cookies.get(settings.SIMPLE_JWT["REFRESH_COOKIE"])

        result = SimpleNamespace(
            status_code=login_result.status_code,
            message=login_result_json.get("message"),
            user_id_response=login_result_json.get("user_id"),
            csrf_response=csrf_result.csrf_response,
            csrf_cookie=csrf_result.csrf_cookie,
            user_id_cookie=user_id_cookie.value if user_id_cookie else None,
            access_token_cookie=access_token_cookie.value if access_token_cookie else None,
            refresh_token_cookie=refresh_token_cookie.value if refresh_token_cookie else None,
        )

        return result

    def token_refresh(self, user_data, isValid=True):
        """リフレッシュトークンでアクセストークンを払い出す"""

        # ログイン認証を送信
        login_result = self.login_user(user_data)

        if isValid:
            post_data = {"refresh": login_result.refresh_token_cookie}
        else:
            post_data = {"refresh": login_result.refresh_token_cookie + "test"}

        # アクセストークンを払い出し要求を送信
        refresh_result = self.client.post(
            reverse("token_refresh"),
            data=json.dumps(post_data),
            content_type="application/json",
            HTTP_X_CSRFTOKEN=login_result.csrf_response,
            HTTP_COOKIE=f"csrftoken={login_result.csrf_cookie} refresh_token={login_result.refresh_token_cookie}",
        )

        refresh_result_json = refresh_result.json()
        user_id_cookie = refresh_result.cookies.get(settings.SIMPLE_JWT["USER_ID_COOKIE"])
        access_token_cookie = refresh_result.cookies.get(settings.SIMPLE_JWT["AUTH_COOKIE"])
        refresh_token_cookie = refresh_result.cookies.get(settings.SIMPLE_JWT["REFRESH_COOKIE"])

        result = SimpleNamespace(
            status_code=refresh_result.status_code,
            message=refresh_result_json.get("message"),
            access_token_response=refresh_result_json.get("access_token"),
            csrf_response=login_result.csrf_response,
            csrf_cookie=login_result.csrf_cookie,
            user_id_cookie=user_id_cookie.value if user_id_cookie else None,
            access_token_cookie=access_token_cookie.value if access_token_cookie else None,
            refresh_token_cookie=refresh_token_cookie.value if refresh_token_cookie else None,
        )

        return result

    def test_csrf_token_view(self):
        """CSRFトークンが正しく払い出され、Cookieとレスポンスで値が異なることを確認する"""

        # CSRFトークンを取得
        result = self.get_csrf_token()

        with self.subTest("チェック1"):
            # ステータスコード200を確認
            self.assertEqual(result.status_code, 200)

        with self.subTest("チェック2"):
            # Set-CookieヘッダーにCSRFトークンが存在することを確認
            self.assertIsNotNone(result.csrf_cookie)

        with self.subTest("チェック3"):
            # CSRFトークンが一致していないことを確認
            self.assertNotEqual(result.csrf_cookie, result.csrf_response)

    def test_user_authentication_with_valid_csrf(self):
        """有効なユーザー情報で認証リクエストが成功することを確認"""

        # ログイン認証を送信
        result = self.login_user(self.valid_user_data)

        with self.subTest("チェック1"):
            # ステータスコード200を確認
            self.assertEqual(result.status_code, 200)

        with self.subTest("チェック2"):
            # 認証成功時のメッセージを確認
            self.assertEqual(result.message, "Authentication successful")

        with self.subTest("チェック3"):
            # レスポンスのユーザーIDが0001であることを確認
            self.assertEqual(result.user_id_response, "0001")

        with self.subTest("チェック4"):
            # CookieにユーザーIDが存在することを確認
            self.assertIsNotNone(result.user_id_cookie)

        with self.subTest("チェック5"):
            # Cookieにaccessトークンが存在することを確認
            self.assertIsNotNone(result.access_token_cookie)

        with self.subTest("チェック6"):
            # Cookieにrefreshトークンが存在することを確認
            self.assertIsNotNone(result.refresh_token_cookie)

        with self.subTest("チェック7"):
            # レスポンスとCookieのユーザーIDが等しいことを確認
            self.assertEqual(result.user_id_response, result.user_id_cookie)

    def test_user_authentication_with_invalid_user(self):
        """無効なユーザー情報で認証リクエストが失敗することを確認"""

        # ログイン認証を送信
        result = self.login_user(self.invalid_user_data)

        with self.subTest("チェック1"):
            # ステータスコード401を確認
            self.assertEqual(result.status_code, 401)

    def test_access_token_issued_with_valid_refresh_token(self):
        """有効なRefreshトークンでAccessトークンが払い出されることを確認"""

        result = self.token_refresh(self.valid_user_data, isValid=True)

        with self.subTest("チェック1"):
            # ステータスコード200を確認
            self.assertEqual(result.status_code, 200)

        with self.subTest("チェック2"):
            # 払い出し成功時のメッセージを確認
            self.assertEqual(result.message, "Token refresh successful")

        with self.subTest("チェック3"):
            # レスポンスにaccessトークンが存在することを確認
            self.assertIsNotNone(result.access_token_response)

        with self.subTest("チェック4"):
            # CookieにユーザーIDが存在することを確認
            self.assertIsNotNone(result.user_id_cookie)

        with self.subTest("チェック5"):
            # Cookieにaccessトークンが存在することを確認
            self.assertIsNotNone(result.access_token_cookie)

        with self.subTest("チェック6"):
            # Cookieにrefreshトークンが存在することを確認
            self.assertIsNotNone(result.refresh_token_cookie)

        with self.subTest("チェック7"):
            # レスポンスとCookieのaccessトークンが等しいことを確認
            self.assertEqual(result.access_token_response, result.access_token_cookie)

    def test_access_token_issued_with_invalid_refresh_token(self):
        """無効なRefreshトークンでAccessトークンが払い出されず、Loginページにリダイレクトされることを確認"""

        result = self.token_refresh(self.valid_user_data, isValid=False)

        with self.subTest("チェック1"):
            # ステータスコード401を確認
            self.assertEqual(result.status_code, 401)

        with self.subTest("チェック2"):
            # CookieにユーザーIDが存在しないことを確認
            self.assertIsNone(result.user_id_cookie)

        with self.subTest("チェック3"):
            # Cookieにaccessトークンが存在しないことを確認
            self.assertIsNone(result.access_token_cookie)

        with self.subTest("チェック4"):
            # Cookieにrefreshトークンが存在しないことを確認
            self.assertIsNone(result.refresh_token_cookie)

    def test_get_activity_list_with_valid_access_token(self):
        """有効なAccessトークンで登山の活動リストを取得できることを確認"""

        # ログイン認証を送信
        login_result = self.login_user(self.valid_user_data)

        # リクエストURLの作成
        url = reverse("activity-list", kwargs={"user_id": login_result.user_id_cookie})

        # 登山の活動リストのGETリクエストを送信
        activity_list_result = self.client.get(
            url,
            HTTP_AUTHORIZATION=f"Bearer {login_result.access_token_cookie}",
        )

        with self.subTest("チェック1"):
            # ステータスコード200を確認
            self.assertEqual(activity_list_result.status_code, 200)

        # レスポンスデータをJSON形式で取得
        activity_data = activity_list_result.json()

        with self.subTest("チェック2"):
            # 登山の活動リストの件数を確認
            self.assertEqual(len(activity_data), 27)

        # 1番目の活動リストデータの想定値
        expected_data_1th = {
            "activity_id": "0001",
            "user_id": "0001",
            "user_name": "テスト太郎",
            "is_paid": True,
            "start_at": "2022-02-25",
            "end_at": "2022-02-25",
            "start_at_display": "2022.02.25(金)",
            "active_time": "07:31",
            "route_distance": 18.4,
            "title": "天拝山・奥天拝",
            "stay_days": 0,
            "activity_days": 1,
            "is_plan_submitted": True,
            "ascent_distance": 890,
            "total_domo_points": 11,
            "total_photos": 4,
            "cover_photo_name": "photo_0001_01_1722765280.webp",
            "prefectures": ["福岡", "佐賀"],
            "areas": ["天拝山・基山"],
            "tags": ["登山", "低山"],
        }

        expected_data_27th = {
            "activity_id": "0027",
            "user_id": "0001",
            "user_name": "テスト太郎",
            "is_paid": True,
            "start_at": "2023-12-29",
            "end_at": "2023-12-29",
            "start_at_display": "2023.12.29(金)",
            "active_time": "05:03",
            "route_distance": 5.9,
            "title": "宝満山",
            "stay_days": 0,
            "activity_days": 1,
            "is_plan_submitted": True,
            "ascent_distance": 710,
            "total_domo_points": 11,
            "total_photos": 3,
            "cover_photo_name": "photo_0027_03_1722765280.webp",
            "prefectures": ["福岡"],
            "areas": ["宝満山・三郡山・若杉山"],
            "tags": ["登山", "低山"],
        }
        with self.subTest("チェック3"):
            # 1番目の活動リストデータが想定値と一致することを確認
            self.assertDictEqual(activity_data[len(activity_data) - 1], expected_data_1th)

        with self.subTest("チェック4"):
            # 最個の活動リストデータが想定値と一致することを確認
            self.assertDictEqual(activity_data[0], expected_data_27th)

    def test_get_activity_detail_with_valid_access_token(self):
        """有効なAccessトークンで登山の詳細情報を取得できることを確認"""

        # ログイン認証を送信
        login_result = self.login_user(self.valid_user_data)

        # リクエストURLの作成
        url = reverse("activity-detail", kwargs={"activity_id": "0001"})

        # 登山の活動詳細のGETリクエストを送信
        activity_detail_result = self.client.get(
            url,
            HTTP_AUTHORIZATION=f"Bearer {login_result.access_token_cookie}",
        )

        with self.subTest("チェック1"):
            # ステータスコード200を確認
            self.assertEqual(activity_detail_result.status_code, 200)

        # レスポンスデータをJSON形式で取得
        activity_detail = activity_detail_result.json()

        # 1番目の活動リストデータの想定値
        expected_data_1th = {
            "activity_id": "0001",
            "user_id": "0001",
            "user_name": "テスト太郎",
            "is_paid": True,
            "start_at": "2022-02-25",
            "end_at": "2022-02-25",
            "start_at_display": "2022.02.25(金)",
            "course_constant_level": "きつい",
            "active_time": "07:31",
            "route_distance": 18.4,
            "standard_time": "07:15",
            "avg_pace_min": 130,
            "avg_pace_max": 150,
            "avg_pace_level": "速い",
            "title": "天拝山・奥天拝",
            "stay_days": 0,
            "activity_days": 1,
            "is_plan_submitted": True,
            "ascent_distance": 890,
            "descent_distance": 893,
            "course_constant": 25,
            "calories": 2088,
            "activity_article": "天拝山は、福岡県筑紫野市に位置する標高257mの山。手軽に登れる初心者向けの山として人気。この山の名は、平安時代、昌泰の変で大宰府に左遷された菅原道真が何度も登って「自身の無実を天に拝んだ」という伝承に由来する。登山口は天拝山歴史自然公園の利用が多い。この公園の奥には九州最古のお寺「武蔵寺」があり、武蔵寺の手前から続く登山道は「天神さまの径」、公園側の登山道は「開運の道」で、どちらも山頂に続いている。開運の道と天神さまの径には1合ごとに道真公の詠んだ歌碑が設置されているので、道真の心境を追体験しながら登ろう。山頂には展望台があり、筑紫野市をはじめ近郊の市街地を一望できる。基山への縦走もおすすめ。",
            "total_domo_points": 11,
            "total_photos": 4,
            "cover_photo_name": "photo_0001_01_1722765280.webp",
            "mountains": ["奥天拝", "天拝山"],
            "prefectures": ["福岡", "佐賀"],
            "areas": ["天拝山・基山"],
            "tags": ["登山", "低山"],
        }

        with self.subTest("チェック2"):
            # 1番目の活動リストデータが想定値と一致することを確認
            self.assertDictEqual(activity_detail, expected_data_1th)

        # リクエストURLの作成
        url = reverse("activity-detail", kwargs={"activity_id": "0027"})

        # 登山の活動詳細をGETリクエスト
        activity_detail_result = self.client.get(
            url,
            HTTP_AUTHORIZATION=f"Bearer {login_result.access_token_cookie}",
        )

        with self.subTest("チェック3"):
            # ステータスコード200を確認
            self.assertEqual(activity_detail_result.status_code, 200)

        # レスポンスデータをJSON形式で取得
        activity_detail = activity_detail_result.json()

        expected_data_27th = {
            "activity_id": "0027",
            "user_id": "0001",
            "user_name": "テスト太郎",
            "is_paid": True,
            "start_at": "2023-12-29",
            "end_at": "2023-12-29",
            "start_at_display": "2023.12.29(金)",
            "course_constant_level": "ふつう",
            "active_time": "05:03",
            "route_distance": 5.9,
            "standard_time": "03:50",
            "avg_pace_min": 110,
            "avg_pace_max": 130,
            "avg_pace_level": "やや速い",
            "title": "宝満山",
            "stay_days": 0,
            "activity_days": 1,
            "is_plan_submitted": True,
            "ascent_distance": 710,
            "descent_distance": 710,
            "course_constant": 14,
            "calories": 1402,
            "activity_article": "宝満山の山中には、数々の史跡が点在し、果てしなく続く100段ガンギ（石段）を登りたどり着いた山頂に竈門神社の上宮がある。頂上からは市街を見下ろす絶景が素晴らしく、また春の新緑、秋の紅葉と四季折々の景色が美しいことから一年を通して多くの登山客が訪れる。",
            "total_domo_points": 11,
            "total_photos": 3,
            "cover_photo_name": "photo_0027_03_1722765280.webp",
            "mountains": ["宝満山"],
            "prefectures": ["福岡"],
            "areas": ["宝満山・三郡山・若杉山"],
            "tags": ["登山", "低山"],
        }

        with self.subTest("チェック4"):
            # 最個の活動リストデータが想定値と一致することを確認
            self.assertDictEqual(activity_detail, expected_data_27th)

    def test_get_profile_with_valid_access_token(self):
        """有効なAccessトークンでプロフィール情報を取得できることを確認"""

        # ログイン認証を送信
        login_result = self.login_user(self.valid_user_data)

        # リクエストURLの作成
        url = reverse("user_profile", kwargs={"user_id": login_result.user_id_cookie})

        # ユーザーのプロファイルのGETリクエストを送信
        user_profile_result = self.client.get(
            url,
            HTTP_AUTHORIZATION=f"Bearer {login_result.access_token_cookie}",
        )

        with self.subTest("チェック1"):
            # ステータスコード200を確認
            self.assertEqual(user_profile_result.status_code, 200)

        # レスポンスデータをJSON形式で取得
        user_profile = user_profile_result.json()

        expected_data = {
            "id": "0001",
            "gender": "男性",
            "activity_prefecture": ["福岡", "佐賀", "大分"],
            "name": "テスト太郎",
            "birth_year": 1982,
            "is_paid": True,
            "domo_points": 0,
        }

        with self.subTest("チェック2"):
            # ユーザーのプロファイル情報が想定値と一致することを確認
            self.assertDictEqual(user_profile, expected_data)

    def test_get_achievement_with_valid_access_token(self):
        """有効なAccessトークンで登山の実績情報を取得できることを確認"""

        # ログイン認証を送信
        login_result = self.login_user(self.valid_user_data)

        # リクエストURLの作成
        url = reverse("activity_achievement", kwargs={"user_id": login_result.user_id_cookie})

        # 登山の活動実績のGETリクエストを送信
        activity_achievement_result = self.client.get(
            url,
            HTTP_AUTHORIZATION=f"Bearer {login_result.access_token_cookie}",
        )

        with self.subTest("チェック1"):
            # ステータスコード200を確認
            self.assertEqual(activity_achievement_result.status_code, 200)

        # レスポンスデータをJSON形式で取得
        activity_achievement = activity_achievement_result.json()

        with self.subTest("チェック2"):
            # 登山の活動実績の件数を確認
            self.assertEqual(len(activity_achievement), 71)

        # 1番目の活動リストデータの想定値
        expected_data_1th = {
            "mountain_name": "宝満山",
            "mountain_name_ruby": "ほうまんざん",
            "prefecture_name": ["福岡"],
            "prefecture_name_ruby": ["ふくおか"],
            "elevation": 829,
            "climbCount": 5,
        }

        expected_data_71th = {
            "mountain_name": "吉見岳",
            "mountain_name_ruby": "よしみたけ",
            "prefecture_name": ["福岡"],
            "prefecture_name_ruby": ["ふくおか"],
            "elevation": 158,
            "climbCount": 1,
        }

        with self.subTest("チェック3"):
            # 1番目の登山の活動実績が想定値と一致することを確認
            self.assertDictEqual(activity_achievement[0], expected_data_1th)

        with self.subTest("チェック4"):
            # 最個の登山の活動実績が想定値と一致することを確認
            self.assertDictEqual(activity_achievement[len(activity_achievement) - 1], expected_data_71th)

    def test_get_activity_list_with_invalid_access_token(self):
        """認証なしで登山の活動リストを取得できないことを確認"""

        # リクエストURLの作成
        url = reverse("activity-list", kwargs={"user_id": "0001"})

        # 登山の活動リストのGETリクエストを送信
        activity_list_result = self.client.get(url)

        with self.subTest("チェック1"):
            # ステータスコード401を確認
            self.assertEqual(activity_list_result.status_code, 401)

    def test_get_activity_detail_with_invalid_access_token(self):
        """認証なしで登山の詳細情報を取得できないことを確認"""

        # リクエストURLの作成
        url = reverse("activity-detail", kwargs={"activity_id": "0001"})

        # 登山の活動詳細のGETリクエストを送信
        activity_detail_result = self.client.get(url)

        with self.subTest("チェック1"):
            # ステータスコード401を確認
            self.assertEqual(activity_detail_result.status_code, 401)

    def test_get_profile_with_invalid_access_token(self):
        """認証なしでプロフィール情報を取得できないことを確認"""

        # リクエストURLの作成
        url = reverse("user_profile", kwargs={"user_id": "0001"})

        # ユーザーのプロファイルのGETリクエストを送信
        user_profile_result = self.client.get(url)

        with self.subTest("チェック1"):
            # ステータスコード401を確認
            self.assertEqual(user_profile_result.status_code, 401)

    def test_get_achievement_with_invalid_access_token(self):
        """認証なしで登山の実績情報を取得できないことを確認"""

        # リクエストURLの作成
        url = reverse("activity_achievement", kwargs={"user_id": "0001"})

        # 登山の活動実績のGETリクエストを送信
        activity_achievement_result = self.client.get(url)

        with self.subTest("チェック1"):
            # ステータスコード401を確認
            self.assertEqual(activity_achievement_result.status_code, 401)
