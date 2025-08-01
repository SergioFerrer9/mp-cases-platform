# Despliegue en Kubernetes - MP Cases Platform

## Estructura de Archivos

```
k8s/
├── namespace.yaml          # Namespace para la aplicación
├── configmap.yaml          # Variables de entorno no sensibles
├── secret.yaml            # Credenciales sensibles
├── auth-deployment.yaml    # Deployment del servicio de autenticación
├── cases-deployment.yaml   # Deployment del servicio de casos
├── reports-deployment.yaml # Deployment del servicio de reportes
├── frontend-deployment.yaml # Deployment del frontend
├── services.yaml          # Services para exponer los pods
├── ingress.yaml           # Ingress para el frontend
├── kustomization.yaml     # Configuración de Kustomize
└── README.md              # Este archivo
```

## Configuración Requerida

### 1. Actualizar ConfigMap y Secret

Antes del despliegue, actualiza los siguientes archivos:

- `configmap.yaml`: Configura las variables de entorno de la base de datos
- `secret.yaml`: Configura las credenciales (en base64)

### 2. Construir las Imágenes

```bash
# Construir imágenes desde los directorios correspondientes
docker build -t sergioferrer9/mp-auth-service:1.0 ./services/auth
docker build -t sergioferrer9/mp-cases-service:1.0 ./services/cases
docker build -t sergioferrer9/mp-reports-service:1.0 ./services/reports
docker build -t sergioferrer9/mp-frontend:1.0 ./frontend
```

### 3. Subir Imágenes al Registry

```bash
# Subir imágenes a Docker Hub
docker push sergioferrer9/mp-auth-service:1.0
docker push sergioferrer9/mp-cases-service:1.0
docker push sergioferrer9/mp-reports-service:1.0
docker push sergioferrer9/mp-frontend:1.0
```

## Comandos de Despliegue

### Desplegar toda la aplicación:
```bash
kubectl apply -k k8s/
```

### Desplegar recursos individuales:
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/auth-deployment.yaml
kubectl apply -f k8s/cases-deployment.yaml
kubectl apply -f k8s/reports-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/services.yaml
kubectl apply -f k8s/ingress.yaml
```

### Verificar el estado:
```bash
kubectl get all -n mp-cases-platform
kubectl get pods -n mp-cases-platform
kubectl get services -n mp-cases-platform
kubectl get ingress -n mp-cases-platform
```

### Ver logs:
```bash
kubectl logs -f deployment/auth-service -n mp-cases-platform
kubectl logs -f deployment/cases-service -n mp-cases-platform
kubectl logs -f deployment/reports-service -n mp-cases-platform
kubectl logs -f deployment/frontend -n mp-cases-platform
```

## Eliminar la aplicación:
```bash
kubectl delete -k k8s/
```

## Notas Importantes

1. **Base de Datos**: Asegúrate de que la base de datos esté accesible desde el cluster de Kubernetes
2. **Health Checks**: Los servicios deben tener endpoints `/health` para los probes
3. **Ingress**: Configura el host en `ingress.yaml` según tu dominio
4. **Recursos**: Ajusta los límites de CPU y memoria según tus necesidades
5. **Replicas**: Modifica el número de réplicas según la carga esperada

## Troubleshooting

### Verificar conectividad entre servicios:
```bash
kubectl exec -it deployment/frontend -n mp-cases-platform -- curl auth-service:4000/health
```

### Verificar variables de entorno:
```bash
kubectl exec -it deployment/auth-service -n mp-cases-platform -- env | grep DB
``` 