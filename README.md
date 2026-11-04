# Agenda de contactos

Aplicación web para guardar y administrar contactos, hecha con Angular. Es un proyecto solo de frontend: no usa backend, y los usuarios, la sesión y los contactos se guardan en el navegador con `localStorage`.

## Funcionalidades

- **Registro** con nombre, apellido, email y contraseña (mínimo 8 caracteres) con confirmación.
- **Inicio y cierre de sesión.** El email no distingue mayúsculas y la contraseña no se guarda en texto plano: se guarda un hash SHA-256.
- **Rutas protegidas.** Sin sesión te lleva al login; con sesión no podés volver al login ni al registro.
- **Contactos por usuario.** Cada usuario ve y administra solo los suyos.
- **Lista de contactos** con avatar de iniciales, y botones para editar y eliminar.
- **Detalle** del contacto con teléfono, email y dirección.
- **Alta y edición** con validaciones: nombre, apellido y teléfono son obligatorios; el email y la dirección son opcionales, y el email, si se completa, tiene que ser válido.
- **Eliminar con confirmación** y avisos con SweetAlert2.
- **Mostrar u ocultar la contraseña** con el icono de ojo.
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
├── interfaces/   Contact, User, LoginForm y RegisterForm
├── pages/        login, register, contact-list, contact-details y create-edit-contact
├── services/     AuthService y ContactService
├── testing/      ayuda para los tests (localStorage en memoria)
└── utils/        alertas, validadores y acceso a localStorage
```

## Cómo se guardan los datos

Todo vive en el `localStorage` del navegador, con estas claves: `agenda:users`, `agenda:session`, `agenda:contacts` y `agenda:nextContactId`.

Algunos límites a tener en cuenta:

- Los datos existen solo en ese navegador. Si se borran los datos del sitio, desaparecen las cuentas y los contactos, y otro navegador o dispositivo no los comparte.
- Como todo corre en el cliente, el hash de la contraseña no es seguridad real: cualquiera con acceso al navegador puede ver lo guardado.
- Para calcular el hash se usa `crypto.subtle`, que solo está disponible en `localhost` o con `https`.

## Tecnologías

Angular 22, Signal Forms, SweetAlert2, SCSS y Vitest.
