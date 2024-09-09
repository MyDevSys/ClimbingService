from django.apps import AppConfig


class ClimbingConfig(AppConfig):
    """アプリケーションのメタ設定を定義するクラス

    Attributes:
        default_auto_field (str): デフォルトのフィールドとして使用するオートフィールドの型
        name (str): アプリケーションの名前
    """

    default_auto_field = "django.db.models.BigAutoField"
    name = "climbing"
