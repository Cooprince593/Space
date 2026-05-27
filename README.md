# 🌹 Discord Authorization Page — Space

Página de autorización OAuth2 de Discord con fondo espacial, efecto glassmorphism y tilt 3D interactivo.

🌐 **Live:** https://cooprince593.github.io/Space/

---

## 🚀 Cómo subir a GitHub Pages

### 1. Clona o descarga este repositorio

```bash
git clone https://github.com/cooprince593/Space.git
cd Space
```

### 2. Copia todos los archivos del proyecto aquí adentro

Reemplaza todos los archivos del repo con los archivos de este proyecto.

### 3. Sube los cambios a GitHub

```bash
git add .
git commit -m "✨ Discord authorization page"
git push origin main
```

### 4. GitHub Actions despliega automáticamente

Al hacer push a `main`, el workflow `.github/workflows/deploy.yml` se activa y:
- Instala dependencias
- Hace build
- Sube el contenido de `dist/` a la rama `gh-pages`

### 5. Activa GitHub Pages en tu repositorio

En tu repo de GitHub:
1. Ve a **Settings** → **Pages**
2. En **Source** selecciona: `Deploy from a branch`
3. En **Branch** selecciona: `gh-pages` / `/ (root)`
4. Guarda

Tu página estará en: **https://cooprince593.github.io/Space/**

---

## 🔗 Uso como redirect URI de Discord

En el **Discord Developer Portal** → tu bot → OAuth2:

```
https://cooprince593.github.io/Space/
```

Cuando el bot redirija al usuario, puede pasar parámetros en la URL:

```
https://cooprince593.github.io/Space/?avatar=URL_DEL_AVATAR&username=NOMBRE
```

o

```
https://cooprince593.github.io/Space/?user_id=ID&avatar_hash=HASH
```

La página los leerá automáticamente y mostrará la foto de perfil del usuario verificado.

---

## ✨ Características

- 🌌 Fondo espacial negro/gris con partículas animadas y estrellas fugaces
- 🪟 Tarjeta con efecto Glassmorphism (aeroglass)
- 🎯 Efecto 3D Tilt suave al mover el mouse
- 🌹 Rosas decorativas en esquinas
- 🔒 Iconos de Lucide React (ShieldCheck, BadgeCheck, ExternalLink, Sparkles)
- 👤 Foto de perfil dinámica del usuario de Discord
- 🟢 Botón de acceso directo al servidor de Discord
