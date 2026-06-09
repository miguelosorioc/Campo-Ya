from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.utils import timezone
from .models import Producto, Pedido, ItemPedido
from .serializers import ProductoSerializer, PedidoSerializer

class ProductoListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        # Solo productos activos (sin expirar y con stock)
        productos = Producto.objects.filter(
            expira_en__gt=timezone.now(),
            stock__gt=0
        )
        serializer = ProductoSerializer(productos, many=True)
        return Response(serializer.data)


class ProductoCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        # Solo granjeros pueden publicar
        if request.user.profile.rol != 'granjero':
            return Response(
                {'error': 'Solo los granjeros pueden publicar productos'},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer = ProductoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(granjero=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductoDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        try:
            producto = Producto.objects.get(pk=pk)
        except Producto.DoesNotExist:
            return Response({'error': 'Producto no encontrado'}, status=404)
        serializer = ProductoSerializer(producto)
        return Response(serializer.data)

    def delete(self, request, pk):
        try:
            producto = Producto.objects.get(pk=pk, granjero=request.user)
        except Producto.DoesNotExist:
            return Response({'error': 'No autorizado'}, status=403)
        producto.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class PedidoView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        pedidos = Pedido.objects.filter(cliente=request.user)
        serializer = PedidoSerializer(pedidos, many=True)
        return Response(serializer.data)

    def post(self, request):
        direccion = request.data.get('direccion')
        items     = request.data.get('items', [])

        if not direccion or not items:
            return Response(
                {'error': 'Dirección e items son requeridos'},
                status=status.HTTP_400_BAD_REQUEST
            )

        pedido = Pedido.objects.create(
            cliente=request.user,
            direccion=direccion
        )

        total = 0
        for item in items:
            producto = Producto.objects.get(pk=item['producto_id'])
            cantidad = item['cantidad']
            ItemPedido.objects.create(
                pedido=pedido,
                producto=producto,
                cantidad=cantidad,
                precio=producto.precio
            )
            total += producto.precio * cantidad

        pedido.total = total
        pedido.save()

        serializer = PedidoSerializer(pedido)
        return Response(serializer.data, status=status.HTTP_201_CREATED)