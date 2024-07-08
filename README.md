# ToDo管理アプリの開発レポート

## アプリ起動手順
アプリの起動手順について記載します。  
まず、```.env.dev```のファイル名を```.env```に変更してください。  
その後、`todo_ts_django_postgres`フォルダ直下で、以下のシェルを実行してアプリを立ち上げてください。  
```./setup_app.sh```

### setup_app.sh詳細
```sh
echo "Building containers..."
docker compose build

echo "Starting containers..."
docker compose up -d

**echo "Migrating..."**
docker compose exec backend python backend/manage.py migrate

echo "Starting TODO APP..."
cd frontend
npm install
npm start
```

## アプリ機能
以下は、今回作成したTODOアプリの機能一覧になります。
- タスクのCRUD操作
- タスク一覧表示(日付昇順)
- タスク総数/タスク完了数の表示
- ページネーションの実装 

## 技術スタック
以下は、今回使用した技術スタックになります。
- バックエンド: Python, Django, Django REST Framework
- フロントエンド: React, TypeScript, Material UI
- データベース: PostgreSQL
- コンテナ化: Docker, Docker Compose

## API一覧
以下は、API一覧になります。
- タスクの一覧表示、作成 (GET/POST)  
 ```GET /api/tasks/```   
 ```POST /api/tasks/```   
- 特定のタスクの取得、更新、削除 (GET/PATCH/PUT/DELETE)  
 ```GET /api/tasks/<id>/```  
 ```PATCH /api/tasks/<id>/```  
 ```PUT /api/tasks/<id>/```  
 ```DELETE /api/tasks/<id>/```  
- タスクのサマリー情報の取得(GET)  
```GET /api/tasks/summary/``` 

## 工夫した点

1. Django REST Frameworkの機能を活用  
ジェネリックビュー(ListCreateAPIViewとRetrieveUpdateDestroyAPIView)を使用することで、共通のCRUD操作を実装しました。
1. ページネーションの実装  
1ページあたりのタスクの取得件数をを設定することで画面遷移たびにAPIを実施する処理にして、大量のデータを効率的に処理できるようにしました。  
実装箇所:```backend/todo/views.py``` 
``` python
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from todo.models import Task
from todo.serializers import TaskSerializer

class CustomPagination(PageNumberPagination):
    """
    ページネーションをカスタマイズし、1ページあたりのタスク数を3に設定
    """
    page_size = 3
    page_size_query_param = "page_size"

    def get_paginated_response(self, data):
        """
        ページネーションのレスポンスをカスタマイズ
        """
        return Response(
            {
                "links": {
                    "next": self.get_next_link(),
                    "previous": self.get_previous_link(),
                },
                "count": self.page.paginator.count,
                "page_size": self.page_size,
                "results": data,
            }
        )

class ListView(generics.ListCreateAPIView):
    """
    タスクリストの表示と新規作成を行うAPI
    """
    queryset = Task.objects.all().order_by("due_date")
    serializer_class = TaskSerializer
    pagination_class = CustomPagination

class DetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    特定のタスクの取得、更新、削除を行うAPI
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

@api_view(["GET"])
def task_summary(request):
    """
    タスクのサマリー情報を取得するAPIビュー
    """
    total_tasks = Task.objects.count()
    completed_tasks = Task.objects.filter(status=2).count()
    return Response({"total_tasks": total_tasks, "completed_tasks": completed_tasks})


```
3. 単体テストの作成  
フロントエンド・バックエンドの単体テスト作成して、既存の機能に影響を受けていないかを確認することできるしました。  
使用したテストフレームワーク  
フロントエンド:```Jest```  
バックエンド:```Pytest```

4. API呼び出しの非同期処理  
API呼び出しを非同期に処理しています。ブラウザがデータの取得や保存の待機中にフリーズしたり、動作が遅くなることを防ぎました。