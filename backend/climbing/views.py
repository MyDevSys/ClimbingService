import logging
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView
from .models import Activity, User, PrefectureMaster, AreaMaster, MountainPrefecture
from .serializers import (
    AuthTokenObtainPairSerializer,
    AuthTokenRefreshSerializer,
    ActivitySerializer,
    ActivityListSerializer,
    ActivityDetailSerializer,
    UserSerializer,
    ContractSerializer,
    ClimbingAchievementsSerializer,
)
from django.db.models import Sum, Count, F
from collections import defaultdict
from django.http import JsonResponse
from django.middleware.csrf import get_token
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from rest_framework.permissions import AllowAny
from django.conf import settings
from rest_framework import status

logger = logging.getLogger(settings.LOGGER["APP"])


class CsrfTokenView(APIView):
    """CSRFトークンを取得するAPIビュークラス

    Attributes:
        permission_classes (list): アクセス可能な権限のリスト
        authentication_classes (list): 認証に関するクラスのリスト
    """

    permission_classes = [AllowAny]  # 全てのユーザーがアクセス可能
    authentication_classes = []  # 認証は不要

    def get(self, request, *args, **kwargs):
        """GETメソッドでCSRFトークンを取得する

        Args:
            request (HttpRequest): リクエストオブジェクト
            *args: 任意の引数
            **kwargs: 任意のキーワード引数

        Returns:
            JsonResponse: CSRFトークン
        """
        token = get_token(request)
        return JsonResponse({"CSRF_Token": token})


@method_decorator(csrf_protect, name="dispatch")
class AuthTokenObtainPairView(TokenObtainPairView):
    """アクセストークンとリフレッシュトークンを取得するAPIビュークラス

    Attributes:
        serializer_class (AuthTokenObtainPairSerializer): 認証トークンのシリアライザクラス。
    """

    serializer_class = AuthTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        """POSTメソッドでトークンを取得する

        リクエストデータを検証し、アクセストークン、リフレッシュトークン、
        ユーザーIDをCookieに設定する

        Args:
            request (HttpRequest): リクエストオブジェクト
            *args: 任意の引数
            **kwargs: 任意のキーワード引数

        Returns:
            Response: 認証結果、ユーザーID
        """

        # リクエストデータをシリアライズ
        serializer = self.get_serializer(data=request.data)

        # データの検証
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            if hasattr(e, "detail") and isinstance(e.detail, dict):
                for field, errors in e.detail.items():
                    error_message = "; ".join([str(error) for error in errors])
                    logger.warning(f"Authentication Error ({field} : {error_message})")

            return Response({"error": e.detail}, status=status.HTTP_401_UNAUTHORIZED)

        # アクセストークン、フレッシュトークン、ユーザーIDの取得
        serializer_data = serializer.validated_data
        access_token = serializer_data.get("access")
        refresh_token = serializer_data.get("refresh")
        user_id = serializer_data.get("user_id")
        # レスポンスの作成
        response = Response({"message": "Authentication successful", "user_id": user_id}, status=status.HTTP_200_OK)

        # cookieの有効期限の設定
        access_token_max_age = int(settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds())
        refresh_token_max_age = int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds())

        # アクセストークンをcookieに設定
        response.set_cookie(
            key=settings.SIMPLE_JWT["AUTH_COOKIE"],
            value=access_token,
            max_age=access_token_max_age,
            secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
            samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
            httponly=True,
            domain=settings.SIMPLE_JWT["DOMAIN"],
        )
        # リフレッシュトークンをcookieに設定
        response.set_cookie(
            key=settings.SIMPLE_JWT["REFRESH_COOKIE"],
            value=refresh_token,
            max_age=refresh_token_max_age,
            secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
            samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
            httponly=True,
            domain=settings.SIMPLE_JWT["DOMAIN"],
        )
        # ユーザーIDをcookieに設定
        response.set_cookie(
            key=settings.SIMPLE_JWT["USER_ID_COOKIE"],
            value=user_id,
            max_age=refresh_token_max_age,
            secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
            samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
            httponly=False,
            domain=settings.SIMPLE_JWT["DOMAIN"],
        )
        return response


