from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from .models import Activity, User, PrefectureMaster, AreaMaster, Contract
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken


class AuthTokenObtainPairSerializer(TokenObtainPairSerializer):
    """アクセストークンを払い出すAPIのシリアライザ

    メールアドレスとパスワードでユーザーを認証し、JWTトークンを発行する

    Attributes:
        email (EmailField): ユーザーのメールアドレス
        password (CharField): 認証用のパスワード
    """

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        """ユーザー認証を行い、トークンを生成するメソッド

        Args:
            attrs (dict): 認証に必要な辞書データ

        Returns:
            dict: アクセストークン、ユーザーID

        Raises:
            ValidationError: 認証に失敗した場合
        """
        credentials = {"email": attrs.get("email"), "password": attrs.get("password")}

        user = authenticate(**credentials)

        if user:
            if not user.is_active:
                raise serializers.ValidationError("User account is disabled.")

            data = super().validate(attrs)
            data.update({"user_id": str(user.id).zfill(4)})

            return data
        else:
            raise serializers.ValidationError("Unable to log in with provided credentials.")

    @classmethod
    def get_token(cls, user):
        """トークンにユーザー情報を追加するメソッド

        Args:
            user (User): トークンに関連付けるユーザー

        Returns:
            Token: ユーザー情報を追加したトークンオブジェクト
        """
        token = super().get_token(user)
        token["email"] = user.email
        token["user_id"] = str(user.id).zfill(4)
        return token


class AuthTokenRefreshSerializer(TokenRefreshSerializer):
    """リフレッシュトークンを使用してアクセストークンを払い出すAPIのシリアライザ

    リフレッシュトークンを使用して新しいアクセストークンを発行する
    """

    def validate(self, attrs):
        """トークンの検証とユーザーIDの取得

        Args:
            attrs (dict): リフレッシュトークンを含む辞書データ

        Returns:
            dict: 新しいアクセス/リフレッシュトークン、ユーザーID

        Raises:
            InvalidToken: トークンが無効な場合
        """
        try:
            data = super().validate(attrs)  # ここでリフレッシュトークンのバリデーションが行われる
        except TokenError as e:
            raise InvalidToken({"detail": "Token is blacklisted", "code": "token_not_valid"})

        refresh_token = RefreshToken(data["refresh"])  # dataからリフレッシュトークンを取り出す
        data["user_id"] = refresh_token["user_id"]
        return data


class DynamicFieldsModelSerializer(serializers.ModelSerializer):
    """特定のフィールドのみをシリアライズするためのカスタムシリアライザ

    fields引数を使用して、シリアライズするフィールドを動的に指定する

    Args:
        fields (list, optional): シリアライズするフィールドのリスト
    """

    def __init__(self, *args, **kwargs):
        # `fields`キーワード引数を取り出す
        fields = kwargs.pop("fields", None)
        super(DynamicFieldsModelSerializer, self).__init__(*args, **kwargs)

        if fields is not None:
            # 指定されたフィールドのみを残す
            allowed = set(fields)
            existing = set(self.fields)
            for field_name in existing - allowed:
                self.fields.pop(field_name)


