# Lingo-shelf-DAWG10

## Integrantes

| # | Nombre                        | Carnet  |
|---|-------------------------------|---------|
| 1 | Karen Guadalupe Flores Melara | FM24002 |
| 2 | Mercedes Andrea Pérez Elías   | PE24012 |
| 3 | Kennet Alonso Castro Siguenza | CS24010 |
| 4 | Pablo Daniel Hurtado Cortez   | HC24019 |
| 5 | Edwin Ulises Cruz Grijalva    | CG21038 |

## Desarrollo

Utilizar el siguiente comando para correr el frontend con docker
```
docker compose --profile front-dev up --watch
```
## Descripción del Proyecto 
Lingo Shelf es una aplicación e-commerce de nicho diseñada específicamente para estudiantes de idiomas, el objetivo principal es la comercialización de material de aprendizaje y lectura, incluyendo obras en su idioma original, traducciones, material didáctico y audiolibros. El sistema está pensado para ser accesible tanto desde dispositivos móviles y computadoras de escritorio(desktop).
La aplicación de Lingo Shelf es el motor que conecta las vistas móviles y desktop con la base de datos, permitiendo desde la gestión interna de los libros (altas, bajas y cambios) hasta el flujo completo de un cliente.

## Funciones principales
1- Gestión de usuairios y autenticación

-Registro e inicio de sesión: permite a los usuarios crear cuentas y autenticarse de forma segura para acceder a una experiencia personalizada 

2- Catálogo de libros y productos(operaciones CRUD)

-Lectura y busqueda: controla el flujo de datos para que los usuarios busquen libros y consulten sus traducciones disponibles

-Home dinámico: filtra y sirve la información de los libreos "más buscados" o populares para la pantalla principal

-Administración de inventario: permite a los usuarios autorizados (administradoeres/vendedores) gestionar el catalogo mediante la creación(Create), edición(Update) y eliminación(Delete) de libros

3- Experiencia de usuario y persistencia 

-Lista de deseos(Wishlist): permite a los clientes guardar libros de su interes para comprarlos en el futuro

-Carrito de compras: Gestiona el estado de los productos seleccionados (agregar, quitar o modificar cantidades) antes de procesar el pago o cierre de la compra