@method_decorator(csrf_protect, name="dispatch")
class AuthTokenRefreshView(TokenRefreshView):
    """リフレッシュトークンを使用してアクセストークンを払い出すAPIビュークラス

    Attributes:
        serializer_class (AuthTokenRefreshSerializer): トークン更新のシリアライザクラス
    """

    serializer_class = AuthTokenRefreshSerializer

    def post(self, request, *args, **kwargs):
        """POSTメソッドでアクセストークンを払い出す

        リフレッシュトークンを使用してアクセストークンを払い出し、cookieに設定する

        Args:
            request (HttpRequest): リクエストオブジェクト
            *args: 任意の引数
            **kwargs: 任意のキーワード引数

        Returns:
            Response: 払い出し結果、アクセス/リフレッシュトークン、ユーザーID
        """

        # リクエストデータをシリアライズ
        serializer = self.get_serializer(data=request.data)

        # データの検証
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            if hasattr(e, "detail") and isinstance(e.detail, dict):
                error_list = []
                for field, errors in e.detail.items():
                    if isinstance(errors, list):
                        error_message = "; ".join([str(error) for error in errors])
                    else:
                        error_message = str(errors)

                    error_list.append(f"{field} : {error_message}")

                full_error_message = ", ".join(error_list)
                logger.warning(f"Refresh Token Error ({full_error_message})")
            return Response({"detail": e.detail["detail"]}, status=status.HTTP_401_UNAUTHORIZED)

        # 検証済みデータの取得
        response_data = serializer.validated_data
        access_token = response_data.get("access")
        refresh_token = response_data.get("refresh")
        user_id = str(response_data.get("user_id"))

        # レスポンスの作成
        response = Response(
            {
                "message": "Token refresh successful",
                "access_token": access_token,
                "refresh_token": refresh_token,
                "user_id": user_id,
            },
            status=status.HTTP_200_OK,
        )

        # cookieの有効期限の設定
        access_token_max_age = int(settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds())
        refresh_token_max_age = int(settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds())

        # アクセストークンをcookieに設定
        response.set_cookie(
            key=settings.SIMPLE_JWT["AUTH_COOKIE"],
            value=access_token,
            max_age=access_token_max_age,
            secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
            samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
            httponly=True,
            domain=settings.SIMPLE_JWT["DOMAIN"],
        )
        # リフレッシュトークンをcookieに設定
        response.set_cookie(
            key=settings.SIMPLE_JWT["REFRESH_COOKIE"],
            value=refresh_token,
            max_age=refresh_token_max_age,
            secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
            samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
            httponly=True,
            domain=settings.SIMPLE_JWT["DOMAIN"],
        )
        # ユーザーIDをcookieに設定
        response.set_cookie(
            key=settings.SIMPLE_JWT["USER_ID_COOKIE"],
            value=user_id,
            max_age=refresh_token_max_age,
            secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
            samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
            httponly=True,
            domain=settings.SIMPLE_JWT["DOMAIN"],
        )

        return response


