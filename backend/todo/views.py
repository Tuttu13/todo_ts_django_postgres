from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from todo.models import Task
from todo.serializers import TaskSerializer


class CustomPagination(PageNumberPagination):
    page_size = 5  # 1ページあたりのアイテム数
    page_size_query_param = 'page_size'

class ListView(generics.ListCreateAPIView):
    queryset = Task.objects.all().order_by('due_date')
    serializer_class = TaskSerializer
    pagination_class = CustomPagination  

class DetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

@api_view(['GET'])
def task_summary(request):
    total_tasks = Task.objects.count()
    completed_tasks = Task.objects.filter(status=2).count()  # assuming 2 is "completed"
    return Response({
        'total_tasks': total_tasks,
        'completed_tasks': completed_tasks
    })