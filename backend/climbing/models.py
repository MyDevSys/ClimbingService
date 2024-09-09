from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin


class GenderMaster(models.Model):
    """
    性別マスターモデル

    Attributes:
        id (AutoField): 性別ID (プライマリキー)
        name (CharField): 性別の名称
    """

    id = models.AutoField(primary_key=True, verbose_name="性別ID")
    name = models.CharField(max_length=10, unique=True, verbose_name="性別名")

    class Meta:
        db_table = "climbing_gender_master"
        verbose_name = "性別"
        verbose_name_plural = "性別"
        ordering = ["id"]

    def __str__(self):
        return self.name


class PrefectureMaster(models.Model):
    """
    都道府県マスターモデル

    Attributes:
        id (AutoField): 都道府県ID (プライマリキー)
        name (CharField): 都道府県名
        name_ruby (CharField): 都道府県のふりがな
    """

    id = models.AutoField(primary_key=True, verbose_name="都道府県ID")
    name = models.CharField(max_length=10, unique=True, verbose_name="都道府県名")
    name_ruby = models.CharField(max_length=10, verbose_name="都道府県のふりがな")

    class Meta:
        db_table = "climbing_prefecture_master"
        verbose_name = "都道府県"
        verbose_name_plural = "都道府県"
        ordering = ["id"]

    def __str__(self):
        return self.name


class PlanMaster(models.Model):
    """
    契約プランマスターモデル

    Attributes:
        id (AutoField): プランID (プライマリキー)
        name (CharField): プラン名
        price (IntegerField): 金額(円)
        duration (IntegerField): 有効期間(日)
    """

    id = models.AutoField(primary_key=True, verbose_name="プランID")
    name = models.CharField(max_length=50, unique=True, verbose_name="プラン名")
    price = models.IntegerField(verbose_name="金額(円)")
    duration = models.IntegerField(blank=True, null=True, verbose_name="有効期間(日)")

    class Meta:
        db_table = "climbing_plan_master"
        verbose_name = "契約プラン"
        verbose_name_plural = "契約プラン"
        ordering = ["id"]

    def __str__(self):
        return self.name


class TagMaster(models.Model):
    """
    タグマスターモデル

    Attributes:
        id (AutoField): タグID (プライマリキー)
        name (CharField): タグ名
    """

    id = models.AutoField(primary_key=True, verbose_name="タグID")
    name = models.CharField(max_length=20, unique=True, verbose_name="タグ名")

    class Meta:
        db_table = "climbing_tag_master"
        verbose_name = "タグ"
        verbose_name_plural = "タグ"
        ordering = ["id"]

    def __str__(self):
        return self.name


class AreaMaster(models.Model):
    """
    エリアマスターモデル

    Attributes:
        id (AutoField): エリアID (プライマリキー)
        name (CharField): エリア名
    """

    id = models.AutoField(primary_key=True, verbose_name="エリアID")
    name = models.CharField(max_length=20, unique=True, verbose_name="エリア名")

    class Meta:
        db_table = "climbing_area_master"
        verbose_name = "エリア"
        verbose_name_plural = "エリア"
        ordering = ["id"]

    def __str__(self):
        return f"{self.name}(ID:{self.id})"


class MountainMaster(models.Model):
    """
    山情報マスターモデル

    Attributes:
        id (AutoField): 山情報ID (プライマリキー)
        name (CharField): 山の名称
        name_ruby (CharField): 山の名称のふりがな
        elevation (IntegerField): 山の標高(m)
        lng (DecimalField): 山の経度
        lat (DecimalField): 山の緯度
        course_constant_min (IntegerField): コース定数(下限)
        course_constant_max (IntegerField): コース定数(上限)
        description (TextField): 山の説明
    """

    id = models.AutoField(primary_key=True, verbose_name="山情報ID")
    name = models.CharField(max_length=20, verbose_name="山の名称")
    name_ruby = models.CharField(max_length=20, verbose_name="山の名称のふりがな")
    elevation = models.IntegerField(verbose_name="山の標高(m)")
    lng = models.DecimalField(max_digits=9, decimal_places=6, verbose_name="山の経度")
    lat = models.DecimalField(max_digits=9, decimal_places=6, verbose_name="山の緯度")
    course_constant_min = models.IntegerField(null=True, blank=True, verbose_name="コース定数(下限)")
    course_constant_max = models.IntegerField(null=True, blank=True, verbose_name="コース定数(上限)")
    description = models.TextField(blank=True, verbose_name="山の説明")

    class Meta:
        db_table = "climbing_mountain_master"
        verbose_name = "山情報"
        verbose_name_plural = "山情報"
        unique_together = (("lng", "lat"),)
        ordering = ["id"]

    def __str__(self):
        return f"{self.name}"