class ActivityList(APIView):
    """登山の活動一覧を取得するAPIビュークラス

    Attributes:
        permission_classes (list): アクセス可能な権限のリスト
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """GETメソッドで登山の活動一覧を取得する

        Args:
            request (HttpRequest): リクエストオブジェクト
            *args: 任意の引数
            **kwargs: 任意のキーワード引数

        Returns:
            Response: 登山の活動一覧
        """
        user_id = self.kwargs["user_id"]

        # 対象ユーザ—の情報を取得
        try:
            user_instance = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "No user found for the User-ID"}, status=404)

        # 対象ユーザーの公開対象の活動情報を取得
        activity_instances = user_instance.activities.filter(is_public=True)

        # 対象ユーザ—の活動情報が存在しない場合は、空リストを返して正常終了
        if not activity_instances.exists():
            return Response([])

        # 活動ID毎のdomoポイント数と写真数を集計
        activity_aggregates = list(
            activity_instances.annotate(
                total_domo_points=Sum("activity_photos__domo_points"),
                total_photos=Count("activity_photos"),
            ).values("id", "total_domo_points", "total_photos")
        )

        # 活動IDと活動した都道府県名を取得
        activity_prefectures = list(
            activity_instances.annotate(name=F("activity_prefecture__prefecture__name")).values("id", "name")
        )

        # 活動IDと活動エリア名を取得
        activity_areas = list(activity_instances.annotate(name=F("activity_area__area__name")).values("id", "name"))

        # 活動IDと活動タグ名を取得
        activity_tags = list(activity_instances.annotate(name=F("activity_tags__tag__name")).values("id", "name"))

        # 活動IDとカバー写真のシーケンス番号、タイムスタンプ、アスペクト比を取得
        cover_photo = list(
            activity_instances.filter(activity_photos__is_cover_photo=True)
            .annotate(
                seq_no=F("activity_photos__seq_no"),
                timestamp=F("activity_photos__timestamp"),
                aspect_ratio=F("activity_photos__aspect_ratio"),
            )
            .values("id", "seq_no", "timestamp", "aspect_ratio")
        )

        # 取得したデータをまとめる
        marge_data = {
            "aggregates": activity_aggregates,
            "prefectures": activity_prefectures,
            "areas": activity_areas,
            "tags": activity_tags,
            "cover_photo": cover_photo,
        }

        # 活動情報でシリアライザで返したいフィールドを指定
        fields = [
            "activity_id",
            "user_id",
            "user_name",
            "is_paid",
            "title",
            "start_at",
            "start_at_display",
            "end_at",
            "stay_days",
            "activity_days",
            "active_time",
            "route_distance",
            "ascent_distance",
            "is_plan_submitted",
        ]

        # 活動情報をシリアライズ
        activities = ActivitySerializer(activity_instances, many=True, fields=fields).data

        # 取得したデータをシリアライズ
        activity_list_info = ActivityListSerializer(marge_data).data

        # 活動ID毎に活動の都道府県情報を整理
        prefectures = defaultdict(list)
        for item in activity_list_info["prefectures"]:
            prefectures[item["id"]].append(item["name"])

        # 活動ID毎に活動エリア情報を整理
        areas = defaultdict(list)
        for item in activity_list_info["areas"]:
            areas[item["id"]].append(item["name"])

        # 活動ID毎に活動タグ情報を整理
        tags = defaultdict(list)
        for item in activity_list_info["tags"]:
            tags[item["id"]].append(item["name"])

        # レスポンスデータの作成
        response_data = []
        for index, activity in enumerate(activities):
            activity_id = int(activity["activity_id"])
            response_data.append(
                {
                    **activity,
                    **activity_list_info["aggregates"][index],
                    **activity_list_info["cover_photo"][index],
                    "prefectures": prefectures.get(activity_id, []),
                    "areas": areas.get(activity_id, []),
                    "tags": tags.get(activity_id, []),
                }
            )

        # レスポンスデータを活動開始日時で降順ソート
        response_data.sort(key=lambda item: item["start_at"], reverse=True)

        # 正常終了
        return Response(response_data)


class ActivityDetail(APIView):
    """登山の活動詳細を返すAPIビュークラス

    Attributes:
        permission_classes (list): アクセス可能な権限のリスト
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """GETメソッドで登山の活動詳細を取得する

        Args:
            request (HttpRequest): リクエストオブジェクト
            *args: 任意の引数
            **kwargs: 任意のキーワード引数

        Returns:
            Response: 登山の活動詳細
        """
        activity_id = self.kwargs["activity_id"]

        # 対象ユーザーの公開対象の活動情報を取得
        activity_instance = Activity.objects.filter(id=activity_id, is_public=True)

        # 対象ユーザ—の活動情報が存在しない場合は、確認
        if not activity_instance.exists():
            return Response({"error": "No activity found for the user"}, status=404)

        # Activityごとに集計
        activity_aggregates = (
            activity_instance.annotate(
                total_domo_points=Sum("activity_photos__domo_points"),
                total_photos=Count("activity_photos"),
            )
            .values("id", "total_domo_points", "total_photos")
            .first()
        )

        # 活動IDと活動した都道府県名を取得
        activity_prefectures = list(
            activity_instance.annotate(name=F("activity_prefecture__prefecture__name")).values("id", "name")
        )

        # 活動IDと活動した山名を取得
        activity_mountains = list(
            activity_instance.annotate(name=F("activity_mountains__mountain__name")).values("id", "name")
        )

        # 活動IDと活動エリア名を取得
        activity_areas = list(activity_instance.annotate(name=F("activity_area__area__name")).values("id", "name"))

        # 活動IDと活動タグ名を取得
        activity_tags = list(activity_instance.annotate(name=F("activity_tags__tag__name")).values("id", "name"))

        # 活動IDとカバー写真のシーケンス番号を取得
        cover_photo = (
            activity_instance.filter(activity_photos__is_cover_photo=True)
            .annotate(
                seq_no=F("activity_photos__seq_no"),
                timestamp=F("activity_photos__timestamp"),
                aspect_ratio=F("activity_photos__aspect_ratio"),
            )
            .values("id", "seq_no", "timestamp", "aspect_ratio")
            .first()
        )

        # 取得したデータをまとめる
        marge_data = {
            "aggregates": activity_aggregates,
            "cover_photo": cover_photo,
            "prefectures": activity_prefectures,
            "mountains": activity_mountains,
            "areas": activity_areas,
            "tags": activity_tags,
        }

        # 活動情報でシリアライザで返したいフィールドを指定
        fields = [
            "activity_id",
            "user_id",
            "user_name",
            "is_paid",
            "title",
            "start_at",
            "start_at_display",
            "end_at",
            "stay_days",
            "activity_days",
            "active_time",
            "route_distance",
            "ascent_distance",
            "is_plan_submitted",
            "descent_distance",
            "calories",
            "course_constant",
            "course_constant_level",
            "standard_time",
            "avg_pace_min",
            "avg_pace_max",
            "avg_pace_level",
            "activity_article",
        ]

        # 活動情報をシリアライズ
        activity = ActivitySerializer(activity_instance.first(), fields=fields).data

        # 取得したデータをシリアライズ
        activity_list_info = ActivityDetailSerializer(marge_data).data

        # 活動ID毎に活動タグ情報を整理
        mountains = defaultdict(list)
        for item in activity_list_info["mountains"]:
            mountains[item["id"]].append(item["name"])

        # 活動ID毎に活動の都道府県情報を整理
        prefectures = defaultdict(list)
        for item in activity_list_info["prefectures"]:
            prefectures[item["id"]].append(item["name"])

        # 活動ID毎に活動エリア情報を整理
        areas = defaultdict(list)
        for item in activity_list_info["areas"]:
            areas[item["id"]].append(item["name"])

        # 活動ID毎に活動タグ情報を整理
        tags = defaultdict(list)
        for item in activity_list_info["tags"]:
            tags[item["id"]].append(item["name"])

        # 活動ID毎に活動タグ情報を整理
        tags = defaultdict(list)
        for item in activity_list_info["tags"]:
            tags[item["id"]].append(item["name"])

        # レスポンスデータの作成
        response_data = []
        response_data = {
            **activity,
            **activity_list_info["aggregates"],
            **activity_list_info["cover_photo"],
            "mountains": mountains.get(activity_id, []),
            "prefectures": prefectures.get(activity_id, []),
            "areas": areas.get(activity_id, []),
            "tags": tags.get(activity_id, []),
        }

        return Response(response_data)


