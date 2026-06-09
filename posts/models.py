from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

def expiracion_default():
    return timezone.now() + timedelta(hours=24)

class Producto(models.Model):

    CATEGORIA_CHOICES = [
        ('verdura', 'Verdura'),
        ('fruta', 'Fruta'),
        ('tuberculo', 'Tubérculo'),
        ('otro', 'Otro'),
    ]

    granjero    = models.ForeignKey(User, on_delete=models.CASCADE, related_name='productos')
    nombre      = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    categoria   = models.CharField(max_length=20, choices=CATEGORIA_CHOICES, default='otro')
    precio      = models.DecimalField(max_digits=10, decimal_places=2)
    stock       = models.FloatField(help_text='Cantidad disponible en libras')
    foto        = models.ImageField(upload_to='productos/', blank=True, null=True)
    expira_en   = models.DateTimeField(default=expiracion_default)
    creado_en   = models.DateTimeField(auto_now_add=True)

    @property
    def activo(self):
        return timezone.now() < self.expira_en and self.stock > 0

    def __str__(self):
        return f'{self.nombre} - {self.granjero.username}'


class Pedido(models.Model):

    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('en_camino', 'En camino'),
        ('entregado', 'Entregado'),
        ('cancelado', 'Cancelado'),
    ]

    cliente     = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pedidos')
    productos   = models.ManyToManyField(Producto, through='ItemPedido')
    estado      = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')
    direccion   = models.TextField()
    total       = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    creado_en   = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Pedido #{self.id} - {self.cliente.username}'


class ItemPedido(models.Model):
    pedido      = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='items')
    producto    = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad    = models.FloatField(help_text='Cantidad en libras')
    precio      = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f'{self.cantidad}lb de {self.producto.nombre}'