class CourseMaster(models.Model):
    """
    登山コースマスターモデル

    Attributes:
        id (AutoField): コースID (プライマリキー)
        name (CharField): コース名
        course_constant (IntegerField): コース定数
        required_time (IntegerField): 所要時間(分)
        route_distance (IntegerField): 走行距離(m)
        ascent_distance (IntegerField): 登った距離(m)
        area (ForeignKey): 登山コースのエリアID
    """

    id = models.AutoField(primary_key=True, verbose_name="コースID")
    name = models.CharField(max_length=30, verbose_name="コース名")
    course_constant = models.IntegerField(verbose_name="コース定数")
    required_time = models.IntegerField(verbose_name="所要時間(分)")
    route_distance = models.IntegerField(verbose_name="走行距離(m)")
    ascent_distance = models.IntegerField(verbose_name="登った距離(m)")
    area = models.ForeignKey(AreaMaster, on_delete=models.RESTRICT, verbose_name="登山コースのエリア")

    class Meta:
        db_table = "climbing_course_master"
        verbose_name = "登山コース"
        verbose_name_plural = "登山コース"
        ordering = ["id"]

    def __str__(self):
        return self.course_name(self.area.name)


class CheckPointTypeMaster(models.Model):
    """
    チェックポイント種別マスターモデル

    Attributes:
        type (AutoField): チェックポイント種別 (プライマリキー)
        type_name (CharField): チェックポイント種別名
        is_display (BooleanField): 活動日記への表示有無
        icon_index (IntegerField): アイコンindex
    """

    type = models.AutoField(primary_key=True, unique=True, verbose_name="チェックポイント種別")
    type_name = models.CharField(max_length=20, verbose_name="チェックポイント種別名")
    is_display = models.BooleanField(default=False, verbose_name="活動日記への表示有無")
    icon_index = models.IntegerField(verbose_name="アイコンindex")

    class Meta:
        db_table = "climbing_checkpoint_type_master"
        verbose_name = "チェックポイント種別"
        verbose_name_plural = "チェックポイント種別"
        ordering = ["type"]

    def __str__(self):
        return self.type_name


class CheckPointMaster(models.Model):
    """
    チェックポイントマスターモデル

    Attributes:
        id (AutoField): チェックポイントID (プライマリキー)
        name (CharField): チェックポイント名
        description (TextField): チェックポイントの説明
        lng (DecimalField): チェックポイントの経度
        lat (DecimalField): チェックポイントの緯度
        type (ForeignKey): チェックポイント種別ID
    """

    id = models.AutoField(primary_key=True, verbose_name="チェックポイントID")
    name = models.CharField(max_length=20, verbose_name="チェックポイント名")
    description = models.TextField(blank=True, verbose_name="チェックポイントの説明")
    lng = models.DecimalField(max_digits=9, decimal_places=6, verbose_name="チェックポイントの経度")
    lat = models.DecimalField(max_digits=9, decimal_places=6, verbose_name="チェックポイントの緯度")
    type = models.ForeignKey(CheckPointTypeMaster, on_delete=models.RESTRICT, verbose_name="チェックポイント種別")

    class Meta:
        db_table = "climbing_checkpoint_master"
        verbose_name = "チェックポイント"
        verbose_name_plural = "チェックポイント"
        unique_together = (("lng", "lat"),)
        ordering = ["id"]

    def __str__(self):
        return f"{self.name}(緯度:{self.lat}, 経度:{self.lng})"


