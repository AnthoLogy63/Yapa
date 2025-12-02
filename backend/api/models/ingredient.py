from django.db import models


class Ingredient(models.Model):
    """
    Ingrediente general: arroz, pollo, leche, etc.
    """
    name = models.CharField(max_length=150, unique=True)
    classification = models.CharField(max_length=100, blank=True)  # fruta, verdura, cereal, etc.
    type_restriction = models.CharField(
        max_length=100,
        blank=True,
        help_text="Tipo de restricción asociada al ingrediente (alergia, intolerancia, etc.)"
    )
    note = models.TextField(blank=True)
    date_register = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'ingredient'
        verbose_name = 'Ingrediente'
        verbose_name_plural = 'Ingredientes'
        ordering = ['name']

    def __str__(self):
        return self.name