# Configuración de Envío de Emails - TICKETERA

## Requisitos Previos

1. Firebase CLI instalado
2. Cuenta de Firebase configurada
3. Una cuenta de Gmail (o servicio compatible con SMTP)

---

## Paso 1: Configurar Variables de Email en Firebase

### 1.1 Instalar Firebase CLI (si no lo tienes)

```bash
npm install -g firebase-tools
```

### 1.2 Iniciar sesión en Firebase

```bash
firebase login
```

### 1.3 Configurar credenciales de email

Desde la carpeta raíz del proyecto:

```bash
firebase functions:config:set email.user="tuemail@gmail.com" email.pass="tu-app-password"
```

**⚠️ IMPORTANTE:** No uses tu contraseña normal de Gmail. Gmail requiere una "App Password".

---

## Paso 2: Crear App Password en Gmail

### 2.1 Habilitar Validación en 2 pasos
1. Ve a https://myaccount.google.com
2. Seguridad → Validación en 2 pasos → Activar

### 2.2 Generar Contraseña de Aplicación
1. Ve a https://myaccount.google.com
2. Seguridad → Contraseñas de aplicaciones
3. Selecciona "Otro" como tipo de app
4. Dale un nombre (ej: "TICKETERA Functions")
5. Copia la contraseña generada (16 caracteres sin espacios)

### 2.3 Configurar en Firebase

```bash
firebase functions:config:set email.user="tuemail@gmail.com" email.pass="xxxx xxxx xxxx xxxx"
```

---

## Paso 3: Desplegar Cloud Functions

### 3.1 Instalar dependencias de Functions

```bash
cd functions
npm install
cd ..
```

### 3.2 Desplegar solo las funciones

```bash
firebase deploy --only functions
```

### 3.3 Verificar despliegue

```bash
firebase functions:log
```

Deberías ver algo como:
```
Function successful, memory: 256MB, function duration: 123ms
```

---

## Paso 4: Habilitar API de Cloud Functions

1. Ve a https://console.firebase.google.com
2. Selecciona tu proyecto (ticketera-652e0)
3. Menú lateral → Build → Functions
4. Si aparece "Enable API", haz clic en它

O directamente:
- https://console.cloud.google.com/apis/library/cloudfunctions.googleapis.com

---

## Solución de Problemas

### Error: "Email authentication not enabled"
El email/password auth de Firebase está habilitado. Si no lo ves:
1. Firebase Console → Authentication → Sign-in method
2. Asegúrate de que "Email/Password" esté habilitado

### Error: "PERMISSION_DENIED"
Las funciones se despliegan pero no pueden ejecutar. Verifica:
1. Que el proyecto ID sea correcto en .env.local
2. Que las functions se desplegaron correctamente

### Error: "Invalid login credentials" (Gmail)
1. Verifica que la App Password sea correcta
2. Asegúrate de que la validación en 2 pasos esté activada
3. Verifica que el email.user en functions:config sea correcto

### Error: "Could not reach Cloud Functions emulator"
El frontend intenta conectarse a un emulador local. Asegúrate de que:
1. No estés ejecutando `firebase emulators:start`
2. Las variables de entorno VITE_ sean correctas

---

## Alternativas a Gmail

### SendGrid (100 emails/día gratis)
```bash
firebase functions:config:set email.service="sendgrid" email.key="tu-sendgrid-api-key"
```

### Mailgun (100 emails/día gratis)
```bash
firebase functions:config:set email.service="mailgun" email.key="tu-mailgun-api-key" email.domain="tu-dominio.com"
```

### Outlook/Hotmail
```bash
firebase functions:config:set email.user="tu@outlook.com" email.pass="tu-contraseña" email.host="smtp-mail.outlook.com"
```

---

## Probar el Flujo

1. Ejecuta la app: `npm run dev`
2. Ve a la página de login
3. Click en "¿Olvidaste tu contraseña?"
4. Ingresa un email registrado
5. Revisa la bandeja de entrada
6. Ingresa el código + nueva contraseña
7. Verifica que la contraseña se haya cambiado en Firebase Auth

---

## Comandos Útiles

```bash
# Ver configuración actual
firebase functions:config:get

# Actualizar email
firebase functions:config:set email.user="nuevo@gmail.com" email.pass="nueva-password"

# Ver logs en tiempo real
firebase functions:log --only sendPasswordResetCode,verifyResetCode

# Eliminar funciones (si necesitas recrear)
firebase functions:delete sendPasswordResetCode verifyResetCode
```

---

## Límites Gratuitos de Firebase

| Recurso | Límite Gratuito |
|---------|-----------------|
| Invocaciones de Functions | 125,000 / mes |
| Emails (Nodemailer) | Depende del proveedor SMTP |
| Firestore Writes | 50,000 / día |
