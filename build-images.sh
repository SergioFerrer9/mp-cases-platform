#!/bin/bash

# Script para construir todas las imágenes Docker de MP Cases Platform
# Versión: 1.0

echo "🚀 Iniciando construcción de imágenes Docker para MP Cases Platform v1.0"
echo "================================================================"

# Variables
REGISTRY="sergioferrer9"
VERSION="1.0"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para construir imagen
build_image() {
    local service_name=$1
    local dockerfile_path=$2
    local image_name="$REGISTRY/mp-$service_name:$VERSION"
    
    echo -e "${YELLOW}🔨 Construyendo $image_name...${NC}"
    
    if docker build -t $image_name $dockerfile_path; then
        echo -e "${GREEN}✅ $image_name construida exitosamente${NC}"
        return 0
    else
        echo -e "${RED}❌ Error construyendo $image_name${NC}"
        return 1
    fi
}

# Función para hacer push de imagen
push_image() {
    local service_name=$1
    local image_name="$REGISTRY/mp-$service_name:$VERSION"
    
    echo -e "${YELLOW}📤 Subiendo $image_name a Docker Hub...${NC}"
    
    if docker push $image_name; then
        echo -e "${GREEN}✅ $image_name subida exitosamente${NC}"
        return 0
    else
        echo -e "${RED}❌ Error subiendo $image_name${NC}"
        return 1
    fi
}

# Verificar que Docker esté ejecutándose
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker no está ejecutándose. Por favor inicia Docker primero.${NC}"
    exit 1
fi

# Verificar que estemos en el directorio correcto
if [ ! -f "docker-compose.yml" ]; then
    echo -e "${RED}❌ No se encontró docker-compose.yml. Ejecuta este script desde el directorio raíz del proyecto.${NC}"
    exit 1
fi

# Construir todas las imágenes
echo -e "${YELLOW}📦 Construyendo imágenes...${NC}"

# Frontend
build_image "frontend" "./frontend"

# Auth Service
build_image "auth-service" "./services/auth"

# Cases Service
build_image "cases-service" "./services/cases"

# Reports Service
build_image "reports-service" "./services/reports"

echo ""
echo -e "${GREEN}🎉 Todas las imágenes han sido construidas exitosamente!${NC}"
echo ""

# Preguntar si quiere hacer push
read -p "¿Deseas subir las imágenes a Docker Hub? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}📤 Iniciando push de imágenes...${NC}"
    
    # Hacer push de todas las imágenes
    push_image "frontend"
    push_image "auth-service"
    push_image "cases-service"
    push_image "reports-service"
    
    echo ""
    echo -e "${GREEN}🎉 Todas las imágenes han sido subidas a Docker Hub!${NC}"
fi

echo ""
echo -e "${GREEN}📋 Resumen de imágenes construidas:${NC}"
echo "  • sergioferrer9/mp-frontend:1.0"
echo "  • sergioferrer9/mp-auth-service:1.0"
echo "  • sergioferrer9/mp-cases-service:1.0"
echo "  • sergioferrer9/mp-reports-service:1.0"
echo ""
echo -e "${YELLOW}💡 Para desplegar en Kubernetes, ejecuta: kubectl apply -k k8s/${NC}" 