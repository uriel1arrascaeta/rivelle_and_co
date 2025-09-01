from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from products.models import Product
from products.serializers import ProductSerializer


class ProductTests(APITestCase):
    def setUp(self):
        self.product1 = Product.objects.create(
            name="Test Product 1", description="A test description.", price="19.99"
        )
        self.product2 = Product.objects.create(
            name="Test Product 2", description="Another test description.", price="29.99"
        )

    def test_list_products(self):
        """
        Ensure we can list all products.
        """
        url = reverse('product-list')
        response = self.client.get(url, format='json')
        products = Product.objects.order_by('id')
        serializer = ProductSerializer(products, many=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'], serializer.data)

    def test_retrieve_product(self):
        """
        Ensure we can retrieve a single product.
        """
        url = reverse('product-detail', kwargs={'pk': self.product1.pk})
        response = self.client.get(url, format='json')
        product = Product.objects.get(pk=self.product1.pk)
        serializer = ProductSerializer(product)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)