class AvgPaceLevelMaster(models.Model):
    """
    平均ペースレベルマスターモデル

    Attributes:
        id (AutoField): 平均ペースパターンID (プライマリキー)
        min (IntegerField): 平均ペース下限
        max (IntegerField): 平均ペース上限
        level (CharField): 平均ペースレベル
    """

    id = models.AutoField(primary_key=True, verbose_name="平均ペースパターンID")
    min = models.IntegerField(verbose_name="平均ペース下限")
    max = models.IntegerField(verbose_name="平均ペース上限")
    level = models.CharField(max_length=10, verbose_name="平均ペースレベル")

    class Meta:
        db_table = "climbing_ave_pace_level_master"
        verbose_name = "平均ペースレベル"
        verbose_name_plural = "平均ペースレベル"
        unique_together = (("min", "max", "level"),)
        ordering = ["id"]

    def __str__(self):
        return f"{self.level}({self.min} - {self.max})"


class CourseConstantLevelMaster(models.Model):
    """
    コース定数レベルマスターモデル

    Attributes:
        id (AutoField): コース定数レベルパターンID (プライマリキー)
        min (IntegerField): コース定数下限
        max (IntegerField): コース定数上限
        level (CharField): コース定数レベル
    """

    id = models.AutoField(primary_key=True, verbose_name="コース定数レベルパターンID")
    min = models.IntegerField(verbose_name="コース定数下限")
    max = models.IntegerField(null=True, blank=True, verbose_name="コース定数上限")
    level = models.CharField(max_length=10, verbose_name="コース定数レベル")

    class Meta:
        db_table = "climbing_course_constant_level_master"
        verbose_name = "コース定数レベル"
        verbose_name_plural = "コース定数レベル"
        unique_together = (("min", "max", "level"),)
        ordering = ["id"]

    def __str__(self):
        return f"{self.level}({self.min} - {self.max})"


