from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from todo.models import Task
from todo.serializers import TaskSerializer


class CustomPagination(PageNumberPagination):
    """
    CustomPaginationクラス
    ページネーションをカスタマイズし、1ページあたりのタスク数を3に設定
    """
    page_size = 3
    page_size_query_param = 'page_size'

    def get_paginated_response(self, data):
        """
        ページネーションのレスポンスをカスタマイズ
        
        Args:
            data (list): シリアライズされたタスクデータのリスト
        
        Returns:
            Response: ページネーションされたレスポンスデータ
        """
        return Response({
            'links': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link()
            },
            'count': self.page.paginator.count,
            'page_size': self.page_size,
            'results': data
        })

class ListView(generics.ListCreateAPIView):
    """
    タスクリストの表示と新規作成を行うAPI
    GETリクエストでタスクのリストを取得
    POSTリクエストで新しいタスクを作成
    タスクは期限日順に並べ替えられ、ページネーションされます。
    """
    queryset = Task.objects.all().order_by('due_date')
    serializer_class = TaskSerializer
    pagination_class = CustomPagination  

class DetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    特定のタスクの取得、更新、削除を行うAPI
    GETリクエストでタスクの詳細を取得
    PUT/PATCHリクエストでタスクを更新
    DELETEリクエストでタスクを削除
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

@api_view(['GET'])
def task_summary(request):
    """
    タスクのサマリー情報を取得するAPIビュー
    
    Returns:
        Response: タスクのサマリー情報。
    """
    total_tasks = Task.objects.count()
    completed_tasks = Task.objects.filter(status=2).count()
    return Response({
        'total_tasks': total_tasks,
        'completed_tasks': completed_tasks
    })