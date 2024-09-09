from django.contrib.auth.backends import BaseBackend
from django.contrib.auth import get_user_model

User = get_user_model()


class EmailBackend(BaseBackend):
    """メールアドレスを使用してユーザー認証を行うカスタム認証バックエンド

    Djangoのデフォルト認証バックエンドを拡張して、メールアドレスとパスワードを使用した認証をサポートする
    """

    def authenticate(self, request, email=None, password=None, **kwargs):
        """ユーザーをメールアドレスとパスワードで認証する

        メールアドレスを基にユーザーを検索し、指定されたパスワードと
        ユーザーのパスワードが一致するかを確認する

        Args:
            request (HttpRequest): 認証のためのリクエストオブジェクト
            email (str, optional): 認証に使用するメールアドレス
            password (str, optional): 認証に使用するパスワー。
            **kwargs: その他の任意のキーワード引数

        Returns:
            User: 認証に成功した場合、認証済みのユーザーオブジェクトを返す
            None: 認証に失敗した場合、Noneを返す
        """
        try:
            # ユーザーインスタンスの取得
            user = User.objects.get(email=email)
            # パスワード認証
            if user.check_password(password):
                return user
        # 指定したメールアドレスに紐づくユーザーが存在しない場合
        except User.DoesNotExist:
            return None

    def get_user(self, user_id):
        """ユーザーIDに基づいたユーザーオブジェクトを取得する

        Args:
            user_id (int): ユーザーのプライマリキー（ID）

        Returns:
            User: 存在する場合はユーザーオブジェクトを返す
            None: ユーザーが存在しない場合はNoneを返す
        """
        try:
            return User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return None