class UserManager(BaseUserManager):
    """
    カスタムユーザーマネージャーモデル

    Djangoの標準のBaseUserManagerを拡張して、メールアドレスを使用したユーザー管理をサポート

    Methods:
        create_user: 一般ユーザーを作成
        create_superuser: スーパーユーザーを作成
    """

    def create_user(self, email, name, password, gender, prefecture=None, **extra_fields):
        """
        一般ユーザーを作成するメソッド

        Args:
            email (str): メールアドレス
            name (str): 名前
            password (str): パスワード
            gender (int): 性別ID
            prefecture (int, optional): 住いの都道府県ID
            **extra_fields: その他の追加フィールド

        Returns:
            User: 作成されたユーザーオブジェクト

        Raises:
            ValueError: メール、名前、パスワード、性別が設定されていない場合に発生
            ValueError: 性別や都道府県のIDが整数でない場合に発生
        """
        if not email:
            raise ValueError("The Email field must be set")
        if not name:
            raise ValueError("The Name field must be set")
        if not password:
            raise ValueError("The Password field must be set")
        if not gender:
            raise ValueError("The Gender field must be set")

        email = self.normalize_email(email)

        if isinstance(gender, int):
            gender = GenderMaster.objects.get(pk=gender)
        else:
            raise ValueError("The genderID is not integer")

        if not prefecture is None:
            if isinstance(prefecture, int):
                prefecture = PrefectureMaster.objects.get(pk=prefecture)
            else:
                raise ValueError("The prefectureID is not integer")

        user = self.model(email=email, name=name, gender=gender, prefecture=prefecture, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password, gender, prefecture=None, **extra_fields):
        """
        スーパーユーザーを作成するメソッド

        Args:
            email (str): メールアドレス
            name (str): 名前
            password (str): パスワード
            gender (int): 性別ID
            prefecture (int, optional): 住いの都道府県ID
            **extra_fields: その他の追加フィールド

        Returns:
            User: 作成されたスーパーユーザーオブジェクト。
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, name, password, gender, prefecture, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    ユーザーモデル

    Attributes:
        id (AutoField): ユーザーID (プライマリキー)
        email (EmailField): メールアドレス
        name (CharField): 名前
        bio (TextField): 自己紹介
        phone_number (CharField): 電話番号
        birth_year (IntegerField): 生まれ年
        height (FloatField): 身長(cm)
        weight (FloatField): 体重(kg)
        is_staff (BooleanField): スタッフかどうか
        is_superuser (BooleanField): スーパーユーザーかどうか
        is_active (BooleanField): アクティブかどうか
        is_paid (BooleanField): 有料ユーザーかどうか
        date_joined (DateTimeField): 登録日
        last_login (DateTimeField): 最終ログイン
        gender (ForeignKey): 性別ID
        prefecture (ForeignKey): お住いの都道府県ID
    """

    id = models.AutoField(primary_key=True, verbose_name="ユーザーID")
    email = models.EmailField(unique=True, verbose_name="メールアドレス")
    name = models.CharField(max_length=30, verbose_name="名前")
    bio = models.TextField(blank=True, verbose_name="自己紹介")
    phone_number = models.CharField(max_length=12, verbose_name="電話番号")
    birth_year = models.IntegerField(blank=True, null=True, verbose_name="生まれ年")
    height = models.FloatField(blank=True, null=True, verbose_name="身長(cm)")
    weight = models.FloatField(blank=True, null=True, verbose_name="体重(kg)")
    is_staff = models.BooleanField(default=False, verbose_name="スタッフ？")
    is_superuser = models.BooleanField(default=False, verbose_name="スーパーユーザー？")
    is_active = models.BooleanField(default=True, verbose_name="アクティブ？")
    is_paid = models.BooleanField(default=False, verbose_name="有料ユーザー？")
    date_joined = models.DateTimeField(auto_now_add=True, verbose_name="登録日")
    last_login = models.DateTimeField(blank=True, null=True, verbose_name="最終ログイン")
    gender = models.ForeignKey(GenderMaster, related_name="gender", on_delete=models.RESTRICT, verbose_name="性別")
    prefecture = models.ForeignKey(
        PrefectureMaster, on_delete=models.RESTRICT, blank=True, null=True, verbose_name="お住いの都道府県"
    )

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name", "phone_number", "gender"]

    # モデルのメタデータを更新
    class Meta:
        db_table = "climbing_user"
        verbose_name = "ユーザー"
        verbose_name_plural = "ユーザー"
        ordering = ["id"]

    def __str__(self):
        return self.email


class UserActivityPrefecture(models.Model):
    """
    ユーザーが活動する都道府県モデル

    Attributes:
        id (AutoField): ユーザー活動エリアID (プライマリキー)
        user (ForeignKey): ユーザーID
        prefecture (ForeignKey): 活動エリアの都道府県ID
    """

    id = models.AutoField(primary_key=True, verbose_name="ユーザー活動エリアID")
    user = models.ForeignKey(
        User, related_name="user_activity_prefecture", on_delete=models.CASCADE, verbose_name="ユーザー"
    )
    prefecture = models.ForeignKey(PrefectureMaster, on_delete=models.RESTRICT, verbose_name="活動エリアの都道府県")

    class Meta:
        db_table = "climbing_user_activity_prefecture"
        verbose_name = "ユーザーの活動エリア"
        verbose_name_plural = "ユーザーの活動エリア"
        ordering = ["id"]

    def __str__(self):
        return f"{self.user.id}({self.prefecture})"