class ActivitySerializer(DynamicFieldsModelSerializer):
    """
    登山の活動データのシリアライザ
    """

    activity_id = serializers.SerializerMethodField()
    user_id = serializers.SerializerMethodField()
    user_name = serializers.CharField(max_length=30, source="user.name")
    is_paid = serializers.BooleanField(source="user.is_paid")
    start_at = serializers.SerializerMethodField()
    end_at = serializers.SerializerMethodField()
    start_at_display = serializers.SerializerMethodField()
    course_constant_level = serializers.CharField(max_length=10, source="course_constant_level.level")
    active_time = serializers.SerializerMethodField()
    route_distance = serializers.SerializerMethodField()
    standard_time = serializers.SerializerMethodField()
    avg_pace_min = serializers.IntegerField(source="avg_pace_level.min")
    avg_pace_max = serializers.IntegerField(source="avg_pace_level.max")
    avg_pace_level = serializers.CharField(max_length=10, source="avg_pace_level.level")

    class Meta:
        model = Activity
        fields = "__all__"

    def get_activity_id(self, obj):
        return str(obj.id).zfill(4)

    def get_user_id(self, obj):
        return str(obj.user_id).zfill(4)

    def get_standard_time(self, obj):
        hr = str(obj.standard_time // 60).zfill(2)
        min = str(obj.standard_time % 60).zfill(2)
        formatted_standard_time = f"{hr}:{min}"
        return formatted_standard_time

    def get_start_at_display(self, obj):
        # 日本語の曜日を取得
        weekdays = ["月", "火", "水", "木", "金", "土", "日"]
        weekday_jp = weekdays[obj.start_at.weekday()]

        # 日付フォーマット変換した活動開始日を取得
        formatted_start_at = obj.start_at.strftime(f"%Y.%m.%d({weekday_jp})")
        return formatted_start_at

    def get_start_at(self, obj):
        return obj.start_at.strftime(f"%Y-%m-%d")

    def get_end_at(self, obj):
        return obj.end_at.strftime(f"%Y-%m-%d")

    def get_route_distance(self, obj):
        return round(obj.route_distance / 1000, 1)

    def get_active_time(self, obj):
        hh = obj.active_time // 60
        mm = obj.active_time % 60

        return f"{str(hh).zfill(2)}:{str(mm).zfill(2)}"


class UserSerializer(DynamicFieldsModelSerializer):
    """
    ユーザデータのシリアライザ
    """

    id = serializers.SerializerMethodField()
    gender = serializers.SerializerMethodField()
    activity_prefecture = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = "__all__"

    def get_id(self, obj):
        return str(obj.id).zfill(4)

    def get_gender(self, obj):
        return obj.gender.name

    def get_activity_prefecture(self, obj):
        return [item.prefecture.name for item in obj.user_activity_prefecture.all()]


class ContractSerializer(DynamicFieldsModelSerializer):
    """
    契約データのシリアライザ
    """

    class Meta:
        model = Contract
        fields = "__all__"


class NameSerializer(serializers.Serializer):
    """
    各マスターデータの名称のシリアライザ
    """

    id = serializers.IntegerField()
    name = serializers.CharField(max_length=20)


class ActivityAggregatesSerializer(serializers.Serializer):
    """
    登山の集計データのシリアライザ
    """

    total_domo_points = serializers.IntegerField()
    total_photos = serializers.IntegerField()


class ActivityPhotosSerializer(serializers.Serializer):
    """
    登山の活動写真ファイル名のシリアライザ
    """

    cover_photo_name = serializers.SerializerMethodField()

    def get_cover_photo_name(self, obj):
        seq_no = obj["seq_no"]
        timestamp = obj["timestamp"]
        cover_photo_name = f"photo_{str(obj['id']).zfill(4)}_{str(seq_no).zfill(2)}_{str(timestamp)}.webp"
        return cover_photo_name


class ActivityListSerializer(serializers.Serializer):
    """
    登山の活動一覧データのシリアライザ
    """

    aggregates = ActivityAggregatesSerializer(many=True)
    cover_photo = ActivityPhotosSerializer(many=True)
    prefectures = NameSerializer(many=True)
    areas = NameSerializer(many=True)
    tags = NameSerializer(many=True)


class ActivityDetailSerializer(serializers.Serializer):
    """
    登山の活動詳細データのシリアライザ
    """

    aggregates = ActivityAggregatesSerializer()
    cover_photo = ActivityPhotosSerializer()
    prefectures = NameSerializer(many=True)
    mountains = NameSerializer(many=True)
    areas = NameSerializer(many=True)
    tags = NameSerializer(many=True)


class ClimbingAchievementsSerializer(serializers.Serializer):
    """
    登山の活動実績データのシリアライザ
    """

    mountain_name = serializers.SerializerMethodField()
    mountain_name_ruby = serializers.SerializerMethodField()
    prefecture_name = serializers.SerializerMethodField()
    prefecture_name_ruby = serializers.SerializerMethodField()
    elevation = serializers.SerializerMethodField()
    climbCount = serializers.SerializerMethodField()

    def get_mountain_name(self, obj):
        return obj["mountain_name"]

    def get_mountain_name_ruby(self, obj):
        return obj["mountain_name_ruby"]

    def get_prefecture_name(self, obj):
        return obj["prefecture_name"]

    def get_prefecture_name_ruby(self, obj):
        return obj["prefecture_name_ruby"]

    def get_elevation(self, obj):
        return obj["elevation"]

    def get_climbCount(self, obj):
        return obj["climbCount"]
