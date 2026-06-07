# Routine.OS — Guía de despliegue

## Requisitos previos
- Node.js 18+
- Cuenta en GitHub
- Cuenta en Vercel (gratuita)

---

## 1. Instalar dependencias

```bash
npm install
```

## 2. Probar en local

```bash
npm run dev
```

Abre `http://localhost:5173` en el navegador.

## 3. Compilar

```bash
npm run build
```

Se genera la carpeta `dist/` lista para producción.

---

## 4. Subir a GitHub

```bash
git init
git add .
git commit -m "feat: Routine.OS inicial"
git remote add origin https://github.com/TU_USUARIO/routine-os.git
git push -u origin main
```

---

## 5. Desplegar en Vercel

1. Ve a [vercel.com](https://vercel.com) e inicia sesión con GitHub
2. Haz clic en **"Add New Project"**
3. Selecciona el repositorio `routine-os`
4. Vercel detecta Vite automáticamente — haz clic en **Deploy**
5. En ~2 minutos tendrás una URL tipo `routine-os.vercel.app`

---

## 6. Instalar en iPhone

1. Abre Safari en tu iPhone
2. Navega a tu URL de Vercel
3. Toca el botón **Compartir** (cuadrado con flecha arriba)
4. Selecciona **"Añadir a pantalla de inicio"**
5. Confirma con **"Añadir"**

La app aparece en tu pantalla de inicio como una app nativa.

---

## 7. Activar notificaciones

1. Abre la app instalada desde la pantalla de inicio (importante: NO desde Safari)
2. En la pantalla de HOY verás un banner amarillo **"Activa las alarmas"**
3. Toca **ACTIVAR** y acepta el permiso
4. Las alarmas funcionan mientras el iPhone esté encendido

### Cuándo suenan las alarmas
- **10 minutos antes** de que empiece una rutina → 3 pitidos ascendentes + vibración
- **Al inicio** de la rutina → 3 pitidos + vibración fuerte
- **Al terminar** la rutina → 2 pitidos descendentes + vibración

---

## Notas iOS importantes

- Las notificaciones requieren **iOS 16.4+**
- La app debe estar **instalada** (no vale abrirla desde Safari)
- Si el iPhone está en modo silencio, las notificaciones llegan pero sin sonido
- El sonido de alarma suena si el audio del sistema está activado

---

## Estructura del proyecto

```
routine-os/
├── public/
│   ├── manifest.json      # Configuración PWA
│   ├── sw.js              # Service Worker
│   └── icons/             # Iconos de la app
├── src/
│   ├── App.tsx            # Componente principal
│   ├── components/        # Vistas (Today, Routines, History)
│   ├── hooks/             # Lógica de estado y notificaciones
│   ├── utils/             # Tiempo, audio, mensajes
│   └── styles/            # CSS global
├── vercel.json            # Headers de seguridad CSP
└── vite.config.ts         # Config del bundler + PWA
```

---

## Seguridad implementada

| Medida | Dónde |
|--------|-------|
| Content Security Policy | `vercel.json` |
| X-Frame-Options DENY | `vercel.json` |
| X-XSS-Protection | `vercel.json` |
| Referrer-Policy strict | `vercel.json` |
| Permissions-Policy | `vercel.json` |
| HTTPS obligatorio | Vercel (automático) |
| Service Worker scope aislado | `sw.js` |
| Sin API keys en frontend | Mensajes locales |

---

## Actualizar la app

Cada vez que hagas cambios:

```bash
git add .
git commit -m "descripción del cambio"
git push
```

Vercel redespliega automáticamente en ~1 minuto. La PWA instalada se actualiza sola.