class Contract(models.Model):
    """
    契約情報モデル

    Attributes:
        id (AutoField): 契約情報ID (プライマリキー)
        contract_start_at (DateTimeField): 契約開始日時
        contract_end_at (DateTimeField): 契約終了日時
        domo_points (IntegerField): DOMOポイント
        is_news_subscribed (BooleanField): メールマガジン受信かどうか
        user (OneToOneField): ユーザーID
        plan (OneToOneField): 契約プランID
    """

    id = models.AutoField(primary_key=True, verbose_name="契約情報ID")
    contract_start_at = models.DateTimeField(verbose_name="契約開始日時")
    contract_end_at = models.DateTimeField(blank=True, null=True, verbose_name="契約終了日時")
    domo_points = models.IntegerField(default=0, verbose_name="DOMOポイント")
    is_news_subscribed = models.BooleanField(default=False, verbose_name="メールマガジン受信？")
    user = models.OneToOneField(User, related_name="contract", on_delete=models.CASCADE, verbose_name="ユーザー")
    plan = models.OneToOneField(PlanMaster, on_delete=models.CASCADE, verbose_name="契約プラン")

    class Meta:
        db_table = "climbing_contract"
        verbose_name = "契約情報"
        verbose_name_plural = "契約情報"
        ordering = ["id"]

    def __str__(self):
        return f"{self.user.id} (plan : {self.plan}, domo : {self.domo_points}"


class Activity(models.Model):
    """
    活動データモデル

    Attributes:
        id (AutoField): 活動ID (プライマリキー)
        title (CharField): 活動タイトル
        start_at (DateTimeField): 活動開始日時
        end_at (DateTimeField): 活動終了日時
        stay_days (IntegerField): 宿泊日数
        activity_days (IntegerField): 活動日数
        active_time (IntegerField): 活動時間(分)
        is_plan_submitted (BooleanField): 登山計画書の提出済みかどうか
        route_distance (IntegerField): 走行距離(m)
        ascent_distance (IntegerField): 登った距離(m)
        descent_distance (IntegerField): 下った距離(m)
        course_constant (IntegerField): コース定数
        standard_time (IntegerField): 標準タイム(分)
        avg_pace (IntegerField): 平均ペース(%)
        calories (IntegerField): カロリー(kcal)
        activity_article (TextField): 活動コメント
        is_public (BooleanField): 活動公開かどうか
        user (ForeignKey): ユーザーID
        avg_pace_level (ForeignKey): 平均ペースパターンID
        course_constant_level (ForeignKey): コース定数レベルパターンID
    """

    id = models.AutoField(primary_key=True, verbose_name="活動")
    title = models.CharField(max_length=50, verbose_name="活動タイトル")
    start_at = models.DateTimeField(verbose_name="活動開始日時")
    end_at = models.DateTimeField(verbose_name="活動終了日時")
    stay_days = models.IntegerField(verbose_name="宿泊日数")
    activity_days = models.IntegerField(default=1, verbose_name="活動日数")
    active_time = models.IntegerField(verbose_name="活動時間(分)")
    is_plan_submitted = models.BooleanField(default=False, verbose_name="登山計画書の提出？")
    route_distance = models.IntegerField(verbose_name="走行距離(m)")
    ascent_distance = models.IntegerField(verbose_name="登った距離(m)")
    descent_distance = models.IntegerField(verbose_name="下った距離(m)")
    course_constant = models.IntegerField(verbose_name="コース定数")
    standard_time = models.IntegerField(verbose_name="標準タイム(分)")
    avg_pace = models.IntegerField(verbose_name="平均ペース(%)")
    calories = models.IntegerField(verbose_name="カロリー(kcal)")
    activity_article = models.TextField(blank=True, verbose_name="活動コメント")
    is_public = models.BooleanField(default=False, verbose_name="活動公開？")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="activities", verbose_name="ユーザー")
    avg_pace_level = models.ForeignKey(AvgPaceLevelMaster, on_delete=models.RESTRICT, verbose_name="平均ペースパターン")
    course_constant_level = models.ForeignKey(
        CourseConstantLevelMaster, on_delete=models.RESTRICT, verbose_name="コース定数レベルパターン"
    )

    class Meta:
        db_table = "climbing_activity"
        verbose_name = "活動データ"
        verbose_name_plural = "活動データ"
        ordering = ["id"]

    def __str__(self):
        return f"{self.id}(user:{self.user.id}), title:{self.title}"


