# Agenda de contactos

Aplicación web para guardar y administrar contactos, hecha con Angular. Se conecta a la API [AgendaApi](https://github.com/NicolasBologna/AgendaApi) (ASP.NET Core): los usuarios y los contactos viven en el back, y el front solo guarda en el navegador el token de sesión.

## Funcionalidades

- **Registro** con nombre, apellido, email y contraseña (mínimo 8 caracteres) con confirmación.
- **Inicio y cierre de sesión** con token. Al cerrar sesión se pide confirmación, y si el token vence la app te lleva al login.
- **Rutas protegidas.** Sin sesión te lleva al login; con sesión no podés volver al login ni al registro.
- **Contactos por usuario.** Cada usuario ve y administra solo los suyos.
- **Lista de contactos** con avatar de iniciales, y botones para editar y eliminar.
- **Detalle** del contacto con teléfono, email y dirección.
- **Alta y edición** con validaciones: nombre, apellido y teléfono son obligatorios; el email y la dirección son opcionales, y el email, si se completa, tiene que ser válido.
- **Eliminar con confirmación** y avisos con SweetAlert2.
- **Mostrar u ocultar la contraseña** con el icono de ojo.
- **Avisos claros** si el servidor no responde o rechaza un pedido.
- **Diseño responsive y accesible:** etiquetas asociadas a cada campo, foco visible, contraste AA, navegación con teclado y un título de página por ruta.

## Rutas

| Ruta                 | Pantalla             | Acceso          |
| -------------------- | -------------------- | --------------- |
| `/login`             | Iniciar sesión       | Solo sin sesión |
| `/register`          | Registro             | Solo sin sesión |
| `/contacts`          | Lista de contactos   | Con sesión      |
| `/contacts/create`   | Nuevo contacto       | Con sesión      |
| `/contacts/:id`      | Detalle del contacto | Con sesión      |
| `/contacts/:id/edit` | Editar contacto      | Con sesión      |

Cualquier otra dirección redirige a `/contacts`.

## Cómo ejecutarlo

Hacen falta el back y el front corriendo a la vez.

### 1. El back (AgendaApi)

Clonalo (por ejemplo en una carpeta `BE` al lado de la de este proyecto) y levantalo con el SDK de .NET 8 o superior:

```bash
git clone https://github.com/NicolasBologna/AgendaApi.git
cd AgendaApi
dotnet run --project API
```

Por defecto queda escuchando en `http://localhost:5000`. Si lo corrés de otra forma (por ejemplo desde Visual Studio) y la dirección es otra, cambiala en `API_URL`, dentro de `src/app/utils/api.ts`.

### 2. El front

Hace falta tener instalado [Node.js](https://nodejs.org) (versión LTS) y npm.

```bash
npm install
npm start
```

Después abrí `http://localhost:4200`. La página se recarga sola cuando guardás un cambio.

Si en Windows PowerShell muestra que la ejecución de scripts está deshabilitada, podés usar `npm.cmd start`, abrir una terminal de Command Prompt, o habilitar los scripts solo para tu usuario:

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### Usuarios de prueba

La base del back trae dos usuarios de ejemplo, y también podés registrar el tuyo desde la app:

| Email                         | Contraseña         |
| ----------------------------- | ------------------ |
| `karenbailapiola@gmail.com`   | `Pa$$w0rd`         |
| `elluismidetotoras@gmail.com` | `lamismadesiempre` |

## Comandos

| Comando         | Qué hace                                   |
| --------------- | ------------------------------------------ |
| `npm start`     | Levanta el servidor de desarrollo          |
| `npm test`      | Corre los tests con Vitest                 |
| `npm run build` | Genera la versión de producción en `dist/` |

## Estructura

```
src/app/
├── components/   avatar, cabecera de página y botón para ver la contraseña
├── guards/       authGuard y guestGuard
├── interfaces/   Contact, LoginForm y RegisterForm
├── pages/        login, register, contact-list, contact-details y create-edit-contact
├── services/     AuthService y ContactService, que llaman a la API
└── utils/        alertas, validadores, acceso a localStorage y llamada a la API
```

## Dónde viven los datos

Los usuarios y los contactos se guardan en la base de datos del back. El front solo guarda en el `localStorage` del navegador el token de sesión, con la clave `agenda:token`.

Si el back no está corriendo, la app muestra un aviso y no puede iniciar sesión ni cargar los contactos.

## Tecnologías

Front: Angular 22, Signal Forms, SweetAlert2, SCSS y Vitest. Back: ASP.NET Core 8 con SQLite.
