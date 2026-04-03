# TICKETERA

Sistema de gestión de tickets y comparación de precios de supermercados con React y Firebase.

## Características

- **Autenticación segura** - Registro, login y recuperación de contraseña con Firebase Auth
- **Tickets** - Registro y seguimiento de gastos por supermercado con totales semanales, mensuales y anuales
- **Lista de compras** - Crea, guarda y comparte listas de productos con descarga como imagen
- **Comparador de precios** - Compara precios entre 7 supermercados españoles (Mercadona, Carrefour, Lidl, Aldi, Dia, Consum, Eroski)
- **Datos en la nube** - Todos los datos sincronizados en Firebase Firestore
- **Diseño responsive** - Funciona en móvil, tablet y escritorio

## Tecnologías

- React 18
- Vite
- Firebase (Auth, Firestore, Hosting)
- React Router DOM
- Bootstrap / React-Bootstrap
- html2canvas
- date-fns
- UUID

## Instalación

```bash
npm install
```

## Configuración

Crea un archivo `.env.local` con las variables de Firebase:

```
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto_id
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
VITE_FIREBASE_APP_ID=tu_app_id
VITE_FIREBASE_MEASUREMENT_ID=tu_measurement_id
```

## Desarrollo

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Testing

```bash
npm test
```

## Despliegue

```bash
firebase deploy
```

## Estructura del proyecto

```
src/
├── components/
│   ├── 404/          # Página de error
│   ├── FOOTER/       # Footer con enlaces legales
│   ├── HOME/         # Dashboard principal
│   ├── INICIO/       # Página de login
│   ├── LISTA/        # Lista de compras
│   ├── LOGIN/        # Registro
│   ├── PRECIO/       # Comparador de precios
│   ├── RECUPERAR/    # Recuperar contraseña
│   └── TICKETS/      # Tracker de gastos
├── context/
│   └── AuthContext.jsx
├── routes/
│   └── Routes.jsx
└── service/
    ├── fireservice.jsx
    ├── storageService.js
    └── supermarketService.js
```