class ActivityArea(models.Model):
    """
    活動したエリア情報モデル

    Attributes:
        id (AutoField): ID (プライマリキー)
        activity (ForeignKey): 活動ID
        area (ForeignKey): エリアID
    """

    id = models.AutoField(primary_key=True, verbose_name="ID")
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE, related_name="activity_area", verbose_name="活動")
    area = models.ForeignKey(AreaMaster, on_delete=models.CASCADE, verbose_name="エリア")

    class Meta:
        db_table = "climbing_activity_area"
        verbose_name = "活動したエリア情報"
        verbose_name_plural = "活動したエリア情報"
        ordering = ["id"]

    def __str__(self):
        return f"{self.area.name}"


class ActivityPrefecture(models.Model):
    """
    活動した都道府県モデル

    Attributes:
        id (AutoField): ID (プライマリキー)
        activity (ForeignKey): 活動ID
        prefecture (ForeignKey): 都道府県ID
    """

    id = models.AutoField(primary_key=True, verbose_name="ID")
    activity = models.ForeignKey(
        Activity, on_delete=models.CASCADE, related_name="activity_prefecture", verbose_name="活動"
    )
    prefecture = models.ForeignKey(PrefectureMaster, on_delete=models.CASCADE, verbose_name="都道府県")

    class Meta:
        db_table = "climbing_activity_prefecture"
        verbose_name = "活動した都道府県"
        verbose_name_plural = "活動した都道府県"
        ordering = ["id"]

    def __str__(self):
        return f"{self.prefecture.name}"


class ActivityTag(models.Model):
    """
    活動タグモデル

    Attributes:
        id (AutoField): ID (プライマリキー)
        activity (ForeignKey): 活動ID
        tag (ForeignKey): 活動タグID
    """

    id = models.AutoField(primary_key=True, verbose_name="活動タグID")
    activity = models.ForeignKey(Activity, on_delete=models.CASCADE, related_name="activity_tags", verbose_name="活動")
    tag = models.ForeignKey(TagMaster, on_delete=models.CASCADE, verbose_name="活動タグ")

    class Meta:
        db_table = "climbing_activity_tag"
        verbose_name = "活動タグ"
        verbose_name_plural = "活動タグ"
        ordering = ["id"]

    def __str__(self):
        return f"{self.activity.id}({self.tag.name})"


class ActivityMountain(models.Model):
    """
    活動で登頂した山モデル

    Attributes:
        id (AutoField): ID (プライマリキー)
        activity (ForeignKey): 活動ID
        mountain (ForeignKey): 登頂した山ID
    """

    id = models.AutoField(primary_key=True, verbose_name="ID")
    activity = models.ForeignKey(
        Activity, on_delete=models.CASCADE, related_name="activity_mountains", verbose_name="活動"
    )
    mountain = models.ForeignKey(MountainMaster, on_delete=models.CASCADE, verbose_name="登頂した山")

    class Meta:
        db_table = "climbing_activity_mountain"
        verbose_name = "活動で登頂した山"
        verbose_name_plural = "活動で登頂した山"
        ordering = ["id"]

    def __str__(self):
        return f"{self.activity.id}({self.mountain.name})"


class ActivityPhotos(models.Model):
    """
    活動写真モデル

    Attributes:
        id (AutoField): 活動写真ID (プライマリキー)
        seq_no (IntegerField): シーケンス番号
        timestamp (IntegerField): タイムスタンプ
        user (ForeignKey): ユーザー
        taken_at (DateTimeField): 撮影日時
        comments (TextField): 活動写真コメント
        is_cover_photo (BooleanField): カバー写真かどうか
        domo_points (IntegerField): DOMOポイント
        aspect_ratio (DecimalField): 写真アスペクト比
        activity (ForeignKey): 活動ID
    """

    id = models.AutoField(primary_key=True, verbose_name="活動写真ID")
    seq_no = models.IntegerField(verbose_name="シーケンス番号")
    timestamp = models.IntegerField(verbose_name="タイムスタンプ")
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="ユーザー")
    taken_at = models.DateTimeField(verbose_name="撮影日時")
    comments = models.TextField(blank=True, verbose_name="活動写真コメント")
    is_cover_photo = models.BooleanField(default=False, verbose_name="カバー写真？")
    domo_points = models.IntegerField(verbose_name="DOMOポイント")
    aspect_ratio = models.DecimalField(max_digits=6, decimal_places=3, verbose_name="写真アスペクト比")
    activity = models.ForeignKey(
        Activity, on_delete=models.CASCADE, related_name="activity_photos", verbose_name="活動"
    )

    class Meta:
        db_table = "climbing_activity_photos"
        verbose_name = "活動写真"
        verbose_name_plural = "活動写真"
        ordering = ["id"]

    def __str__(self):
        return f"{self.id}({self.taken_at})"


