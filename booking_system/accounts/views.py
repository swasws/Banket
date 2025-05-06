# accounts/views.py

from django.utils import timezone
from datetime import timedelta

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate

from rest_framework.authtoken.models import Token
from .serializers import OwnerRegisterSerializer, ClientRegisterSerializer

from rest_framework.permissions import AllowAny



class OwnerRegisterView(APIView):
    """
    Регистрация владельца (role='owner').
    При успешной регистрации возвращает сообщение.
    """

    def post(self, request):
        serializer = OwnerRegisterSerializer(data=request.data)
        if serializer.is_valid():
            # role='owner' прописано внутри сериализатора (или в create())
            user = serializer.save()
            return Response(
                {"message": "Owner registered successfully."},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OwnerLoginView(APIView):
    """
    Логин владельца:
    - Проверяем username/password через authenticate().
    - Убеждаемся, что user.role == 'owner'.
    - Если у пользователя есть старый токен (старше 30 дней), удаляем его.
    - Создаём (или возвращаем) Token и возвращаем его в ответе + role, organization_name, username.
    """

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if not user:
            return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

        if user.role != 'owner':
            return Response({"error": "User is not an owner."}, status=status.HTTP_403_FORBIDDEN)

        # Проверяем, есть ли у пользователя старый токен
        old_token = Token.objects.filter(user=user).first()
        if old_token:
            token_age = timezone.now() - old_token.created
            # Если токен старше 30 дней, удаляем и создаём заново
            if token_age > timedelta(days=30):
                old_token.delete()

        # Создаём/получаем новый токен (если старый был удалён)
        token, created = Token.objects.get_or_create(user=user)

        return Response({
            "user_id": user.id,
            "token": token.key,
            "role": user.role,
            "organization_name": user.organization_name,
            "username": user.username,
            "message": "Owner logged in successfully."
        }, status=status.HTTP_200_OK)


class ClientRegisterView(APIView):
    """
    Регистрация клиента (role='client').
    При успешной регистрации возвращает сообщение.
    """

    class ClientRegisterView(APIView):
        permission_classes = [AllowAny]

    def post(self, request):
        serializer = ClientRegisterSerializer(data=request.data)
        if serializer.is_valid():
            # role='client' прописано в create() сериализатора
            user = serializer.save()
            return Response(
                {"message": "Client registered successfully."},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ClientLoginView(APIView):
    """
    Логин клиента:
    - Проверяем username/password через authenticate().
    - Убеждаемся, что user.role == 'client'.
    - Если токен старше 30 дней, удаляем и создаём заново.
    - Возвращаем токен, role, username, full_name (при желании).
    """

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)
        if not user:
            return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

        if user.role != 'client':
            return Response({"error": "User is not a client."}, status=status.HTTP_403_FORBIDDEN)

        # Проверим, не истёк ли старый токен
        old_token = Token.objects.filter(user=user).first()
        if old_token:
            token_age = timezone.now() - old_token.created
            if token_age > timedelta(days=30):
                old_token.delete()

        token, created = Token.objects.get_or_create(user=user)

        return Response({
            "user_id": user.id,
            "token": token.key,
            "role": user.role,
            "username": user.username,
            "full_name": user.full_name,  # если нужно
            "message": "Client logged in successfully."
        }, status=status.HTTP_200_OK)
