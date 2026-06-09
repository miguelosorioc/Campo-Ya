from django.urls import path
from .views import ProductoListView, ProductoCreateView, ProductoDetailView, PedidoView

urlpatterns = [
    path('productos/',        ProductoListView.as_view(),   name='productos'),
    path('productos/crear/',  ProductoCreateView.as_view(), name='crear-producto'),
    path('productos/<int:pk>/', ProductoDetailView.as_view(), name='producto-detalle'),
    path('pedidos/',          PedidoView.as_view(),         name='pedidos'),
]