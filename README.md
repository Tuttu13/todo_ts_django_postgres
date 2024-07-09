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

## 動作環境
以下は、動作環境になります。
- Django と PostgreSQL は Docker コンテナ内で動作
- React はローカル環境で動作

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
変数名```page_size```の値を変更することによって、1ページあたりタスクの取得数を設定できます。(初期値は3)  
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

5. タスクとサマリーの取得をuseEffectで管理  
useEffectを使用して、初回表示時とページが遷移するたびにタスクとサマリーを取得し表示するようにしました。  
``` javascrypt
  useEffect(() => {
    fetchTasks(currentPage);
    fetchTaskSummary();
  }, [currentPage, fetchTasks, fetchTaskSummary]);
```


## テストカバレッジ
以下は、フロントエンドおよびバックエンドのテストカバレッジの詳細です。
### フロントエンド
フロントエンドでは、Jestを使用してユニットテストを実行し、カバレッジを測定しました。以下はカバレッジの結果です。
``` bash
$ jest --coverage
 PASS  tests/utils.test.ts
 PASS  tests/services/api.test.ts
 PASS  tests/components/TaskSummary.test.tsx (5.764 s)
 PASS  tests/components/Header.test.tsx (5.796 s)
 PASS  tests/components/TaskDetailModal.test.tsx (5.895 s)
 PASS  tests/components/TaskList.test.tsx (5.969 s)
 PASS  tests/components/TaskItem.test.tsx (5.979 s)
 PASS  tests/components/TaskFormModal.test.tsx (6.388 s)
 PASS  tests/pages/Home.test.tsx (6.507 s)
----------------------|---------|----------|---------|---------|-------------------------------------------
File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------------------|---------|----------|---------|---------|-------------------------------------------
All files             |   94.06 |       75 |   86.66 |    92.3 |                                           
 src                  |     100 |      100 |     100 |     100 |                                           
  utils.ts            |     100 |      100 |     100 |     100 |                                           
 src/components       |   98.05 |    69.56 |   94.44 |   97.75 |                                           
  Header.tsx          |     100 |      100 |     100 |     100 |                                           
  TaskDetailModal.tsx |     100 |       50 |     100 |     100 | 33-56                                     
  TaskFormModal.tsx   |     100 |    92.85 |     100 |     100 | 45                                        
  TaskItem.tsx        |    91.3 |       20 |      80 |    90.9 | 49-50                                     
  TaskList.tsx        |     100 |      100 |     100 |     100 |                                           
  TaskSummary.tsx     |     100 |      100 |     100 |     100 |                                           
 src/pages            |   86.81 |    81.81 |   70.58 |   81.53 |                                           
  Home.tsx            |   86.81 |    81.81 |   70.58 |   81.53 | 47-48,82-83,94-95,101-102,107,139-150,165 
 src/services         |     100 |    83.33 |     100 |     100 |                                           
  api.ts              |     100 |    83.33 |     100 |     100 | 7                                         
----------------------|---------|----------|---------|---------|-------------------------------------------

Test Suites: 9 passed, 9 total
Tests:       31 passed, 31 total
Snapshots:   0 total
Time:        7.705 s
```


### バックエンド
バックエンドでは、PytestとCoverageを使用してテストを実行し、カバレッジを測定しました。以下はカバレッジの結果です。
``` bash
$ docker compose exec backend pytest backend/todo/tests --cov
---------- coverage: platform linux, python 3.12.4-final-0 -----------
Name                                      Stmts   Miss  Cover
-------------------------------------------------------------
backend/backend/__init__.py                   0      0   100%
backend/backend/settings.py                  21      0   100%
backend/backend/urls.py                       3      0   100%
backend/todo/__init__.py                      0      0   100%
backend/todo/admin.py                         1      0   100%
backend/todo/apps.py                          4      0   100%
backend/todo/migrations/0001_initial.py       5      0   100%
backend/todo/migrations/__init__.py           0      0   100%
backend/todo/models.py                       13      1    92%
backend/todo/serializers.py                   6      0   100%
backend/todo/tests/__init__.py                0      0   100%
backend/todo/tests/test_views.py            114      0   100%
backend/todo/urls.py                          3      0   100%
backend/todo/views.py                        23      0   100%
-------------------------------------------------------------
TOTAL                                       193      1    99%
```

## 振り返り
前回の面接を通じて、REST APIに対する理解が浅いことを改めて実感しました。REST APIの理解を深めるために、「現場で使える Django REST Framework の教科書」を購入し、学習を進めました。  
その後、技術課題としていただいたToDoアプリを実装する中で、読んだ内容が非常に便利であることを実感しました。  
これまでPythonとDjangoを使用するバックエンド開発がメインでしたが、フロントエンドの知識には自信がありませんでした。  
個人的にあまり経験のないReact（TypeScript）を使用し、さらなる成長を目指して選定しました。  
その過程で、フロントエンド側の知識が不足していることを改めて感じました。技術課題に取り組む前後で、自分が成長したことを実感しています。  
特に良かった取り組みは、フロントエンドとバックエンドの両方でテストコードを作成したことです。  
これにより、作成したコードが無責任にならないように、きちんとした品質を維持することができました。
また、自分のフロントエンドとバックエンドのスキルを振り返り、知識や技術が不足していることを再認識しました。
自分の前向きな姿勢とキャッチアップ能力を活かし、プロフェッショナルなエンジニアを目指して自己研鑽を続けていきたいと思います。ありがとうございました。
