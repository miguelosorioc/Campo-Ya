from rest_framework import serializers
from .models import Producto, Pedido, ItemPedido

class ProductoSerializer(serializers.ModelSerializer):
    granjero = serializers.CharField(source='granjero.username', read_only=True)
    activo   = serializers.BooleanField(read_only=True)

    class Meta:
        model  = Producto
        fields = [
            'id', 'granjero', 'nombre', 'descripcion',
            'categoria', 'precio', 'stock', 'foto',
            'expira_en', 'creado_en', 'activo'
        ]

class ItemPedidoSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)

    class Meta:
        model  = ItemPedido
        fields = ['id', 'producto', 'producto_nombre', 'cantidad', 'precio']

class PedidoSerializer(serializers.ModelSerializer):
    items   = ItemPedidoSerializer(many=True, read_only=True)
    cliente = serializers.CharField(source='cliente.username', read_only=True)

    class Meta:
        model  = Pedido
        fields = ['id', 'cliente', 'estado', 'direccion', 'total', 'creado_en', 'items']