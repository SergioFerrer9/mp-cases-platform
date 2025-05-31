# mp-cases-platform

**Sistema de Gestión de Casos para el Ministerio Público de Guatemala**

Este proyecto es una solución técnica propuesta para la prueba de desarrollo del Ministerio Público, orientada a facilitar la administración, seguimiento y control de casos judiciales mediante una plataforma web segura, modular y contenerizada.

## Alacances

Aplicación web que permita:
- Registrar, actualizar y asignar casos a fiscales.
- Controlar el estado y progreso de los casos.
- Generar informes y estadísticas.
- Garantizar autenticación segura y control de acceso.
- Contar con una arquitectura contenerizada moderna, con backend modular, frontend reactivo y base de datos optimizada con procedimientos almacenados.

## Tecnologías Utilizadas

| Componente     | Tecnología         |
|----------------|--------------------|
| Frontend       | React.js           |
| Backend API    | Node.js + Express  |
| Base de Datos  | SQL Server         |
| Dockerización  | Docker & Docker Compose |
| Documentación API | Swagger          |
| Pruebas Backend | Jest + Supertest  |

## Arquitectura

La solución sigue una arquitectura basada en microservicios ligeros:

- **Frontend (ReactJS)**: Aplicación de usuario para fiscales.
- **Auth Service**: Servicio de autenticación con control de roles y JWT.
- **Case Management Service**: Registro, reasignación y control de estado de casos.
- **Reports Service**: Generación de estadísticas e informes.
- **SQL Server**: Procedimientos almacenados para cada operación de base de datos.
- **Docker Compose**: Orquestación del entorno completo.