class MountainPrefecture(models.Model):
    """
    山の都道府県モデル

    Attributes:
        id (AutoField): ID (プライマリキー)
        mountain (ForeignKey): 山情報ID
        prefecture (ForeignKey): 都道府県ID
    """

    id = models.AutoField(primary_key=True, verbose_name="ID")
    mountain = models.ForeignKey(
        MountainMaster, on_delete=models.CASCADE, related_name="mountain_prefecture", verbose_name="山情報"
    )
    prefecture = models.ForeignKey(PrefectureMaster, on_delete=models.CASCADE, verbose_name="都道府県")

    class Meta:
        db_table = "climbing_mountain_prefecture"
        verbose_name = "山の都道府県"
        verbose_name_plural = "山の都道府県"
        ordering = ["id"]

    def __str__(self):
        return f"{self.mountain.name} ({self.prefecture.name})"


class AreaMountain(models.Model):
    """
    エリアの山情報モデル

    Attributes:
        id (AutoField): ID (プライマリキー)
        area (ForeignKey): エリアID
        mountain (ForeignKey): 山情報ID
    """

    id = models.AutoField(primary_key=True, verbose_name="ID")
    area = models.ForeignKey(AreaMaster, on_delete=models.CASCADE, verbose_name="エリア")
    mountain = models.ForeignKey(MountainMaster, on_delete=models.CASCADE, verbose_name="山情報")

    class Meta:
        db_table = "climbing_area_mountain"
        verbose_name = "エリアの山情報"
        verbose_name_plural = "エリアの山情報"
        ordering = ["id"]

    def __str__(self):
        return f"{self.area.name} ({self.mountain.name})"


class MountainCourse(models.Model):
    """
    山の登山コースモデル

    Attributes:
        id (AutoField): ID (プライマリキー)
        mountain (ForeignKey): 山情報ID
        course (ForeignKey): 登山コースID
    """

    id = models.AutoField(primary_key=True, verbose_name="ID")
    mountain = models.ForeignKey(MountainMaster, on_delete=models.CASCADE, verbose_name="山情報")
    course = models.ForeignKey(CourseMaster, on_delete=models.CASCADE, verbose_name="登山コース")

    class Meta:
        db_table = "climbing_mountain_course"
        verbose_name = "山の登山コース"
        verbose_name_plural = "山の登山コース"
        ordering = ["id"]

    def __str__(self):
        return f"{self.mountain.name} ({self.course.name})"


class CourseCheckPoint(models.Model):
    """
    登山コースのチェックポイントモデル

    Attributes:
        id (AutoField): ID (プライマリキー)
        course (ForeignKey): 登山コースID
        checkpoint (ForeignKey): チェックポイントID
    """

    id = models.AutoField(primary_key=True, verbose_name="ID")
    course = models.ForeignKey(CourseMaster, on_delete=models.CASCADE, verbose_name="登山コース")
    checkpoint = models.ForeignKey(CheckPointMaster, on_delete=models.CASCADE, verbose_name="チェックポイント")

    class Meta:
        db_table = "climbing_course_checkpoint"
        verbose_name = "登山コースのチェックポイント"
        verbose_name_plural = "登山コースのチェックポイント"
        ordering = ["id"]

    def __str__(self):
        return f"{self.course.name} ({self.checkpoint.name})"
