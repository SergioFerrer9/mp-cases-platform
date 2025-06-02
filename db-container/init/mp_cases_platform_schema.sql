
-- ========================================
-- BASE DE DATOS: mp_cases_platform
-- ========================================

-- CREAR BASE DE DATOS
CREATE DATABASE mp_cases_platform;
GO
USE mp_cases_platform;
GO

-- ========================================
-- TABLA: Fiscalia
-- ========================================
CREATE TABLE Fiscalia (
    id INT PRIMARY KEY IDENTITY(1,1),
    nombre NVARCHAR(100) NOT NULL
);
GO

-- ========================================
-- TABLA: Usuario
-- ========================================
CREATE TABLE Usuario (
    id INT PRIMARY KEY IDENTITY(1,1),
    nombre NVARCHAR(100) NOT NULL,
    correo NVARCHAR(100) NOT NULL UNIQUE,
    clave NVARCHAR(255) NOT NULL,
    rol NVARCHAR(50) NOT NULL, -- 'fiscal', 'admin'
    fiscalia_id INT NOT NULL,
    FOREIGN KEY (fiscalia_id) REFERENCES Fiscalia(id)
);
GO

-- ========================================
-- TABLA: Caso
-- ========================================
CREATE TABLE Caso (
    id INT PRIMARY KEY IDENTITY(1,1),
    titulo NVARCHAR(100) NOT NULL,
    descripcion NVARCHAR(MAX),
    estado NVARCHAR(50) NOT NULL CHECK (estado IN ('pendiente', 'progreso', 'cerrado')),
    fiscal_id INT NOT NULL,
    fecha_creacion DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (fiscal_id) REFERENCES Usuario(id)
);
GO

-- ========================================
-- TABLA: LogIntentoFallido
-- ========================================
CREATE TABLE LogIntentoFallido (
    id INT PRIMARY KEY IDENTITY(1,1),
    caso_id INT,
    usuario_origen_id INT,
    usuario_destino_id INT,
    razon NVARCHAR(255),
    fecha DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (caso_id) REFERENCES Caso(id),
    FOREIGN KEY (usuario_origen_id) REFERENCES Usuario(id),
    FOREIGN KEY (usuario_destino_id) REFERENCES Usuario(id)
);
GO

-- ========================================
-- PROCEDIMIENTOS ALMACENADOS
-- ========================================

-- Crear un nuevo caso
CREATE PROCEDURE sp_crear_caso
    @titulo NVARCHAR(100),
    @descripcion NVARCHAR(MAX),
    @fiscal_id INT
AS
BEGIN
    INSERT INTO Caso (titulo, descripcion, estado, fiscal_id)
    VALUES (@titulo, @descripcion, 'pendiente', @fiscal_id);
END;
GO

-- Actualizar estado de un caso
CREATE PROCEDURE sp_actualizar_estado_caso
    @caso_id INT,
    @nuevo_estado NVARCHAR(50)
AS
BEGIN
    UPDATE Caso
    SET estado = @nuevo_estado
    WHERE id = @caso_id;
END;
GO

-- Reasignar un caso si el estado es pendiente
CREATE PROCEDURE sp_reasignar_caso
    @caso_id INT,
    @nuevo_fiscal_id INT
AS
BEGIN
    UPDATE Caso
    SET fiscal_id = @nuevo_fiscal_id
    WHERE id = @caso_id AND estado = 'pendiente';
END;
GO

-- Obtener casos por fiscal
USE mp_cases_platform;
GO

IF OBJECT_ID('sp_obtener_casos_por_fiscal', 'P') IS NOT NULL
    DROP PROCEDURE sp_obtener_casos_por_fiscal;
GO

CREATE PROCEDURE sp_obtener_casos_por_fiscal
    @fiscal_id INT
AS
BEGIN
    SELECT 
        c.id,
        c.titulo,
        c.descripcion,
        c.estado,
        c.fecha_creacion,
        f.nombre AS fiscalia
    FROM Caso c
    INNER JOIN Usuario u ON c.fiscal_id = u.id
    INNER JOIN Fiscalia f ON u.fiscalia_id = f.id
    WHERE c.fiscal_id = @fiscal_id;
END;
GO
    

-- Generar estadísticas de casos por estado
CREATE PROCEDURE sp_estadisticas_por_estado
AS
BEGIN
    SELECT estado, COUNT(*) AS total
    FROM Caso
    GROUP BY estado;
END;
GO

-- ========================================
-- PROCEDIMIENTOS PARA GESTIÓN DE USUARIOS
-- ========================================

-- Crear un nuevo usuario
CREATE PROCEDURE sp_crear_usuario
    @nombre NVARCHAR(100),
    @correo NVARCHAR(100),
    @clave NVARCHAR(255),
    @rol NVARCHAR(50),
    @fiscalia_id INT
AS
BEGIN
    INSERT INTO Usuario (nombre, correo, clave, rol, fiscalia_id)
    VALUES (@nombre, @correo, @clave, @rol, @fiscalia_id);
END;
GO

-- Obtener usuario por correo (para login)
CREATE PROCEDURE sp_obtener_usuario_por_correo
    @correo NVARCHAR(100)
AS
BEGIN
    SELECT TOP 1 * FROM Usuario
    WHERE correo = @correo;
END;
GO

-- Listar todos los usuarios
CREATE PROCEDURE sp_listar_usuarios
AS
BEGIN
    SELECT * FROM Usuario;
END;
GO

-- Actualizar datos de un usuario
CREATE PROCEDURE sp_actualizar_usuario
    @id INT,
    @nombre NVARCHAR(100),
    @correo NVARCHAR(100),
    @rol NVARCHAR(50),
    @fiscalia_id INT
AS
BEGIN
    UPDATE Usuario
    SET nombre = @nombre,
        correo = @correo,
        rol = @rol,
        fiscalia_id = @fiscalia_id
    WHERE id = @id;
END;
GO

-- Eliminar usuario
CREATE PROCEDURE sp_eliminar_usuario
    @id INT
AS
BEGIN
    DELETE FROM Usuario WHERE id = @id;
END;
GO

-- Crear Fiscalia
CREATE PROCEDURE sp_crear_fiscalia
    @nombre NVARCHAR(100)
AS
BEGIN
    INSERT INTO Fiscalia (nombre)
    VALUES (@nombre);
END;
GO

-- Crear fiscalía por defecto
INSERT INTO Fiscalia (nombre)
VALUES ('Fiscalía Central Guatemala');
GO
