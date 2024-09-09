from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken


class CookieJWTAuthentication(JWTAuthentication):
    """CookieからJWTアクセストークンを使用して認証を行うクラス

    デフォルトのJWT認証に加えて、リクエストヘッダーだけでなく、Cookieに保存されたアクセストークンから
    認証を行う
    """

    def authenticate(self, request):
        """認証メソッド

        リクエストヘッダーまたはCookieからアクセストークンを取得し、そのトークンを検証してユーザーを認証する

        Args:
            request (HttpRequest): 認証リクエストオブジェクト

        Returns:
            tuple: 認証済みのユーザーオブジェクトと検証済みのトークン
            None: トークンが取得できないか無効な場合はNoneを返す

        Raises:
            InvalidToken: トークンが無効な場合にスローされる例外
        """
        # 認証ヘッダーを取得
        header = self.get_header(request)

        # 認証ヘッダーがない場合、Cookieからアクセストークンを取得
        if header is None:
            raw_token = self.get_raw_token_from_cookie(request)
        else:
            # 認証ヘッダーがある場合、ヘッダーからアクセストークンを取得
            raw_token = self.get_raw_token(header)

        # アクセストークンが取得できなかった場合、Noneを返す（認証エラー）
        if raw_token is None:
            return None

        # アクセストークンの検証
        validated_token = self.get_validated_token(raw_token)

        # 検証済みトークンからユーザーを取得
        return self.get_user(validated_token), validated_token

    def get_raw_token_from_cookie(self, request):
        """Cookieからアクセストークンを取得するメソッド

        リクエストオブジェクトのCookieから`access_token`という名前のトークンを取得する

        Args:
            request (HttpRequest): 認証リクエストオブジェクト

        Returns:
            str: Cookieに含まれるアクセストークン

        Raises:
            InvalidToken: Cookieにアクセストークンが存在しない場合にスローされる例外
        """
        # Cookieからアクセストークンを取得
        raw_token = request.COOKIES.get("access_token")

        # Cookieにアクセストークンが存在しない場合、例外をスロー
        if raw_token is None:
            raise InvalidToken("No access token in request")

        return raw_token