class ClimbingAchievements(APIView):
    """登山の活動実績を返すAPIビュークラス

    Attributes:
        permission_classes (list): アクセス可能な権限のリスト
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """GETメソッドで登山の活動実績を取得する

        Args:
            request (HttpRequest): リクエストオブジェクト
            *args: 任意の引数
            **kwargs: 任意のキーワード引数

        Returns:
            Response: 登山の活動実績
        """

        user_id = self.kwargs["user_id"]

        # 対象ユーザ—の情報を取得
        try:
            user_instance = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "No user found for the User-ID"}, status=404)

        # 対象ユーザーの公開対象の活動情報を取得
        activity_instances = user_instance.activities.filter(is_public=True)

        # 対象ユーザ—の活動情報が存在しない場合、空リストを返して正常終了
        if not activity_instances.exists():
            return Response([])

        # 活動情報から山の登頂回数と標高情報を取得
        climbing_achievements = list(
            activity_instances.annotate(
                mountain_id=F("activity_mountains__mountain"),
                mountain_name=F("activity_mountains__mountain__name"),
                mountain_name_ruby=F("activity_mountains__mountain__name_ruby"),
                elevation=F("activity_mountains__mountain__elevation"),
            )
            .values(
                "mountain_id",
                "mountain_name",
                "mountain_name_ruby",
                "elevation",
            )
            .annotate(climbCount=Count("mountain_name"))
            .order_by("-climbCount", "-elevation")
        )

        # 登頂した山のidのリストを作成
        mountain_ids = [achievement["mountain_id"] for achievement in climbing_achievements]

        # 登頂した山の都道府県情報を取得
        prefectures = list(
            MountainPrefecture.objects.filter(mountain__id__in=mountain_ids)
            .annotate(
                prefecture_name=F("prefecture__name"),
                prefecture_name_ruby=F("prefecture__name_ruby"),
            )
            .values("mountain_id", "prefecture_name", "prefecture_name_ruby")
        )

        # 登頂した山の都道府県情報の整理
        mountain_prefectures = defaultdict(list)
        mountain_prefectures_ruby = defaultdict(list)
        for prefecture in prefectures:
            mountain_id = prefecture["mountain_id"]
            mountain_prefectures[mountain_id].append(prefecture["prefecture_name"])
            mountain_prefectures_ruby[mountain_id].append(prefecture["prefecture_name_ruby"])

        # 山の登頂回数と標高情報、山の都道府県情報を整理
        marge_data = []
        for achievement in climbing_achievements:
            mountain_id = achievement["mountain_id"]
            marge_data.append(
                {
                    "mountain_name": achievement["mountain_name"],
                    "mountain_name_ruby": achievement["mountain_name_ruby"],
                    "elevation": achievement["elevation"],
                    "climbCount": achievement["climbCount"],
                    "prefecture_name": mountain_prefectures.get(mountain_id, []),
                    "prefecture_name_ruby": mountain_prefectures_ruby.get(mountain_id, []),
                }
            )

        # データをシリアライズ
        response_data = ClimbingAchievementsSerializer(marge_data, many=True).data

        # 正常終了応答
        return Response(response_data)


class UserProfile(APIView):
    """ユーザーのプロファイル情報を返すAPIビュークラス

    Attributes:
        permission_classes (list): アクセス可能な権限のリスト
    """

    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        """GETメソッドでユーザーのプロファイル情報を取得する

        Args:
            request (HttpRequest): リクエストオブジェクト
            *args: 任意の引数
            **kwargs: 任意のキーワード引数

        Returns:
            Response: ユーザーのプロファイル情報
        """

        user_id = self.kwargs["user_id"]

        # 対象ユーザ—の情報を取得
        try:
            user_instance = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response({"error": "No user found for the User-ID"}, status=404)

        # ユーザー情報をシリアライズ
        user_data = UserSerializer(
            user_instance,
            fields=["id", "is_paid", "name", "gender", "birth_year", "activity_prefecture"],
        ).data

        contract_data = ContractSerializer(user_instance.contract, fields=["domo_points"]).data

        # 辞書をマージ
        response_data = user_data | contract_data

        # 正常終了応答
        return Response(response_data)
