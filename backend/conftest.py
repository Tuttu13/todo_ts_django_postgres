# conftest.py

import os
import sys

import django
import pytest

# プロジェクトのルートディレクトリをシステムパスに追加
sys.path.append(os.path.dirname(__file__))

# Django設定モジュールを環境変数として設定
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

# Djangoを初期化
django.setup()

@pytest.fixture(scope='session')
def django_db_setup():
    pass
