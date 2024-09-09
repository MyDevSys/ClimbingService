import os
from django.core.management.base import BaseCommand
from django.core.management import call_command
import subprocess


class Command(BaseCommand):
    """Djangoのカスタム管理コマンドクラス。

    指定された順序でfixtureファイルをロードし、
    登山の活動データに基づいてユーザーのDomoポイントの総和を更新するスクリプトを実行する

    Attributes:
        help (str): コマンドの説明。
    """

    help = "Load fixtures in a pre-defined order"

    def handle(self, *args, **options):
        """コマンド実行時に呼び出されるメソッド

        ・指定されたfixtureファイルを順に読み込み、データベースに反映する
        ・fixtureファイルのロード後、Domoポイントの更新スクリプトを実行する

        Args:
            *args: 任意の引数リスト
            **options: 任意のキーワード引数辞書

        Raises:
            Exception: Fixtureファイルの読み込みやスクリプト実行中にエラーが発生した場合の例外を出力
        """

        FIXTURES_FILE_DIR = "climbing/fixtures"
        fixtures = [
            "gender_master.json",
            "prefecture_master.json",
            "plan_master.json",
            "tag_master.json",
            "area_master.json",
            "avg_pace_level_master.json",
            "course_constant_level_master.json",
            "mountain_master.json",
            "mountain_prefecture.json",
            "user.json",
            "user_activity_prefecture.json",
            "contract.json",
            "activity.json",
            "activity_tag.json",
            "activity_prefecture.json",
            "activity_area.json",
            "activity_photo.json",
            "activity_mountain.json",
        ]

        # 各fixtureファイルの内容をDBに反映
        for fixture in fixtures:
            file_path = os.path.join(FIXTURES_FILE_DIR, fixture)
            if not os.path.exists(file_path):
                self.stderr.write(self.style.ERROR(f"Fixture file {file_path} does not exist"))
                continue
            try:
                call_command("loaddata", file_path)
                self.stdout.write(self.style.SUCCESS(f"Successfully loaded {file_path}"))
            except Exception as e:
                self.stderr.write(self.style.ERROR(f"Error loading {file_path}: {e}"))

        env = os.environ.copy()
        env["PYTHONPATH"] = r"C:\Python\venv\backend\Lib\site-packages"

        # DBに反映した登山の活動データをもとにユーザのDomoポイントの総和を算出し、DBの内容を更新
        try:
            result = subprocess.run(
                ["python", "manage.py", "update_domo_point"],
                check=True,
                capture_output=True,
                text=True,
                env=env,
            )

            # スクリプトの標準出力を表示
            self.stdout.write(self.style.SUCCESS(f"Successfully ran the script: {result.stdout}"))
        except subprocess.CalledProcessError as e:
            # エラー発生時の標準エラー出力を表示
            self.stderr.write(self.style.ERROR(f"Error running the script: {e.stderr}"))
